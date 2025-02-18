import express from 'express'
import { addProducts, deleteProduct, getProductByID, getProducts, searchProducts, updateProduct } from '../controllers/products.controllers.js';

const router = express.Router();

router.post('/addproducts', addProducts);
router.get('/getproducts', getProducts);
router.get('/getproductbyid/:id', getProductByID);
router.delete('/deleteproduct/:id', deleteProduct);
router.put('/updateproduct/:id', updateProduct);
router.get('/searchproduct/:searchquery', searchProducts);

export default router;