import { Types } from 'mongoose';
import Match, { MatchModel } from 'src/database/models/Match';

export default class MatchRepo {
  public static findById(id: Types.ObjectId): Promise<Match | null> {
    return MatchModel.findOne({ _id: id, status: true }).lean<Match>().exec();
  }

  public static async create(match: Match): Promise<{ match: object }> {
    const now = new Date();
    match.createdAt = match.updatedAt = now;
    const newMatch = await MatchModel.create(match);
    return { match: newMatch.toObject() };
  }
}
