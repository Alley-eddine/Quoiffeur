import Appointment from "../models/appointmentModel.js";

// Créer un rendez-vous
export const createAppointment = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime, customerName, customerPhone } = req.body;

    // Vérifiez les champs requis
    if (!appointmentDate || !appointmentTime || !customerName || !customerPhone) {
      return res.status(400).json({ message: "Les champs appointmentDate, appointmentTime, customerName et customerPhone sont requis." });
    }

    // Vérifiez le nombre de réservations existantes pour le créneau donné
    const existingAppointments = await Appointment.find({ appointmentDate, appointmentTime });
    if (existingAppointments.length >= 3) {
      return res.status(400).json({ message: "Le créneau est complet. Veuillez choisir un autre créneau." });
    }

    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json({ message: "Rendez-vous créé avec succès", data: newAppointment });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du rendez-vous", error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    res.status(200).json({ message: "Rendez-vous mis à jour", data: updatedAppointment });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }
    res.status(500).json({ message: "Erreur lors de la mise à jour du rendez-vous", error: error.message });
  }
};

// Supprimer un rendez-vous
export const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }
    res.status(500).json({ message: "Erreur lors de la suppression du rendez-vous", error: error.message });
  }
};

// Récupérer les créneaux occupés pour une date donnée
export const getCreneauxOccupes = async (req, res) => {
  try {
    const { date } = req.query;
    const appointments = await Appointment.find({ appointmentDate: date });
    const creneauxOccupes = appointments.map(app => app.appointmentTime);
    res.status(200).json(creneauxOccupes);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des créneaux occupés", error: error.message });
  }
};

// Récupérer les rendez-vous d'un utilisateur spécifique
export const getAppointmentByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ customerId: userId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous de l'utilisateur", error: error.message });
  }
};

export default {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getCreneauxOccupes,
  getAppointmentByUser,
};