import {pool} from "../config/database.js";
import {MatchModel} from "../models/match.model.js";

export class MatchRepository {
    async findAll() {
        const result = await pool.query(
            'SELECT * FROM matches'
        )
        return result.rows || undefined
    }

    async findById(id: string) {
        const result = await pool.query(
            'SELECT * FROM matches WHERE id = $1',
            [id]
        )
        return result.rows[0] || undefined
    }

    async create(match: Pick<MatchModel, 'home_team' | 'away_team' | 'odds_home' | 'odds_away' | 'odds_draw' | 'status' | 'start_time'>) {
        const result = await pool.query(
            'INSERT INTO matches (home_team, away_team, odds_home, odds_away, odds_draw, status, start_time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [match.home_team, match.away_team, match.odds_home, match.odds_away, match.odds_draw, match.status, match.start_time]
        );
        return result.rows[0];
    }

    async updateOdds(id:string, odds: {odds_home:number, odds_away:number, odds_draw:number}) {
        const result = await pool.query(
            `
                UPDATE matches SET odds_home = $1, odds_away = $2, odds_draw = $3 WHERE id = $4 RETURNING *
            `, [odds.odds_home, odds.odds_away, odds.odds_draw, id]
        )
        return result.rows[0];
    }

    async updateStatus(id: string, status: string) {
        const result = await pool.query(
            `UPDATE matches SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        )
        return result.rows[0];
    }
}