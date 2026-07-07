import axios from 'axios';
import { toast } from 'react-hot-toast';

// Setup Base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure retry properties
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // ms

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eafc_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global handler and retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // Determine if we should retry the request
    // Retry only on network errors or 5xx server errors, for GET requests only to prevent double mutations
    const isNetworkError = !response;
    const isServerError = response && response.status >= 500;
    const isGetRequest = config && config.method === 'get';

    if (isGetRequest && (isNetworkError || isServerError)) {
      // Initialize retry count
      config.retryCount = config.retryCount || 0;

      if (config.retryCount < MAX_RETRIES) {
        config.retryCount += 1;
        
        // Calculate backoff delay: 1s, 2s, 4s...
        const backoffDelay = Math.pow(2, config.retryCount - 1) * RETRY_DELAY_BASE;
        
        // Notify user about retry
        toast.error(`Connection issue. Retrying request (${config.retryCount}/${MAX_RETRIES}) in ${backoffDelay / 1000}s...`, {
          id: `retry-${config.url}`, // prevent duplicate toasts
        });

        // Delay execution
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));

        // Re-execute request
        return api(config);
      }
    }

    // Global Error Handling / User Notifications
    if (response) {
      const { status, data } = response;
      const errorMessage = data?.message || 'Something went wrong';

      switch (status) {
        case 400:
          // Bad Request: Validation or parameters error
          toast.error(`Validation Error: ${errorMessage}`);
          break;
        case 401:
          // Unauthorized: Session expired
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('eafc_token');
          localStorage.removeItem('eafc_user');
          // Dispatch logout or trigger page reload if not on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden: Access denied
          toast.error('Access Denied: You do not have permissions for this action.');
          break;
        case 404:
          // Not Found
          toast.error(`Not Found: ${errorMessage}`);
          break;
        default:
          // 5xx and other server errors
          toast.error(`Server Error (${status}): ${errorMessage}`);
          break;
      }
    } else {
      // Complete Offline / Network failure
      toast.error('Network Error: Please check your internet connection.');
    }

    return Promise.reject(error);
  }
);

export default api;
