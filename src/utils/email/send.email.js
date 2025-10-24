import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve("./src/config/.env.dev");
dotenv.config({ path: envPath });
export async function sendEmail({ 
  to="",
  cc="",
  bcc="",
  subject="sarha app",
  text="",
  html="",
  attachments=[]
 }={}){
  const transporter = nodemailer.createTransport({
  service:"gmail",  
  auth: {
    user: process.env.your_app_email,
    pass: process.env.your_app_password,
  }, 
  tls: {
    rejectUnauthorized: false,
  }
});

  const info = await transporter.sendMail({
    from: `hi ${process.env.your_app_email}`,
    to,cc,bcc,subject,text,html,attachments
    })
    console.log('Message sent:', info.messageId);
  }
  
