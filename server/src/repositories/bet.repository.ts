import {pool} from "../config/database.js";
import {BetModel} from "../models/bet.model.js";

export class BetRepository {
    async findAll() {
        const result = await pool.query(
            'SELECT * FROM bets'
        )
        return result.rows || undefined
    }

    async findById(id: string) {
        const result = await pool.query(
            'SELECT * FROM bets WHERE id = $1',
            [id]
        )
        return result.rows[0] || undefined
    }

    async findByUserId(user_id: string) {
        const result = await pool.query(
            `
            SELECT users.name, bets.amount 
            FROM users 
                INNER JOIN  bets 
                    ON users.id = bets.user_id 
            WHERE bets.user_id = $1`,
            [user_id]
        )
        return result.rows || undefined
    }

    async create(match: Pick<BetModel, 'amount' | 'match_id' | 'odds_at_placement' | 'selection' | 'user_id'>) {
        const result = await pool.query(
            'INSERT INTO bets (amount, match_id, odds_at_placement, selection, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [match.amount, match.match_id, match.odds_at_placement, match.selection, match.user_id]
        );
        return result.rows[0];
    }
}