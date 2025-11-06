import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/shopContext'
import axios from 'axios'

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const email = localStorage.getItem('email');

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, saveCartToDB, logOut, status, setStatus, backendUrl } = useContext(ShopContext);

  useEffect(() => {
    if (token) {
      setStatus("log-Out");
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/notification/get`, { email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (error) {
      console.log("Error fetching notifications:", error.message);
    }
  };

  // Download file helper
  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url;
    link.click();
  };

  // ✅ Remove notification handler
  const handleRemoveNotification = async (id) => {
    try {
      const res = await axios.post(`${backendUrl}/api/notification/delete`,{id}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // Remove notification from local state
        setNotifications(notifications.filter(n => n._id !== id));
      }
    } catch (error) {
      console.log("Error removing notification:", error.message);
    }
  };

  return (
    <div className='flex items-center justify-between py-5 font-medium relative'>
      <Link to='/'>
        <img src={assets.logo} className="w-36" alt="" />
      </Link>

      {/* ---------- Center Nav Links ---------- */}
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className="flex flex-col items-center gap-1"><p>Home</p></NavLink>
        <NavLink to='/collection' className="flex flex-col items-center gap-1"><p>Collection</p></NavLink>
        <NavLink to='/about' className="flex flex-col items-center gap-1"><p>About</p></NavLink>
        <NavLink to='/contact' className="flex flex-col items-center gap-1"><p>Contact</p></NavLink>
      </ul>

      {/* ---------- Right Section ---------- */}
      <div className='flex items-center gap-6'>
        {/* Search */}
        <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' />

        {/* Notification */}
        <div className='relative'>
          <img
            onClick={() => setShowNotifications(!showNotifications)}
            src={assets.bell_icon}
            className='w-5 cursor-pointer'
            alt='Notifications'
          />
          {notifications.length > 0 && (
            <span className='absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center'>
              {notifications.length}
            </span>
          )}

          {showNotifications && (
            <div className='absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-md border z-20'>
              <div className='p-3 text-sm text-gray-700 font-semibold border-b'>Notifications</div>
              <div className='max-h-72 overflow-y-auto'>
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n._id} className='p-3 border-b hover:bg-gray-50 flex flex-col gap-1'>
                      <p className='text-gray-700 text-sm'>{n.message}</p>
                      {n.invoicePdf && (
                        <div className='flex justify-between items-center mt-1 text-xs'>
                          <a
                            href={n.invoicePdf}
                            target='_blank'
                            rel='noreferrer'
                            className='text-blue-600 underline'
                          >
                            View Invoice
                          </a>
                          <button
                            onClick={() => handleDownload(n.invoicePdf)}
                            className='bg-black text-white px-2 py-[2px] rounded hover:bg-gray-800'
                          >
                            Download
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveNotification(n._id)}
                        className='self-end text-red-500 text-xs hover:underline'
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className='p-3 text-gray-500 text-sm'>No notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className='group relative'>
          <img className='w-5 cursor-pointer' src={assets.profile_icon} alt='' />
          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
              <Link to='/profile'><p className='cursor-pointer hover:text-black'>My Profile</p></Link>
              <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
              <Link to='/login'>
                <p onClick={async (e) => { e.preventDefault(); await logOut(); }} className='cursor-pointer hover:text-black'>{status}</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Cart */}
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
        </Link>

        {/* Mobile Menu */}
        <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
      </div>

      {/* ---------- Sidebar for Mobile ---------- */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'} `}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-180 ' src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/">Home</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/collection">Collection</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/about">About</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/contact">Contact</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Navbar
