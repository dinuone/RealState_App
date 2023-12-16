import express from 'express';
import { DeleteUser, UpdateUser, getUserListings } from '../Controllers/User.controller.js';
import { verifyToken } from '../Utils/verifyUser.js';

const router = express.Router();


router.post('/update/:id',verifyToken, UpdateUser)
router.delete('/delete/:id',verifyToken, DeleteUser)
router.get('/listings/:id',verifyToken, getUserListings )

export default router;