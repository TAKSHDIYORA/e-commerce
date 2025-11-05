import express from 'express';
import { addCart, fetchUser, getData, getDataOfUser, saveCart } from '../controllers/cartController.js';
import authUser from '../middleware/auth.js';


const cartRouter = express.Router();
cartRouter.post("/save",authUser,saveCart);

cartRouter.get("/getData",authUser,getData);
cartRouter.post("/getDataOfUser",authUser,getDataOfUser);
cartRouter.post("/add",authUser,addCart);

cartRouter.post("/:email",authUser,fetchUser);




export default cartRouter;