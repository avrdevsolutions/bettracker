import { Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken";
import {config} from "../config/index.js";
import {JwtPayload} from "../models/user.model.js";

export const authMiddleware = (req:Request, res: Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if(!token) return res.status(401).json({message: 'No Token'})

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded as JwtPayload
        next()
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError) return res.status(401).json({message: 'Token Expired'})
        if(error instanceof jwt.JsonWebTokenError) return res.status(401).json({message: 'Token Error'})
    }
}