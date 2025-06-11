import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Register route
router.post("/register", authController.register);
// Login route
router.post("/login", authController.login);

export default router;