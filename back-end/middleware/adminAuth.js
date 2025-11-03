import jwt from "jsonwebtoken"

const adminAuth = async (req,res,next) =>{
    try{
        // console.log(req.headers);
        const allowedIPs = process.env.WHITELIST.split(',');
        console.log(allowedIPs);
        
   const clientIP = req.ip.replace("::ffff:", "");  // remove IPv6 prefix
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