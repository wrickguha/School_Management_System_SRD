import axios from 'axios';

const getBaseURL = (): string => {
  const envUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
  if (envUrl) {
    return envUrl;
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    if (['5173', '3000', '5174'].includes(port)) {
      return `${protocol}//${hostname}:8000/api`;
    }
    return `${protocol}//${hostname}/api`;
  }

  return 'http://localhost:8000/api';
};

const normalizeRequestUrl = (baseURL: string, url: string): string => {
  if (!url || /^https?:\/\//i.test(url)) return url;

  let normalized = url.replace(/^\/+/, '');
  if (baseURL.replace(/\/+$/, '').endsWith('/api')) {
    normalized = normalized.replace(/^api\//i, '');
  }

  return normalized;
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

  if (config.baseURL && typeof config.url === 'string') {
    config.url = normalizeRequestUrl(config.baseURL, config.url);
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getImageUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = getBaseURL().replace(/\/api\/?$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBase}${cleanPath}`;
};

export default apiClient;
