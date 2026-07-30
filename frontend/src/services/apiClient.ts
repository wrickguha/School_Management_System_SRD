import axios from 'axios';

const getBaseURL = (): string => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin; // e.g. "https://www.subhraedu.com" or "https://subhraedu.com" or "http://localhost:5173"
    const envUrl = import.meta.env.VITE_API_URL;

    if (envUrl) {
      try {
        const parsedEnv = new URL(envUrl, origin);
        const windowHost = window.location.hostname; // e.g. "www.subhraedu.com"
        
        // Compare base domain stripping 'www.'
        const baseWindowHost = windowHost.replace(/^www\./i, '');
        const baseEnvHost = parsedEnv.hostname.replace(/^www\./i, '');

        // If visiting subhraedu.com or www.subhraedu.com, align origin to match current window origin
        if (baseWindowHost === baseEnvHost) {
          return `${origin}${parsedEnv.pathname}`;
        }
        return envUrl;
      } catch (e) {
        return envUrl;
      }
    }

    // Dev server fallback
    if (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '5174') {
      return `${window.location.protocol}//${window.location.hostname}:8000/api`;
    }

    // Default same-origin production fallback
    return `${origin}/api`;
  }

  return import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Real Backend Request Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('erp_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
