// src/components/UserPapers.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserPapers = ({ userId }) => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const response = await axios.get(`/user/${userId}/papers`); // Adjust the URL based on your backend route
                setPapers(response.data);
            } catch (err) {
                setError('Failed to fetch papers');
            } finally {
                setLoading(false);
            }
        };

        fetchPapers();
    }, [userId]);

    if (loading) return <p>Loading papers...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">User's Papers</h2>
            {papers.length > 0 ? (
                <ul className="space-y-4">
                    {papers.map((paper) => (
                        <li key={paper._id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold text-indigo-700">{paper.title}</h3>
                            <p className="text-gray-600">Author: {paper.author}</p>
                            <p className="text-gray-600">DOI: {paper.DOI}</p>
                            <p className="text-gray-600">Publisher: {paper.publisher}</p>
                            <p className="text-gray-600">Year: {paper.year}</p>
                            <p className="text-gray-600">Journal: {paper.journal}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No papers found for this user.</p>
            )}
        </div>
    );
};

export default UserPapers;
