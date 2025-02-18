import express from 'express';
import { addCategories, deleteCategories, getCategories, getCategoryByID, updateCategories } from '../controllers/categories.controllers.js';
const router = express.Router();

router.post('/addcategories', addCategories);
router.get('/getcategories', getCategories);
router.delete('/deletecategories/:id',deleteCategories);
router.put('/updatecategories/:id',updateCategories);
router.get('/getcategorybyid/:id',getCategoryByID);

export default router;