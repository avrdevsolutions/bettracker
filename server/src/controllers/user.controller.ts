import {AuthService} from "../services/user.service.js";
import {Request, Response} from "express";


export class UserController {
    constructor(private authService = new AuthService()) {}

    register = async (req: Request, res: Response) => {
        const { email, name, password } = req.body
        if (!email || !name || !password) {
            return res.status(400).json({ error: 'email, name, and password are required' });
        }
        const user = await this.authService.register({ email, name, password });
        res.status(201).json(user);
    };

    login = async (req: Request, res: Response) => {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }
        const result = await this.authService.login({ email, password })
        res.status(200).json(result)
    }

    getProfile = async (req: Request, res: Response) => {
        const { userId } = req.user
        const userProfile = await this.authService.findById(userId);
        res.status(200).json(userProfile)
    }
}