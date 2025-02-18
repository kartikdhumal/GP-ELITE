import { changeStatus, fetchOrders, placeOrder } from "../controllers/orders.controller.js";
import express from 'express'
import authorizeUser from "../middlewares/authorizeUser.js";

const router = express.Router();

router.get('/getorders', authorizeUser, fetchOrders);
router.put('/changestatus/:id', authorizeUser, changeStatus);
router.post('/placeorder', authorizeUser, placeOrder);

export default router;
