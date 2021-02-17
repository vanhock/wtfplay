import Match from '../models/Match';
import NodeCache from 'node-cache';
import { nanoid } from 'nanoid';

const memoryCache = new NodeCache({
  deleteOnExpire: false,
});

export default class MatchRepo {
  public static findById(id: any): any {
    return memoryCache.get(id);
  }

  public static create(match: Match): Match {
    const newMatch = {
      id: nanoid(7),
      urls: match.urls,
      createdAt: new Date(),
    };
    memoryCache.set(newMatch.id, newMatch);
    return newMatch;
  }
}
