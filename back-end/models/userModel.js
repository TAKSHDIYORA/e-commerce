import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
   cartData:{
      type: Object,
      default: {}
  },
 
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  profilePic: {
    type: String, // image URL or file path
    default: ""
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  cartData : {
    type : Object,
    default : {}
  }
},{minimize:false});


const userModel = mongoose.models.user|| mongoose.model('user',userSchema)

export default userModel;