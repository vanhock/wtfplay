import axios from 'axios';
import { apiUrl } from '@/config';

const cancelToken = axios.CancelToken;
export let cancelTokenSource = cancelToken.source();
export const cancelRequest = () => {
  cancelTokenSource.cancel();
  cancelTokenSource = cancelToken.source();
};
const request = () => {
  let headers = { 'Content-Type': 'application/json' };
  const a = axios.create({
    baseURL: apiUrl,
    headers,
    cancelToken: cancelTokenSource.token,
  });

  a.interceptors.response.use(
    (response) => response.data.data,
    (error) => {
      if (axios.isCancel(error)) {
        return Promise.reject("cancel");
      } else {
        return Promise.reject(error);
      }
    },
  );
  return a;
};

const api = request();

export default api;
