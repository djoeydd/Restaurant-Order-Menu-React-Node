const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  firstName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  salary: {
    type: Number,
    required: true,
  },
  employeeStatus: {
    type: String,
    required: true,
    enum: ["Active", "Inactive", "On Leave"],
  },

  shifts: [shiftSchema],
});

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
