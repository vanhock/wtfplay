import express from 'express';
import validator, { ValidationSource } from '../../../helpers/validator';
import { Types } from 'mongoose';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import MatchRepo from '../../../database/repository/MatchRepo';
import { BadRequestError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import MatchService from '../../../services/MatchService';
import Match from '../../../database/models/Match';
import PlayerService from '../../../services/PlayerService';
import Player from '../../../database/models/Player';

const router = express.Router();

router.get(
  '/get/:id',
  validator(schema.matchId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const match = await MatchRepo.findById(new Types.ObjectId(req.params.id));
    if (!match) throw new BadRequestError('Has no record with specified id');
    return new SuccessResponse('success', match).send(res);
  }),
);

router.post(
  '/create',
  validator(schema.match),
  asyncHandler(async (req, res) => {
      console.log("req.body.urls", req.body.urls);
    const players = await PlayerService.getPlayers(req.body.urls);
    if (!players) throw new BadRequestError('Has no players found');
    const games = await MatchService.getCommonGames(
      players.map((player: Player) => player.steamid),
    );
    const createdMatch = await MatchRepo.create({
      players,
      games,
    } as Match);

    return new SuccessResponse('success', createdMatch).send(res);
  }),
);

export default router;
