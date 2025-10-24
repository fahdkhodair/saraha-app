import  mongoose from "mongoose";
const emailSchema = new mongoose.Schema({
    to: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
})

const EmailModel = mongoose.model("Email", emailSchema);
export default EmailModel;