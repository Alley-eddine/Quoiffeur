import { useState, useEffect } from 'react';

const useAppointments = () => {
  const [creneauxOccupes, setCreneauxOccupes] = useState([]);
  const [jourSelectionne, setJourSelectionne] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les créneaux occupés depuis l'API
  const chargerCreneaux = async (date) => {
    setJourSelectionne(date);
    const response = await fetch(`http://localhost:5001/appointments/creneaux?date=${date}`);
    const data = await response.json();
    setCreneauxOccupes(data);
  };

  // Prendre un rendez-vous
  const prendreRdv = async (creneau) => {
    const user = JSON.parse(localStorage.getItem('user')); // Récupérer les informations de l'utilisateur
    if (!user) {
      alert("Utilisateur non connecté");
      return;
    }

    const appointmentData = {
      customerId: user._id,
      customerName: user.name,
      customerPhone: user.phone,
      appointmentDate: jourSelectionne,
      appointmentTime: creneau,
    };

    const response = await fetch('http://localhost:5001/appointments/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Rendez-vous pris avec succès");
      chargerCreneaux(appointmentData.appointmentDate); // Recharger les créneaux pour mettre à jour l'état
    } else {
      alert(`Erreur: ${data.message}`);
    }
  };

  // Récupérer les rendez-vous de l'utilisateur connecté
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      const response = await fetch(`http://localhost:5001/appointments/appointments/user/${user._id}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des rendez-vous');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:5001/appointments/appointments/${appointmentId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        alert("Rendez-vous supprimé avec succès");
        setAppointments(appointments.filter(appointment => appointment._id !== appointmentId));
      } else {
        alert(`Erreur: ${data.message}`);
      }
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    creneauxOccupes,
    jourSelectionne,
    chargerCreneaux,
    prendreRdv,
    appointments,
    loading,
    error,
    deleteAppointment
  };
};

export default useAppointments;