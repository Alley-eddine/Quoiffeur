import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import appointmentRoutes from '../routes/appointmentRoute.js';
import connectDB from '../config/db.js';

jest.mock('../schema/userSchema.js');
jest.mock('../mailer/confirmMail.js');

import User from '../schema/userSchema.js';
import * as confirmMail from '../mailer/confirmMail.js';

const app = express();
app.use(express.json());
app.use('/api', appointmentRoutes);

let mongoServer;
let appointmentId;

const validObjectId = new mongoose.Types.ObjectId();

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  await connectDB();

  // Vérifier que la connexion est bien établie
  console.log('MongoDB connection state:', mongoose.connection.readyState);

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

  appointmentId = response.body.data._id;
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Reset et configurer les mocks avant chaque test
beforeEach(() => {
  jest.clearAllMocks();
  
  // Configuration des mocks
  User.findById = jest.fn().mockResolvedValue({ 
    _id: validObjectId, 
    mail: 'test@example.com', 
    name: 'Test User' 
  });
  
  confirmMail.sendAppointmentConfirmation = jest.fn().mockResolvedValue({ 
    success: true, 
    messageId: 'mock-message-id' 
  });
});

describe('Tests des routes des rendez-vous', () => {
  // Test de création basique
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

  // Test pour l'envoi d'email
  it('POST /api/appointments - devrait envoyer un email de confirmation quand customerId est fourni', async () => {
    const newAppointment = {
      customerName: "Test User",
      customerPhone: "1234567890",
      appointmentDate: "2025-02-12",
      appointmentTime: "14:30",
      customerId: validObjectId.toString()
    };

    const response = await request(app)
      .post('/api/appointments')
      .send(newAppointment);

    // Si erreur, afficher le message
    if (response.status !== 201) {
      console.log('Error message:', response.body);
    }

    // Vérifier que le rendez-vous a été créé avec succès
    expect(response.status).toBe(201);
    
    // Vérifier que User.findById a été appelé avec le bon ID
    expect(User.findById).toHaveBeenCalledWith(validObjectId.toString());
    
    // Vérifier que sendAppointmentConfirmation a été appelé avec les bons paramètres
    expect(confirmMail.sendAppointmentConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: "Test User",
        appointmentDate: "2025-02-12",
        appointmentTime: "14:30"
      }),
      'test@example.com'
    );
  });

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
      .put(`/api/appointments/${appointmentId}`)
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
      .delete(`/api/appointments/${appointmentId}`);

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