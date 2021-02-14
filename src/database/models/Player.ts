import { Schema, Document } from 'mongoose';

export const DOCUMENT_NAME = 'Player';
export const COLLECTION_NAME = 'players';

export default interface Player extends Document {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
}

export const PlayerScheme = new Schema(
  {
    steamid: {
      type: Schema.Types.String,
    },
    personaname: {
      type: Schema.Types.String,
    },
    profileurl: {
      type: Schema.Types.String,
    },
    avatar: {
      type: Schema.Types.String,
    },
    avatarmedium: {
      type: Schema.Types.String,
    },
  },
  {
    versionKey: false,
  },
);

