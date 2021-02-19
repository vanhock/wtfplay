import express from 'express';
import { NotFoundError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import validator, { ValidationSource } from '../../../helpers/validator';
import asyncHandler from '../../../helpers/asyncHandler';
import MatchService from '../../../services/MatchService';
import schema from './schema';
import Player from "../../../models/Player";

const router = express.Router();
router.get(
  '/get',
  validator(schema.matchId, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const match = MatchService.getMatchFromCacheById(req.query.id);
    if (!match) throw new NotFoundError('Has no record with specified id');
    const { steamIds } = match;
    console.log('steamIds', steamIds);
    const { players, games } = await MatchService.getMatchData(steamIds, req);
    return new SuccessResponse('success', { players, games }).send(res);
  }),
);

router.post(
  '/create',
  validator(schema.match),
  asyncHandler(async (req, res) => {
    const { games, players } = await MatchService.getMatchData(req.body.steamIds, req);

    /** Store urls in-memory **/
    const { id } = MatchService.saveMatchToCache(players.map((p: Player) => p.steamid));
    console.log('Request was finally end!');
    return new SuccessResponse('success', { games, id }).send(res);
  }),
);

export default router;
