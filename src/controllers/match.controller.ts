import {MatchService} from "../services/match.service.js";
import {Request, Response} from "express";

export class MatchController {
    constructor(private matchService = new MatchService()) {}

    getAll = async (req: Request, res: Response) => {
        const matches = await this.matchService.getAll();
        res.status(200).json(matches);
    };

    getById = async (req: Request, res: Response) => {
        const match = await this.matchService.getById(req.params.id as string);
        res.status(200).json(match);
    };

    create = async (req: Request, res: Response) => {
        const { home_team, away_team, odds_home, odds_away, odds_draw, status, start_time } = req.body;
        const match = await this.matchService.create({ home_team, away_team, odds_home, odds_away, odds_draw, status, start_time });
        res.status(201).json(match);
    };

    updateOdds = async(req:Request, res:Response) => {
        const { odds_home, odds_away, odds_draw } = req.body
        const match = await this.matchService.updateOdds(req.params.id as string, { odds_home, odds_away, odds_draw })
        res.status(200).json(match)
    }
}
