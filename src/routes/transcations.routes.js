import { Router } from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { createTranscation } from "../controllers/transcation.controllers.js";

const router = Router();

router.post("/", authMiddleware, createTranscation)

export default router;