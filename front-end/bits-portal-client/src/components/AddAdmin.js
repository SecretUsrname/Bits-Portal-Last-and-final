import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddAdmin() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        Dept: '',
        PSR: '',
        chamberNum: '',
        officePhone: '',
        role: 'Admin',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null); // For editing user
    const navigate = useNavigate();

    // Fetch users when the component mounts
    useEffect(() => {
        axios.get('http://localhost:3000/allAdmins')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                setError('Error fetching users');
                console.error('Error fetching users:', error);
            });
    }, []);

    // Handle adding a new user
    const handleAddUser = (e) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email) {
            alert('Please provide all required fields');
            return;
        }

        axios.post('http://localhost:3000/user', newUser)
            .then(response => {
                setUsers([...users, response.data]);
                setNewUser({ name: '', email: '', Dept: '', PSR: '', chamberNum: '', officePhone: '' });
                setSuccessMessage('Admin added successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            })
            .catch(error => {
                alert('Error adding user');
                console.error('Error adding user:', error);
            });
    };

    // Handle editing an existing user
    const handleEditClick = (user) => {
        setEditingUser({ ...user });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        console.log(editingUser);
        // Check if all required fields are filled
        if (!editingUser.name || !editingUser.email) {
            alert('Please provide all required fields');
            return;
        }
    
        // Update user data
        axios
            .put(`http://localhost:3000/user/update/${editingUser._id}`, editingUser) // Updated path to match the API
            .then(response => {
                // Assuming the API returns the updated user in response.data.user
                const updatedUser = response.data.user;
    
                // Update the users list
                const updatedUsers = users.map(user =>
                    user._id === editingUser._id ? updatedUser : user
                );
    
                setUsers(updatedUsers);
                setEditingUser(null); // Close modal after saving
                setSuccessMessage('User updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            })
            .catch(error => {
                alert('Error updating user');
                console.error('Error updating user:', error);
            });
    };
    

    const handleDelete = (userId) => {
        axios.delete(`http://localhost:3000/user/${userId}`)
            .then(response => {
                alert(response.data.message);
                setUsers(users.filter(user => user._id !== userId));
            })
            .catch(error => {
                alert('Error deleting user');
                console.error('Error deleting user:', error);
            });
    };

    const goback = () => {
        navigate('/home');
    };

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gradient-to-r from-indigo-500 to-blue-400 text-white rounded-lg shadow-xl">
            <button
                className="w-auto py-2 px-6 mb-4 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition duration-200 ease-in-out self-end"
                type="button"
                onClick={goback}
            >
                ← Back
            </button>

            <h1 className="text-4xl font-extrabold text-center mb-8">View All Admins</h1>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-500 text-white py-2 px-4 mb-4 rounded-md shadow-md text-center">
                    {successMessage}
                </div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {/* Add User Form */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-gray-700 mb-4">Add New Admin</h2>
                <form onSubmit={handleAddUser} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="w-full py-3 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full py-3 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                    />
                    <input
                        type="text"
                        name="department"
                        placeholder="Enter department"
                        value={newUser.Dept}
                        onChange={(e) => setNewUser({ ...newUser, Dept: e.target.value })}
                        className="w-full py-3 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                    />
                    <input
                        type="text"
                        name="psrNumber"
                        placeholder="Enter PSR number"
                        value={newUser.PSR}
                        onChange={(e) => setNewUser({ ...newUser, PSR: e.target.value })}
                        className="w-full py-3 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                    />
                    <input
                        type="text"
                        name="chamberNumber"
                        placeholder="Enter chamber number"
                        value={newUser.chamberNum}
                        onChange={(e) => setNewUser({ ...newUser, chamberNum: e.target.value })}
                        className="w-full py-3 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                    />
                    <input
                        type="text"
                        name="officePhoneNumber"
                        placeholder="Enter office phone number"
                        value={newUser.officePhone}
                        onChange={(e) => setNewUser({ ...newUser, officePhone: e.target.value })}
                        className="w-full py-3 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none transition duration-300 ease-in-out"
                    >
                        Add Admin
                    </button>
                </form>
            </div>

            {/* Users Table */}
            {users.length === 0 ? (
                <p className="text-center text-lg text-gray-300">No Admins found.</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="min-w-full table-auto text-gray-800">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50 transition duration-300 ease-in-out">
                                    <td className="py-3 px-6">{user.name}</td>
                                    <td className="py-3 px-6">{user.email}</td>
                                    <td className="py-3 px-6 text-center">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Edit User</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter name"
                                value={editingUser.name}
                                onChange={handleEditChange}
                                className="w-full py-3 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={editingUser.email}
                                onChange={handleEditChange}
                                className="w-full py-3 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                            />
                            <input
                                type="text"
                                name="Dept"
                                placeholder="Enter Dept"
                                value={editingUser.Dept}
                                onChange={handleEditChange}
                                className="w-full py-3 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                            />
                            <input
                                type="text"
                                name="PSR"
                                placeholder="Enter PSR"
                                value={editingUser.PSR}
                                onChange={handleEditChange}
                                className="w-full py-3 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                            />
                            <input
                                type="text"
                                name="Chamber Number"
                                placeholder="Enter Chamber Num"
                                value={editingUser.chamberNum}
                                onChange={handleEditChange}
                                className="w-full py-3 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                            />
                            <input
                                type="text"
                                name="Office Phone Number"
                                placeholder="Enter Phone Number"
                                value={editingUser.officePhone}
                                onChange={handleEditChange}
                                className="w-full py-3 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                            />
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-6 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition duration-200 mr-4"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-200"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddAdmin;
