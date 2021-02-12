import Joi from 'joi';
import { JoiObjectId } from 'src/helpers/validator';

export default {
    matchId: Joi.object().keys({
        id: JoiObjectId().required(),
    }),
    match: Joi.object().keys({
        accounts: Joi.array().items(Joi.string())
    }),
}