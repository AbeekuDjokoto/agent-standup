import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '@/stores';
import { ENV_VARS } from '@/utils/constants';
import {
  isCookieAuthRequestUrl,
  isLogoutRequestUrl,
  isRefreshRequestUrl,
  shouldProactivelyRefresh,
  shouldSyncAuthFromResponse,
  tryRefreshSession,
} from '@/utils/sessionRefresh';

const instance = axios.create({
  baseURL: ENV_VARS.API_BASE_URL,
  withCredentials: true,
});

const CANCELLED_STATUS_CODE = 499;

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

function getResponseErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === 'object' && data !== null) {
    const body = data as { error?: string; message?: string; detail?: string };
    return (
      body.error?.trim() ||
      body.message?.trim() ||
      body.detail?.trim() ||
      fallback
    );
  }
  return fallback;
}

function errorHandler(error: AxiosError) {
  let { status } = error.response || {};
  status = error.code === 'ERR_CANCELED' ? CANCELLED_STATUS_CODE : status;

  const fallback = error.message || 'Sorry, an unexpected error occurred.';
  const responseData = error.response?.data;
  const message = getResponseErrorMessage(responseData, fallback);

  throw {
    status,
    message,
    ...(typeof responseData === 'object' && responseData !== null
      ? responseData
      : {}),
  };
}

instance.interceptors.request.use(
  async (request: InternalAxiosRequestConfig) => {
    const requestUrl = request.url ?? '';

    if (!isCookieAuthRequestUrl(requestUrl) && shouldProactivelyRefresh()) {
      await tryRefreshSession();
    }

    const { token, isSessionValid } = useAuthStore.getState();

    if (token && isSessionValid() && !isCookieAuthRequestUrl(requestUrl)) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
);

instance.interceptors.response.use(
  (response) => {
    const { data } = response;
    const requestUrl = response.config?.url ?? '';

    if (shouldSyncAuthFromResponse(requestUrl)) {
      if (
        data?.access_token &&
        data?.user &&
        typeof data.expires_in === 'number'
      ) {
        useAuthStore.getState().authenticateFromLoginResponse(data);
      } else if (data?.user && !data.access_token) {
        useAuthStore.getState().setUser(data.user);
      }
    }

    return data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? '';

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isCookieAuthRequestUrl(requestUrl)
    ) {
      originalRequest._retry = true;

      const refreshed = await tryRefreshSession();

      if (refreshed) {
        const { token, isSessionValid } = useAuthStore.getState();

        if (token && isSessionValid()) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        return instance(originalRequest);
      }

      useAuthStore.getState().reset();
    } else if (
      status === 401 &&
      (isRefreshRequestUrl(requestUrl) || isLogoutRequestUrl(requestUrl))
    ) {
      useAuthStore.getState().reset();
    }

    return errorHandler(error);
  },
);

export { instance as axiosClient };
