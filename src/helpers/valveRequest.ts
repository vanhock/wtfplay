import axios from 'axios';
import { valveRequestRetryThrottle, valveToken } from '../config';
import Logger from '../core/Logger';
import { retryRequest } from '../helpers/valveRequestRetry';

const request = (): any => {
  let headers = { 'Content-Type': 'application/json' };
  const a = axios.create({
    baseURL: 'http://api.steampowered.com/',
    headers,
    params: {
      key: valveToken,
      format: 'json',
    },
  });

  a.interceptors.response.use(
    (response) => response.data.response,
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

const valveRequest = request();
export default valveRequest;
