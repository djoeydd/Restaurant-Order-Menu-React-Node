import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { expect } from "chai";
import MenuItem from "../models/MenuItem.js";
import menuItemsRoute from "./menuItems.js";

const app = express();
app.use(express.json());
app.use("/api/menuItems", menuItemsRoute);

describe("Menu Items Route", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/food-order-test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it("should return all menu items", async () => {
    const response = await request(app).get("/api/menuItems");
    expect(response.status).to.equal(200);
    expect(Array.isArray(response.body)).to.be.true;
  });

  it("should create a new menu item", async () => {
    const newItem = {
      productId: "1",
      name: "New Item",
      description: "Delicious new item",
      price: 10.99,
      image: "image_url",
      category: "Category",
    };
    const response = await request(app).post("/api/menuItems").send(newItem);
    expect(response.status).to.equal(201);
    expect(response.body.name).to.equal(newItem.name);
  });

  it("should return a menu item by ID", async () => {
    const newItem = new MenuItem({
      productId: "1",
      name: "New Item",
      description: "Delicious new item",
      price: 10.99,
      image: "image_url",
      category: "Category",
    });
    const savedItem = await newItem.save();
    const response = await request(app).get(`/api/menuItems/${savedItem._id}`);
    expect(response.status).to.equal(200);
    expect(response.body._id).to.equal(savedItem._id.toString());
  });

  it("should update a menu item", async () => {
    const newItem = new MenuItem({
      productId: "1",
      name: "New Item",
      description: "Delicious new item",
      price: 10.99,
      image: "image_url",
      category: "Category",
    });
    const savedItem = await newItem.save();
    const updatedItem = { name: "Updated Item", price: 12.99 };
    const response = await request(app)
      .put(`/api/menuItems/${savedItem._id}`)
      .send(updatedItem);
    expect(response.status).to.equal(200);
    expect(response.body.name).to.equal(updatedItem.name);
  });

  it("should delete a menu item", async () => {
    const newItem = new MenuItem({
      productId: "1",
      name: "New Item",
      description: "Delicious new item",
      price: 10.99,
      image: "image_url",
      category: "Category",
    });
    const savedItem = await newItem.save();
    const response = await request(app).delete(
      `/api/menuItems/${savedItem._id}`
    );
    expect(response.status).to.equal(204);
  });
});
