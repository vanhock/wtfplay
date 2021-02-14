import express from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import { SuccessResponse } from '../../../core/ApiResponse';
import PlayerService from '../../../services/PlayerService';

const router = express.Router();

router.get(
  '/',
  validator(schema.accountUrls, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const { urls } = req.query;
    if (typeof urls !== 'string') return;
    const players = await PlayerService.getPlayers(urls.split(','));
    return new SuccessResponse('success', players).send(res);
  }),
);

export default router;
