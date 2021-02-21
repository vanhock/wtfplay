import NodeCache from 'node-cache';
import Bottleneck from 'bottleneck';
import { nanoid } from 'nanoid';
import { valveRequestThrottle, cacheConfig, limiterConfig, matchResultLimit } from '../config';
import valveRequest from '../helpers/valveRequest';
import valveStoreRequest from '../helpers/valveStoreRequest';
import { sleep, getYear, removeDuplicates, isMultiplayer } from '../helpers/helpers';
import {GAMES_NOT_FOUND, GET_OWN_GAMES_ERROR} from '../helpers/errorsContants';
import { BadRequestError, NotFoundError } from '../core/ApiError';

import Match from '../models/Match';
import Game from '../models/Game';
import PlayerService from '../services/PlayerService';

const memoryCache = new NodeCache(cacheConfig);
const limiter = new Bottleneck(limiterConfig);

export default class MatchService {
  protected static async getGame(
    appid: string,
    playtime_forever: number,
  ): Promise<Game | undefined> {
    let game;
    let response;
    try {
      response = await valveStoreRequest.get('/appdetails/', {
        params: { appids: appid },
      });
    } catch (e) {
      return Promise.reject({
        message: 'Has ',
        error: null,
        data: { appid },
      });
    }
    const data = response && response[`${appid}`].data;
    if (!data) {
      /** Store failed response in cache **/
      memoryCache.set(appid, { steam_appid: appid });
      return;
    }
    const dataForSave = {
      name: data.name,
      steam_appid: data.steam_appid,
      short_description: data.short_description,
      header_image: data.header_image,
      categories: data.categories,
      playtime_forever,
      release_date: data.release_date,
    };
    /** Store it in cache **/
    memoryCache.set(appid, dataForSave);
    /** Check this game support multiplayer **/
    if (isMultiplayer(data)) {
      game = dataForSave;
    }
    return game;
  }

  protected static async getCommonGames(steamIds: any, req: any): Promise<any> {
    if (!steamIds || !steamIds.length) return;
    let isCanceled = false;
    let errors = [];
    req.on('close', () => {
      isCanceled = true;
      throw new BadRequestError('Request end');
    });

    interface GameIds {
      appid: number;
      playtime_forever: number;
    }

    let playersGames: any = [];

    for (const steamid of steamIds) {
      let ownedGames = [];
      try {
        const response = await valveRequest.get('/IPlayerService/GetOwnedGames/v0001/', {
          params: { steamid },
        });
        if (!response || !response.games) {
          errors.push({
            message: GET_OWN_GAMES_ERROR,
            error: null,
            data: { steamId: steamid },
          });
        }
        const { games } = response;
        ownedGames = games || [];
      } catch (e) {
        errors.push({
          message: GET_OWN_GAMES_ERROR,
          error: null,
          data: { steamId: steamid },
        });
      }
      if (ownedGames && ownedGames.length) {
        playersGames = [
          ...playersGames,
          [
            ...ownedGames.map((g: any) => ({
              appid: g.appid,
              playtime_forever: g.playtime_forever,
            })),
          ],
        ];
      }
    }

    console.log(`Got ${playersGames.length} players with games`);
    if (errors && errors.length) console.log('playersGames errors: ', errors);
    if (playersGames.length <= 1) {
      return { games: [], errors };
    }

    /**
     * Let's get common games of each player
     **/
    let commonGames =
      playersGames.slice(1).reduce((result: any, current: any) => {
        return current.filter((currentItem: GameIds) => {
          return result.some(({ appid }: GameIds) => appid === currentItem.appid);
        });
      }, playersGames[0]) || [];

    commonGames = commonGames.filter((g: any, i: any) =>
      matchResultLimit ? i <= matchResultLimit : true,
    );

    console.log('common games', commonGames.length);

    /**
     * Now get game details
     */
    let commonGamesWithDetails: any[] = [];
    const cache = memoryCache.mget(commonGames.map(({ appid }: GameIds) => appid)) || [];

    /** Get games from a cache **/
    const cachedGames = Object.values(cache);
    const cachedMultiplayerGames = cachedGames.filter((g) => isMultiplayer(g));

    console.log('Has cached', cachedMultiplayerGames.length);

    /** Remove cached games from found common games **/
    const targetGames = cachedGames.length
      ? commonGames.filter(
          (game: any) =>
            !cachedGames.some(({ steam_appid }) => `${game.appid}` === `${steam_appid}`),
        )
      : commonGames;

    const addedAppIds: any[] = [];

    /** Loop only games which not in a cache **/
    for (const { appid, playtime_forever = 0 } of targetGames) {
      if (isCanceled) return; // Stop loop on canceled request
      let game;

      try {
        game = await this.getGame(appid, playtime_forever);
      } catch (e) {
        console.error(e); // just a console message, we continue collecting games data
      }

      if (game && addedAppIds.indexOf(game.steam_appid) === -1) {
        commonGamesWithDetails.push(game);
        addedAppIds.push(game.steam_appid);
      }
      await sleep(valveRequestThrottle);
    }

    commonGamesWithDetails = [
      ...cachedMultiplayerGames,
      ...commonGamesWithDetails,
    ];

    /**
     * Remove duplicates from cached results.
     * Steam has duplicated games on both appid`s,
     * for example:
     * https://store.steampowered.com/api/appdetails/?appids=100
     * https://store.steampowered.com/api/appdetails/?appids=80
     **/

    const removedDuplicates = removeDuplicates(commonGamesWithDetails);

    /**
     * Sort games by relevant
     */
    const games = removedDuplicates
      .sort((a: any, b: any) => a.playtime_forever - b.playtime_forever)
      .sort((a: any, b: any) => getYear(a.release_date) - getYear(b.release_date));
    return { games, errors };
  }

  protected static filterErrors(errors: any, players: any): any {
    return errors.map((error: any) => {
      if (error && error.data && error.data.steamId) {
        const thatPlayer = players.find(({ steamid }: any) => steamid === error.data.steamId);
        return {
          ...error,
          message: `${error.message} ${thatPlayer ? thatPlayer.personaname : ''}`,
        };
      } else {
        return error;
      }
    });
  }

  public static saveMatchToCache(steamIds: any): Match {
    const newMatch = {
      id: nanoid(7),
      steamIds: steamIds,
      createdAt: new Date(),
    };
    memoryCache.set(newMatch.id, newMatch);
    return newMatch;
  }

  public static getMatchFromCacheById(id: any): any {
    return memoryCache.get(id);
  }

  public static async getMatchData(steamIds: string[], req: any): Promise<any> {
    /** Applied limiter, which runs requests in the queue **/
    return await limiter.schedule(async () => {
      console.log('Job starts!');
      const players = await PlayerService.getPlayersData(steamIds);
      if (!players) throw new NotFoundError('Has no players found');

      const response = await MatchService.getCommonGames(steamIds, req);
      if (!response) throw new NotFoundError(GAMES_NOT_FOUND);
      const { games, errors } = response;
      console.log('Job end!');
      return { games, players, errors: this.filterErrors(errors, players) };
    });
  }
}
