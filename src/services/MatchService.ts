import { Types } from 'mongoose';
import valveRequest from '../helpers/valveRequest';
import valveStoreRequest from '../helpers/valveStoreRequest';
import { sleep } from '../helpers/helpers';
import { valveRequestTimeout } from '../config';

export default class MatchService {
  public static async getCommonGames(steamIds: Types.Array<string>): Promise<any> {
    if (!steamIds || !steamIds.length) return;

    interface Game {
      appid: number;
      playtime_forever: number;
    }

    let accountGames: any[] = [];

    for (const steamid of steamIds) {
      const { games } = await valveRequest.get('/IPlayerService/GetOwnedGames/v0001/', {
        params: { steamid },
      });
      accountGames = [...accountGames, [...games]];
      await sleep(valveRequestTimeout);
    }

    /**
     * Let's get common games of each player
     **/

    const commonGames = accountGames
      .slice(1)
      .reduce((result, current) => {
        return current.filter((currentItem: Game) => {
          return result.some(({ appid }: Game) => appid === currentItem.appid);
        });
      }, accountGames[0])
      .filter((item: Game) => item.playtime_forever);

    /**
     * Now add game details
     */

    let commonGamesWithDetails: any[] = [];

    for (const { appid, playtime_forever = 0 } of commonGames) {
      const d: object = await valveStoreRequest.get('/appdetails/', {
        params: { appids: appid },
      });
      const data = Object.values(d)[0].data;
      commonGamesWithDetails = [
        ...commonGamesWithDetails,
        {
          name: data.name,
          steam_appid: data.steam_appid,
          short_description: data.short_description,
          header_image: data.header_image,
          categories: data.categories,
          playtime_forever
        },
      ];
      await sleep(valveRequestTimeout);
    }

    /**
     * Filter common games by multiplayer categories
     */

    return commonGamesWithDetails.filter(
      (i) =>
        i && i.categories && i.categories.some((c: { id: number }) => c.id === 1 || c.id === 38),
    );
  }
}
