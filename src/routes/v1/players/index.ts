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
    console.log("Got accounts data", req.body);
    let ids = steamIds;
    let errors = [];
    if (nicknames) {
        try {
            const steamIdsByNicknames = await PlayerService.getSteamIdsByNicknames(nicknames);
            ids = [...ids.filter((id:string) => steamIdsByNicknames.indexOf(id) === -1), ...steamIdsByNicknames];
        } catch (e) {
            if (e) errors.push(e);
        }
    }
    const players = await PlayerService.getPlayersData(ids);
    return new SuccessResponse('success', { players, errors }).send(res);
  }),
);

export default router;
