import { asyncHandler } from "../utils/response.js"
import { decodedtoken, tokenTypeEnum } from "../utils/security/token.security.js"

export const authentication = ({tokenType=tokenTypeEnum.access}={})=>{
    return asyncHandler(async(req,res,next)=>{
     req.user = await decodedtoken({next,authorization:req.headers.authorization,tokenType})
        return next()
    })
}



