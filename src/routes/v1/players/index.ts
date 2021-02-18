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
    const { urls } = req.body;
    const players = await PlayerService.getPlayers(urls);
    return new SuccessResponse('success', players).send(res);
  }),
);

export default router;
