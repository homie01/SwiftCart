const OrderModel = require("../models/order.model");
const UserModel = require("../models/user.model");

class OrderController {
  getUsersOrders = async (req, res) => {
    try {
      const userId = req.params.userId;

      const existUser = await UserModel.findById({ _id: userId });

      if (!existUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const orders = await OrderModel.find({ userId }).sort({ _id: -1 });

      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  placeOrder = async (req, res) => {
    try {
      const userId = req.params.userId;
      const orderDetails = req.body;

      const existUser = await UserModel.findById({ _id: userId });

      if (!existUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const orderItems = orderDetails.products.map((item) => {
        return {
          productId: item._id,
          quantity: item.productCount,
          price: item.price,
        };
      });

      const objectToBeAdded = {
        userId,
        totalAmount: orderDetails.totalAmount,
        totalItems: orderItems.length,
        status: "DRAFT",
        orderItems,
      };

      const createdOrder = await OrderModel.create(objectToBeAdded);

      return res.status(200).json({
        message: "Order placed successfully",
        orderId: createdOrder._id
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  confirmOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const userId = req.params.userId;

      const existOrder = await OrderModel.findById({ _id: orderId });
      const existUser = await UserModel.findById({ _id: userId });

      if (!existOrder || !existUser) {
        return res.status(404).json({ error: "Order or User not found" });
      }

      existOrder.status = "CONFIRMED";
      await existOrder.save();

      return res.status(200).json({
        message: "Order confirmed successfully",
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new OrderController();
