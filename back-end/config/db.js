import mongoose from "mongoose";
mongoose.connect("mongodb+srv://24ceuos030_db_user:RN78hYSRUvwPVDlE@e-commerce.oabfxlc.mongodb.net/test?retryWrites=true&w=majority&appName=e-commerce").then(()=>{
    console.log("connected to database");
    
}).catch((err)=>{console.log(err);}
);
export default mongoose;