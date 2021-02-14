import axios from 'axios';
import Logger from '../core/Logger';

const request = (): any => {
  let headers = { 'Content-Type': 'application/json' };
  const a = axios.create({
    baseURL: 'http://store.steampowered.com/api/',
    headers,
  });

  a.interceptors.response.use(
    (response) => response.data,
    (error) => {
      Logger.error(error);
      return Promise.reject(error);
    },
  );
  return a;
};

const valveStoreRequest = request();

export default valveStoreRequest;
