import Joi from 'joi';
import { JoiObjectId } from 'src/helpers/validator';

export default {
    accountIds: Joi.object().keys({
        ids: Joi.array().items(Joi.string())
    }),
}