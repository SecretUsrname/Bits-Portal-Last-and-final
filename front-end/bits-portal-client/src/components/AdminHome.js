// src/components/HomePage.js
import { useAdminAuth } from '../context/AdminAuthContext';
import React from 'react';
import { useNavigate } from 'react-router-dom';


const AdminHome = () => {
    const { Adminlogout } = useAdminAuth();
    const navigate = useNavigate();
    const handlelogout = () => {
      Adminlogout();
    }

    const navpapers = () => {
        navigate('/papers');
    }

    const navcreateAndviewUser = () => {
        navigate('/users');
    }

    const navadmins = () => {
      navigate('/admins');
    }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">Welcome Admin</h1>
        
        <div className="space-y-4">
          <button
            className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none"
            type="button"
            onClick={() => navpapers()}
          >
            View All Papers
          </button>

          <button
            className="w-full py-2 px-4 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 focus:outline-none"
            type="button"
            onClick={() => navcreateAndviewUser()}
          >
            View or create Users
          </button>

          <button
            className="w-full py-2 px-4 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none"
            type="button"
            onClick={() => navadmins()}
          >
            View or Create Admins
          </button>

          <button
            className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none"
            type="button"
            onClick={() => handlelogout()}
          >
            Logout
          </button> 
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
