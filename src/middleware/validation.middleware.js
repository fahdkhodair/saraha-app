import { genderEnum } from "../DB/models/User.model.js";
import { asyncHandler } from "../utils/response.js"
import { Types } from "mongoose";
import Joi from "joi";
export const generalfields = {
    email: Joi.string().email({minDomainSegments:2,maxDomainSegments:3,tlds:{allow:['net','com','edu']}}),
    password:Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    fullName: Joi.string().min(2).max(20).messages({
            "string.min":"min name length is 2 char",
            "any.required":"fullName is mandatory"
        }),
        phone: Joi.string()
      .pattern(/^(002|\+2)?01[0125][0-9]{8}$/)
      .messages({
        'string.pattern.base': 'Phone must be a valid Egyptian number',
        'any.required': 'Phone is required',
      }),
      confirmpassword:Joi.string().valid(Joi.ref("password")).options({allowUnknown:false}),
      otp: Joi.string().length(6).pattern(new RegExp(/^\d{6}$/)),
      gender:Joi.string().valid(...Object.values(genderEnum)),
       id: Joi.string().custom((value, helper) => {
    if (!Types.ObjectId.isValid(value)) {
      return helper.error("any.invalid");
    }
    return value; 
  }).length(24)
}

export const validation =(Schema)=>{
    return asyncHandler(
        async(req,res,next) =>{
            const validationerror = [] 
            for (const key of Object.keys(Schema)) {
                const validateresult = Schema[key].validate(req[key], { abortEarly: false })
                if (validateresult.error) {
                    validationerror.push({
                        key,
                        details: validateresult.error.details.map(ele =>{
                            return {message:ele.message,path:ele.path[0]}
                        })
                    });
                }
            }
            if (validationerror.length) {
                return res.status(400).json({err_message:"validation error",validationerror})
            }
            return next();        
        }
    );
}


export const validationQuery =(Schema)=>{
    return asyncHandler(
        async(req,res,next) =>{
            const validateresult = Schema.validate(req.query, { abortEarly: false })
                    if (validateresult.error) {
                        return res.status(400).json({err_message:"validation error",validateresult})
                    }
            return next()        
        }
    )
}