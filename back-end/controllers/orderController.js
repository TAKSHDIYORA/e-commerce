import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"

//global vars
const currency = 'inr'
const deliveryCharges = 10

//gateway initializer
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



//Placing orders using COD method

const placeOrder = async(req,res) =>{
  try{
    console.log("👉 Incoming Order Request");
    console.log("Headers:", req.headers);
    console.log("Body before auth:", req.body);

   
     const {email,items,amount,address} = req.body;
     
     const orderData = {
        email,
        items,
        address,
        amount,
        paymentMethod : "cod",
        payment:false,
        date: Date.now()
     }
  
      const newOrder = new orderModel(orderData);
     await newOrder.save();

     await userModel.findOneAndUpdate({email:email},{cartData:{}});//reset the cart data

     res.json({status:true,message:"Pending"});

  }catch(err){

     console.log(err);
     res.json({status:false,message:err.message})
     

  }
   

}

//Place Orders using Stripe
const placeOrderStripe = async(req,res) =>{
  try{
          
      const {email,items,amount,address} = req.body;
      const { origin } = req.headers;

         const orderData = {
        email,
        items,
        address,
        amount,
        paymentMethod : "stripe",
        payment:false,
        date: Date.now()
     }

        const newOrder = new orderModel(orderData);
     await newOrder.save();

     const line_items = items.map((item)=>({
       price_data: {
       currency:currency,
       product_data: {
         name:item.name,

       },
       unit_amount: item.price * 100
      },
      quantity: item.quantity
     }));

     line_items.push({
          price_data: {
       currency:currency,
       product_data: {
         name: 'Delivery Charges',

       },
       unit_amount: deliveryCharges * 100
      },
      quantity: 1
   
   })

   const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
   })

   res.json({success:true,session_url:session.url});


  }catch(err){
  
     console.log(err);
     res.json({success:false,message:err.message});

   

  }

    
}

//Verify Stripe
const verifyStripe = async (req,res) =>{
 
   const {orderId,success,userId} = req.body;

   try{
          if(success === "true"){
                   await orderModel.findByIdAndUpdate(orderId,{payment:true});
                   await userModel.findByIdAndUpdate(userId,{cartData:{}})
                   res.json({"success" : true});
               }else{
          await orderModel.findByIdAndDelete(orderId);
          res.json({success:false});
               }
   }catch(err){

         console.log(err);
     res.json({success:false,message:err.message});


   }

}


//Place Orders using razorpay

const placeOrderRazorPay = async(req,res) =>{


}


// All Orders Data For Admin Panel

const AllOrders = async(req,res) =>{
  
   try{
      const orders = await orderModel.find({});
      // console.log(orders);
      res.json({"status":true,orders});
      
   }catch(err){

        console.log(err);
        res.json({"status":false,"message":err.message});        

   }

}

//User Order Data For Frontend
const UserOrders = async(req,res) =>{
   
   try{
  const {email} = req.body;
  const order = await orderModel.find({"email":email});
  console.log(order);
 
  res.json({"status":true,order})
   
       
   }catch(err){
      console.log(err);
      res.json({"status":false,"message":err.message});
      

   }

    
}

//update order status from admin panel
const updateStatus = async(req,res) =>{
   try {
    const { orderId, status } = req.body; // frontend sends { orderId, status }

    if (!orderId || !status) {
      return res.status(400).json({
        status: false,
        message: "Order ID and new status are required",
      });
    }

    // ✅ Update the order’s status
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // returns the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    res.json({
      status: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({
      status: false,
      message: err.message || "Internal Server Error",
    });
  }
    
}




export {verifyStripe,placeOrder,placeOrderStripe,placeOrderRazorPay,AllOrders,UserOrders,updateStatus}
