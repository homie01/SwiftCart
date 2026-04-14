const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  totalAmount: Number,
  totalItems: Number,
  status: String,
  orderItems: [
    {
      productId: String,
      quantity: Number,
      price: Number,
    },
  ],
});

const OrderModel = mongoose.model("order", orderSchema);

module.exports = OrderModel;
