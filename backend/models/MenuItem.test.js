const assert = require("assert");
const mongoose = require("mongoose");
const MenuItem = require("./MenuItem");

describe("MenuItem Model", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/food-order-test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it("should create a MenuItem with valid properties", async () => {
    const item = new MenuItem({
      productId: "1",
      name: "Pizza",
      description: "Delicious pizza",
      price: 10,
      image: "image_url",
      category: "Category",
    });
    const savedItem = await item.save();
    assert.strictEqual(savedItem.name, "Pizza");
    assert.strictEqual(savedItem.price, 10);
  });

  it("should throw an error if name is missing", async () => {
    try {
      const item = new MenuItem({
        productId: "1",
        description: "Delicious pizza",
        price: 10,
        image: "image_url",
        category: "Category",
      });
      await item.save();
    } catch (err) {
      assert.strictEqual(err.errors.name.kind, "required");
    }
  });

  it("should throw an error if price is negative", async () => {
    try {
      const item = new MenuItem({
        productId: "1",
        name: "Pizza",
        description: "Delicious pizza",
        price: -5,
        image: "image_url",
        category: "Category",
      });
      await item.save();
    } catch (err) {
      assert.strictEqual(err.errors.price.kind, "min");
    }
  });
});
