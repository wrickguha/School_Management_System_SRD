import axios from 'axios';

const getBaseURL = (): string => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const envUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');

    if (envUrl) {
      try {
        const parsedEnv = new URL(envUrl, origin);
        const windowHost = window.location.hostname;
        const baseWindowHost = windowHost.replace(/^www\./i, '');
        const baseEnvHost = parsedEnv.hostname.replace(/^www\./i, '');

        if (baseWindowHost === baseEnvHost) {
          return `${origin}${parsedEnv.pathname.replace(/\/+$/, '')}`;
        }

        return parsedEnv.toString().replace(/\/+$/, '');
      } catch (e) {
        return envUrl;
      }
    }

    if (['5173', '3000', '5174'].includes(window.location.port)) {
      return `${window.location.protocol}//${window.location.hostname}:8000/api`;
    }

    return `${origin}/api`;
  }

  return import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:8000/api';
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

const normalizeRequestUrl = (baseURL: string, url: string): string => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;

  const normalizedBase = baseURL.replace(/\/+$/, '');
  const strippedUrl = url.replace(/^\/+/, '');

  if (normalizedBase.endsWith('/api')) {
    return strippedUrl.replace(/^api\//i, '');
  }

  return strippedUrl;
};

// Real Backend Request Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('erp_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const baseURL = config.baseURL || '';
  const requestUrl = config.url || '';
  if (baseURL.includes('/api') && requestUrl.startsWith('/')) {
    config.url = normalizeRequestUrl(baseURL, requestUrl);
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
