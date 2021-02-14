import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { corsUrl, environment } from './config';

import Logger from './core/Logger';

import { NotFoundError, ApiError, InternalError } from './core/ApiError';

import './database'; // initialize database

import routesV1 from './routes/v1/index';

process.on('uncaughtException', (e) => {
  Logger.error(e);
});

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

// Routes
app.use('/v1', routesV1);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (environment === 'development') {
      Logger.error(err);
      return res.status(500).send(err.message);
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
