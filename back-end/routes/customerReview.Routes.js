import express from "express";

import { addReview, getReviews } from "../controllers/customerReviewController.js";


const customerReviewRouter = express.Router();

customerReviewRouter.post('/add',addReview);
customerReviewRouter.post('/getReview',getReviews);

export default customerReviewRouter;
