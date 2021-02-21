// Mapper for environment variables
export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const matchResultLimit = process.env.MATCH_RESULT_LIMIT || 0;
export const cacheConfig = {
  deleteOnExpire: false,
  useClones: true,
  checkperiod: 0
}

export const limiterConfig = {
  maxConcurrent: 1,
  minTime: 100
}

export const valveToken = process.env.VALVE_TOKEN || '';
export const corsUrl = process.env.CORS_URL;
export const logDirectory = process.env.LOG_DIR;

export const valveRequestThrottle = 1500;
export const valveRequestRetryThrottle = 2000;

