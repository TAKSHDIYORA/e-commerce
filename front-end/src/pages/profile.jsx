import React from "react";

const Profile = () => {
  // Get user data from localStorage (set after login)
  const userData = localStorage.getItem("email");
  

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm text-center">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>
        <div className="text-gray-700">
          <p className="text-lg">
            <span className="font-medium">Name:</span> {userData|| "Guest"}
          </p>
        
        </div>

        {/* <button
          onClick={() => {
            localStorage.removeItem("email");
            localStorage.removeItem("token");
            localStorage.removeItem("cartItems")
            window.location.href = "/login";
          }}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button> */}
      </div>
    </div>
  );
};

export default Profile;
