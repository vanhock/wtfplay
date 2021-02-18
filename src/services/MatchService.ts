import { Types } from 'mongoose';
import valveRequest from '../helpers/valveRequest';
import valveStoreRequest from '../helpers/valveStoreRequest';
import { sleep } from '../helpers/helpers';
import { valveRequestThrottle } from '../config';
import NodeCache from 'node-cache';
import { BadRequestError } from '../core/ApiError';

const memoryCache = new NodeCache({
  deleteOnExpire: false,
  useClones: false,
});
const isMultiplayer = (data: any) =>
  data && data.categories && data.categories.some((c: { id: number }) => c.id === 1 || c.id === 38);

export default class MatchService {
  protected static async getGame(appid: string, playtime_forever: number): Promise<any> {
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

  public static async getCommonGames(steamIds: Types.Array<string>, req: any): Promise<any> {
    if (!steamIds || !steamIds.length) return;
    let isCanceled = false;

    req.on('close', () => {
      isCanceled = true;
      throw new BadRequestError('Request end');
    });

    interface Game {
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

    const commonGames = playerGames.slice(1).reduce((result: any, current: any) => {
      return current.filter((currentItem: Game) => {
        return result.some(({ appid }: Game) => appid === currentItem.appid);
      });
    }, playerGames[0]);
    //.filter((g: any, i: any) => i <= 5);
    console.log('commonGames', commonGames);
    /**
     * Now add game details
     */

    console.log('common games', commonGames.length);

    let commonGamesWithDetails: any[] = [];
    const cache = memoryCache.mget(commonGames.map(({ appid }: any) => appid)) || [];

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
      if (isCanceled) return;
      console.log("get game", appid);
      const game = await this.getGame(appid, playtime_forever);
      if (game && addedAppIds.indexOf(game.steam_appid) === -1) {
        commonGamesWithDetails.push(game);
        addedAppIds.push(game.steam_appid);
      }
      await sleep(valveRequestThrottle);
    }

    console.log('commonGamesWithDetails', commonGamesWithDetails);

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
    const removedDuplicates: any = commonGamesWithDetails.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.steam_appid === current.steam_appid);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    /**
     * Sort games by relevant
     */
    const getYear = (dateObject: any): number => {
      const dateString = dateObject && dateObject.date;
      const m = dateString.match(/(\d{4}|\d{4}\d{4})$/g) || [];
      return (m[0] && parseInt(m[0])) || 0;
    };
    return removedDuplicates
      .sort((a: any, b: any) => b.playtime_forever - a.playtime_forever)
      .sort((a: any, b: any) => getYear(b.release_date) - getYear(a.release_date));
  }
}
