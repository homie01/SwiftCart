const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  wishList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
  ],
});

const wishListModel = mongoose.model('Wishlist', wishListSchema);

module.exports = wishListModel;
