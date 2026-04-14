const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  contact: Number,
  password: String,
  address: {
    type: [
      {
        street: String,
        landmark: String,
        area: String,
        city: String,
        state: String,
        country: String,
        pincode: Number,
        type: {
          type: String,
          enum: ['home', 'work'],
        },
      },
    ],
    default: [],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
  },
  cart: {
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
