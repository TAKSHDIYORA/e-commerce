import customerReviewModel from "../models/customerReviewModel.js";


const addReview = async (req,res) =>{
    try{
         const {email,name,review,productId,star}  = req.body;
         const newReview = new customerReviewModel({name,review,email,productId,star});
         await newReview.save();
         res.json({"success":true,"message":"review created successfully"});
    }catch(err){
         console.log(err);
         res.json({"success":false,"message":err.message});
         
    }
}

const getReviews = async(req,res) =>{
   try{
       const {productId} = req.body;
       const reviews = await customerReviewModel.find({productId});
       let sum=0;
       for(const review of reviews){
            sum+=review.star;
            // console.log(review);
            
       }
       const total = reviews.length;
       const average = sum/total;
    // const average = 0;
//    console.log(reviews);
   
       res.json({"success":true,"message":"review fetched successfully","data":reviews,"total":total,"average":average});     

   }catch(err){
          console.log(err);
          res.json({"success":false,"message":err.message});
          

   }

}


export {addReview,getReviews};