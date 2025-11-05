import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/shopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';

const Login = () => {

  const [currentState, setCurrentState] = useState('Sign Up');
  const { token, setToken, navigate, backendUrl, fetchCartFromDB } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading when user clicks submit

    try {
      if (currentState === 'Sign Up') {
        // API call for registration
        const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });

        if (response.data.success) {
          localStorage.setItem('email', email);
          // setToken(response.data.token);
          localStorage.setItem('tempToken',response.data.token);

          // Show loader for 2 seconds before redirecting
          setTimeout(() => {
            navigate('/verify-email');
          }, 2000);
        } else {
          toast.error(response.data.message);
          setLoading(false);
        }
      } else {
        // API call for login
        const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });

        if (response.data.status) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('email', email);
          await fetchCartFromDB(email);
          navigate('/');
        } else {
          toast.error(response.data.message);
          setLoading(false);
        }
      }

    } catch (err) {
      console.log(err);
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div>

      {loading ? (
        // 🔄 Loader Section
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="w-16 h-16 border-4 border-t-transparent border-black rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700 text-lg font-medium">Redirecting, please wait...</p>
        </div>
      ) : (
        // 🧾 Normal form
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
          <div className='inline-flex items-center gap-2 mb-2 mt-10'>
            <p className='prata-regular text-3xl'>{currentState}</p>
            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
          </div>

          {currentState === 'Login'
            ? ''
            : <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}

          <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
          <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />

          <div className='w-full flex justify-between text-sm mt-[-8px]'>
            <p className='cursor-pointer'>Forgot Your Password?</p>
            {currentState === 'Login'
              ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create Account</p>
              : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>}
          </div>

          <button
            type='submit'
            className='bg-black text-white font-light px-8 py-2 mt-4 hover:bg-gray-800 transition-all'
          >
            {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
      )}

    
    </div>
  );
}

export default Login;
