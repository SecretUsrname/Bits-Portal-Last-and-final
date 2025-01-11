import axios from 'axios';

const API_URL = 'http://localhost:3000';

// User APIs
export const createUser = (userData) => axios.post(`${API_URL}/user`, userData);
export const getUserByEmail = (email) => axios.get(`${API_URL}/user/${email}`);
export const deleteUser = (userId) => axios.delete(`${API_URL}/user/${userId}`);
export const getAllUsers = () => axios.get(`${API_URL}/alluser`);

// Paper APIs
export const createPaper = (userId, paperData) => axios.post(`${API_URL}/${userId}/paper`, paperData);
export const getPaperById = (paperId) => axios.get(`${API_URL}/paper/${paperId}`);
export const getPaperByDOI = (DOI) => axios.get(`${API_URL}/paper/DOI/${DOI}`);
export const deletePaperById = (paperId) => axios.delete(`${API_URL}/paper/${paperId}`);
export const getAllPapers = () => axios.get(`${API_URL}/allpapers`);

// Upload and Tag APIs
export const uploadFile = (file, userId) => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post(`${API_URL}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(response => {
            const paperData = response.data;
            console.log("Uploaded file data:", paperData);
            return createPaper(userId, paperData);
        })
        .catch(console.error);
    
};

export const tagPaper = (DOI, email) => axios.post(`${API_URL}/paper/tag/${DOI}/${email}`);
