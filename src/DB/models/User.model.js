
import mongoose from "mongoose";
export const genderEnum={male:"male",female:"female"}
export const roleEnum={user:"user",admin:"admin"}
export const providerEnum={system:"system",google:"google"}
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: [20, "firstName max length is 20 char and you have entered {VALUE}"]
  },
  lastName:{
    type:String,
    required:false,
    minLength:2,
    maxLength:[20,"lastName max length is 20 char and you have entered {VALUE}"]
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  oldpassword:{
    type:String
  },
  password: {
    type: String,
    required: function(){
      return this.provider === providerEnum.system ? true : false;
    }
  },
  gender:{
    type: String,
    enum: { values: Object.values(genderEnum), message: `gender only allow ${Object.values(genderEnum)}` },
    default: genderEnum.male
  },
  role:{
    type:String,
    enum:Object.values(roleEnum),
    default:roleEnum.user
  },
  phone:{
    type: String,
    required: function () {
      return this.provider === providerEnum.system ? true : false;
    }
  },
  picture:{
    type:String
  },
  confirmEmail: {
    type: Date,
    required: false,
  },
  confirmemailotp:{
    type:String,
    required:false
  },
  provider:{
    type:String,
    enum:Object.values(providerEnum),
    default:providerEnum.system
  },
  otp:{
    value:String,
    attempt:{type:Number,default:0},
    expiredAt:Date,
    banUntil:Date
  },
  deletedAt:Date,
  deletedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  restoredAt:Date,
  restoredBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
}, {
  timestamps: true,
  toObject:{virtuals:true},
  toJSON:{virtuals:true}
});
userSchema.virtual("fullName").set(function (value) {
  const [firstName,lastName]=value?.trim().split(" ")||[];
  this.set({firstName,lastName});
}).get(function () {
    return `${this.firstName}  ${this.lastName}`;
});
export   const UserModel = mongoose.model("User", userSchema)

