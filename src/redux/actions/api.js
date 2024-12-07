// utils/api.js
import axios from 'axios';
import { getToken } from './authAction'; // Import getToken from auth.js
import { API_BASE_URL } from '../../config';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL
});

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to make authenticated requests
export const fetchWithAuth = async (method, url, data, options = {}) => {
  try {

    if(method === 'get'){
        const response = await axiosInstance.get(url, options);
        return response.data; // Return the response data
    }else{
        const response = await axiosInstance.post(url, data, options);
        return response.data; // Return the response data
    }
  } catch (error) {
    console.error('Failed to fetch data.', error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
