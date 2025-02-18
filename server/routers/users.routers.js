import express from 'express'
import { addUsers, deleteUser, getUserDetails, getUsers, loginUser, registerUser, updateUser } from '../controllers/users.controllers.js'

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getuserdetails", getUserDetails);
router.get("/getusers", getUsers);
router.post("/addusers", addUsers);
router.delete("/deleteusers/:id", deleteUser);
router.put("/updateuser/:id", updateUser);

export default router;