const Order = require("../models/Order");
const mongoose = require("mongoose");

// Get all orders (admin view)
exports.getAllOrders = async (req, res) => {
  const { tableNumber, open } = req.query;
  try {
    let query = {};
    if (tableNumber) {
      query.tableNumber = tableNumber;
    }
    if (open !== undefined) {
      query.open = open === "true";
    }
    const orders = await Order.find(query);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving orders" });
  }
};

// Get orders by table number
exports.getOrdersByTableNumber = async (req, res) => {
  const { tableNumber } = req.params;
  try {
    const orders = await Order.find({ tableNumber, open: true });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).send("Error retrieving orders");
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  const { items, tableNumber } = req.body;
  const newOrder = new Order({ items, tableNumber });
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: "Failed to create order" });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: "Failed to update order" });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete order" });
  }
};

// Delete an item from an order
exports.deleteOrderItem = async (req, res) => {
  const { orderId, itemId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Remove the item from the order
    order.items = order.items.filter((item) => item._id.toString() !== itemId);

    // Save the updated order
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: "Failed to delete item from order" });
  }
};

// Close orders by table number
exports.closeOrdersByTableNumber = async (req, res) => {
  const { tableNumber } = req.params;
  try {
    await Order.updateMany({ tableNumber, open: true }, { open: false });
    res.send("Orders closed successfully");
  } catch (err) {
    res.status(500).send("Error closing orders");
  }
};

// Add items to an order by table number
exports.addItemsToOrder = async (req, res) => {
  const { tableNumber } = req.params;
  const { items } = req.body;
  try {
    const result = await Order.updateMany(
      { tableNumber, open: true },
      { $push: { items: { $each: items } } }
    );
    res.send("Items added successfully");
  } catch (err) {
    res.status(500).send("Error adding items");
  }
};
