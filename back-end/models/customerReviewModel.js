import mongoose from "mongoose";

const customerReviewSchema = new mongoose.Schema({
 name:{
     type: String,
     required:true
 },
 review:{
    type:String,
    required: true
 },
 email:{
    type: String,
    required: true
 },
 productId:{
    type: String,
    required : true
 },
 star:{
    type:Number,
    
 }

});

const customerReviewModel = mongoose.models.customerReview || mongoose.model("customerReview",customerReviewSchema)

export default customerReviewModel;