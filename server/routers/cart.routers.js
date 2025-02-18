import express from 'express'
import { addToCart, deleteCart, fetchCarts, updatedQuantity } from '../controllers/cart.controller.js';
import authorizeUser from '../middlewares/authorizeUser.js';

const router = express.Router();

router.post("/addtocart", authorizeUser, addToCart);
router.get("/fetchcart/:id", authorizeUser, fetchCarts);
router.put("/updatequantity", authorizeUser, updatedQuantity);
router.delete('/deletecart/:id', authorizeUser , deleteCart);

export default router;