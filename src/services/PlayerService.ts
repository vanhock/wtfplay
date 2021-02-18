import valveRequest from '../helpers/valveRequest';

export default class PlayerService {
  public static async getPlayers(urls: string[]): Promise<any> {
    let steamIdsArray = [];
    const vaninityUrlsArray =
      urls.map((u: string) => u.replace('https://steamcommunity.com/id/', '').replace('/', '')) ||
      [];

    for (const vanityurl of vaninityUrlsArray) {
      try {
        const { steamid } = await valveRequest.get('/ISteamUser/ResolveVanityURL/v0001/', {
          params: { vanityurl },
        });
        steamIdsArray.push(steamid);
      } catch (e) {
        console.error('Error with ResolveVanityURL', e);
      }
    }

    console.log('steamIdsArray', steamIdsArray);

    try {
      const { players } = await valveRequest.get('/ISteamUser/GetPlayerSummaries/v0002/', {
        params: { steamids: steamIdsArray.join(',') },
      });

      return players;
    } catch (e) {
      console.error('Error with GetPlayerSummaries', e);
    }
  }
}
