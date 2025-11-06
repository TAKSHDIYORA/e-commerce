import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"
import fs  from "fs";
import PDFDocument from "pdfkit";
import Notification from "../models/notificationModel.js";
import path from "path";

//global vars
const currency = 'inr'
const deliveryCharges = 10
const symbolCurr = '₹';

//gateway initializer
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const backendUrl = process.env.VITE_BACKEND_URL;



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
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        status: false,
        message: "Order ID and new status are required",
      });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    // If delivered or cancelled → Generate PDF + Notification
    if (status === "Delivered" || status === "Cancelled") {
      // ✅ Create invoices directory
      const invoiceDir = path.resolve("./invoices");
      if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);
// ✅ Generate PDF invoice (clean layout)
const filename = `invoice_${orderId}.pdf`;
const filePath = path.join(invoiceDir, filename);

const doc = new PDFDocument({ margin: 50 });
const writeStream = fs.createWriteStream(filePath);
doc.pipe(writeStream);

// ===== Header =====
doc
  .fontSize(24)
  .font("Helvetica-Bold")
  .text("INVOICE", { align: "center" })
  .moveDown(1.5);

// ===== Order Details =====
doc
  .fontSize(12)
  .font("Helvetica")
  .text(`Order ID: ${orderId}`)
  .text(`Date: ${new Date().toLocaleString()}`)
  .text(`Status: ${status}`)
  .moveDown(1);

// ===== Customer Details =====
doc
  .font("Helvetica-Bold")
  .text("Customer Information:", { underline: true })
  .moveDown(0.5)
  .font("Helvetica")
  .text(`Customer Email: ${order.email || "N/A"}`)
  .moveDown(1);

// ===== Items List =====
doc.font("Helvetica-Bold").text("Items:", { underline: true }).moveDown(0.5);
doc.font("Helvetica");

order.items.forEach((item, index) => {
  doc.text(
    `${index + 1}. ${item.name} (${item.size || "-"}) × ${item.quantity} — ${"$"+item.price}`,
    { indent: 20 }
  );
});

// ===== Total =====
doc.moveDown(1);
doc
  .font("Helvetica-Bold")
  .text(`Total Amount: ${"$"+order.amount}`, { align: "right" })
  .moveDown(2);

// ===== Footer =====
doc
  .fontSize(10)
  .font("Helvetica-Oblique")
  .text("Thank you for shopping with FOREVER!", { align: "center" });

// End PDF
doc.end();

// Wait for file write completion
await new Promise((resolve) => writeStream.on("finish", resolve));

      // ✅ Create Notification
      const message =
        status === "Delivered"
          ? `🎉 Your order #${orderId} has been delivered successfully.`
          : `⚠️ Your order #${orderId} has been cancelled.`;

      await Notification.create({
        email: order.email,
        orderId,
        message,
        type: status === "Delivered" ? "success" : "error",
        invoicePdf: `${backendUrl}/invoices/${filename}`,
      });

      // ✅ Delete order if cancelled
    
        await orderModel.findByIdAndDelete(orderId);
        // res.json({
        //   status: true,
        //   message: "Order cancelled and deleted successfully.",
        // });
      

      // ✅ Update to Delivered
      order.status = status;
      await order.save();

      return res.json({
        status: true,
        message: "Order delivered and invoice generated successfully.",
        invoice: `/invoices/${filename}`,
      });
    }

    // ✅ Other status updates
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.json({
      status: true,
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({
      status: false,
      message: err.message || "Internal Server Error",
    });
  }
};



export {verifyStripe,placeOrder,placeOrderStripe,placeOrderRazorPay,AllOrders,UserOrders,updateStatus}
