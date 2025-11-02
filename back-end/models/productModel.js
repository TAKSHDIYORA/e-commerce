import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
 
  
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: [String], // array of image URLs or file paths
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  sizes: {
    type: [String], // array like ["S", "M", "L"]
    default: []
  },
  date: {
    type: Number, // can also use: type: Date, default: Date.now
    default: Date.now
  },
  bestseller: {
    type: Boolean,
    default: false
  }
});

const productModel = mongoose.models.product || mongoose.model("product",productSchema)

export default productModel;