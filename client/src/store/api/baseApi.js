import axios from 'axios';
import { setCredentials, logout } from '../slices/authSlice';
import { updateSocketToken } from '../../socket/socketClient';

const getApiUrl = () => {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '';
  return envUrl.replace(/\/$/, '') || 'http://localhost:3001/api/v1';
};

// Standard Axios instance
export const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000, // Stop getting stuck on "Signing in..." if server is offline
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject token if we have one
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('pso_accessToken') || localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const safeRedirectToLogin = () => {
  if (typeof process !== 'undefined' && (process.env?.VITEST || process.env?.NODE_ENV === 'test')) {
    return;
  }
  if (typeof window !== 'undefined' && window.location && window.location.pathname !== '/auth/login') {
    try {
      window.location.href = '/auth/login';
    } catch {
      // Safe fallback for JSDOM or headless environments
    }
  }
};

let currentDispatch = null;
let isResponseInterceptorSet = false;

export const resetInterceptorState = () => {
  isRefreshing = false;
  failedQueue = [];
  isResponseInterceptorSet = false;
  currentDispatch = null;
};

/**
 * Enhanced setup function to inject Redux dispatch safely into the response interceptor.
 * This completely prevents circular dependency build loops and duplicate handler stacking.
 */
export const setupResponseInterceptor = (dispatch) => {
  currentDispatch = dispatch;
  if (isResponseInterceptorSet) return;
  isResponseInterceptorSet = true;

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error?.config;

      // If no config or network crash, forward error
      if (!originalRequest) return Promise.reject(error);

      // Catch 403 Forbidden specifically for account/society deactivation
      if (error.response?.status === 403) {
        const msg = error.response?.data?.message || '';
        if (msg.toLowerCase().includes('deactivated')) {
          return Promise.reject(error);
        }
      }

      // Catch 401 Unauthorized errors (excluding login/refresh endpoints to prevent loops)
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/refresh') &&
        !originalRequest.url?.includes('/auth/login')
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken =
          localStorage.getItem('pso_refreshToken') ||
          localStorage.getItem('refreshToken');
        if (!refreshToken) {
          if (currentDispatch) currentDispatch(logout()); // Clean Redux + LocalStorage
          safeRedirectToLogin();
          return Promise.reject(error);
        }

        try {
          const { data } = await axios.post(
            `${getApiUrl()}/auth/refresh`,
            { refreshToken }
          );

          // The backend returns new tokens inside data.data
          const newAccessToken = data?.data?.accessToken;
          const newRefreshToken = data?.data?.refreshToken;

          if (newAccessToken) {
            localStorage.setItem('pso_accessToken', newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('pso_refreshToken', newRefreshToken);
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            // Parse safe user fallback if missing
            let currentUser = null;
            try {
              const localUser =
                localStorage.getItem('pso_user') ||
                localStorage.getItem('user');
              if (localUser && localUser !== 'undefined' && localUser !== 'null') {
                currentUser = JSON.parse(localUser);
              }
            } catch (e) {
              console.error(e);
            }

            // Sync the fresh tokens back to Redux state instantly
            if (currentDispatch) {
              currentDispatch(
                setCredentials({
                  user: currentUser,
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken || refreshToken,
                })
              );
            }

            if (!axiosInstance.defaults.headers.common) {
              axiosInstance.defaults.headers.common = {};
            }
            axiosInstance.defaults.headers.common['Authorization'] =
              'Bearer ' + newAccessToken;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] =
              'Bearer ' + newAccessToken;

            // Re-authenticate Socket with the new token
            updateSocketToken(newAccessToken);

            processQueue(null, newAccessToken);
            return axiosInstance(originalRequest);
          }
        } catch (err) {
          processQueue(err, null);
          if (currentDispatch) currentDispatch(logout()); // Clean Redux + LocalStorage
          safeRedirectToLogin();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

/**
 * Custom baseQuery for RTK Query using Axios.
 * Grabs the API's `dispatch` function dynamically on every call.
 */
export const axiosBaseQuery =
  () =>
    async ({ url, method, data, params, headers }, api) => {
      // Dynamically inject dispatch into interceptor setup
      setupResponseInterceptor(api.dispatch);

      try {
        const isFormData = data instanceof FormData;

        const result = await axiosInstance({
          url,
          method,
          data,
          params,
          headers: isFormData ? { ...headers, 'Content-Type': undefined } : headers,
        });
        return { data: result.data };
      } catch (axiosError) {
        const err = axiosError;
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        };
      }
    };
