import {MatchRepository} from "../repositories/match.repository.js";
import {MatchModel} from "../models/match.model.js";
import {NotFoundError} from "../errors/AppError.js";
import {redis} from "../config/redis.js";
import {broadcast} from "../websocket/ws.manager.js";

export class MatchService {
    constructor(private matchRepo = new MatchRepository()) {}

    async getAll() {
        const cached = await redis.get('matches')
        if(cached) return JSON.parse(cached)
        const matches = await this.matchRepo.findAll();
        await redis.set('matches', JSON.stringify(matches), 'EX',60)
        return matches
    }

    async getById(id: string) {
        const match = await this.matchRepo.findById(id);
        if (!match) throw new NotFoundError('Match not found');
        return match;
    }

    async create(data: Pick<MatchModel, 'home_team' | 'away_team' | 'odds_home' | 'odds_away' | 'odds_draw' | 'status' | 'start_time'>) {
        const match = this.matchRepo.create(data);
        await redis.del('matches')
        return match;
    }

    async updateOdds(id:string, odds: {odds_home:number, odds_away:number, odds_draw:number}) {
        const match = await this.matchRepo.updateOdds(id, odds)
        if(!match) throw new NotFoundError('Match not found');
        broadcast({matchId: id, odds: { home: odds.odds_home, away: odds.odds_away, draw: odds.odds_draw }})
        await redis.del('matches')
    }
}
