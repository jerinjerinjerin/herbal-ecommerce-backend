import express from 'express';
import { 
    paymentController 
} from '../controller/payment.controller.js';
import authToken from '../middleware/authToken.js';
import { webhooks } from '../controller/webhook.js';
const app = express();
app.use(express.raw({ type: 'application/json' }));
const router = express.Router();


router.post('/checkout',authToken,paymentController);
router.post('/webhook',authToken, webhooks)//api weebhook

export default router;