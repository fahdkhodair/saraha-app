import {providerEnum, roleEnum, UserModel} from "../../DB/models/User.model.js";
import {asyncHandler, successResponse}   from "../../utils/response.js";
import * as DBservice from "../../DB/db.service.js"
import { Error} from "mongoose";
import { compareHash, createHash } from "../../utils/security/hash.security.js";
import { createencryption } from "../../utils/security/encryption.security.js";
import {generateLogincredential } from "../../utils/security/token.security.js";
import { emailevent } from "../../utils/event/email.event.js";
import { customAlphabet } from "nanoid";
import { createotp } from "../../utils/security/otp.security.js";
import {OAuth2Client} from 'google-auth-library';
export const signup =asyncHandler(async (req, res, next) => { 
        const{fullName,email,password,phone}=req.body;
        console.log({fullName,email,password,phone});   
        if(await DBservice.findOne({model:UserModel,filter:{email}})){
            return next(new Error("Email exist",{cause:409}))
        }
        const hashpassword = await createHash({plaintext:String(password)})
        const encryptionphone = await  createencryption({plaintext:String(phone)})
        const otp = customAlphabet('01234567',6)()
        const confirmemailotp = await createHash({plaintext:otp})
        const [user] =await DBservice.create({
            model:UserModel,
            data:{
                fullName,
                email,
                password:hashpassword,
                phone:encryptionphone,
                confirmemailotp,
                otp:{
                    value:createotp(),
                    attempt:0,
                    expireAt:Date.now() + 2 * 60 * 1000
                }
            }})
        emailevent.emit("confirm-email",{to:email,otp:otp})
        return successResponse({res,status:201,data:{user}})
});



export const confirmEmail =asyncHandler(async (req, res, next) => {
        const { email, otp } = req.body;

    const user = await DBservice.findOne({
        model: UserModel,
        filter: {
            email,
            confirmEmail: { $exists: false },
        },
    });

    if (!user) {
        return next(new Error("invalid account or already verified", { cause: 404 }));
    }

    if (user.otp.banuntil && user.otp.banuntil > Date.now()) {
        const waittime = Math.ceil((user.otp.banuntil - Date.now()) / 1000);
        return next(new Error(`You are temporarily banned, try again after ${waittime} seconds`));
    }

    if (Date.now() - user.otp.expireAt > 2 * 60 * 1000) {
        return next(new Error("Code expired, you need to request a new one"));
    }

    if (user.otp.attempt >= 5) {
        await DBservice.updateOne({
            model: UserModel,
            filter: { email },
           updates: [
           { $set: { "otp.banuntil": Date.now() + 5 * 60 * 1000 } },
           { $inc: { __v: 1 } }
          ]

        });
        return next(new Error("Too many failed attempts, you are temporarily banned for 5 minutes"));
    }
    const isValidOTP = await compareHash({ plaintext: otp, hashValue: user.confirmemailotp });
    if (!isValidOTP) {
        await DBservice.updateOne({
            model: UserModel,
            filter: { email },
             updates: [
           { $set: { "otp.banuntil": Date.now() + 5 * 60 * 1000 } },
           { $inc: { __v: 1 } }
          ]
        });
        return next(new Error("Invalid OTP"));
    }
    const updateUser = await DBservice.updateOne({
        model: UserModel,
        filter: { email },
          updates: [
           { $set: { "otp.banuntil": Date.now() + 5 * 60 * 1000 } },
           { $inc: { __v: 1 } }
          ]
    });

    if (updateUser.matchedCount) {
        return successResponse({ res, status: 201, data: {} });
    } else {
        return next(new Error("Failed to confirm user email"));
    }
}
)
export const login =asyncHandler( async (req, res, next) => {
        const{email,password}=req.body;
        console.log({email,password});
        const user = await DBservice.findOne({
            model:UserModel, 
            filter:{email},
        })
        if(!user){
            return next(new Error("invalid-login data",{cause:404}))
        }
        const match = await compareHash({plaintext:String(password),hashValue:user.password})
        if (!match) {
            return next(new Error("invalid-login data",{cause:404}))
        }
        
          if (![roleEnum.user, roleEnum.admin].includes(user.role)) {
          return next(new Error("Unauthorized role", { cause: 403 }));
         }

       const credentials = await generateLogincredential({user})
        return successResponse({res,data:{ credentials }})
})



  async  function  verifygoogleaccount  (idToken) {
  const client = new OAuth2Client(process.env.WEB_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.WEB_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (err) {
    console.log("Google Verify Error:", err.message);
    throw new Error("Invalid Google token");
  }
}


export const resendconfirmEmail =asyncHandler(async (req, res, next) => {
        const{email}=req.body;
        const user = DBservice.findOne({
            model:UserModel,
            filter:{
            email
          }
        })
        if (!user) {
            return next(new Error("user not found",{cause:404}))
        }
        const otp = createotp()
        emailevent.emit("confirm-email",{to:email,otp:otp})
            await DBservice.updateOne({
                model:UserModel,
                filter:{email},
                updates:{
                  $set:{confirmotp:await createotp()},  
                  $inc:{
                    'otp-attempt':1,
                     'otp-value':await createotp(),
                     'otp-expiredat':Date.now() + 2*60*1000
                }
                },
            });
        return successResponse({res,message:`otp sent sucessfully to ${user.email}`})
}
)

export const signupwithgmail = asyncHandler (
    async(req,res,next)=>{
        const {idToken}=req.body
         const payload = await verifygoogleaccount( idToken );

        if (!payload) {
        return next(new Error("Invalid Google token", { cause: 400 }));
        }
        const { picture,name,email,email_verified }= payload
        if (!email_verified) {
            return next (new Error("not verified email",{cause:400}))
        }
        const existuser=await DBservice.findOne({
            model:UserModel,
            filter:{email}
        })
        if (existuser) {
            return next(new Error("Email-exist",{cause:409}))
        }
        const user = await DBservice.create({
            model:UserModel,
            data: [{
                fullName:name,
                email:email,
                picture:picture,
                confirmEmail:Date.now(),
                provider:providerEnum.google
            }]
        })
        return successResponse({res,status:201,data:{user}})
    }
)

export const loginwithgmail = asyncHandler(
  async (req, res, next) => {
    const { idToken } = req.body;
    const payload = await verifygoogleaccount( idToken );

        if (!payload) {
        return next(new Error("Invalid Google token", { cause: 400 }));
        }
    const { email, email_verified } = payload;

    if (!email_verified) {
      return next(new Error("not verified email", { cause: 400 }));
    }

    const user = await DBservice.findOne({
      model:UserModel,
      filter: { email },
    });

    if (!user) {
      return next(new Error("invalid-login data", { cause: 409 }));
    }

    const credentials = await generateLogincredential({ user });

    return successResponse({ res, status: 200, data: { credentials } });
  }
);
