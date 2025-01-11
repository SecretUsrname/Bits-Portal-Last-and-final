import React, { useState, useEffect } from 'react';
import { FaBars, FaPen } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // For toggling edit mode on personal phone
  const default_val = localStorage.getItem('style');
  const userId = localStorage.getItem('id');
  const [citationStyle,setCitation] = useState(default_val|| 'APA'); // Citation style state
  const [user, setUser] = useState([]);
  const dp = localStorage.getItem('DP');
  console.log(dp);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const setCitationStyle = (value) => {
    localStorage.setItem('style', value);
    setCitation(value);   
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handlePersonalNumberChange = (e) => {
    setUser({ ...user, personalPhone: e.target.value });
  };

  const navPapers = () => {
    console.log("papers")
    navigate('/user/papers');
  };

  const navCreatePaper = () => {
    console.log("Create")
    navigate('/create/paper');
  };

  const navTags = () => {
    console.log("tags")
    navigate('/user/taggedpapers');
  };
  
  const handlelogout = () => {
    logout();
  }

  const handleEditSubmit = () => {
    axios
      .put(`http://localhost:3000/user/update/${user._id}`, user)
      .then((response) => {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        alert('Profile updated successfully!');
      })
      .catch((error) => {
        alert('Error updating profile.');
        console.error('Error:', error);
      });
  };
  
  useEffect(() => {
    axios.get(`http://localhost:3000/user/byid/${userId}`)
        .then(response => {
            setUser(response.data); // Set the fetched users to state
        })
        .catch(error => {
            console.error('Error fetching user:', error);
        });
}, []);
const formatName = (fullName) => {
    const nameParts = fullName.split(' ');
    return fullName; // Return as-is if not in the expected format
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex w-2/3 bg-gray-100">
      {/* Sidebar */}
      <div
      style={{
        position: 'fixed',
        top: 0,
        left: isSidebarOpen ? 0 : '-16rem', // Adjust width accordingly
        height: '100%',
        width: '16rem',
        backgroundColor: '#2d3748', // Tailwind's gray-800
        color: 'white',
        transition: 'left 0.3s ease',
        zIndex: 1000,
      }}
      >
        <button
          className="text-2xl absolute top-4 left-4 text-gray-700 hover:text-gray-900 focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
        <br></br>
      <h2 className="text-xl font-bold p-4">Menu</h2>
      <ul>
      <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => navPapers()}
        >
          Journal Publications
        </li>
        <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => navCreatePaper()}
        >
          Create Journal Publications
        </li>
        <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => navTags()}
        >
          Tagged Journal Publications
        </li>
        <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => handlelogout()}
        >
          Logout
        </li>
      </ul>
      </div>

      <button
          className="text-2xl absolute top-4 left-4 text-gray-700 hover:text-gray-900 focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars />
      </button>
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Hamburger menu */}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          {user.name ? formatName(user.name) : 'User Profile'}
        </h2>


          <div className="flex flex-wrap -mx-2">
            {/* Left Column */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <div className="relative">
                <label className="block text-gray-700">Email ID:</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                  value={user.email}
                  readOnly
                />
              </div>

              <div className="relative mt-4">
                <label className="block text-gray-700">Office Phone:</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                  value={user.officePhone}
                  readOnly
                />
              </div>

              <div className="relative mt-4">
                <label className="block text-gray-700">Department:</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                  value={user.Dept}
                  readOnly
                />
              </div>

              <div className="relative mt-4">
                <label className="block text-gray-700">Chamber Number:</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                  value={user.chamberNum}
                  readOnly
                />
              </div>

              <div className="relative mt-4">
                <label className="block text-gray-700">Personal Phone:</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    className={`flex-grow p-2 border border-gray-300 rounded ${
                      isEditing ? '' : 'bg-gray-100 cursor-not-allowed'
                    }`}
                    value={user.personalPhone || ''}
                    onChange={handlePersonalNumberChange}
                    readOnly={!isEditing}
                  />
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                    onClick={toggleEdit}
                  >
                    <FaPen />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <img
                    src={dp}
                    alt="Profile"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
            <label className="block mb-4">
          <span className="text-gray-700">Citation Style:</span>
          <select
            value={citationStyle}
            onChange={(e) => setCitationStyle(e.target.value)}
            className="block text-gray-700 w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-300"
          >
            <option value="Default">APA</option>
            <option value="Harvard">Harvard</option>
            <option value="IEEE">IEEE</option>
          </select>
        </label>
        <button
            onClick={handleEditSubmit} // Call, not reference
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Save
          </button>
          </div>
        </div>
      </div>
  );
};

export default Home;
