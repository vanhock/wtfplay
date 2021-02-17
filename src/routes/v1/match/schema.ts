import Joi from 'joi';
import { JoiStringCommaSeparated, JoiValveUrl } from '../../../helpers/validator';

export default {
  matchId: Joi.object().keys({
    id: Joi.string().length(7).required(),
  }),
  match: Joi.object().keys({
    urls: JoiStringCommaSeparated().items(JoiValveUrl()).single().required(),
  }),
};
