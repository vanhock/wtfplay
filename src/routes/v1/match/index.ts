import express from 'express';
import validator, { ValidationSource } from '../../../helpers/validator';
import { Types } from 'mongoose';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import MatchRepo from '../../../database/repository/MatchRepo';
import { NotFoundError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import MatchService from '../../../services/MatchService';
import Match from '../../../database/models/Match';
import PlayerService from '../../../services/PlayerService';
import Player from '../../../database/models/Player';
import Bottleneck from 'bottleneck';

const router = express.Router();

const limiter = new Bottleneck({
  maxConcurrent: 1,
});

const getMatchData = async (urls: string[]) => {
  return await limiter.schedule(async () => {
    console.log('Job starts!');
    const players = await PlayerService.getPlayers(urls);
    if (!players) throw new NotFoundError('Has no players found');
    const games = await MatchService.getCommonGames(
      players.map((player: Player) => player.steamid),
    );
    console.log('Job end!');
    return { games, players };
  });
};

router.get(
  '/get',
  validator(schema.matchId, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const match = await MatchRepo.findById(req.query.id);
    if (!match) throw new NotFoundError('Has no record with specified id');
    const { urls } = match;
    const { players, games } = await getMatchData(urls);
    return new SuccessResponse('success', { players, games }).send(res);
  }),
);

router.post(
  '/create',
  validator(schema.match),
  asyncHandler(async (req, res) => {
    const { players, games } = await getMatchData(req.body.urls);

    /** Store urls in-memory **/
    const { id } = await MatchRepo.create({
      urls: req.body.urls,
    } as Match);

    console.log('Request finally end!');

    return new SuccessResponse('success', { games, id }).send(res);
  }),
);

export default router;
