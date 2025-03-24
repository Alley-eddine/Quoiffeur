import { Schema } from "mongoose";
import mongoose from "mongoose";

const appointmentSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Scheduled",
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;