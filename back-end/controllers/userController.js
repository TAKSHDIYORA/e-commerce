
import validator from "validator";
import bcrypt from "bcrypt"
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import { use } from "react";
import { transporter } from "../config/nodemailer.js";

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

let otpStore = {};






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
            return res.status(500).json({"success":false,"message":"user is already exist"});
         }
          console.log(exists);
          
        //validating email and strong password
              if(!validator.isEmail(email)){
                 return res.status(500).json({"success":false,"message":"email is not valid"});
              }


//send mail 
 const otp = Math.floor(100000 + Math.random() * 900000).toString();
          otpStore[email] = {otp,expires:Date.now()+5*60*1000};
       


//send mail
await transporter.sendMail({
   from: `"e-commerce"<${process.env.EMAIL_NAME}>`,
          to: email,
          subject:"you just make account on forever",
          html:`
          <h3>Hi ${name},</h3>
        <p>Your verification OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in 5 minutes.</p>
          `,
        })





               if(password.length<8){
                 return res.status(500).json({"success":false,"message":"please enter a strong password"});
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


 



      res.json({"success" : true,token})
      
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

const verifyOtp = async (req,res)=>{
   try{
      const {email,otp} = req.body;
      const record = otpStore[email];

      if(!record) return res.json({"success":false,"message":"otp not found"});

      if(record.otp !== otp || record.expires < Date.now()){
         return res.json({"success":false,"message":"invalid or expire otp"})
      }

      delete otpStore[email];
      res.json({"success":true,"message":"email verified"});
   }catch(err){
      console.log(err);
      res.json({"success":false,"message":err.message});      
   }
}

 const deleteUser = async (req,res) =>{
   try{

      const {email} = req.body;
      await userModel.findOneAndDelete({email});
      res.json({"success":true,"message":"user deleted successfully"});

   }catch(err){
      console.log(err);
      rs.json({"success":false,"message":err.message});
      
   }
}

export {loginUser,registerUser,adminLogin,otpStore,verifyOtp,deleteUser};