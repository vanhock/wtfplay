import valveRequest from '../helpers/valveRequest';

export default class PlayerService {
  public static async getPlayers(urls: string[]): Promise<any> {
    let steamIdsArray = [];
    const vaninityUrlsArray =
      urls.map((u: string) => u.replace('https://steamcommunity.com/id/', '')) || [];

    for (const vanityurl of vaninityUrlsArray) {
      const { steamid } = await valveRequest.get('/ISteamUser/ResolveVanityURL/v0001/', {
        params: { vanityurl },
      });
      steamIdsArray.push(steamid);
    }

    const { players } = await valveRequest.get('/ISteamUser/GetPlayerSummaries/v0002/', {
      params: { steamids: steamIdsArray.join(',') },
    });

    return players;
  }
}
