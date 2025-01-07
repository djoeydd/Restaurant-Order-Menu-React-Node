const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");
const adminController = require("../controllers/adminController");

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
router.post("/", adminController.createMenuItem);

// Delete a menu item
router.delete("/:id", adminController.deleteMenuItem);

// Update a menu item
router.put("/:id", adminController.updateMenuItem);

module.exports = router;
