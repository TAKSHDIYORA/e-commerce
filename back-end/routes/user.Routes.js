import express from 'express';
import { loginUser,registerUser, adminLogin } from '../controllers/userController.js';
import  { IpAuth } from '../middleware/adminAuth.js';



const userRouter = express.Router();


userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser);
userRouter.post("/admin",IpAuth,adminLogin);

export default userRouter;