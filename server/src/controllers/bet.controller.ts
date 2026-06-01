import {BetService} from "../services/bet.service.js";
import {Request, Response} from "express";

export class BetController {
    constructor(private betService = new BetService()) {}

    placeBet = async (req: Request, res: Response) => {
        const { match_id, amount, selection } = req.body;
        const bet = await this.betService.placeBet(req.user.userId, { match_id, amount, selection });
        res.status(201).json(bet);
    };

    getMyBets = async (req: Request, res: Response) => {
        const bets = await this.betService.getMyBets(req.user.userId);
        res.status(200).json(bets);
    };
}
