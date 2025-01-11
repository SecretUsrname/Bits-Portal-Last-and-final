import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserTag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Tag = () => {
    const navigate = useNavigate();
    const id = localStorage.getItem('id');
    const [userlist, setuserlist] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [currentdoi, setcurrentdoi] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const filteredUsers = userlist.filter(user =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) || user.email.toLowerCase().includes(searchText.toLowerCase())
    );

    useEffect(() => {
        const pid = localStorage.getItem('pid');
        axios.get(`http://localhost:3000/paper/${pid}`)
            .then(response => {
                const paper = response.data;
                setcurrentdoi(paper.DOI);
            })
            .catch(error => {
                console.error('Error fetching paper:', error);
            });
    }, []);

    const TagUser = () => {
        for (const user of selectedUsers) {
            if (!user.DOI.includes(currentdoi) && !user.tagged_DOI.includes(currentdoi)) {
                const encodedDoi = encodeURIComponent(currentdoi);
                axios.post(`http://localhost:3000/paper/tag/${encodedDoi}/${user.email}`)
                    .then(() => {
                        alert(`${user.name} has been tagged.`);
                    })
                    .catch(error => {
                        console.error('Error tagging user:', error);
                    });
            } else {
                alert(`${user.name} is already tagged.`);
            }
        }
        navigate('/user/papers');
    };

    const handleTagUser = (user) => {
        if (!selectedUsers.includes(user)) {
            setSelectedUsers([...selectedUsers, user]);
        }
        setSearchText(''); // Clear search after tagging
    };

    const handleRemoveUser = (userToRemove) => {
        setSelectedUsers(selectedUsers.filter(user => user !== userToRemove));
    };

    useEffect(() => {
        axios.get(`http://localhost:3000/allUsers`)
            .then(response => {
                const users = response.data;
                const updatedUserList = users.filter(user => user._id !== id);
                setuserlist(updatedUserList);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    return (
        <div className="w-11/12 mx-auto p-10 bg-white shadow-lg rounded-lg h-auto mt-10">
            <h1 className="text-3xl font-semibold mb-6">Tag Users</h1>

            {/* Search Bar */}
            <div className="relative mb-6">
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search for users..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
                <FaUserTag className="absolute right-4 top-3 text-gray-400" />

                {/* Dropdown with user suggestions */}
                {searchText && (
                    <ul className="absolute w-full bg-white border border-gray-200 rounded-lg mt-2 max-h-56 overflow-y-auto z-10">
                        {filteredUsers.map((user) => (
                            <li
                                key={user.id}
                                onClick={() => handleTagUser(user)}
                                className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                            >
                                {user.name}
                                <br />
                                {user.email}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Display Selected Users */}
            <div className="mb-6">
                <h2 className="text-lg font-medium mb-3">Tagged Users</h2>
                {selectedUsers.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {selectedUsers.map((user) => (
                            <span
                                key={user.id}
                                className="flex items-center bg-red-100 text-black px-4 py-2 rounded-full text-sm"
                            >
                              <span>{user.name}</span>
                              <span className="mx-2">|</span>
                              <span className="text-gray-500">{user.email}</span>
                                <button
                                    onClick={() => handleRemoveUser(user)}
                                    className="ml-2 bg-red-600 text-white px-2 rounded-full focus:outline-none"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No users tagged yet.</p>
                )}
            </div>

            {/* Save Button */}
            <button
                className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors"
                onClick={TagUser}
            >
                Save Tags
            </button>
        </div>
    );
};

export default Tag;