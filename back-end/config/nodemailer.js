import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL_NAME,
        pass:process.env.EMAIL_APP_PASS
    }
})