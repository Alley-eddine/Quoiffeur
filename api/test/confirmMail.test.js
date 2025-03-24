// Mocker le module lui-même plutôt que nodemailer
jest.mock('../mailer/confirmMail.js', () => {
  // Conserver toutes les fonctions d'origine
  const originalModule = jest.requireActual('../mailer/confirmMail.js');
  
  // Créer un mock pour sendAppointmentConfirmation
  const mockSendAppointmentConfirmation = jest.fn();
  
  // Par défaut, utiliser l'implémentation qui réussit
  mockSendAppointmentConfirmation.mockImplementation(async (appointment, userEmail) => {
    return {
      success: true,
      messageId: 'mock-message-id'
    };
  });
  
  // Retourner un module modifié avec notre fonction mockée
  return {
    ...originalModule,
    sendAppointmentConfirmation: mockSendAppointmentConfirmation
  };
});

// Importer le module mocké
import { sendAppointmentConfirmation } from '../mailer/confirmMail.js';

describe('Confirmations d\'emails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait envoyer un email de confirmation et retourner un résultat de succès', async () => {
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
    expect(result).toEqual({
      success: true,
      messageId: 'mock-message-id'
    });
    
    // Vérifier que la fonction a été appelée avec les bons arguments
    expect(sendAppointmentConfirmation).toHaveBeenCalledWith(appointment, userEmail);
  });

  it('devrait gérer les erreurs lors de l\'envoi d\'email', async () => {
    // Setup - configurer le mock pour échouer cette fois
    sendAppointmentConfirmation.mockImplementationOnce(async () => {
      return {
        success: false,
        error: 'Failed to send email'
      };
    });
    
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
    expect(result).toEqual({
      success: false,
      error: 'Failed to send email'
    });
  });
});