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
export {fetchUser,saveCart};