import express from 'express';
import authorizeUser from "../middlewares/authorizeUser.js";
import { addRating, deleteRating, fetchRating, fetchRatingByProId } from '../controllers/ratings.controller.js';

const router = express.Router();

router.get('/fetchratings', fetchRating);
router.get('/fetchratingbyproduct/:id', fetchRatingByProId);
router.post('/addratings', authorizeUser, addRating);
router.delete('/deleterating/:user_id/:pro_id', authorizeUser, deleteRating);

export default router;
