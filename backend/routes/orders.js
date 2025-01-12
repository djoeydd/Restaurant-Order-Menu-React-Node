const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const orderController = require("../controllers/orderController");

// Order route for managing orders

// Get orders with query parameters
router.get("/", orderController.getAllOrders);

// Get orders by table number
router.get("/table/:tableNumber", orderController.getOrdersByTableNumber);

// Create a new order
router.post("/", orderController.createOrder);

// Update an order
router.put("/:id", orderController.updateOrder);

// Delete an order
router.delete("/:orderId", orderController.deleteOrder);

// Delete an item from an order
router.delete("/:orderId/items/:itemId", orderController.deleteOrderItem);

// Close orders by table number
router.patch("/close/:id", orderController.closeOrdersByID);

// Open Orders by id
router.patch("/open/:id", orderController.openOrdersByID);

// Add items to an order by table number
router.patch("/add/:tableNumber", orderController.addItemsToOrder);

module.exports = router;
