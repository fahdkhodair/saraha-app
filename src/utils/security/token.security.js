import jwt from 'jsonwebtoken'
import * as DBservice from '../../DB/db.service.js'
import { UserModel,roleEnum } from "../../DB/models/User.model.js";
export const generatetoken = ({
    payload={},
    secret = process.env.Access_User_Token_Signature,
    options = {expiresIn:"5h"},
}={})=>{
 return  jwt.sign(payload, secret, options)
}

export const signaturelevelEnum = {bearer: "Bearer",system : "system"} 
export const tokenTypeEnum = {access:"access",refresh:"refresh"}


export const verifytoken = async({token = "",secret = getsignature.accesssignature}={})=>{
return jwt.verify(token,secret)
}


export const getsignature = async({signaturelevel = signaturelevelEnum.bearer}={})=>{
   let signatures = {accesssignature:undefined,refreshsignature:undefined}
        switch (signaturelevel) {
            case signaturelevelEnum.system:
                signatures.accesssignature = process.env.Access_System_Token_Signature;
                signatures.refreshsignature = process.env.Refresh_System_Token_Signature;
                break;
            default:
                signatures.accesssignature = process.env.Access_User_Token_Signature;
                signatures.refreshsignature = process.env.Refresh_User_Token_Signature;
                break;
        }
        return signatures
}


export const decodedtoken = async({next, authorization ="",tokenType=tokenTypeEnum.access}={})=>{
            console.log(authorization);
            console.log(authorization?.split(' '));
            const [bearer,token] = authorization?.split(' ')||[]
            console.log({bearer,token});
            if (!bearer || !token) {
               return next (new Error('missing token parts',{cause:401}))  
            }
           let signatures= await getsignature({signaturelevel:bearer})
           const decoded =await verifytoken({
            token,
            secret:tokenType===tokenTypeEnum.access? signatures.accesssignature:signatures.refreshsignature
         });
           console.log(decoded);
            const user = await DBservice.findById({model:UserModel,id: decoded.id })
            if (!user) {
                return next(new Error("Not Register account",{cause:404}))
            }
            return user
}

export const generateLogincredential = async({user}={})=>{
    const signatures = await getsignature({
                        signaturelevel: user.role != roleEnum.user ? signaturelevelEnum.system:signaturelevelEnum.bearer
                     })
                    console.log(signatures);
            const access_token  = await generatetoken({
                     payload:{id: user._id},
                     secret:signatures.accesssignature,
                     options:{
                         expiresIn:process.env.Access_Token_expiresIn
                     }
                 })
         
                  const Refresh_token = await generatetoken({
                    payload:{id: user._id},
                    secret: signatures.refreshsignature,
                    options:{
                     expiresIn:process.env.Refresh_Token_expiresIn,
                     }
         })   
         return {access_token,Refresh_token}
}