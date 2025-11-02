import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/admin_assets/assets'
 
const sidebar = () => {

    const [property,setProperty] = useState('add');
    

  return (
    <div className='w-[18%] min-h-screen border-r-2'>

    <div className='flex flex-col gap-4 pt-6 pl=[20%] text-[15px] after:'>
       <NavLink onClick={()=>setProperty('add')}  className={`flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${property === 'add' ? 'bg-pink-200' : ''}`} to="/add">
              <img className='w-5 h-5' src={assets.add_icon} alt="" />
              <p className='hidden md:block'>Add Items</p>
       </NavLink>
        <NavLink onClick={()=>setProperty('list')}  className={`flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${property === 'list' ? 'bg-pink-200' : ''}`} to="/list">
              <img className='w-5 h-5' src={assets.order_icon} alt="" />
              <p className='hidden md:block'>List Items</p>
       </NavLink>
        <NavLink onClick={()=>setProperty('orders')}   className={`flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${property === 'orders' ? 'bg-pink-200' : ''}`} to="/orders">
              <img className='w-5 h-5' src={assets.order_icon} alt="" />
              <p className='hidden md:block'>Orders</p>
       </NavLink>
    </div>

    </div>
  )
}

export default sidebar