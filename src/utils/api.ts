// client/src/utils/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Make sure this matches your backend server port
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for sending/receiving cookies with CORS
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
