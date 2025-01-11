// src/components/UserPapersPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePaper } from '../context/PaperContext';

const UserTaggedPapers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('id');
  const navigator = useNavigate();
  const {pid} = usePaper();

  const goback = () => {
    navigator('/');
  } 

  const ShiftToTag = async (paperid) => {
    try{
      const response = await axios.get(`http://localhost:3000/${userId}/${paperid}/tagged/accepted`);
      setPapers(papers.filter(item => item._id !== paperid));
    }
    catch(err){
      console.log(error);
    }
  }
  const DeclineTag = async (paperid) => {
    try{
      const response = await axios.get(`http://localhost:3000/${userId}/${paperid}/tagged/declined`);
      setPapers(papers.filter(item => item._id !== paperid));
    }
    catch(err){
      console.log(error);
    }
  }

  useEffect(() => {
    // Fetch all papers for the user
    const fetchPapers = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${userId}/tagged/papers`);
        setPapers(response.data);
      } catch (err) {
        setError("No papers");
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [userId]);

  if (loading) return <p>Loading papers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-grey min-h-screen flex flex-col items-center text-gray-100">
        <div className="w-full max-w-4xl">
            <button
            className="w-auto py-2 px-6 mb-4 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition duration-200 ease-in-out self-end"
            type="button"
            onClick={() => goback()}
            >
            ← Back
            </button>
            
            <h1 className="text-4xl font-bold mb-8 text-center text-black">Your Tagged Papers</h1>

            {papers.length > 0 ? (
            <div className="space-y-6">
                {papers.map((paper) => (
                <div key={paper._id} className="p-6 bg-white text-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <p className="text-md mb-1 text-gray-700">
                      {paper.author} ({paper.year}). {paper.title}. <em>{paper.journal}</em>, {paper.volume}, {paper.pages}. 
                      {paper.DOI && (
                        <>
                          <span>https://doi.org/</span>
                          {paper.DOI}
                        </>
                      )}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={() => ShiftToTag(paper._id)}
                        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
                      >
                        Accept Tag
                      </button>
                      <button 
                        onClick={() => DeclineTag(paper._id)}
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                      >
                        Decline Tag
                      </button>
                    </div>
                </div>
                ))}
            </div>
            ) : (
            <p className="text-center text-xl font-medium mt-8 text-black">No tags yet.</p>
            )}
        </div>
    </div>

  );
};

export default UserTaggedPapers;