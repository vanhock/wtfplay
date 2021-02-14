import Joi from 'joi';
import {JoiObjectId, JoiStringCommaSeparated, JoiValveUrl} from '../../../helpers/validator';

export default {
    matchId: Joi.object().keys({
        id: JoiObjectId().required(),
    }),
    match: Joi.object().keys({
        urls: JoiStringCommaSeparated().items(JoiValveUrl()).single().required()
    }),
}