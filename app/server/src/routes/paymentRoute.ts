import express from 'express';
import {
    createAccount, 
    createAccountLink, 
} from '../controllers/paymentController';

const router = express.Router();


// POST routes
router.post('/account', createAccount);
router.post('/account-link', createAccountLink)

export default router;