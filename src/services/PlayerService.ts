import valveRequest from '../helpers/valveRequest';
import { GET_PLAYER_ERROR, GET_PLAYER_SUMMARIES_ERROR } from '../helpers/errorsContants';

export default class PlayerService {
  public static async getPlayersData(steamIds: string[]): Promise<any> {
    try {
      const { players } = await valveRequest.get('/ISteamUser/GetPlayerSummaries/v0002/', {
        params: { steamids: steamIds.join(',') },
      });
      if (!players) {
        return Promise.reject({
          message: GET_PLAYER_SUMMARIES_ERROR,
          error: null,
          data: null,
        });
      }
      return players;
    } catch (e) {
      console.error('Error with GetPlayerSummaries', e);
      return Promise.reject({
        message: GET_PLAYER_SUMMARIES_ERROR,
        error: e,
        data: null,
      });
    }
  }

  public static async getSteamIdsByNicknames(nicknames: string[]): Promise<any> {
    let steamIdsArray = [];
    let errors = [];
    for (const nickname of nicknames) {
      try {
        const { steamid } = await valveRequest.get('/ISteamUser/ResolveVanityURL/v0001/', {
          params: { vanityurl: nickname },
        });
        if (!steamid) {
          errors.push({
            message: GET_PLAYER_ERROR(nickname),
            error: null,
            data: { nickname },
          });
        } else {
          steamIdsArray.push(steamid);
        }
      } catch (e) {
        console.error(`Profile ${nickname} not found`, e);
        errors.push({
          message: GET_PLAYER_ERROR(nickname),
          error: null,
          data: { nickname },
        });
        return { errors };
      }
    }
    return { steamIdsArray, errors };
  }

  public static async getPlayers(nicknames: string[], steamIds: string[]): Promise<any> {
    let ids = steamIds;
    let allErrors: any = [];
    let players = [];
    if (nicknames) {
      try {
        const { steamIdsArray, errors } = await this.getSteamIdsByNicknames(nicknames);
        ids = [...ids.filter((id: string) => steamIdsArray.indexOf(id) === -1), ...steamIdsArray];
        if (errors) allErrors = [...allErrors, ...errors];
      } catch (e) {
        if (e) allErrors.push(e);
      }
    }
    try {
      players = await this.getPlayersData(ids);
    } catch (e) {
      if (e) allErrors.push(e);
    }

    players.forEach((item: any) => {
      const { communityvisibilitystate, personaname } = item;
      if (communityvisibilitystate === 1) {
        allErrors.push(`${personaname} has a private profile, we have no access to his games`);
      }
    });
    return { players, errors: allErrors };
  }
}
