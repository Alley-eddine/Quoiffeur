import express from "express";
import appointmentController from "../controllers/appointmentController.js";

const router = express.Router();

// Route pour créer un rendez-vous
router.post("/appointments", appointmentController.createAppointment);

// Route pour modifier un rendez-vous
router.put("/appointments/:id", appointmentController.updateAppointment);

// Route pour supprimer un rendez-vous
router.delete("/appointments/:id", appointmentController.deleteAppointment);

export default router;
