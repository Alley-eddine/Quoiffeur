const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const connectDB = require("../config/db"); // Chemin vers ta fonction connectDB

describe("MongoDB Connection", () => {
  let mongoServer;

  // Avant tous les tests, démarre une base de données en mémoire
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGO_URI = uri; // Remplace l'URI de la base réelle
  });

  // Après tous les tests, arrête la base de données en mémoire
  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("devrait se connecter à MongoDB sans erreur", async () => {
    await connectDB();
    expect(mongoose.connection.readyState).toBe(1); // 1 signifie "connecté"
  });
});
