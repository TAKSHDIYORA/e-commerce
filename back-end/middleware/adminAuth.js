import jwt from "jsonwebtoken"

const adminAuth = async (req,res,next) =>{
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

export default adminAuth;