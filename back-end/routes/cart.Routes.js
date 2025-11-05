import express from 'express';
import {  fetchUser , saveCart,addToCart ,getUserCart} from '../controllers/cartController.js';
import authUser from '../middleware/auth.js';


const cartRouter = express.Router();
cartRouter.post("/save",authUser,saveCart);

// cartRouter.get("/getData",authUser,getData);
// cartRouter.post("/getDataOfUser",authUser,getDataOfUser);
cartRouter.post("/add",authUser,addToCart);
cartRouter.post("/userCart",authUser,getUserCart);

cartRouter.post("/:email",authUser,fetchUser);




export default cartRouter;