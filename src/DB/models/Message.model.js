import mongoose from 'mongoose';
const messagesSchema = new mongoose.Schema({
    content: { type: String, required: true },
    receiverId:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
},{
    timestamps: true,
});

const Message = mongoose.model('Message', messagesSchema);
export default Message;
