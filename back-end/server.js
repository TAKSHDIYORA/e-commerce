import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose  from './config/db.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/user.Routes.js'
import productRouter from './routes/product.Routes.js'
import cartRouter from './routes/cart.Routes.js'
import orderRouter from './routes/order.Routes.js'

// App Config

const app = express()
const PORT = process.env.PORT || 4000;
connectCloudinary();
//middlewares
app.use(express.json());
app.use(
  cors({})
);
// api endpoints 
app.use('/api/user',userRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter);
app.get('/',(req,res)=>{
     res.send("API WORKING")
});

app.listen(PORT,()=>{
    console.log("server is running on PORT :" + PORT);
    
});
