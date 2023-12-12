import express from 'express';
import { GoogleAuth, SignIn, Signup } from '../Controllers/Auth.controller.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/signin',SignIn)
router.post('/google',GoogleAuth);

export default router;