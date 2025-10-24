import { asyncHandler } from "../utils/response.js"
import { decodedtoken } from "../utils/security/token.security.js"

export const auth = ({accessRoles=[]}={})=>{
    return asyncHandler(async(req,res,next)=>{
       req.user = await decodedtoken({next,authorization:req.headers.authorization}) 
    console.log({accessRoles,currentRole:req.user.role,match:accessRoles.includes(req.user.role)});
    if (!accessRoles.includes(req.user.role)) {
        return next (new Error("Not authorztion account",{cause:403}))
    }
    return next()
    })
}