import Joi from "joi";
import { generalfields } from "../../middleware/validation.middleware.js";
export const shareprofile = {
    params: Joi.object({
        userid: generalfields.id.required()
    })
}
export const updatebasicinfo = {
    body: Joi.object().keys({
     fullName:generalfields.fullName.required(),
     phone:generalfields.phone.required(),
     gender:generalfields.gender.required(),
    }).required()
}
export const updatepassword = {
    body: Joi.object().keys({
     oldpassword:generalfields.password.required(),
     password:generalfields.password.not(Joi.ref('oldpassword')).required(),
    }).required()
}
export const freezeAccount = {
    params: Joi.object().keys({
        userid: generalfields.id
    }).required()
}
export const restoreAccount = {
    params: Joi.object().keys({
        userid: generalfields.id.required()
    }).required()
}
export const deleteAccount = {
    params: Joi.object().keys({
        userid: generalfields.id.required()
    }).required()
}