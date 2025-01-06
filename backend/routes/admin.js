const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin route for managing orders
router.get("/orders", adminController.getAllOrders);
router.post("/orders", adminController.createOrder);
router.put("/orders/:id", adminController.updateOrder);
router.delete("/orders/:orderId", adminController.deleteOrder);
router.delete(
  "/orders/:orderId/items/:itemId",
  adminController.deleteOrderItem
);

// Admin route for managing menu items
router.get("/menuItems", adminController.getAllMenuItems);
router.post("/menuItems", adminController.createMenuItem);
router.put("/menuItems/:id", adminController.updateMenuItem);
router.delete("/menuItems/:id", adminController.deleteMenuItem);

module.exports = router;
