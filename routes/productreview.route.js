import express from 'express';
import authToken from '../middleware/authToken.js';
import { GetProductReviews, ProductReview } from '../controller/review.controller.js';

const router = express.Router();

router.post('/product-review', authToken, ProductReview);
router.get('/get-product-review/:productId',GetProductReviews)

export default router;