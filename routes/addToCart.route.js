import express from 'express';
import { addToCart, CountAddToCartProduct } from '../controller/cart.controller.js';
import authToken from '../middleware/authToken.js';

const router = express.Router();

router.post('/addtocart',authToken,addToCart);
router.get('/count-product-cart', authToken, CountAddToCartProduct);



export default router;