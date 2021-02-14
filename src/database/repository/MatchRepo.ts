import { Types } from 'mongoose';
import Match, { MatchModel } from '../models/Match';

export default class MatchRepo {
  public static findById(id: Types.ObjectId): Promise<Match | null> {
    return MatchModel.findById(id).populate('games').populate('players').lean<Match>().exec();
  }

  public static async create(match: Match): Promise<Match> {
    const now = new Date();
    match.createdAt = match.updatedAt = now;
    const newMatch = new MatchModel(match);
    return await newMatch.save();
  }
}
