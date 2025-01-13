const mongoose = require("mongoose");
const Order = require("./models/Order"); // Adjust the path as necessary
mongoose
  .connect("mongodb+srv://mike:No@cluster0.vc3ql.mongodb.net/menu-order", {})
  .then(() => {
    console.log("Connected to MongoDB");
    addClosedOrdersForDays();
  })
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const addClosedOrdersForDays = async () => {
  const days = 90; // Number of days to add orders for
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const orderDate = new Date(today);
    orderDate.setDate(today.getDate() - i);

    const numOrders = Math.floor(Math.random() * 6) + 15; // Random number of orders between 15 and 20

    for (let j = 0; j < numOrders; j++) {
      const price = Math.floor(Math.random() * 801) + 800; // Random price between 800 and 1600
      const quantity = Math.floor(Math.random() * 10) + 1; // Random quantity between 1 and 10

      const newOrder = new Order({
        date: orderDate,
        items: [
          {
            itemName: "Sample Item",
            price: price,
            quantity: quantity,
            image: "sample.jpg",
          },
        ],
        tableNumber: 1, // Same table number for all orders
        open: false,
      });

      try {
        await newOrder.save();
        console.log(
          `Order for ${orderDate.toDateString()} added successfully.`
        );
      } catch (error) {
        console.error(
          `Failed to add order for ${orderDate.toDateString()}:`,
          error
        );
      }
    }
  }

  mongoose.connection.close();
};
