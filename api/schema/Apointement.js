const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  clientPhone: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
