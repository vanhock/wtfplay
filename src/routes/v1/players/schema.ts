import Joi from 'joi';
import {JoiStringCommaSeparated, JoiValveUrl} from "../../../helpers/validator"
export default {
    accountUrls: Joi.object().keys({
        urls: JoiStringCommaSeparated().items(JoiValveUrl()).single().required()
    }),
}