import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    sessionId : {type: mongoose.Schema.Types.ObjectId,ref:'ChatSession'},
    sender: {type: String,enum: ['user','admin'],required:true},
    message: {type:String,required:true}
},{timestamps:true});

export default mongoose.model('ChatMessage',chatMessageSchema);