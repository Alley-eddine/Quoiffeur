import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import appointmentRoutes from '../routes/appointmentRoute.js';
import connectDB from '../config/db.js';
import { sendAppointmentConfirmation } from '../mailer/confirmMail.js';
import User from '../schema/userSchema.js';

// Mock du module confirmMail
jest.mock('../mailer/confirmMail.js', () => ({
  sendAppointmentConfirmation: jest.fn().mockResolvedValue({ success: true, messageId: 'mock-message-id' })
}));

// Mock de User.findById
jest.mock('../schema/userSchema.js', () => ({
  default: {
    findById: jest.fn()
  }
}));

const app = express();
app.use(express.json());
app.use('/api', appointmentRoutes);

let mongoServer;
let appointmentId; // Variable pour stocker l'ID du rendez-vous

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri; // Remplace l'URI de la base réelle
  await connectDB();

  // Créez un rendez-vous avant les tests PUT et DELETE
  const newAppointment = {
    customerName: "John Doe",
    customerPhone: "1234567890",
    appointmentDate: "2025-02-12",
    appointmentTime: "10:00",
  };

  const response = await request(app)
    .post('/api/appointments')
    .send(newAppointment);

  appointmentId = response.body.data._id; // Stockez l'ID du rendez-vous
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Tests des routes des rendez-vous', () => {
  // Existing test cases remain the same
  it('POST /api/appointments - devrait créer un rendez-vous avec succès', async () => {
    const newAppointment = {
      customerName: "John Doe",
      customerPhone: "1234567890",
      appointmentDate: "2025-02-12",
      appointmentTime: "10:00",
    };

    const response = await request(app)
      .post('/api/appointments')
      .send(newAppointment);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Rendez-vous créé avec succès");
    expect(response.body.data.customerName).toBe("John Doe");
  });

  // New test for email sending functionality
  it('POST /api/appointments - devrait envoyer un email de confirmation quand customerId est fourni', async () => {
    // Configure the mock for User.findById
    const mockUser = { _id: 'user123', mail: 'test@example.com', name: 'Test User' };
    User.findById.mockResolvedValue(mockUser);

    const newAppointment = {
      customerName: "Test User",
      customerPhone: "1234567890",
      appointmentDate: "2025-02-12",
      appointmentTime: "10:00",
      customerId: "user123"
    };

    const response = await request(app)
      .post('/api/appointments')
      .send(newAppointment);

    // Check that the appointment was created successfully
    expect(response.status).toBe(201);
    
    // Check that User.findById was called with the correct ID
    expect(User.findById).toHaveBeenCalledWith("user123");
    
    // Check that sendAppointmentConfirmation was called with the correct parameters
    expect(sendAppointmentConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: "Test User",
        appointmentDate: "2025-02-12",
        appointmentTime: "10:00"
      }),
      'test@example.com'
    );
  });

  it('POST /api/appointments - ne devrait pas échouer si l\'envoi de l\'email échoue', async () => {
    // Configure the mock for User.findById
    const mockUser = { _id: 'user123', mail: 'test@example.com', name: 'Test User' };
    User.findById.mockResolvedValue(mockUser);
    
    // Make the email sending fail
    sendAppointmentConfirmation.mockRejectedValueOnce(new Error('Email sending failed'));

    const newAppointment = {
      customerName: "Test User",
      customerPhone: "1234567890",
      appointmentDate: "2025-02-12",
      appointmentTime: "10:00",
      customerId: "user123"
    };

    const response = await request(app)
      .post('/api/appointments')
      .send(newAppointment);

    // The appointment should still be created successfully
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Rendez-vous créé avec succès");
  });

  // Continue with the existing tests...
  it('POST /api/appointments - devrait retourner une erreur si les champs requis sont manquants', async () => {
    const newAppointment = {
      customerPhone: "1234567890",
      appointmentDate: "2025-02-12",
    };

    const response = await request(app)
      .post('/api/appointments')
      .send(newAppointment);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("customerName");
  });

  it('PUT /api/appointments/:id - devrait mettre à jour un rendez-vous avec succès', async () => {
    const updatedAppointment = {
      customerName: "Jane Doe",
      customerPhone: "0987654321",
      appointmentDate: "2025-02-12",
      appointmentTime: "14:00",
    };

    const response = await request(app)
      .put(`/api/appointments/${appointmentId}`) // Utilisez l'ID du rendez-vous créé
      .send(updatedAppointment);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Rendez-vous mis à jour");
    expect(response.body.data.customerName).toBe("Jane Doe");
  });

  it('PUT /api/appointments/:id - devrait retourner une erreur si le rendez-vous n\'existe pas', async () => {
    const updatedAppointment = {
      customerName: "Jane Doe",
      customerPhone: "0987654321",
      appointmentDate: "2025-02-12",
      appointmentTime: "14:00",
    };

    const response = await request(app)
      .put('/api/appointments/invalidId')
      .send(updatedAppointment);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Rendez-vous non trouvé");
  });

  it('DELETE /api/appointments/:id - devrait supprimer un rendez-vous avec succès', async () => {
    const response = await request(app)
      .delete(`/api/appointments/${appointmentId}`); // Utilisez l'ID du rendez-vous créé

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Rendez-vous supprimé avec succès");
  });

  it('DELETE /api/appointments/:id - devrait retourner une erreur si le rendez-vous n\'existe pas', async () => {
    const response = await request(app)
      .delete('/api/appointments/invalidId');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Rendez-vous non trouvé");
  });

  it('GET /api/creneaux - devrait retourner une liste de créneaux occupés', async () => {
    const response = await request(app).get('/api/creneaux?date=2025-02-12');
    expect(response.status).toBe(200);
    expect(response.body).toContain("10:00");
  });

  it('GET /api/appointments/user/:userId - devrait retourner une liste de rendez-vous pour un utilisateur spécifique', async () => {
    const response = await request(app).get('/api/appointments/user/67e0036f84372cf248e9c767'); 
    expect(response.status).toBe(200);
    // Array check
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /api/appointments - devrait retourner une erreur si le créneau est complet', async () => {
    const newAppointment1 = {
      customerName: "John Doe",
      customerPhone: "1234567890",
      appointmentDate: "2025-02-12",
      appointmentTime: "11:00",
    };

    const newAppointment2 = {
      customerName: "Jane Doe",
      customerPhone: "0987654321",
      appointmentDate: "2025-02-12",
      appointmentTime: "11:00",
    };

    const newAppointment3 = {
      customerName: "Alice Smith",
      customerPhone: "1122334455",
      appointmentDate: "2025-02-12",
      appointmentTime: "11:00",
    };

    const newAppointment4 = {
      customerName: "Bob Brown",
      customerPhone: "5566778899",
      appointmentDate: "2025-02-12",
      appointmentTime: "11:00",
    };

    await request(app).post('/api/appointments').send(newAppointment1);
    await request(app).post('/api/appointments').send(newAppointment2);
    await request(app).post('/api/appointments').send(newAppointment3);

    const response = await request(app)
      .post('/api/appointments')
      .send(newAppointment4);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Le créneau est complet. Veuillez choisir un autre créneau.");
  });
});