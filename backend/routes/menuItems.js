const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

// Get all menu items
router.get("/", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.send(menuItems);
  } catch (err) {
    res.status(500).send("Error retrieving menu items");
  }
});

// Create a new menu item
router.post("/", async (req, res) => {
  const { name, description, price, image, category } = req.body;
  const menuItem = new MenuItem({ name, description, price, image, category });
  try {
    const result = await menuItem.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send("Error creating menu item");
  }
});

module.exports = router;
