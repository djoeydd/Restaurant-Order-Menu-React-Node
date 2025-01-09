const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

// menu route for managing menu items
router.get("/", menuController.getAllMenuItems);
router.post("/", menuController.createMenuItem);
router.put("/:id", menuController.updateMenuItem);
router.delete("/:id", menuController.deleteMenuItem);

module.exports = router;
