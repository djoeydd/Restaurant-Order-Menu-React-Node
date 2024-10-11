const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Get orders with query parameters
router.get("/", async (req, res) => {
  try {
    const { tableNumber, open } = req.query;
    const query = {};
    if (tableNumber) query.tableNumber = tableNumber;
    if (open !== undefined) query.open = open === "true";
    const orders = await Order.find(query);
    res.send(orders);
  } catch (err) {
    res.status(500).send("Error retrieving orders");
  }
});

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

module.exports = router;
