import { Router } from 'express'
import { userRegisterController, userLoginController } from '../controllers/auth.controllers.js';
const router = Router()

router.post('/register', userRegisterController);
router.post('/login', userLoginController);

export default router;