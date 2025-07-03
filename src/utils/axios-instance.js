import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
});

// Request Interceptor: Add token from cookie
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access-token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
        Cookies.remove("access-token");
        Cookies.remove("refresh-token");
        Cookies.remove("role");
        localStorage.clear();
        if (typeof window !== 'undefined') {
            toast.error("Your session has been expired");
            window.location.assign("/?tokenRevoked");
        }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
