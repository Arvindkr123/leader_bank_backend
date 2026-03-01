import { Router } from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { createAccountController } from "../controllers/account.controllers.js";

const router = Router();

router.post("/", authMiddleware, createAccountController)

export default router;