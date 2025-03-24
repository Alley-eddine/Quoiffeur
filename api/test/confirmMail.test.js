import { sendAppointmentConfirmation } from '../mailer/confirmMail.js';
import nodemailer from 'nodemailer';

// Mock complet de nodemailer
jest.mock('nodemailer');

describe('Confirmations d\'emails', () => {
  // Setup pour les mocks avant chaque test
  beforeEach(() => {
    // Créer un mock pour sendMail qui retourne une promesse résolue
    const mockSendMail = jest.fn().mockResolvedValue({
      messageId: 'mock-message-id'
    });

    // Créer un mock pour createTransport qui retourne un objet avec sendMail
    nodemailer.createTransport.mockReturnValue({
      sendMail: mockSendMail
    });
  });

  // Reset des mocks après chaque test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devrait envoyer un email de confirmation avec les bonnes informations', async () => {
    // Setup
    const appointment = {
      customerName: 'John Doe',
      customerPhone: '1234567890',
      appointmentDate: '2025-02-12',
      appointmentTime: '14:00'
    };
    const userEmail = 'john.doe@example.com';

    // Action
    const result = await sendAppointmentConfirmation(appointment, userEmail);

    // Assertions
    // Vérifier que createTransport a été appelé
    expect(nodemailer.createTransport).toHaveBeenCalled();
    
    // Récupérer le mock de transporter.sendMail
    const mockTransporter = nodemailer.createTransport();
    
    // Vérifier que sendMail a été appelé avec les bons paramètres
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.any(String),
        to: userEmail,
        subject: 'Confirmation de votre rendez-vous',
        html: expect.stringContaining(appointment.customerName)
      })
    );
    
    // Vérifier que l'email contient toutes les informations importantes
    const mailOptions = mockTransporter.sendMail.mock.calls[0][0];
    expect(mailOptions.html).toContain(appointment.customerName);
    expect(mailOptions.html).toContain(appointment.customerPhone);
    expect(mailOptions.html).toContain(appointment.appointmentTime);
    
    // Vérifier que la fonction retourne le bon résultat
    expect(result).toEqual({
      success: true,
      messageId: 'mock-message-id'
    });
  });

  it('devrait gérer les erreurs lors de l\'envoi d\'email', async () => {
    // Setup - faire échouer l'envoi d'email
    const mockError = new Error('Failed to send email');
    const mockTransporter = {
      sendMail: jest.fn().mockRejectedValue(mockError)
    };
    nodemailer.createTransport.mockReturnValue(mockTransporter);
    
    const appointment = {
      customerName: 'John Doe',
      customerPhone: '1234567890',
      appointmentDate: '2025-02-12',
      appointmentTime: '14:00'
    };
    const userEmail = 'john.doe@example.com';

    // Espionner console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Action
    const result = await sendAppointmentConfirmation(appointment, userEmail);

    // Assertions
    expect(mockTransporter.sendMail).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending email:', mockError);
    expect(result).toEqual({
      success: false,
      error: 'Failed to send email'
    });

    // Restaurer console.error
    consoleErrorSpy.mockRestore();
  });

  it('devrait formater correctement la date dans l\'email', async () => {
    // Setup
    const appointment = {
      customerName: 'John Doe',
      customerPhone: '1234567890',
      appointmentDate: '2025-02-12',
      appointmentTime: '14:00'
    };
    const userEmail = 'john.doe@example.com';

    // Simuler la fonction toLocaleDateString pour un résultat prévisible
    const originalToLocaleDateString = Date.prototype.toLocaleDateString;
    Date.prototype.toLocaleDateString = jest.fn().mockReturnValue('12/02/2025');

    // Action
    await sendAppointmentConfirmation(appointment, userEmail);

    // Assertions
    const mockTransporter = nodemailer.createTransport();
    const mailOptions = mockTransporter.sendMail.mock.calls[0][0];
    expect(mailOptions.html).toContain('12/02/2025');

    // Restaurer la fonction d'origine
    Date.prototype.toLocaleDateString = originalToLocaleDateString;
  });
  
  it('devrait inclure l\'année actuelle dans le copyright', async () => {
    // Setup
    const appointment = {
      customerName: 'John Doe',
      customerPhone: '1234567890',
      appointmentDate: '2025-02-12',
      appointmentTime: '14:00'
    };
    const userEmail = 'john.doe@example.com';
    
    // Mock Date pour avoir une année constante dans le test
    const currentYear = new Date().getFullYear();
    const realDate = Date;
    global.Date = class extends Date {
      constructor() {
        super();
      }
      getFullYear() {
        return currentYear;
      }
    };

    // Action
    await sendAppointmentConfirmation(appointment, userEmail);

    // Assertions
    const mockTransporter = nodemailer.createTransport();
    const mailOptions = mockTransporter.sendMail.mock.calls[0][0];
    expect(mailOptions.html).toContain(`© ${currentYear} Quoiffeur`);

    // Restaurer Date
    global.Date = realDate;
  });
});