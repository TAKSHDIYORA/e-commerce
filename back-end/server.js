import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB  from './config/db.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/user.Routes.js'
import productRouter from './routes/product.Routes.js'
import cartRouter from './routes/cart.Routes.js'
import orderRouter from './routes/order.Routes.js'
import customerReviewRouter from './routes/customerReview.Routes.js'

// App Config

const app = express()
const PORT = process.env.PORT || 4000;
connectCloudinary();
//middlewares
app.set("trust proxy",true);
app.use(express.json());
app.use(
  cors({})
);
// api endpoints 
await connectDB();
app.use('/api/user',userRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter);
app.use('/api/customerReview',customerReviewRouter);
app.get('/',(req,res)=>{
     res.send("API WORKING")
});

app.listen(PORT,()=>{
    console.log("server is running on PORT :" + PORT);
    
});
