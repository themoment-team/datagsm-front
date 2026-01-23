import { authUrl } from '@repo/shared/api';
import { COOKIE_KEYS } from '@repo/shared/constants';
import { deleteCookie, getCookie, setCookie } from '@repo/shared/utils';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

export const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

const refreshAxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const oauthAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_OAUTH_BASE_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getCookie(COOKIE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    return Promise.reject(response.data);
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = getCookie(COOKIE_KEYS.REFRESH_TOKEN);

        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await refreshAxiosInstance.put(authUrl.putRefresh(), {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data;

        if (!newAccessToken) throw new Error('No new token returned');

        setCookie(COOKIE_KEYS.ACCESS_TOKEN, newAccessToken);
        setCookie(COOKIE_KEYS.REFRESH_TOKEN, newRefreshToken);

        refreshQueue.forEach((cb) => cb(newAccessToken));
        refreshQueue = [];

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
        deleteCookie(COOKIE_KEYS.REFRESH_TOKEN);

        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

oauthAxiosInstance.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    return Promise.reject(response.data);
  },
  (error: AxiosError) => Promise.reject(error),
);
