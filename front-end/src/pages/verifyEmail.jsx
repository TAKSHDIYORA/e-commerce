import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { ShopContext } from "../context/shopContext";
import { toast } from "react-toastify";
// import { logOut } from "../context/shopContext";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const {backendUrl,logOut, fetchCartFromDB,token,setToken,navigate,userId} = useContext(ShopContext);
  const email = localStorage.getItem('email');

  const handleVerify = async () => {
    if (!otp) return setMessage("Please enter OTP.");
    setStatus("loading");
    setMessage("");

    try {
      const response = await axios.post(backendUrl+"/api/user/verify-otp", {
        email,
        otp,
      });

      if (response.data.success) {
        const tmptoken = localStorage.getItem('tempToken');
        setToken(tmptoken);
        localStorage.removeItem('tempToken');
          localStorage.setItem('token',token);
          localStorage.setItem('userId',userId);
                 
                await fetchCartFromDB(email);

        setStatus("success");
        setMessage("Email verified successfully! Redirecting...");
        console.log(message);
        
        navigate("/")
      } else {
        setStatus("error");
        toast.error(response.data.message);
        setMessage(response.data.message || "Invalid OTP.");
        const response2 =await axios.post(backendUrl+"/api/user/delete",{
            email,
        })
        logOut();
      }
    } catch (err) {
        console.log(err);
        
      setStatus("error");
      setMessage("Verification failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
        <p className="text-gray-500 mb-6">
          We’ve sent a 6-digit OTP to <span className="font-medium">{email}</span>.
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-200"
          maxLength={6}
        />

        <button
          onClick={handleVerify}
          disabled={status === "loading"}
          className={`mt-6 w-full py-3 rounded-lg font-semibold text-white transition-all ${
            status === "loading"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-pink-500 hover:bg-pink-600"
          }`}
        >
          {status === "loading" ? "Verifying..." : "Verify Email"}
        </button>

        {message && (
          <p
            className={`mt-4 text-sm ${
              status === "success"
                ? "text-green-600"
                : status === "error"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
