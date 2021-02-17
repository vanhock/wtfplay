export default interface Game {
  name: string;
  steam_appid: number;
  short_description: string;
  header_image: string;
  categories: string[];
  playtime_2weeks: number;
  playtime_forever: number;
}
