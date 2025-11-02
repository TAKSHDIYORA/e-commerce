import express from 'express';
import { fetchUser, saveCart } from '../controllers/cartController.js';
import authUser from '../middleware/auth.js';


const cartRouter = express.Router();
cartRouter.post("/save",authUser,saveCart);
cartRouter.post("/:email",authUser,fetchUser);





export default cartRouter;