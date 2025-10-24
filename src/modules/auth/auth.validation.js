import Joi from "joi";
import { generalfields } from "../../middleware/validation.middleware.js";
export const login = {
  body: Joi.object().keys({
    email: generalfields.email.required(),
    password: generalfields.password.required(),
}).required().options({allowUnknown:false})
}

export const signup = { 
  body: login.body.append({
    fullName: generalfields.fullName.required(),
    phone: generalfields.phone.required(),
    confirmpassword: generalfields.confirmpassword.required(),
}).required().options({allowUnknown:false})
}

export const confirmEmail = { 
  body: Joi.object().keys({
    email: generalfields.email.required(),
    otp: generalfields.otp.required(),
}).required().options({allowUnknown:false})
}

export const loginwithGmail = { 
  body: Joi.object().keys({
    idToken: Joi.string().required()
}).required().options({allowUnknown:false})
}