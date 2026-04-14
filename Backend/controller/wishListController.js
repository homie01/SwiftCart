const UserModel = require('../models/user.model');
const wishListModel = require('../models/wishlist.model');

class wishListController {
  all = async (req, res) => {
    try {
      const wishlists = await wishListModel.find();
      res.json({ success: true, data: wishlists });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error!' });
    }
  };

  getUsersWishlist = async (req, res) => {
    try {
      const userId = req.params.id;

      const wishlistData = await wishListModel.findOne({ userId });

      if (wishlistData) {
        return res.json({ success: true, data: wishlistData.wishList });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error!' });
    }
  };

  add = async (req, res) => {
    try {
      const userId = req.params.userId;
      const productId = req.body.productId;

      const existUser = await UserModel.findById(userId);
      if (!existUser) {
        return res
          .status(404)
          .json({ success: false, error: 'User not found!' });
      }

      let existingWishList = await wishListModel.findOne({ userId });

      if (!existingWishList) {
        existingWishList = await wishListModel.create({
          userId,
          wishList: [productId],
        });
        return res.json({
          success: true,
          data: existingWishList,
          message: 'Wishlist created with product!',
        });
      }

      if (existingWishList.wishList.includes(productId)) {
        return res.status(400).json({
          success: false,
          error: 'Product already in wishlist!',
        });
      }

      existingWishList.wishList.push(productId);
      await existingWishList.save();

      return res.json({
        success: true,
        data: existingWishList,
        message: 'Product added to wishlist!',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'An error occurred while adding to wishlist.',
      });
    }
  };

  remove = async (req, res) => {
    try {
      const productId = req.params.id;
      const userId = req.params.userId;

      const existingWishList = await wishListModel.findOne({ userId });
      if (!existingWishList) {
        return res
          .status(404)
          .json({ success: false, error: 'Wishlist not found!' });
      }

      if (!existingWishList.wishList.includes(productId)) {
        return res.json({
          success: false,
          error: 'Product not found in wishlist!',
        });
      }

      existingWishList.wishList.pull(productId);
      await existingWishList.save();

      return res.json({
        success: true,
        data: existingWishList,
        message: 'Product removed from wishlist!',
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Internal server error!' });
    }
  };
}

module.exports = new wishListController();
