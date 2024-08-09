import express from 'express';
import { 
    paymentController 
} from '../controller/payment.controller.js';
import authToken from '../middleware/authToken.js';

const router = express.Router();

router.post('/checkout',authToken,paymentController)

export default router;