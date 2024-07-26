import express from 'express';
import authToken from '../middleware/authToken.js';
import { ProductReview } from '../controller/review.controller.js';

const router = express.Router();

router.post('/product-review', authToken, ProductReview);

export default router;