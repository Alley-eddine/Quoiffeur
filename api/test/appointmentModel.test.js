import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Appointment from '../models/appointmentModel.js';
import connectDB from '../config/db.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri; // Remplace l'URI de la base réelle
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Tests du modèle Appointment', () => {
  it('devrait créer un rendez-vous avec succès', async () => {
    const appointmentData = {
      customerName: "John Doe",
      customerPhone: "1234567890",
      appointmentDate: "2025-02-12",
      appointmentTime: "10:00",
    };

    const newAppointment = new Appointment(appointmentData);
    const savedAppointment = await newAppointment.save();

    expect(savedAppointment._id).toBeDefined();
    expect(savedAppointment.customerName).toBe("John Doe");
    expect(savedAppointment.customerPhone).toBe("1234567890");
    expect(savedAppointment.appointmentDate).toBe("2025-02-12");
    expect(savedAppointment.appointmentTime).toBe("10:00");
  });

  it('devrait ne pas créer un rendez-vous sans customerName', async () => {
    const appointmentData = {
      customerPhone: "1234567890",
      appointmentDate: "2025-02-12",
      appointmentTime: "10:00",
    };

    const newAppointment = new Appointment(appointmentData);
    let err;
    try {
      await newAppointment.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.customerName).toBeDefined();
  });

  it('devrait ne pas créer un rendez-vous sans customerPhone', async () => {
    const appointmentData = {
      customerName: "John Doe",
      appointmentDate: "2025-02-12",
      appointmentTime: "10:00",
    };

    const newAppointment = new Appointment(appointmentData);
    let err;
    try {
      await newAppointment.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.customerPhone).toBeDefined();
  });

  it('devrait ne pas créer un rendez-vous sans appointmentDate', async () => {
    const appointmentData = {
      customerName: "John Doe",
      customerPhone: "1234567890",
      appointmentTime: "10:00",
    };

    const newAppointment = new Appointment(appointmentData);
    let err;
    try {
      await newAppointment.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.appointmentDate).toBeDefined();
  });

  it('devrait ne pas créer un rendez-vous sans appointmentTime', async () => {
    const appointmentData = {
      customerName: "John Doe",
      customerPhone: "1234567890",
      appointmentDate: "2025-02-12",
    };

    const newAppointment = new Appointment(appointmentData);
    let err;
    try {
      await newAppointment.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.appointmentTime).toBeDefined();
  });
});