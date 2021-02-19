import valveRequest from '../helpers/valveRequest';

export default class PlayerService {
  public static async getPlayersData(steamIds: string[]): Promise<any> {
    try {
      const { players } = await valveRequest.get('/ISteamUser/GetPlayerSummaries/v0002/', {
        params: { steamids: steamIds.join(",") },
      });
      if(!players) {
        return Promise.reject('Profiles not found')
      }
      return players;
    } catch (e) {
      console.error('Error with GetPlayerSummaries', e);
      return Promise.reject('Profiles not found')
    }
  }
  public static async getSteamIdsByNicknames(nicknames: string[]): Promise<string[]> {
    let steamIdsArray = [];

    for (const nickname of nicknames) {
      try {
        const { steamid } = await valveRequest.get('/ISteamUser/ResolveVanityURL/v0001/', {
          params: { vanityurl: nickname },
        });
        if(!steamid) {
          return Promise.reject(`Profile ${nickname} not found`)
        }
        steamIdsArray.push(steamid);
      } catch (e) {
        console.error(`Profile ${nickname} not found`, e);
        return Promise.reject(`Profile ${nickname} not found`)
      }
    }

    return steamIdsArray
  }
}
