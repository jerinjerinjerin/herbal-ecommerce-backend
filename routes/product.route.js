import express from 'express';
import { 
    CreateProduct, 
    DeleteProduct, 
    getCategoryWiseProduct, 
    GetProduct, 
    GetProducts, 
    getProductsByCategoryId, 
    searchProduct, 
    updateProduct
} from '../controller/product.controller.js';
import authToken from '../middleware/authToken.js';

const router = express.Router();

//admin routes
router.post('/create-product',authToken, CreateProduct)
router.post('/update-product', authToken, updateProduct)
router.delete('/delete-product/:id',authToken, DeleteProduct)


//user routes
router.get('/single-product/:id', GetProduct)
router.get('/getall-products', GetProducts)

//relected product
router.get('/get-product-category/:id', getProductsByCategoryId)


router.get('/search-products', searchProduct)
router.post('/category-wise',getCategoryWiseProduct)

export default router;