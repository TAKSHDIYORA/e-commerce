import jwt from 'jsonwebtoken'

const authUser = async (req,res,next) =>{


    try{
        console.log("headers",req.headers);
        
        let token = req.headers.token || req.headers.authorization;
   if(!token){
       return res.json({status:false,message:"Not Authorized Login Again"})
    
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
 const token_decode = jwt.verify(token,process.env.JWT_SECRET);
 req.body.userId = token_decode.id;
 next();
    }catch(err){
res.json({"status":false,"message":err.message});
    }

}
export default authUser;