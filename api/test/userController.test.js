import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import userRoutes from '../routes/userRoute.js';
import connectDB from '../config/db.js';

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

let mongoServer;
let userId; // Variable pour stocker l'ID de l'utilisateur

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri; // Remplace l'URI de la base réelle
  await connectDB();

  // Créez un utilisateur avant les tests PUT et DELETE
  const newUser = {
    name: "John Doe",
    mail: "john.doe@example.com",
    password: "password123",
    phone: "1234567890"
  };

  const response = await request(app)
    .post('/api/register')
    .send(newUser);

  userId = response.body.data._id; // Stockez l'ID de l'utilisateur
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Tests des routes utilisateur', () => {
  it('POST /api/register - devrait créer un utilisateur avec succès', async () => {
    const newUser = {
      name: "Jane Doe",
      mail: "jane.doe@example.com",
      password: "password123",
      phone: "0987654321"
    };

    const response = await request(app)
      .post('/api/register')
      .send(newUser);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User successfully added");
    expect(response.body.data.name).toBe("Jane Doe");
  });

  it('POST /api/login - devrait connecter un utilisateur avec succès', async () => {
    const userCredentials = {
      mail: "john.doe@example.com",
      password: "password123"
    };

    const response = await request(app)
      .post('/api/login')
      .send(userCredentials);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logged in successfully");
    expect(response.body.user.mail).toBe("john.doe@example.com");
  });

  it('POST /api/update - devrait mettre à jour un utilisateur avec succès', async () => {
    const updatedUser = {
      _id: userId, // Utilisez l'ID de l'utilisateur créé
      name: "John Smith",
      mail: "john.smith@example.com",
      password: "newpassword123",
      phone: "1234567890"
    };

    const response = await request(app)
      .post('/api/update')
      .send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User updated successfully");
    expect(response.body.user.name).toBe("John Smith");
  });

  it('POST /api/delete - devrait supprimer un utilisateur avec succès', async () => {
    const userToDelete = {
      _id: userId // Utilisez l'ID de l'utilisateur créé
    };

    const response = await request(app)
      .post('/api/delete')
      .send(userToDelete);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
  });
});