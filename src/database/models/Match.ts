import { model, Schema, Document } from 'mongoose';
import { nanoid } from 'nanoid';
import Player, { PlayerScheme } from './Player';
import Game, { GameSchema } from './Game';

export const DOCUMENT_NAME = 'Match';
export const COLLECTION_NAME = 'matches';

export default interface Match extends Document {
  players: [Player];
  games: [Game];
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    _id: {
      type: Schema.Types.String,
      default: () => nanoid(7),
    },
    players: [PlayerScheme],
    games: [GameSchema],
    createdAt: {
      type: Date,
      required: false,
    },
    updatedAt: {
      type: Date,
      required: false,
    },
  },
  {
    versionKey: false,
  },
);

export const MatchModel = model<Match>(DOCUMENT_NAME, schema, COLLECTION_NAME);
