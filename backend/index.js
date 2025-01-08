const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

mongoose
  .connect("mongodb+srv://mike:No@cluster0.vc3ql.mongodb.net/menu-order", {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Import and use route files
const ordersRoute = require("./routes/orders");
const menuItemsRoute = require("./routes/menuItems");
const adminRoute = require("./routes/admin");

app.use("/api/orders", ordersRoute);
app.use("/api/menuItems", menuItemsRoute);
app.use("/api/admin", adminRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
