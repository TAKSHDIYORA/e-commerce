import express from "express";
import { deleteNotification, getnotification } from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.post('/get',getnotification);
notificationRouter.post('/delete',deleteNotification);

export default notificationRouter;