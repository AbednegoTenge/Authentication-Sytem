import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

// Register route
router.post("/register", authController.register);
// Login route
router.post("/login", authController.login);
// verification route
router.get('/verify-email', authController.verifyEmail);

export default router;