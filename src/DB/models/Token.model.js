
import mongoose from "mongoose";

const tokenschema = new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    expiredAt:{
        type:Date,
        required:true
    }
})
tokenschema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); 

export   const TokenModel = mongoose.model("Token", tokenschema)