import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js';

// add product 

const addProduct = async (req,res) =>{
    try{
        // console.log(req.body);
        
       const {name,description,price,category,subCategory,sizes,bestseller} = req.body;
       
         const image1 =req.files.image1 && req.files.image1[0];
         const image2 = req.files.image2 && req.files.image2[0];
         const image3 = req.files.image3 && req.files.image3[0];
         const image4 = req.files.image4&& req.files.image4[0];
         
         const images = [image1,image2,image3,image4].filter((item)=> item!==undefined);

        let imagesUrl = await Promise.all(
            images.map(async(item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url;
            })
        )

       const productData = {
           name,
           description,
           category,
           price: Number(price),
           subCategory,
           bestseller: bestseller === "true" ? true : false,
           sizes: JSON.parse(sizes),
           image: imagesUrl,
           date: Date.now()
           
       }
       console.log(productData);

       const product = new productModel(productData);
       await product.save();
       const response = {
        "message" : "data added successfully",
        "data" : productData
       }
       
       
         
         res.json({"status":true,response})

    }catch(err){
        console.log(err);
        
            res.json({"status" : false,"message":err.message})
    }
}

//list product 

const listProducts = async (req,res) =>{
    //   console.log(req);
      
      try{
            
            const products = await productModel.find({});
            
           res.json({status:true,products});
      }catch(err){
          res.json({"status": false,"message":err.message})
      }

}

//remove product

const removeProduct = async (req,res) =>{
         try{
            const obj ={
                "name" : req.body.name
            }
          
            const products = await productModel.findOneAndDelete(obj);
              const response ={
                "message" : "data removed successfully",
                "data": products
            }
           res.json({status:true,response});
      }catch(err){
          res.json({"status": false,"message":err.message})
      }
}

// single product info

const singleProduct = async (req,res) =>{
      
      try{
            const obj ={
                "name" : req.body.name
            }
            const products = await productModel.findOne(obj);
           res.json({status:true,products});
      }catch(err){
          res.json({"status": false,"message":err.message})
      }

}

export {addProduct,listProducts,removeProduct,singleProduct}