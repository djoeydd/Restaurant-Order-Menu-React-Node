const assert = require("assert");
const mongoose = require("mongoose");
const Order = require("./Order");

describe("Order Model", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/food-order-test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it("should create an Order with valid properties", async () => {
    const order = new Order({
      tableNumber: 1,
      items: [
        { itemName: "Pizza", price: 10, quantity: 2 },
        { itemName: "Burger", price: 5, quantity: 1 },
      ],
    });
    const savedOrder = await order.save();
    assert.strictEqual(savedOrder.tableNumber, 1);
    assert.strictEqual(savedOrder.items.length, 2);
  });

  it("should throw an error if tableNumber is missing", async () => {
    try {
      const order = new Order({
        items: [
          { itemName: "Pizza", price: 10, quantity: 2 },
          { itemName: "Burger", price: 5, quantity: 1 },
        ],
      });
      await order.save();
    } catch (err) {
      assert.strictEqual(err.errors.tableNumber.kind, "required");
    }
  });

  it("should throw an error if items are missing", async () => {
    try {
      const order = new Order({
        tableNumber: 1,
      });
      await order.save();
    } catch (err) {
      assert.strictEqual(err.errors.items.kind, "required");
    }
  });
});
