import express from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import validator from '../../../helpers/validator';
import { SuccessResponse } from '../../../core/ApiResponse';
import PlayerService from '../../../services/PlayerService';
import schema from './schema';

const router = express.Router();

router.post(
  '/',
  validator(schema.accountUrls),
  asyncHandler(async (req, res) => {
    const { steamIds, nicknames } = req.body;
    const { players, errors } = await PlayerService.getPlayers(nicknames, steamIds);
    return new SuccessResponse('success', { players, errors }).send(res);
  }),
);

export default router;
