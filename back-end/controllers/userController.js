
import validator from "validator";
import bcrypt from "bcrypt"
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import { use } from "react";

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}








const loginUser = async(req,res)=>{
   try{


          
        const {email,password} = req.body;
        
        const user = await userModel.findOne({email});
         const username = user.name;
        if(!user){
               return res.status(500).json({"status":false,"message":"user not found with this email"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
     if(isMatch){
              const token = createToken(user._id);
              res.json({"status" : true,username,token});
     }else{ 

           res.json({"status":false,"message":"password is incorrect"})

     }

   }catch(err){
       console.log(err);
       res.status(500).json({"status":false,"message":err.message})
       

   }
   
 

}

// Route for user registration

const registerUser = async(req,res) =>{
     try{
         //  console.log(req.body);
          
         const {name , email ,password} = req.body;

         const exists = await userModel.findOne({email});
         if(exists){
            return res.status(500).json({"status":false,"message":"user is already exist"});
         }
          
        //validating email and strong password
              if(!validator.isEmail(email)){
                 return res.status(500).json({"status":false,"message":"imail is not valid"});
              }
               if(password.length<8){
                 return res.status(500).json({"status":false,"message":"please enter a strong password"});
              }
        // hashing user password
        const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(password,salt);

       const newUser = new userModel({
         name,
         email,
         password:hashedPassword
       })
      const user = await newUser.save();

      const token = createToken(user._id);
      res.json({"status" : true,token})
      
     }catch(err){
       console.log(err);
       res.status(500).json({"status":false,"message":err.message})
       
     }
}

//Route for admin login

const adminLogin = async (req,res) =>{
  try{
   
          const {email,password} = req.body;
          if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
               const token = jwt.sign(email+password,process.env.JWT_SECRET);
               res.json({"status":true,token})
          }else{
             res.json({"status":false,"message":"invalid credential"})
          }
  }catch{
             console.log(err);
       res.status(500).json({"status":false,"message":err.message})
  }
}

export {loginUser,registerUser,adminLogin}