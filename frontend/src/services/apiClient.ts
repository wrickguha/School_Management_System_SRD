/**
 * API Client Simulator
 * 
 * This client mocks real network requests with custom latency (300ms - 800ms)
 * to test loading states, skeletons, and transaction responses.
 * 
 * TODO: INTEGRATING WITH LARAVEL BACKEND:
 * 1. Install axios: `npm install axios`
 * 2. Replace this class instance with an axios instance:
 *    ```typescript
 *    import axios from 'axios';
 *    const apiClient = axios.create({
 *      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
 *      headers: { 'Content-Type': 'application/json' }
 *    });
 *    apiClient.interceptors.request.use(config => {
 *      const token = localStorage.getItem('sms_auth_token');
 *      if (token) config.headers.Authorization = `Bearer \${token}`;
 *      return config;
 *    });
 *    export default apiClient;
 *    ```
 */

const LATENCY_MS = 400;

class ApiClient {
  private logRequest(method: string, url: string, data?: any) {
    console.log(`%c[REST API Request] ${method} ${url}`, 'color: #6366f1; font-weight: bold;', data || '');
  }

  private logResponse(url: string, data: any) {
    console.log(`%c[REST API Response] ${url}`, 'color: #10b981; font-weight: bold;', data);
  }

  private simulateNetwork<T>(responseValue: T, method: string, url: string, requestData?: any): Promise<T> {
    this.logRequest(method, url, requestData);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.logResponse(url, responseValue);
        resolve(responseValue);
      }, LATENCY_MS);
    });
  }

  get<T>(url: string): Promise<T> {
    // Locate and extract mock data storage from localStorage or local constants
    const storageKey = `mock_${url.replace(/\//g, '_')}`;
    const localData = localStorage.getItem(storageKey);
    const mockVal = localData ? JSON.parse(localData) : null;
    return this.simulateNetwork<T>(mockVal, 'GET', url);
  }

  post<T>(url: string, data: any): Promise<T> {
    return this.simulateNetwork<T>(data, 'POST', url, data);
  }

  put<T>(url: string, data: any): Promise<T> {
    return this.simulateNetwork<T>(data, 'PUT', url, data);
  }

  delete<T>(url: string): Promise<T> {
    return this.simulateNetwork<T>({ success: true } as any, 'DELETE', url);
  }

  // Helper to pre-populate local mock values
  setMockData(url: string, data: any) {
    const storageKey = `mock_${url.replace(/\//g, '_')}`;
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }
}

export const apiClient = new ApiClient();
