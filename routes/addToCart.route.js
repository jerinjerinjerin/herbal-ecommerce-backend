import express from 'express';
import { addToCart, addToCartViewProduct, CountAddToCartProduct } from '../controller/cart.controller.js';
import authToken from '../middleware/authToken.js';

const router = express.Router();

router.post('/addtocart',authToken,addToCart);
router.get('/count-product-cart', authToken, CountAddToCartProduct);
router.get('/view-product-cart', authToken,addToCartViewProduct);



export default router;