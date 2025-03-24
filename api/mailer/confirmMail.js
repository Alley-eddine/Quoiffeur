import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send confirmation email for a new appointment
 * @param {Object} appointment - The appointment object
 * @param {string} userEmail - The user's email address
 * @returns {Promise} - The result of the email sending operation
 */
export const sendAppointmentConfirmation = async (appointment, userEmail) => {
  try {
    // Format the date and time for better readability
    const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString();
    const formattedTime = appointment.appointmentTime;

    // Generate email content
    const mailOptions = {
      from: `"Quoiffeur" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Confirmation de votre rendez-vous',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Confirmation de Rendez-vous</h2>
          <p>Bonjour ${appointment.customerName},</p>
          <p>Votre rendez-vous a été confirmé avec les détails suivants :</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Heure:</strong> ${formattedTime}</p>
            <p><strong>Nom:</strong> ${appointment.customerName}</p>
            <p><strong>Téléphone:</strong> ${appointment.customerPhone}</p>
          </div>
          <p>Si vous souhaitez modifier ou annuler votre rendez-vous, veuillez nous contacter.</p>
          <p>Merci d'avoir choisi nos services!</p>
          <div style="text-align: center; margin-top: 20px; color: #777;">
            <p>© ${new Date().getFullYear()} Quoiffeur. Tous droits réservés.</p>
          </div>
        </div>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export default { sendAppointmentConfirmation };