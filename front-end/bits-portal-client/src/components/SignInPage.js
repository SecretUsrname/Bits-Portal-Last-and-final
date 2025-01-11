// src/components/SignInPage.js
import React, { useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useAdminAuth } from '../context/AdminAuthContext';

const SignInPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { loginAdmin, isAuthenticatedAdmin } = useAdminAuth();
  const { userId, uid } = useUser();

  // Check if the user is already authenticated and redirect accordingly
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to user dashboard");
      navigate('/'); // User dashboard
    } else if (isAuthenticatedAdmin) {
      console.log("Admin is authenticated, redirecting to admin dashboard");
      navigate('/home'); // Admin dashboard
    } else {
      console.log("User is not authenticated");
    }
  }, [isAuthenticated, isAuthenticatedAdmin, navigate]);

  const handleLoginSuccess = async (credentialResponse, role) => {
    try {
      const token = credentialResponse.credential;
      const userInfo = jwtDecode(token); // Decode JWT to get user info
      const userEmail = userInfo.email;
      const userImage = userInfo.picture;
      console.log("User Image:", userImage);
      localStorage.setItem("DP", userImage);

      // Call the role-based login endpoint
      const response = await axios.get(`http://localhost:3000/login/${role}/${userEmail}`);
      console.log("Login Response:", response);

      if (response.status === 200 && response.data.authorize === 'YES') {
        if (role === 'User') {
          login(); // Set user as authenticated
          const user = await axios.get(`http://localhost:3000/user/${userEmail}`);
          const id = user.data._id;
          uid(id); // Set the user ID in context
          navigate('/'); // Redirect to user dashboard
        } else if (role === 'Admin') {
          loginAdmin(); // Set admin as authenticated
          navigate('/home'); // Redirect to admin dashboard
        }
      } else {
        alert("Unauthorized Access");
      }
    } catch (error) {
      alert("Unauthorized Access");
      console.error("Error during login:", error);
    }
  };

  const handleLoginError = () => {
    console.log('Google Login Failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Welcome Back!</h2>

        {/* User Login */}
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-8">Login As User</h2>
        <GoogleOAuthProvider clientId="526314418933-ai3uvq89emkiod12khrhn040vittie77.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={(credentialResponse) => handleLoginSuccess(credentialResponse, 'User')}
            onError={handleLoginError}
            theme="filled_blue"
            size="large"
            className="w-full bg-blue-600 text-white py-4 rounded-xl shadow-md hover:bg-blue-700 focus:outline-none"
          />
        </GoogleOAuthProvider>

        {/* Admin Login */}
        <br />
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-8">Login As Admin</h2>
        <GoogleOAuthProvider clientId="526314418933-ai3uvq89emkiod12khrhn040vittie77.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={(credentialResponse) => handleLoginSuccess(credentialResponse, 'Admin')}
            onError={handleLoginError}
            theme="filled_blue"
            size="large"
            className="w-full bg-blue-600 text-white py-4 rounded-xl shadow-md hover:bg-blue-700 focus:outline-none"
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default SignInPage;
