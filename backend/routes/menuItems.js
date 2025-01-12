const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

// menu route for managing menu items

// Get all menu items
router.get("/", menuController.getAllMenuItems);
// Create a new menu item
router.post("/", menuController.createMenuItem);
// Update a menu item by ID
router.put("/:id", menuController.updateMenuItem);
// Delete a menu item by ID
router.delete("/:id", menuController.deleteMenuItem);

module.exports = router;
