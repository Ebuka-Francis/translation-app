// api/apiClient.ts
import axios, {
   AxiosResponse,
   AxiosError,
   InternalAxiosRequestConfig,
} from 'axios';
import toast from 'react-hot-toast';
import { config } from '../api/api';

// Type definitions

interface RefreshResponse {
   success: boolean;
   accessToken: string;
   refreshToken: string;
}

interface QueueItem {
   resolve: (token: string) => void;
   reject: (error: AxiosError) => void;
}

const api = axios.create({
   baseURL: config.baseUrl,
   timeout: 10000,
});

// Token management functions with proper types
const getAccessToken = (): string | null => localStorage.getItem('accessToken');
const getRefreshToken = (): string | null =>
   localStorage.getItem('refreshToken');

const setTokens = (accessToken: string, refreshToken: string): void => {
   localStorage.setItem('accessToken', accessToken);
   localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = (): void => {
   localStorage.removeItem('accessToken');
   localStorage.removeItem('refreshToken');
};

// Flag to prevent multiple refresh requests
let isRefreshing: boolean = false;
let failedQueue: QueueItem[] = [];

const processQueue = (
   error: AxiosError | null,
   token: string | null = null
): void => {
   failedQueue.forEach(({ resolve, reject }: QueueItem) => {
      if (error) {
         reject(error);
      } else {
         resolve(token!);
      }
   });

   failedQueue = [];
};

// REQUEST INTERCEPTOR - Add tokens to requests
api.interceptors.request.use(
   async (
      config: InternalAxiosRequestConfig
   ): Promise<InternalAxiosRequestConfig> => {
      try {
         const accessToken: string | null = getAccessToken();
         const refreshToken: string | null = getRefreshToken();

         // Add access token to Authorization header
         if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
         }

         // Add refresh token to custom header
         if (refreshToken) {
            config.headers['X-Refresh-Token'] = refreshToken;
         }

         return config;
      } catch (error) {
         console.error('Error setting up request:', error);
         return Promise.reject(error);
      }
   },
   (error: AxiosError): Promise<AxiosError> => {
      return Promise.reject(error);
   }
);

// RESPONSE INTERCEPTOR - Handle token refresh and errors
api.interceptors.response.use(
   (response: AxiosResponse): AxiosResponse => {
      // Check for new tokens in response headers
      const newAccessToken: string = response.headers['x-new-access-token'];
      const newRefreshToken: string = response.headers['x-new-refresh-token'];

      if (newAccessToken && newRefreshToken) {
         setTokens(newAccessToken, newRefreshToken);
         toast.success('Tokens refreshed automatically');
      }

      return response;
   },
   async (error: AxiosError): Promise<AxiosResponse | void> => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
         _retry?: boolean;
      };

      // Handle network errors
      if (error.code === 'ERR_NETWORK' || !error.response) {
         toast.error('Check your internet connection');
         return Promise.reject(error);
      }

      // Handle 401 errors (token expired/invalid)
      if (error.response?.status === 401 && !originalRequest._retry) {
         if (isRefreshing) {
            // If already refreshing, queue this request
            return new Promise<string>((resolve, reject) => {
               failedQueue.push({ resolve, reject });
            })
               .then((token: string) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  return api(originalRequest);
               })
               .catch((err: unknown) => {
                  return Promise.reject(err);
               });
         }

         originalRequest._retry = true;
         isRefreshing = true;

         const refreshToken: string | null = getRefreshToken();

         if (!refreshToken) {
            // No refresh token, redirect to login
            clearTokens();
            toast.error('Session expired. Please login again.');
            window.location.href = '/login';
            return Promise.reject(error);
         }

         try {
            // Attempt to refresh tokens
            const refreshResponse: AxiosResponse<RefreshResponse> =
               await axios.post(
                  `${config.baseUrl}${config.endpoints.refreshToken}`,
                  {},
                  {
                     headers: {
                        'X-Refresh-Token': refreshToken,
                     },
                  }
               );

            const {
               accessToken,
               refreshToken: newRefreshToken,
            }: RefreshResponse = refreshResponse.data;

            // Save new tokens
            setTokens(accessToken, newRefreshToken);

            // Process queued requests
            processQueue(null, accessToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
         } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            processQueue(refreshError as AxiosError, null);
            clearTokens();
            toast.error('Session expired. Please login again.');
            window.location.href = '/login';
            return Promise.reject(refreshError);
         } finally {
            isRefreshing = false;
         }
      }

      // Handle other error statuses
      if (error.response?.status === 403) {
         toast.error("Access forbidden. You don't have permission.");
      } else if (error.response?.status === 404) {
         toast.error('Resource not found.');
      } else if (error.response?.status >= 500) {
         toast.error('Server error. Please try again later.');
      } else if (
         error.response?.data &&
         typeof error.response.data === 'object' &&
         'error' in error.response.data
      ) {
         toast.error((error.response.data as { error: string }).error);
      }

      return Promise.reject(error);
   }
);

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
   return !!getAccessToken();
};

export default api;
