import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/shopContext'
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
const verify = () => {
  const {navigate,token,setCartItems,backendUrl} = useContext(ShopContext);
  const [searchParams,setSearchparams] = useSearchParams();

  const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

   const verifyPayment = async() =>{ 
         
    try{
         if(!token){

            return null;
         }

         const response = await axios.post(backendUrl+'/api/order/verifyStripe',{success,orderId},{headers: {token}});
           if(response.data.success){
         setCartItems({});
         navigate('/orders');

           }else{
                    navigate('/cart');

           }
         console.log(response);
         
    }catch(err){

       console.log(err);
       toast.error(err.message);
       

    }
         

  }

 useEffect(()=>{
      verifyPayment();
 },[token]);

     return (
    <div>
        

    </div>
  )
}

export default verify