import express from "express";
import appointmentController from "../controllers/appointmentController.js";

const router = express.Router();

// Route pour créer un rendez-vous
router.post("/appointments", appointmentController.createAppointment);

// Route pour modifier un rendez-vous
router.put("/appointments/:id", appointmentController.updateAppointment);

// Route pour supprimer un rendez-vous
router.delete("/appointments/:id", appointmentController.deleteAppointment);

// Route pour récupérer les créneaux occupés
router.get("/creneaux", appointmentController.getCreneauxOccupes);

// Route pour récupérer les rendez-vous d'un utilisateur spécifique
router.get("/appointments/user/:userId", appointmentController.getAppointmentByUser);

export default router;