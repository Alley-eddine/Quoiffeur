import Appointment from "../models/appointmentModel.js";

// Créer un rendez-vous
export const createAppointment = async (req, res) => {
  try {
    // Créer un nouveau rendez-vous à partir des données envoyées
    const newAppointment = new Appointment(req.body);
    await newAppointment.save(); // Sauvegarde dans la base de données
    res
      .status(201)
      .json({ message: "Rendez-vous créé avec succès", data: newAppointment });
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({
      message: "Erreur lors de la création du rendez-vous",
      error: error.message,
    });
  }
};

// Modifier un rendez-vous
export const updateAppointment = async (req, res) => {
  try {
    // Trouver le rendez-vous par son ID et mettre à jour les données
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id, // ID du rendez-vous à modifier
      req.body, // Nouvelles données envoyées dans la requête
      { new: true, runValidators: true } // Options pour retourner l'objet modifié et valider les données
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    res
      .status(200)
      .json({ message: "Rendez-vous mis à jour", data: updatedAppointment });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du rendez-vous",
      error: error.message,
    });
  }
};

// Supprimer un rendez-vous
export const deleteAppointment = async (req, res) => {
  try {
    // Trouver et supprimer le rendez-vous par son ID
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du rendez-vous",
      error: error.message,
    });
  }
};
export default {
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
