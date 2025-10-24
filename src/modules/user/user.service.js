import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBservice from '../../DB/db.service.js'
import { roleEnum, UserModel } from "../../DB/models/User.model.js";
import { createencryption, decryptencryption } from "../../utils/security/encryption.security.js";
import { generateLogincredential} from "../../utils/security/token.security.js";
import { confirmEmail } from "../auth/auth.service.js";
import { compareHash,createHash } from "../../utils/security/hash.security.js";
export const profile =asyncHandler(async(req,res,next)=>{
    req.user.phone=decryptencryption({ciphertext:req.user.phone})
    return successResponse({res,data:{user:req.user}})
})

export const shareprofile =asyncHandler(async(req,res,next)=>{
    const {userid} = req.params
    const user = await DBservice.findOne({
        model:UserModel,
        filter:{
            _id:userid,
            confirmEmail:{ $exists: true}
        }
    })
    return user ? successResponse({res,data:{user}}) : next (new Error ("invalid account"),{cause:404})
})

export const updatebasicinfo =asyncHandler(async(req,res,next)=>{
    if (req.body.phone) {
        req.body.phone = createencryption({plaintext:req.body.phone})
    }
    const user = await DBservice.findOneAndUpdate({
        model:UserModel,
        filter:{
            _id:req.user._id,
        },
        data:req.body
    })
    return user ? successResponse({res,data:{user}}) : next (new Error ("invalid account"),{cause:404})
})

export const updatepassword =asyncHandler(async(req,res,next)=>{
   const {oldpassword,password} = req.body
   if (!await compareHash({plaintext:oldpassword,hashValue:req.user.password})) {
       return next(new Error("invalid old password"),{cause:403})
   }
   if (req.user.oldpassword?.length) {
    for (const hashpassword of req.user.oldpassword) {
        if (await compareHash({plaintext:oldpassword,hashValue:hashpassword})) {
            return next(new Error("invalid old password"),{cause:403})
        }
    }
  }
    const user = await DBservice.findOneAndUpdate({
        model:UserModel,
        filter:{
            _id:req.user._id,
        },
        data:{
            password:await createHash({plaintext:password}),
            $push:{oldpassword:req.user.password}
        }
    })
    return user ? successResponse({res,data:{user}}) : next (new Error ("invalid account"),{cause:404})
})

export const freezeAccount =asyncHandler(async(req,res,next)=>{
    const {userid} = req.params;
    if (userid && req.user.role !==roleEnum.admin) {
        return next(new Error("not authorized account",{cause:403}))
    }
    const user = await DBservice.findOneAndUpdate({
        model:UserModel,
        filter:{
            _id:user.id||req.user._id,
            deletedAt:{$exists:false}
        },
        data:{
          deletedAt:Date.now(),
          deletedBy:req.user._id
        }
    })
    return user ? successResponse({res,data:{user}}) : next (new Error ("invalid account"),{cause:404})
})

export const restoreAccount =asyncHandler(async(req,res,next)=>{
    const {userid} = req.params;
    const user = await DBservice.findOneAndUpdate({
        model:UserModel,
        filter:{
            _id:userid||req.user._id,
            deletedAt:{$exists:true},
            deletedBy:{$ne:userid}
        },
        data:{
            $unset: {
                deletedAt: 1,
                deletedBy:1
            },
            restoredAt:Date.now(),
            restoredBy:req.user._id
        }
    })
    return user ? successResponse({res,data:{user}}) : next (new Error ("invalid account"),{cause:404})
})

export const deleteAccount =asyncHandler(async(req,res,next)=>{
    const {userid} = req.params;
    const user = await DBservice.deleteOne({
        model:UserModel,
        filter:{
            _id:userid,
            deletedAt:{$exists:true}
        },
    })
    return  successResponse({res,data:{user}}) 
})
export const getNewLoginCredentials = 
    asyncHandler(async(req,res,next)=>{
        const credentials = await generateLogincredential({user:req.user})  
     return successResponse({res,data:{credentials}})
    })


export const forgetpassword = asyncHandler(async(req,res,next)=>{
   const {email} = req.body;
   if (!email) {
       return next(new Error("Email is required"),{cause:400})
   }
   const user = await DBservice.findOne({
       model:UserModel,
       filter:{
           email
       }
   })
   if (!user) {
       return next(new Error("User not found"),{cause:404})
   }
   const resetToken = user.generateResetToken();
   await user.save();
   await sendEmail({
       to:user.email,
       subject:"Password Reset",
       text:`Your reset token is ${resetToken}`
   })
   return successResponse({res,message:"Reset token sent to email",cause:200})
})

export const resetpassword = asyncHandler(async(req,res,next)=>{
   const {resetToken,newPassword} = req.body;
   if (!resetToken || !newPassword) {
       return next(new Error("Reset token and new password are required"),{cause:400})
   }
   const user = await DBservice.findOne({
       model:UserModel,
       filter:{
           resetToken
       }
   })
   if (!user) {
       return next(new Error("Invalid reset token"),{cause:404})
   }
   user.password = await createHash({plaintext:newPassword});
   user.resetToken = undefined;
   await user.save();
   return successResponse({res,message:"Password reset successfully",cause:200})
})
export const uploadprofileservice=asyncHandler(async(req,res,next)=>{
    console.log('the file info after upload',req.file);
    console.log(req.body);
    
    return successResponse({res,cause:200,message:"profile uploaded successfully"})
})