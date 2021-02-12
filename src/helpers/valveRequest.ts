import axios from 'axios';
import { valveToken } from 'src/config';
import Logger from 'src/core/Logger';

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
    (response) => response,
    (error) => {
      Logger.error(error);
      return Promise.reject(error);
    },
  );
};

const valveRequest = request();

export default valveRequest;
