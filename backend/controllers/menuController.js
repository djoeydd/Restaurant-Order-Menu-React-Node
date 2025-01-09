const MenuItem = require("../models/MenuItem");
const mongoose = require("mongoose");

// Get all menu items
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
