// Mapper for environment variables
export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;

export const db = {
    name: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || ''
};

export const valveToken = process.env.VALVE_TOKEN || '';
export const corsUrl = process.env.CORS_URL;
export const logDirectory = process.env.LOG_DIR;