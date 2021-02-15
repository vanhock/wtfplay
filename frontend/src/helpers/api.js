import axios from 'axios';
import { apiUrl } from '@/config';

const request = () => {
  let headers = { 'Content-Type': 'application/json' };
  const a = axios.create({
    baseURL: apiUrl,
    headers,
    params: {
      format: 'json',
    },
  });

  a.interceptors.response.use(
    (response) => response.data.response,
    (error) => {
      return Promise.reject(error);
    },
  );
  return a;
};

const api = request();

export default api;
