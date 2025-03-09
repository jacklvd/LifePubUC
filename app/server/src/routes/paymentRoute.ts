import express from 'express';
import {
    createStripeAccount, 
    createStripeAccountLink, 
    createStripeCheckoutSession
} from '../controllers/paymentController';

const router = express.Router();


// POST routes
router.post('/accounts', createStripeAccount);
router.post('/account-links', createStripeAccountLink)
router.post('/payment-intent', createStripeCheckoutSession)

export default router;