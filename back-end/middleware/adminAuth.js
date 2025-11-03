import jwt from "jsonwebtoken"

const adminAuth = async (req,res,next) =>{
    try{
        // console.log(req.headers);
        const forwarded = req.headers["x-forwarded-for"];
        const allowedIPs = process.env.WHITELIST.split(',');
        console.log(allowedIPs);
        let clientIP = "";
  if (typeof forwarded === "string") {
    clientIP = forwarded.split(",")[0].trim(); // real IP
  } else {
    clientIP = req.socket.remoteAddress || "";
  } // remove IPv6 prefix
  console.log(clientIP);
  console.log(req.socket.remoteAddress);
  
  
  if (!allowedIPs.includes(clientIP)) {
    res.json({ status:false,message: "Access denied" });
    return ;
  } else {
   
     console.log("ip is valid");
    
  }

        
         
           next();
        }catch(err){
             console.log(err);
             res.json({"status":false,"message":err.message})
             
    }
}

export default adminAuth;