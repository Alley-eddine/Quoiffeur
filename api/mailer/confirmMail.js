import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
//WIP
dotenv.config();

// Créer un compte de test Ethereal
let transporter;

async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount();
  
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  
  console.log('Compte de test Ethereal créé:', testAccount.user);
  console.log('Consultez les emails sur:', testAccount.web);
}

// Initialiser le transporteur au démarrage
createTestAccount();

/**
 * Envoie un email de confirmation de rendez-vous
 * @param {Object} appointment - Le rendez-vous
 * @param {Object} customer - Le client
 */
export const sendAppointmentConfirmation = async (appointment, customer) => {
  try {
    // S'assurer que le transporteur est initialisé
    if (!transporter) {
      await createTestAccount();
    }
    
    const mailOptions = {
      from: '"Salon de Coiffure" <no-reply@votresalon.com>',
      to: customer.mail,
      subject: 'Confirmation de votre rendez-vous',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2>Confirmation de rendez-vous</h2>
          <p>Bonjour ${customer.name},</p>
          <p>Votre rendez-vous a été confirmé pour:</p>
          <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <p><strong>Date:</strong> ${appointment.appointmentDate}</p>
            <p><strong>Heure:</strong> ${appointment.appointmentTime}</p>
          </div>
          <p>Nous avons hâte de vous accueillir!</p>
          <p>L'équipe du Quoiffeur</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de confirmation envoyé:', info.messageId);
    console.log('Prévisualiser l\'email:', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
    // Ne pas planter l'application si l'email échoue
    return { error: error.message };
  }
};

export default {
  sendAppointmentConfirmation,
};