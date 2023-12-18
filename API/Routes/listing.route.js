import express from 'express';
import { createListing, deleteListings, getListing, searchListing, updateListings } from '../Controllers/Listing.controller.js';
import { verifyToken } from '../Utils/verifyUser.js';


const router = express.Router();

router.post('/create', verifyToken, createListing)
router.delete('/delete/:id', verifyToken, deleteListings)
router.post('/update/:id', verifyToken, updateListings)
router.get('/getListing/:id',getListing)
router.get('/get',searchListing)

export default router;