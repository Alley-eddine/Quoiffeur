import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

// Route pour créer un rendez-vous
router.post("/register", userController.register);

router.post("/update", userController.updateUser);

router.post("/delete", userController.deleteUser);

export default router;
