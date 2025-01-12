const Users = require("../models/Users");
const mongoose = require("mongoose");

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Add new employee
exports.addNewEmployee = async (req, res) => {
  const {
    username,
    email,
    role,
    password,
    userId,
    title,
    firstName,
    lastName,
    startDate,
    employeeStatus,
    salary,
    birthDate,
    shifts,
    isAdmin,
  } = req.body;

  const newUser = new Users({
    username,
    email,
    role,
    password,
    userId,
    title,
    firstName,
    lastName,
    startDate,
    employeeStatus,
    salary,
    birthDate,
    isAdmin,
    shifts: shifts.map((shift) => ({
      startTime: shift.startTime,
      endTime: shift.endTime,
    })),
  });

  console.log(newUser);
  try {
    const savedUser = await newUser.save();
    await savedUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: "Failed to create user" });
  }
};

// Update employee information
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await Users.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Failed to update user" });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await Users.findByIdAndDelete(id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete employee" });
  }
};

// Get all employee shifts
exports.getAllEmployeeShifts = async (req, res) => {
  try {
    const users = await Users.find({}, "shifts");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shifts" });
  }
};

// Get employee shifts by employee id
exports.getEmployeeShifts = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findById(id, "shifts");
    if (!user) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(user.shifts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shifts" });
  }
};

// Add employee shift by employee id
exports.addEmployeeShift = async (req, res) => {
  const { id } = req.params;
  const { startTime, endTime, totalHours } = req.body;
  try {
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Employee not found" });
    }
    user.shifts.push({ startTime, endTime, totalHours });
    await user.save();
    res.status(201).json(user.shifts);
  } catch (error) {
    res.status(400).json({ error: "Failed to add shift" });
  }
};

// Update employee shift by employee id and shift id
exports.updateEmployeeShift = async (req, res) => {
  const { id, shiftId } = req.params;
  const { startTime, endTime, totalHours } = req.body;
  try {
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Employee not found" });
    }
    const shift = user.shifts.id(shiftId);
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }
    shift.startTime = startTime;
    shift.endTime = endTime;
    shift.totalHours = totalHours;
    await user.save();
    res.status(200).json(shift);
  } catch (error) {
    res.status(400).json({ error: "Failed to update shift" });
  }
};

// Delete employee shift by employee id and shift id
exports.deleteEmployeeShift = async (req, res) => {
  const { id, shiftId } = req.params;
  try {
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Employee not found" });
    }
    const shift = user.shifts.id(shiftId);
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }
    shift.remove();
    await user.save();
    res.status(200).json({ message: "Shift deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete shift" });
  }
};
