import NodeCache from 'node-cache';
import Bottleneck from 'bottleneck';
import { nanoid } from 'nanoid';
import { valveRequestThrottle, cacheConfig, limiterConfig, matchResultLimit } from '../config';
import valveRequest from '../helpers/valveRequest';
import valveStoreRequest from '../helpers/valveStoreRequest';
import { sleep, getYear, removeDuplicates, isMultiplayer } from '../helpers/helpers';
import { BadRequestError, NotFoundError } from '../core/ApiError';

import Match from '../models/Match';
import Game from '../models/Game';
import Player from '../models/Player';
import PlayerService from '../services/PlayerService';

const memoryCache = new NodeCache(cacheConfig);
const limiter = new Bottleneck(limiterConfig);

export default class MatchService {
  protected static async getGame(
    appid: string,
    playtime_forever: number,
  ): Promise<Game | undefined> {
    let game;
    try {
      const d: any = await valveStoreRequest.get('/appdetails/', {
        params: { appids: appid },
      });
      const data = d && d[`${appid}`].data;
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
    } catch (e) {
      console.log('Catch block', e);
    }
  }

  public static saveMatchToCache(urls: any): Match {
    const newMatch = {
      id: nanoid(7),
      urls: urls,
      createdAt: new Date(),
    };
    memoryCache.set(newMatch.id, newMatch);
    return newMatch;
  }

  protected static async getCommonGames(steamIds: any, req: any): Promise<any> {
    if (!steamIds || !steamIds.length) return;
    let isCanceled = false;

    req.on('close', () => {
      isCanceled = true;
      throw new BadRequestError('Request end');
    });

    interface GameIds {
      appid: number;
      playtime_forever: number;
    }

    let playerGames: any = [];

    for (const steamid of steamIds) {
      try {
        const { games } = await valveRequest.get('/IPlayerService/GetOwnedGames/v0001/', {
          params: { steamid },
        });
        playerGames = [
          ...playerGames,
          [
            ...games.map((g: any) => ({
              appid: g.appid,
              playtime_forever: g.playtime_forever,
            })),
          ],
        ];
      } catch (e) {
        console.log('Catch block', e);
      }
    }

    /**
     * Let's get common games of each player
     **/

    const commonGames = playerGames
      .slice(1)
      .reduce((result: any, current: any) => {
        return current.filter((currentItem: GameIds) => {
          return result.some(({ appid }: GameIds) => appid === currentItem.appid);
        });
      }, playerGames[0])
      .filter((g: any, i: any) => (matchResultLimit ? i <= matchResultLimit : true));
    console.log('commonGames', commonGames);
    /**
     * Now add game details
     */

    console.log('common games', commonGames.length);

    let commonGamesWithDetails: any[] = [];
    const cache = memoryCache.mget(commonGames.map(({ appid }: GameIds) => appid)) || [];

    /** Get games from cache **/
    const cachedGames = Object.values(cache);
    console.log('Has cached', cachedGames.length);

    /** Remove cached games from found common games **/

    const targetGames = cachedGames.length
      ? commonGames.filter(
          (game: any) =>
            !cachedGames.some(({ steam_appid }) => `${game.appid}` === `${steam_appid}`),
        )
      : commonGames;

    console.log('targetGames', targetGames.length);

    const addedAppIds: any[] = [];

    /** Loop only games which not in a cache **/
    for (const { appid, playtime_forever = 0 } of targetGames) {
      if (isCanceled) return; // Stop loop on canceled request

      const game = await this.getGame(appid, playtime_forever);
      if (game && addedAppIds.indexOf(game.steam_appid) === -1) {
        commonGamesWithDetails.push(game);
        addedAppIds.push(game.steam_appid);
      }
      await sleep(valveRequestThrottle);
    }

    commonGamesWithDetails = [
      ...commonGamesWithDetails,
      ...cachedGames.filter((g) => isMultiplayer(g)),
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
    return removedDuplicates
      .sort((a: any, b: any) => b.playtime_forever - a.playtime_forever)
      .sort((a: any, b: any) => getYear(b.release_date) - getYear(a.release_date));
  }

  public static getMatchFromCacheById(id: any): any {
    return memoryCache.get(id);
  }

  public static async getMatchData(urls: any, req: any): Promise<any> {
    return await limiter.schedule(async () => {
      console.log('Job starts!');
      const players = await PlayerService.getPlayers(urls);
      if (!players) throw new NotFoundError('Has no players found');

      const games = await MatchService.getCommonGames(
        players.map((player: Player) => player.steamid),
        req,
      );
      console.log('Job end!');
      return { games, players };
    });
  }
}
