import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId,required: true},
    status: {type: String, enum: ['waiting','open','closed'],default:'waiting'},
     active: { type: Boolean, default: true },
     isClosed: { type: Boolean, default: false }

},{timestamps:true});

export default mongoose.model('ChatSession',chatSessionSchema);