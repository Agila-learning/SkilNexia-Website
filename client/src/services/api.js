import axios from 'axios';

const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) {
        const url = import.meta.env.VITE_API_URL;
        return url.endsWith('/api') ? url : `${url.replace(/\/$/, '')}/api`;
    }
    
    // In production, if served from the same domain, use relative path
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return '/api';
    }

    return 'http://localhost:5000/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
    timeout: 30000, 
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('skilnexia_auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
