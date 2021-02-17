import axios from 'axios';
import Logger from '../core/Logger';
import { valveRequestRetryThrottle } from '../config';
import { retryRequest } from '../helpers/valveRequestRetry';

const request = (): any => {
  let headers = { 'Content-Type': 'application/json' };
  const a = axios.create({
    baseURL: 'http://store.steampowered.com/api/',
    headers,
  });

  a.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const {
        config,
        response: { status },
      } = error;
      console.log('Status', status);
      if (status === 429) {
        console.log('retry request');
        return retryRequest(valveRequestRetryThrottle, a, config);
      } else {
        Logger.error(error);
        return Promise.reject(error);
      }
    },
  );
  return a;
};

const valveStoreRequest = request();

export default valveStoreRequest;
