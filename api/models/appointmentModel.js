import Appointment from "../schema/appointmentSchema.js";

const newAppointment = (appointmentData) => {
  const newAppointment = new Appointment(appointmentData);
  newAppointment.save();
}

export default Appointment;