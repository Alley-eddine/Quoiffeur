import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import appointmentRoutes from "./routes/appointmentRoute.js";

dotenv.config(); // Charger les variables d'environnement

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
connectDB().then(() => {
  console.log("MongoDB connected");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

// Route par défaut
app.get("/", (req, res) => {
  res.send("API backend opérationnelle");
});

// Routes utilisateur
app.use("/users", userRoutes);

// Routes pour les rendez-vous
app.use("/appointments", appointmentRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;