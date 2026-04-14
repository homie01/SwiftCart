import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';

const StoreContext = createContext(null);
const CART_KEY = 'swiftcart_cart';
const AUTH_KEY = 'swiftcart_auth';

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function toCartMap(items = []) {
  return items.map((item) => ({
    productId:
      typeof item.productId === 'object' && item.productId !== null
        ? item.productId._id
        : item.productId,
    productCount: item.productCount || item.quantity || 1,
  }));
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [catalogStatus, setCatalogStatus] = useState({ loading: true, error: '' });
  const [authReady, setAuthReady] = useState(false);
  const [authState, setAuthState] = useState({ user: null, token: '' });
  const [cartItems, setCartItems] = useState([]);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setAuthState(loadJson(AUTH_KEY, { user: null, token: '' }));
    setCartItems(loadJson(CART_KEY, []));
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (authReady) {
      saveJson(AUTH_KEY, authState);
    }
  }, [authReady, authState]);

  useEffect(() => {
    if (authReady) {
      saveJson(CART_KEY, cartItems);
    }
  }, [authReady, cartItems]);

  useEffect(() => {
    let ignore = false;

    async function loadCatalog() {
      try {
        setCatalogStatus({ loading: true, error: '' });
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);

        if (!ignore) {
          setProducts(productsResponse.data || []);
          setCategories(categoriesResponse.data || []);
          setCatalogStatus({ loading: false, error: '' });
        }
      } catch (error) {
        if (!ignore) {
          setCatalogStatus({
            loading: false,
            error: error.message || 'Unable to load catalog.',
          });
        }
      }
    }

    loadCatalog();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!authReady || !authState.user?._id) {
      return;
    }

    syncCartFromBackend();
    fetchOrders();
  }, [authReady, authState.user?._id]);

  const cartProducts = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = products.find((entry) => entry._id === item.productId);
        return product ? { ...product, productCount: item.productCount } : null;
      })
      .filter(Boolean);
  }, [cartItems, products]);

  const cartSummary = useMemo(() => {
    const totalItems = cartProducts.reduce((sum, item) => sum + item.productCount, 0);
    const subtotal = cartProducts.reduce((sum, item) => {
      const discount = item.discountPercentage || 0;
      const discountedPrice = item.price - (item.price * discount) / 100;
      return sum + discountedPrice * item.productCount;
    }, 0);
    const delivery = subtotal > 0 ? 99 : 0;

    return {
      totalItems,
      subtotal,
      delivery,
      grandTotal: subtotal + delivery,
    };
  }, [cartProducts]);

  async function syncCartFromBackend() {
    if (!authState.user?._id) {
      return;
    }

    try {
      const response = await api.getUserCart(authState.user._id);
      setCartItems(toCartMap(response.data || []));
    } catch (error) {
      setFeedback(error.message || 'Unable to sync cart.');
    }
  }

  async function fetchOrders() {
    if (!authState.user?._id) {
      return;
    }

    try {
      const response = await api.getOrders(authState.user._id);
      setOrders(response.data || []);
    } catch (error) {
      setFeedback(error.message || 'Unable to fetch orders.');
    }
  }

  async function login(loginData) {
    const response = await api.login(loginData);
    setAuthState({ user: sanitizeUser(response.data), token: response.token });
    setFeedback(response.message || 'Logged in successfully.');
    return response;
  }

  async function register(registerData) {
    const response = await api.register(registerData);
    await login({ email: registerData.email, password: registerData.password });
    return response;
  }

  function logout() {
    setAuthState({ user: null, token: '' });
    setCartItems([]);
    setOrders([]);
    setFeedback('Logged out successfully.');
  }

  async function addToCart(product, quantity = 1) {
    const existingItem = cartItems.find((item) => item.productId === product._id);
    const nextCount = (existingItem?.productCount || 0) + quantity;

    setCartItems(
      existingItem
        ? cartItems.map((item) =>
            item.productId === product._id
              ? { ...item, productCount: nextCount }
              : item
          )
        : [...cartItems, { productId: product._id, productCount: quantity }]
    );

    if (authState.user?._id) {
      try {
        await api.addToCart(authState.user._id, product._id, quantity);
      } catch (error) {
        setFeedback(error.message || 'Unable to sync cart with backend.');
      }
    }

    setFeedback(`${product.title} added to cart.`);
  }

  async function updateCartQuantity(productId, nextQty) {
    const previousItem = cartItems.find((item) => item.productId === productId);

    if (!previousItem) {
      return;
    }

    if (nextQty <= 0) {
      await removeFromCart(productId);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.productId === productId ? { ...item, productCount: nextQty } : item
      )
    );

    if (authState.user?._id) {
      try {
        if (nextQty > previousItem.productCount) {
          await api.addToCart(
            authState.user._id,
            productId,
            nextQty - previousItem.productCount
          );
        } else if (nextQty < previousItem.productCount) {
          await api.removeFromCart(productId, authState.user._id);
          await api.addToCart(authState.user._id, productId, nextQty);
        }
      } catch (error) {
        setFeedback(error.message || 'Unable to update cart quantity.');
      }
    }
  }

  async function removeFromCart(productId) {
    setCartItems((current) => current.filter((item) => item.productId !== productId));

    if (authState.user?._id) {
      try {
        await api.removeFromCart(productId, authState.user._id);
      } catch (error) {
        setFeedback(error.message || 'Unable to remove cart item.');
      }
    }
  }

  async function placeOrder(address) {
    if (!authState.user?._id || !cartProducts.length) {
      throw new Error('Login and add products before placing an order.');
    }

    const payload = {
      shippingAddress: address,
      totalAmount: cartSummary.grandTotal,
      products: cartProducts.map((item) => ({
        ...item,
        price: item.price - (item.price * (item.discountPercentage || 0)) / 100,
      })),
    };

    const orderResponse = await api.placeOrder(authState.user._id, payload);
    await api.confirmOrder(authState.user._id, orderResponse.orderId);
    setCartItems([]);
    await fetchOrders();
    setFeedback('Order placed successfully.');
    return orderResponse;
  }

  async function updateProfile(userData) {
    if (!authState.user?._id) {
      throw new Error('You must be logged in.');
    }

    const response = await api.updateUser(authState.user._id, userData);
    setAuthState((current) => ({
      ...current,
      user: sanitizeUser(response.data),
    }));
    setFeedback(response.message || 'Profile updated successfully.');
    return response;
  }

  async function addAddress(address) {
    if (!authState.user?._id) {
      throw new Error('You must be logged in.');
    }

    const response = await api.addAddress(authState.user._id, address);
    setAuthState((current) => ({
      ...current,
      user: sanitizeUser(response.data),
    }));
    setFeedback(response.message || 'Address saved successfully.');
    return response;
  }

  return (
    <StoreContext.Provider
      value={{
        authReady,
        user: authState.user,
        token: authState.token,
        products,
        categories,
        orders,
        cartProducts,
        cartSummary,
        catalogStatus,
        feedback,
        setFeedback,
        login,
        register,
        logout,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        placeOrder,
        updateProfile,
        addAddress,
        fetchOrders,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }

  return context;
}
