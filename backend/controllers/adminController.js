const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const mongoose = require("mongoose");

// Get all orders (admin view)
exports.getAllOrders = async (req, res) => {
  const { open } = req.query;
  try {
    let orders;
    if (open !== undefined) {
      const isOpen = open === "true";
      orders = await Order.find({ open: isOpen });
    } else {
      orders = await Order.find();
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
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

// Get all menu items (admin view)
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  const { productId, name, description, price, image, category } = req.body;
  const newMenuItem = new MenuItem({
    productId,
    name,
    description,
    price,
    image,
    category,
  });
  try {
    const savedMenuItem = await newMenuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (error) {
    res.status(400).json({ error: "Failed to create menu item" });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    res.status(400).json({ error: "Failed to update menu item" });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting ${id}`);
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId");
      return res.status(400).json({ error: "Invalid ObjectId" });
    }
    const objectId = new mongoose.Types.ObjectId(id);
    console.log(`Object ID: ${objectId}`);
    const result = await MenuItem.findByIdAndDelete(objectId);
    if (!result) {
      console.log("Menu item not found");
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.status(200).json({ message: "Menu item deleted successfully" });
    console.log("Deleted");
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({ error: "Failed to delete menu item" });
    console.log("Failed to delete");
  }
};
