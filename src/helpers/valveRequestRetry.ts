import { AxiosInstance, AxiosRequestConfig } from 'axios';

export const retryRequest = (
  milliseconds: number,
  axiosInstance: AxiosInstance,
  originalRequestConfig: AxiosRequestConfig,
) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(axiosInstance(originalRequestConfig)), milliseconds);
  });
};
