import Joi from 'joi';
import { JoiStringCommaSeparated } from '../../../helpers/validator';

export default {
  matchId: Joi.object().keys({
    id: Joi.string().length(7).required(),
  }),
  match: Joi.object().keys({
    steamIds: JoiStringCommaSeparated().items().single().required(),
  }),
};
