import express from 'express';
import { UpdateUser, test } from '../Controllers/User.controller.js';
import { verifyToken } from '../Utils/verifyUser.js';

const router = express.Router();

router.get('/test', test)
router.post('/update/:id',verifyToken, UpdateUser)

export default router;