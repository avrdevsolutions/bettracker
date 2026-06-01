import {BetRepository} from "../repositories/bet.repository.js";
import {pool} from "../config/database.js";
import {NotFoundError, AppError} from "../errors/AppError.js";

export class BetService {
    constructor(private betRepo = new BetRepository()) {}

    async getMyBets(userId: string) {
        return this.betRepo.findByUserId(userId);
    }

    async placeBet(userId: string, data: { match_id: string; amount: number; selection: 'home' | 'draw' | 'away' }) {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')
            const match = await client.query(`SELECT * FROM matches WHERE id = $1`, [data.match_id])
            if(!match.rows[0]) throw new NotFoundError('Match not found')
            if(match.rows[0].status !== 'upcoming') throw new AppError(400, 'Match is not open for betting')
            const userBalance = await client.query(`SELECT users.balance FROM users WHERE users.id = $1`, [userId])
            if(userBalance.rows[0].balance < data.amount) throw new AppError(400, 'Insufficient balance')
            await client.query(`UPDATE users SET balance = balance - $1 WHERE id = $2`, [data.amount, userId])
            const odds = match.rows[0][`odds_${data.selection}`]

            const bet = await client.query(`INSERT INTO bets (user_id, match_id, amount, odds_at_placement, selection) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
                [userId, data.match_id, data.amount, odds, data.selection])
            await client.query('COMMIT')
            return bet.rows[0];

        } catch (error) {
            await client.query('ROLLBACK')
            throw error;
        } finally {
            client.release()
        }
    }
}
