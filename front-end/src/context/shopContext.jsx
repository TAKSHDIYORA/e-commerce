import { createContext, useEffect, useState } from "react";
import { useAsyncError, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios"


export const ShopContext = createContext();

const ShopContextProvider = 
(props)=>{
    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems,setCartItems] = useState({});
    const [products,setProducts] = useState([]);
    const [token,setToken] = useState('');
    const [verEmail,setVerEmail] = useState(false);
    const navigate = useNavigate();

     useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);




     const addToCart = async (itemId,size) =>{
        if(!size){
            toast.error('select product size');
            return ;
        }
         let cartData = structuredClone(cartItems);
         if(cartData[itemId]){
              if(cartData[itemId][size]){
                cartData[itemId][size]+=1;
              }else{
                    cartData[itemId][size]=1;
              }
         }else{
                 cartData[itemId]={};
                 cartData[itemId][size]=1;
         }
         toast.success("Added Successfully");
         setCartItems(cartData);
     }
     const getCartCount = ()=>{
           let totalcount = 0;
           for(const items in cartItems){
               for(const item in cartItems[items]){
                 try{
                        if(cartItems[items][item]>0){
                            totalcount+=cartItems[items][item];
                        }
                 }catch(err){

                 }
               }
           }
           return totalcount
     };
 
     const updateQuantity = async (itemId,size,quantity)=>{
             let cartData = structuredClone(cartItems);
             cartData[itemId][size] = quantity;
             setCartItems(cartData);
     }
     
     const getCartAmount =  ()=>{
          let totalAmount =0 ;
          for(const items in cartItems){
             let itemInfo = products.find((product)=> product._id === items);
             for(const item in cartItems[items]){
                try{
                     if(cartItems[items][item]>0){
                          totalAmount+=itemInfo.price * cartItems[items][item];
                     }
                }catch(err){
                    
                }
             }
          }
          console.log(totalAmount);
          
          return totalAmount;
     }

const getProuctsData = async () =>{
      try{
      
           const response = await  axios.get(backendUrl + "/api/product/list")
         if(response.data.status){
           setProducts(response.data.products);
         }else{
            toast.error(response.data.message);
         }
      }catch(err){
              console.log(err);
              toast.error(err.message);
              
      }
}

useEffect(()=>{
  getProuctsData();

},[]);

useEffect(()=>{
   if(!token && localStorage.getItem('token')){
        setToken(localStorage.getItem('token'));
   }
})

const fetchCartFromDB = async (email) => {
    try {
            const token = localStorage.getItem('token');

      const res = await axios.post(backendUrl+`/api/cart/${encodeURIComponent(email)}`,{},{headers:{token:token,},});
      // console.log(res);
      if (res.data.status && res.data.cartData) {
        setCartItems(res.data.cartData);
        console.log(res.data.cartData);
        
        localStorage.setItem("cartItems", JSON.stringify(res.data.cartData));
      } else {
        setCartItems({});
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const saveCartToDB = async () => {
  try {
    const email = localStorage.getItem("email");
    if (!email) {
      console.log("🚫 No email found in localStorage — cannot save cart");
      return;
    }

    const payload = {
      email,
      cartdata: cartItems,
    };
    console.log("📦 Sending payload to backend:", payload);

    const res = await axios.post(backendUrl+`/api/cart/save`, payload, {
    headers: {
    token: token, // 👈 this line is important
  }
    });

    console.log("🔵 Response from backend:", res.data);

    if (res.data.success) {
      console.log("🛒 Cart saved to DB successfully!");
    } else {
      console.error("⚠️ Failed to save cart:", res.data.message);
    }
  } catch (err) {
    console.error("❌ Error saving cart to DB:", err);
  }
};



const logOut =  async() =>{
    // const email = localStorage.getItem("email");
   await saveCartToDB();
    
     localStorage.removeItem('token');
     localStorage.removeItem('cartItems');
      localStorage.removeItem('email');
     
          

     setToken('');
     setCartItems({});
    
 setTimeout(() => navigate('/login'), 0);
  }




    const value = {
        products,currency,delivery_fee,
        search,setSearch,showSearch,setShowSearch,
        cartItems,setCartItems,addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        setToken,token,
        fetchCartFromDB,
        saveCartToDB,
        verEmail,setVerEmail,logOut
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>

    )
}
 
export default ShopContextProvider;