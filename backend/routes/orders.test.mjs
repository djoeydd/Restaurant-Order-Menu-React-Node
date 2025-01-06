import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { expect } from "chai";
import Order from "../models/Order.js";
import ordersRoute from "./orders.js";

const app = express();
app.use(express.json());
app.use("/api/orders", ordersRoute);

describe("Orders Route", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/food-order-test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it("should create a new order", async () => {
    const newOrder = {
      tableNumber: 1,
      items: [
        { itemName: "Pizza", price: 10, quantity: 2 },
        { itemName: "Burger", price: 5, quantity: 1 },
      ],
    };
    const response = await request(app).post("/api/orders").send(newOrder);
    expect(response.status).to.equal(201);
    expect(response.body.tableNumber).to.equal(newOrder.tableNumber);
  });

  it("should get orders with query parameters", async () => {
    const response = await request(app).get(
      "/api/orders?tableNumber=1&open=true"
    );
    expect(response.status).to.equal(200);
    expect(Array.isArray(response.body)).to.be.true;
  });

  it("should get orders by table number", async () => {
    const response = await request(app).get("/api/orders/table/1");
    expect(response.status).to.equal(200);
    expect(Array.isArray(response.body)).to.be.true;
  });

  it("should close orders by table number", async () => {
    const response = await request(app).patch("/api/orders/close/1");
    expect(response.status).to.equal(200);
    expect(response.text).to.equal("Orders closed successfully");
  });

  it("should delete an item from an order", async () => {
    const newOrder = new Order({
      tableNumber: 1,
      items: [
        { itemName: "Pizza", price: 10, quantity: 2 },
        { itemName: "Burger", price: 5, quantity: 1 },
      ],
    });
    const savedOrder = await newOrder.save();
    const itemId = savedOrder.items[0]._id;
    const response = await request(app).delete(
      `/api/orders/${savedOrder._id}/items/${itemId}`
    );
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Item deleted successfully");
  });
});
