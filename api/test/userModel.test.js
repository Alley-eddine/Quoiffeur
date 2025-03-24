import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createUser, loginUser, updateUser, deleteUser } from '../models/userModel.js';
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

describe('Tests du modèle User', () => {
  let userId;

  it('devrait créer un utilisateur avec succès', async () => {
    const userData = {
      name: "John Doe",
      mail: "john.doe@example.com",
      password: "password123",
      phone: "1234567890"
    };

    const { user, token } = await createUser(userData);

    expect(user._id).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.mail).toBe("john.doe@example.com");
    expect(user.phone).toBe("1234567890");
    expect(token).toBeDefined();

    userId = user._id; // Stockez l'ID de l'utilisateur pour les tests suivants
  });

  it('devrait connecter un utilisateur avec succès', async () => {
    const userData = {
      mail: "john.doe@example.com",
      password: "password123"
    };

    const { user, token } = await loginUser(userData);

    expect(user._id).toBeDefined();
    expect(user.mail).toBe("john.doe@example.com");
    expect(token).toBeDefined();
  });

  it('devrait mettre à jour un utilisateur avec succès', async () => {
    const updatedUserData = {
      _id: userId,
      name: "John Smith",
      mail: "john.smith@example.com",
      password: "newpassword123",
      phone: "0987654321"
    };

    const updatedUser = await updateUser(updatedUserData);

    expect(updatedUser._id).toBeDefined();
    expect(updatedUser.name).toBe("John Smith");
    expect(updatedUser.mail).toBe("john.smith@example.com");
    expect(updatedUser.phone).toBe("0987654321");
  });

  it('devrait supprimer un utilisateur avec succès', async () => {
    const userToDelete = {
      _id: userId
    };

    const deletedUser = await deleteUser(userToDelete);

    expect(deletedUser._id).toBeDefined();
    expect(deletedUser.name).toBe("John Smith");
  });
});