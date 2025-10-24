import { asyncHandler } from "../utils/response.js"
export const authorization = ({accessRoles=[]}={})=>{
    return asyncHandler(async(req,res,next)=>{
    console.log({accessRoles,currentRole:req.user.role,match:accessRoles.includes(req.user.role)});
    if (!accessRoles.includes(req.user.role)) {
        return next (new Error("Not authorztion account"))
    }
    return next()
    })
}