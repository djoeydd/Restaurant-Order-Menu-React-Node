const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin route for employee data
router.get("/employees", adminController.getAllEmployees);
router.post("/employees", adminController.addNewEmployee);
router.put("/employee/:id", adminController.updateEmployee);
router.delete("/employee/:id", adminController.deleteEmployee);

// Admin route for getting and managing employee shifts
router.get("/employee/:id/shifts", adminController.getEmployeeShifts);
router.post("/employee/:id/shifts", adminController.addEmployeeShift);
router.put("/employee/:id/shift/:shiftId", adminController.updateEmployeeShift);
router.delete(
  "/employee/:id/shift/:shiftId",
  adminController.deleteEmployeeShift
);
router.get("/shifts", adminController.getAllEmployeeShifts);

module.exports = router;
