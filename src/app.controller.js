import express from 'express';
import connectDB from './DB/connection.db.js';
import authcontroller  from './modules/auth/auth.controller.js'
import usercontroller from './modules/user/user.controller.js'
import messagecontroller from './modules/message/message.controller.js'
import { globalerrorHandling } from './utils/response.js';
import path from 'node:path'
console.log(path.join('./src/config/.env.dev'));
import * as dotenv from 'dotenv'
dotenv.config({})
import cors from 'cors'
import {sendEmail} from './utils/email/send.email.js'
import {resizeimage} from './utils/image.processor.js'
import { deleteallExpired } from './utils/token/deleteexpiredtokens.js';
import helmet from 'helmet';
import { limit } from './middleware/rate-limit.middleware.js';
const bootstrap=async()=>{
    const app=express();
    const port=3000
    app.use(express.json());
    async function getclientip(ip){
    const response = await axios.get(`https://ipapi.co/${ip}/json/`)
    console.log(response);
    return response.data
    }
    // ratelimit
    app.use(limit)
    //helmet
    app.use(helmet({
      referrerPolicy:{policy:'origin'}
    }))
    await sendEmail({to:"fahdkhodair77@gmail.com",text:"meeting now"})
    // cors
      const whitelist = process.env.whitelist_domains;  
      console.log("CORS whitelist:", whitelist);
   const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true
};
    app.use(cors(corsOptions))
    // db
    await connectDB();
    console.log(process.env.WEB_Client_id.split(','));
    
    // image-processor
    await resizeimage()
    // deleteExpiredTokens
    await deleteallExpired()
    //  app-router
    app.use('/auth',authcontroller)
    app.use('/user',usercontroller)
    app.use('/api',messagecontroller)
    app.use(globalerrorHandling)
    app.listen(port,()=>console.log(`server running on port ${port}`));
}
export default bootstrap;