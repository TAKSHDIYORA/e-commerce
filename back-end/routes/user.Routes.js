import express from 'express';
import { loginUser,registerUser, adminLogin,verifyOtp,deleteUser } from '../controllers/userController.js';
import  { IpAuth } from '../middleware/adminAuth.js';



const userRouter = express.Router();


userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser);
userRouter.post("/admin",IpAuth,adminLogin);
userRouter.post("/verify-otp",verifyOtp);
userRouter.post("/delete",deleteUser);

export default userRouter;