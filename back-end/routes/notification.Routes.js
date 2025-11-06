import express from "express";
import { getnotification } from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.post('/get',getnotification);

export default notificationRouter;