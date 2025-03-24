import React, { useMemo } from 'react';
import useAppointments from '../hooks/appointmentHook';

const Appointments = () => {
  const { appointments, loading, error, deleteAppointment } = useAppointments();

  // Séparer les rendez-vous à venir des rendez-vous passés
  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    if (!appointments) return { upcomingAppointments: [], pastAppointments: [] };
    
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    return appointments.reduce((acc, appointment) => {
      // Comparer la date du rendez-vous avec aujourd'hui
      const appointmentDate = appointment.appointmentDate;
      const appointmentTime = appointment.appointmentTime;
      
      // Créer une date complète pour comparer plus précisément
      const [hours, minutes] = appointmentTime.split(':');
      const appointmentDateTime = new Date(appointmentDate);
      appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      
      if (appointmentDate > today || 
          (appointmentDate === today && appointmentDateTime > now)) {
        acc.upcomingAppointments.push(appointment);
      } else {
        acc.pastAppointments.push(appointment);
      }
      
      return acc;
    }, { upcomingAppointments: [], pastAppointments: [] });
  }, [appointments]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Your Appointments</h1>
      
      <div className="appointments-section">
        <h2>Upcoming Appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <p>No upcoming appointments</p>
        ) : (
          <ul>
            {upcomingAppointments.map((appointment) => (
              <li key={appointment._id} className="upcoming-appointment">
                {appointment.appointmentDate} - {appointment.appointmentTime} with {appointment.customerName}
                <button name='Supprimer' onClick={() => deleteAppointment(appointment._id)}>Supprimer</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="appointments-section">
        <h2>Past Appointments</h2>
        {pastAppointments.length === 0 ? (
          <p>No past appointments</p>
        ) : (
          <ul>
            {pastAppointments.map((appointment) => (
              <li key={appointment._id} className="past-appointment">
                {appointment.appointmentDate} - {appointment.appointmentTime} with {appointment.customerName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Appointments;