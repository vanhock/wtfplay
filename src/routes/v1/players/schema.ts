import Joi from 'joi';
import { JoiStringCommaSeparated, JoiValveUrl } from '../../../helpers/validator';
export default {
  accountUrls: Joi.object().keys({
    nicknames: JoiStringCommaSeparated().required(),
    steamIds: JoiStringCommaSeparated().required(),
  }),
};
