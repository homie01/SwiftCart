const express = require('express');
require('dotenv').config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? require('stripe')(stripeSecretKey) : null;

const router = express.Router();

const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .trim()
  .replace(/\/$/, '');

const toPositiveNumber = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
};

const toPositiveInteger = (value) => {
  const numberValue = Number(value);
  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
};

const toStripeAmount = (amount) => Math.round(amount * 100);

const isAbsoluteImageUrl = (url) =>
  typeof url === 'string' && /^https?:\/\//i.test(url);

const buildLineItems = (cartProducts, shippingAmount) => {
  const lineItems = cartProducts.map((product, index) => {
    const title = typeof product.title === 'string' ? product.title.trim() : '';
    const price = toPositiveNumber(product.price);
    const quantity = toPositiveInteger(
      product.productCount ?? product.quantity ?? 1,
    );
    const discountPercentage = Number(product.discountPercentage || 0);
    const safeDiscount = Number.isFinite(discountPercentage)
      ? Math.min(Math.max(discountPercentage, 0), 100)
      : 0;

    if (!title || !price || !quantity) {
      const error = new Error(`Invalid product details at index ${index}.`);
      error.statusCode = 400;
      throw error;
    }

    const unitAmount = toStripeAmount(price * (1 - safeDiscount / 100));

    if (unitAmount <= 0) {
      const error = new Error(`Invalid product price at index ${index}.`);
      error.statusCode = 400;
      throw error;
    }

    const productData = {
      name: title,
      images: isAbsoluteImageUrl(product.thumbnail) ? [product.thumbnail] : [],
    };

    if (product._id) {
      productData.metadata = { productId: String(product._id) };
    }

    return {
      price_data: {
        currency: 'usd',
        product_data: productData,
        unit_amount: unitAmount,
      },
      quantity,
    };
  });

  const shipping = Number(shippingAmount || 0);
  if (Number.isFinite(shipping) && shipping > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Shipping' },
        unit_amount: toStripeAmount(shipping),
      },
      quantity: 1,
    });
  }

  return lineItems;
};

router.post('/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured.' });
    }

    const { cartProducts, shippingAmount = 0 } = req.body;

    if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
      return res.status(400).json({ error: 'Cart products are required.' });
    }

    const lineItems = buildLineItems(cartProducts, shippingAmount);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${FRONTEND_URL}/checkout?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/checkout?payment=canceled`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message:
        statusCode === 500 ? 'Internal server error' : error.message,
    });
  }
});

router.get('/checkout-session/:sessionId', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured.' });
    }

    const { sessionId } = req.params;

    if (!sessionId || !sessionId.startsWith('cs_')) {
      return res.status(400).json({ message: 'Invalid checkout session id.' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
