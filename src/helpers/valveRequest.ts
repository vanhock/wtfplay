import axios from 'axios';
import { valveToken } from '../config';
import Logger from '../core/Logger';

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
      Logger.error(error);
      return Promise.reject(error);
    },
  );
  return a;
};

const valveRequest = request();

export default valveRequest;
