import { model, Schema, Document } from 'mongoose';

export const DOCUMENT_NAME = 'Match';
export const COLLECTION_NAME = 'matches';

export default interface Match extends Document {
  accounts: [string];
  games: [{
      name: string,
      id: string,
      img: string
  }];
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    accounts: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    games: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
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
