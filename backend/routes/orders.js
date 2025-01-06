const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const adminController = require("../controllers/adminController");

// Get orders with query parameters
router.get("/", adminController.getAllOrders);

// Get orders by table number
router.get("/table/:tableNumber", async (req, res) => {
  const { tableNumber } = req.params;
  try {
    const orders = await Order.find({ tableNumber, open: true });
    res.send(orders);
  } catch (err) {
    res.status(500).send("Error retrieving orders");
  }
});

// Create a new order
router.post("/", async (req, res) => {
  const { items, tableNumber } = req.body;
  const order = new Order({ items, tableNumber });
  try {
    const result = await order.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send("Error creating order");
  }
});

// Close orders by table number
router.patch("/close/:tableNumber", async (req, res) => {
  const { tableNumber } = req.params;
  try {
    await Order.updateMany({ tableNumber, open: true }, { open: false });
    res.send("Orders closed successfully");
  } catch (err) {
    res.status(500).send("Error closing orders");
  }
});

// Delete an item from an order
router.delete("/:orderId/items/:itemId", adminController.deleteOrderItem);

// Add items to an order by table number
router.patch("/add/:tableNumber", async (req, res) => {
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
});

//delete an order by order id
router.delete("/:orderId", adminController.deleteOrder);

module.exports = router;
