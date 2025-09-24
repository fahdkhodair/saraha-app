import { asyncHandler, successResponse } from "../../utils/response.js";
import Message from "../../DB/models/Message.model.js";
import * as DBservice from '../../DB/db.service.js'
import { UserModel } from "../../DB/models/User.model.js";
export const sendmessage = asyncHandler(async(req,res,next)=>{
    const{content} = req.body;
    const{receiverId} = req.params;
    const user = await DBservice.findById({
        model:UserModel,
        id:receiverId,
    });
    if (!user) {
        return next(new Error("User not found",{cause:404}));
    }
    const message = new Message({
        content,
        receiverId
    })
    await message.save();
    return successResponse({res,message:"message sent successfully",cause:201,data:message})
})
export const getMessageservice = asyncHandler(async(req,res,next)=>{
    const messages = await DBservice.find({
        model:Message,
        populate:[{path:'receiverId',
            select:'firstName middleName lastName'
        }]
    });
    return successResponse({res,cause:200,data:messages})
})