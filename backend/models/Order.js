const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  items: [
    {
      itemName: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
  ],
  tableNumber: {
    type: Number,
    required: true,
  },
  open: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
