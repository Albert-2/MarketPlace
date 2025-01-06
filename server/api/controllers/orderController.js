import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// Place an order
export const placeOrder = async (req, res) => {
  const { productId, buyerId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    const totalPrice = product.price * quantity;

    const order = new Order({
      user: buyerId,
      product: productId,
      name: product.name,
      quantity,
      totalPrice,
    });

    await order.save();

    product.quantity -= quantity;
    await product.save();

    const user = await User.findById(buyerId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.orders.push({
      orderID: order._id,
      status: "Pending",
    });

    await user.save();

    res
      .status(201)
      .json({ message: "Order has been placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res
      .status(500)
      .json({ message: "Error placing order", error: error.message });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ user: userId }).populate(
      "product",
      "name"
    );
    const formattedOrders = orders.map((order) => ({
      ...order.toObject(),
      productName: order.product.name,
    }));
    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Mark order as delivered
export const markOrderAsDelivered = async (req, res) => {
  const { userId, orderId } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this order" });
    }

    order.status = "Delivered";
    await order.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderIndex = user.orders.findIndex(
      (userOrder) => userOrder.orderID.toString() === orderId
    );
    if (orderIndex !== -1) {
      user.orders[orderIndex].status = "Delivered";
      await user.save();
    }

    const updatedOrder = {
      ...order.toObject(),
      productName: order.productName,
    };

    res
      .status(200)
      .json({ message: "Order marked as delivered", updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};

export const withdrawOrder = async (req, res) => {
  const { userId, orderId } = req.body;
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to withdraw this order" });
    }

    const product = await Product.findById(order.product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.quantity += order.quantity;
    await product.save();

    await Order.findByIdAndDelete(orderId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.orders = user.orders.filter(
      (userOrder) => userOrder.orderID.toString() !== orderId
    );

    await user.save();

    res.status(200).json({
      message: "Order withdrawn successfully",
      productName: order.name,
      quantity: order.quantity,
      updatedStock: product.quantity,
    });
  } catch (error) {
    console.error("Error withdrawing order:", error);
    res
      .status(500)
      .json({ message: "Error withdrawing order", error: error.message });
  }
};
