// import cartModel from "../models/cartModel.js";
// import productCartModel from "../models/productCartModel.js";
import Cart from "../models/cartModel.js";
import ProductCart from "../models/productCartModel.js";
import CartItem from "../models/cartItemModel.js";
import Product from "../models/productModel.js"; 


import userModel from "../models/userModel.js";
const  fetchUser = async (req,res) =>{
  try{ 
      const email = req.params.email;
       const user = await userModel.findOne({"email":email});
      res.json({"status" : true,cartData : user.cartData});
  }catch(err){
     res.json({"status":false,"message":err.message});
     
  }
};

const saveCart = async (req, res) => {
  try {
    const { email, cartdata } = req.body;
    // console.log("🟡 Incoming body:", req.body); // debug

    if (!email || !cartdata) {
      return res.status(400).json({
        success: false,
        message: "Email and cart data are required",
      });
    }
console.log("📩 Request received at /api/cart/save");
    // Step 1: Find user
    const user = await userModel.findOne({ email: email });
    console.log("🟢 Found user:", user ? user.email : "No user found");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 2: Make a new object
    const updatedCart = {
       // old
      ...cartdata,      // new
    };

    // Step 3: Save
    user.cartData = updatedCart;
    await user.save();

    console.log("✅ Saved user:", user);

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: user.cartData,
    });

  } catch (err) {
    console.error("❌ Error saving cart:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};









const addToCart = async (req, res) => {
  try {
    const { userId, products } = req.body;

    // 1️⃣ Check if cart exists for this user
    let findCart = await Cart.findOne({ userId });

    // If no cart exists, create a new one
    if (!findCart) {
      findCart = await Cart.create({ userId });
    }

    // 2️⃣ Loop through all products being added
    for (const product of products) {
      const { productId, items } = product; // items = [{ size, quantity }]

      // 3️⃣ Check if product already exists in user's cart
      let cartProduct = await ProductCart.findOne({
        cartId: findCart._id,
        productId,
      });

      // If product not in cart, create a new ProductCart record
      if (!cartProduct) {
        cartProduct = await ProductCart.create({
          cartId: findCart._id,
          productId,
        });
      }

      // 4️⃣ For each size in items array
      for (const item of items) {
        const { size, quantity } = item;

        // Check if this size already exists for that product in the cart
        let cartItem = await CartItem.findOne({
          cartProductId: cartProduct._id,
          size,
        });

        if (cartItem) {
          // If size exists → increase quantity
          cartItem.quantity += quantity;
          await cartItem.save();
        } else {
          // Else → create new size entry
          await CartItem.create({
            cartProductId: cartProduct._id,
            size,
            quantity,
          });
        }
      }
    }

    // ✅ Response
    res.status(200).json({
      success: true,
      message: "Items added to cart successfully",
    });

  } catch (err) {
    console.error("❌ Add to Cart Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const getUserCart = async (req, res) => {
  try {
    const { userId, page = 1, limit = 5 } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // 1️⃣ Find the user’s main cart
    const userCart = await Cart.findOne({ userId });
    if (!userCart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found for this user",
      });
    }

    // 2️⃣ Fetch all products for that cart with pagination
    const totalProducts = await ProductCart.countDocuments({
      cartId: userCart._id,
    });

    const skip = (page - 1) * limit;

    const productCarts = await ProductCart.find({ cartId: userCart._id })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "productId",
        model: "product",
        select: "name price image description", // Adjust fields as needed
      })
      .lean();

    // 3️⃣ For each productCart, fetch its sizes and quantities
    const cartData = [];
    for (const prod of productCarts) {
      const items = await CartItem.find({
        cartProductId: prod._id,
      }).select("size quantity -_id");
  for(const item of items){
      cartData.push({
        productId: prod.productId._id,
        name: prod.productId.name,
        price: prod.productId.price,
        image: prod.productId.image,
        description: prod.productId.description,
        item, // [{ size, quantity }]
      });
    }
  }

    // 4️⃣ Return structured and paginated response
    res.status(200).json({
      success: true,
      message: "User cart fetched successfully",
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      data: cartData,
    });
  } catch (err) {
    console.error("❌ Error fetching user cart:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};











export {fetchUser,saveCart,addToCart,getUserCart};