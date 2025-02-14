import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

// Route pour créer un rendez-vous
router.post("/register", userController.register);

export default router;
