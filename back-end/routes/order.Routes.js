import express from 'express'

import {verifyStripe,placeOrder,placeOrderStripe,placeOrderRazorPay,AllOrders,UserOrders,updateStatus} from '../controllers/orderController.js'
import { adminAuth } from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/list',adminAuth,AllOrders);
orderRouter.post('/status',adminAuth,updateStatus);




orderRouter.post('/place',authUser,placeOrder);
orderRouter.post('/stripe',authUser,placeOrderStripe);
orderRouter.post('/razorpay',authUser,placeOrderRazorPay)

orderRouter.post('/userorders',authUser,UserOrders);


//verify payment
orderRouter.post('/verifyStripe',authUser,verifyStripe)

export default orderRouter;


