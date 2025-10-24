import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import MongoStore from 'rate-limit-mongo';
import { getclientip } from '../utils/countries.utils.js';
      export const limit= rateLimit({
      windowMs:15*60*1000,
      max:async function (req) {
        const country_code = await getclientip(req.headers['x-forwarded-for'])
        console.log(country_code)
        if (country_code == 'IN') {
          return 20
        }
        if (country_code == 'EG') {
          return 30
        }
        return 15
      },
      requestProperty: "rateLimit",
      statusCode:429,
      message:"too many requests,please try again later",
      handler:(req,res,next)=>{
        res.status(429).json({message:"too many requests,please try again later"})
      },
      legacyHeaders:false,
      standardHeaders:'draft-7',
      skipFailedRequests:true,
      keyGenerator:(req)=>{
        const ip=ipKeyGenerator(req.headers['x-forwarded-for']);
        console.log(`the key Generator: ${ip} ${req.path}`);
        return `${ip} ${req.path}`
      },
      store:new MongoStore({
        uri:process.env.DB_url,
        collectionName:'rate-Limiter',
        expireTimeMs:15*60*1000
      })
    })