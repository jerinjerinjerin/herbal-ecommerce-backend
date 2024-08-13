import express from 'express';
import { paymentController, webhooks } from '../controller/payment.controller.js';
import authToken from '../middleware/authToken.js';

const router = express.Router();

// Apply the raw body parser specifically for the webhook route
router.post('/webhook', express.raw({ type: 'application/json' }), webhooks);

// Other routes can use JSON parser or other middleware as needed
router.post('/checkout', authToken, paymentController);

export default router;
