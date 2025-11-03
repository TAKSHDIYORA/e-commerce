import jwt from "jsonwebtoken"

export const adminAuth = async (req,res,next) =>{
    try{
        // console.log(req.headers);
        
           const {token} = req.headers
           if(!token){
            return res.json({"status":false,"message":"Not Authorized Login Again"})
           }
           const token_decode = jwt.verify(token,process.env.JWT_SECRET);
           if(token_decode!== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
                 
            return res.json({"status":false,"message":"Not Authorized Login Again"})
           
           }
           next();
        }catch(err){
             console.log(err);
             res.json({"status":false,"message":err.message})
             
    }
}

// export default adminAuth;

export const IpAuth = async (req,res,next) =>{
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

