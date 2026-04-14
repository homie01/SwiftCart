const ProductModel = require('../models/product.model');
const UserModel = require('../models/user.model');

class cartController {
  addProductToCart = async (req, res) => {
    try {
      const userId = req.params.id;
      const productId = req.body.productId;
      const quantity = req.body.productCount;

      const existUser = await UserModel.findById({ _id: userId });

      if (!existUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const existProduct = await ProductModel.findById({ _id: productId });

      if (!existProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (!existUser.cart) {
        existUser.cart = [];
      }

      const existingCartItem = existUser.cart.find(
        (item) => item.productId.toString() === productId
      );

      if (existingCartItem) {
        existingCartItem.quantity += quantity;
      } else {
        existUser.cart.push({ productId, quantity });
      }

      await existUser.save();

      return res.status(200).json({
        message: 'Product added to cart successfully',
        data: existUser.cart,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  removeFromCart = async (req, res) => {
    try {
      const productId = req.params.id;
      const userId = req.params.userId;

      const existUser = await UserModel.findById({ _id: userId });

      if (!existUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const existProduct = await ProductModel.findById({ _id: productId });

      if (!existProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const index = existUser.cart.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (index < 0) {
        return res.status(404).json({ error: 'Product not found in cart' });
      }

      existUser.cart.splice(index, 1);
      await existUser.save();

      return res.status(200).json({
        message: 'Product removed from cart successfully',
        data: existUser.cart,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getUsersCart = async (req, res) => {
    try {
      const userId = req.params.id;

      const existUser = await UserModel.findById({ _id: userId });

      if (!existUser) {
        return res
          .status(404)
          .json({ success: false, error: 'User not found' });
      }

      return res.status(200).json({ success: true, data: existUser.cart });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Internal Server Error' });
    }
  };
}

module.exports = new cartController();
