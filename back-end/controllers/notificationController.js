// import Notification from "../models/orderModel"
import Notification from "../models/notificationModel.js";
const getnotification = async(req,res)=>{
 try{
 const {email} = req.body;
  const notifications = await  Notification.find({email});
  res.json({"success":true,"message": "notifications fetched successfully",notifications});
 }catch(err){
       console.log(err);
       res.json({"success":false,"message":err.message});
       
 }
}

const deleteNotification = async(req,res)=>{
      try{
        const {id} = req.body;
        const data = await Notification.findByIdAndDelete(id);
         res.json({"success":true,"message":"notification deleted successfully"});
      }catch(err){
             console.log(err);
             
            res.json({"success":false,"message":err.message});

      }
}

export {getnotification,deleteNotification};