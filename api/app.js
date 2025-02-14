import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import appointmentRoutes from "./routes/appointmentRoute.js";

dotenv.config(); // Charger les variables d'environnement

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
connectDB();

// Route par défaut
app.get("/", (req, res) => {
  res.send("API backend opérationnelle");
});

// Routes utilisateur
app.use("/users", userRoutes);

// Routes pour les rendez-vous
app.use("/appointments", appointmentRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
