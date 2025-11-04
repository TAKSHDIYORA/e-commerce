import React, { useContext } from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/home'
import Collection from './pages/collection'
import About from './pages/about'
import Cart from './pages/cart'
import Contact from './pages/contact'
import Login from './pages/login'
import Orders from './pages/Orders'
import PlaceOrders from './pages/PlaceOrder'
import Product from './pages/product'
import Navbar from './components/navbar'
import Footer from './components/Footer'
import SearchBar from './components/searchBar'
import { ToastContainer , toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './pages/profile'
import Verify from './pages/verify'
import VerifyEmail from './pages/verifyEmail'
import { ShopContext } from './context/shopContext'
const App = () => {
  const {token} = useContext(ShopContext);
  if(token){
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer/>
      <Navbar />
      <SearchBar />
      <Routes>
         <Route path='/' element={<Home/>} />
         <Route path='/collection' element={<Collection/>}/>
         <Route path='/about' element={<About/>}/> 
         <Route path='/contact' element={<Contact/>}/>
         <Route path='/product/:productId' element={<Product/>}/>
         <Route path='/cart' element={<Cart/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/placeOrder' element={<PlaceOrders/>}/>
         <Route path='/orders' element={<Orders/>}/>  
         <Route path='/profile' element={<Profile/>} />
         <Route path='/verify' element={<Verify/>}/>
         <Route path='/verify-email' element={<VerifyEmail/>}/>
      </Routes>
    <Footer/>

    </div>
  )
}else{

  return (
 <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer/>
     <Login />

    </div>
  )

}
}

export default App;
