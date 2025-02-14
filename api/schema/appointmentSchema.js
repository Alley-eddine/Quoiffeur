import { Schema } from "mongoose"; // Import Schema depuis mongoose
import mongoose from "mongoose"; // Import mongoose pour utiliser model et connect

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
  },
  { timestamps: true }
);

// Création du modèle
const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment; // Export du modèle
