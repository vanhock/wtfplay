import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import Logger from '../core/Logger';
import { BadRequestError } from '../core/ApiError';

export enum ValidationSource {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
}

export const JoiValveUrl = () =>
  Joi.string().custom((value: string, helpers) => {
    const decodedValue = decodeURIComponent(value);
    if (!decodedValue.includes('https://steamcommunity.com/id/'))
      return helpers.error('any.invalid');
    return decodedValue;
  }, 'Url Endpoint Validation');

export const JoiStringCommaSeparated = () =>
  Joi.array().custom((value: string) => {
    return value.split ? value.split(',') : value;
  }, 'Comma separated parameters validation');

export default (schema: Joi.ObjectSchema, source: ValidationSource = ValidationSource.BODY) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error } = schema.validate(req[source]);

    if (!error) return next();

    const { details } = error;
    const message = details.map((i) => i.message.replace(/['"]+/g, '')).join(',');
    Logger.error(message);

    next(new BadRequestError(message));
  } catch (error) {
    next(error);
  }
};
