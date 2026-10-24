import axios from 'axios';

const api = axios.create({
  baseURL: "https://apnagaana.onrender.com/api", // Replace with your backend API URL
  withCredentials: true, // Include credentials (cookies) in requests
});
export default api;