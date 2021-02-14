import { Schema, Document } from 'mongoose';

export const DOCUMENT_NAME = 'Game';
export const COLLECTION_NAME = 'games';

export default interface Game extends Document {
  name: string;
  steam_appid: number;
  short_description: string;
  header_image: string;
  categories: string[];
  playtime_2weeks: number;
  playtime_forever: number;
}

export const GameSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
    },
    steam_appid: {
      type: Schema.Types.Number,
    },
    short_description: {
      type: Schema.Types.String,
    },
    header_image: {
      type: Schema.Types.String,
    },
    categories: {
      type: Schema.Types.Array,
    },
    playtime_2weeks: {
      type: Schema.Types.Number,
    },
    playtime_forever: {
      type: Schema.Types.Number,
    },
  },
  {
    versionKey: false,
  },
);
