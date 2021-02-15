import express from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import { SuccessResponse } from '../../../core/ApiResponse';
import PlayerService from '../../../services/PlayerService';

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
