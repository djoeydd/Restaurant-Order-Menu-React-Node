const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Order = require("./models/Order");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/food-order", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.send(orders);
  } catch (err) {
    res.status(500).send("Error retrieving orders");
  }
});

app.get("/api/orders/table/:tableNumber", async (req, res) => {
  const { tableNumber } = req.params;
  try {
    const orders = await Order.find({ tableNumber, open: true });
    res.send(orders);
  } catch (err) {
    res.status(500).send("Error retrieving orders");
  }
});

app.post("/api/orders", async (req, res) => {
  const { items, tableNumber } = req.body;

  const order = new Order({
    items,
    tableNumber,
  });

  try {
    const result = await order.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send("Error creating order");
  }
});

app.patch("/api/orders/close/:tableNumber", async (req, res) => {
  const { tableNumber } = req.params;
  try {
    await Order.updateMany({ tableNumber, open: true }, { open: false });
    res.send("Orders closed successfully");
  } catch (err) {
    res.status(500).send("Error closing orders");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
