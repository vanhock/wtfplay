import express from 'express';
import validator, { ValidationSource } from 'src/helpers/validator';
import { Types } from 'mongoose';
import schema from './schema';
import asyncHandler from 'src/helpers/asyncHandler';
import MatchRepo from 'src/database/repository/MatchRepo';
import { BadRequestError } from 'src/core/ApiError';
import { SuccessResponse } from 'src/core/ApiResponse';
import MatchService from 'src/services/MatchService';

const router = express.Router();

router.get(
  'get/:id',
  validator(schema.matchId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const match = await MatchRepo.findById(new Types.ObjectId(req.params.id));
    if (!match) throw new BadRequestError('User not registered');
    return new SuccessResponse('success', match).send(res);
  }),
);

router.post(
  'create',
  validator(schema.match),
  asyncHandler(async (req, res) => {
    const accounts = await MatchService.getCommonGames(req.body.accounts);
    return new SuccessResponse('success', accounts).send(res);
  }),
);

export default router;
