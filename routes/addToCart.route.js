import express from 'express';
import { addToCart, addToCartViewProduct, CountAddToCartProduct, deleteAddToCartProduct, updateAddToCartProduct } from '../controller/cart.controller.js';
import authToken from '../middleware/authToken.js';

const router = express.Router();

router.post('/addtocart',authToken,addToCart);
router.get('/count-product-cart', authToken, CountAddToCartProduct);
router.get('/view-product-cart', authToken,addToCartViewProduct);
router.post('/update-cart-product', authToken, updateAddToCartProduct);
router.delete('/delect-cart-product', authToken, deleteAddToCartProduct)



export default router;