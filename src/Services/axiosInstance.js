import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// A separate, public API instance without authentication headers
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Request interceptor to add the access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Check for 401 and that we haven't already tried to refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/refresh`, null, { withCredentials: true });
        
        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        
        // Update the header and retry the original request
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is also invalid, so redirect to login
        localStorage.removeItem("accessToken");
       window.location.href = '/'; 
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { api, publicApi };