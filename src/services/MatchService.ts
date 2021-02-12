import { Types } from 'mongoose';
import valveRequest from 'src/helpers/valveRequest';

export default class MatchService {
  protected static async getAccountGames(steamid: number): Promise<any> {
    return await valveRequest.get('ISteamUser/ResolveVanityURL/v0001/', {
      params: { steamid },
    });
  }
  public static async getCommonGames(steamIds: Types.Array<string>): Promise<any> {
    if (!steamIds || !steamIds.length) return;
    const accountGames = steamIds.map(async (steamid:string) => ({
      steamid: await this.getAccountGames(parseInt(steamid))
    }));
  }
}
