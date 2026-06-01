import {Request, Response, NextFunction} from "express";
import {pool} from "../config/database.js";
import {AppError} from "../errors/AppError.js";

export const kycMiddleware = async (req: Request, res:Response, next:NextFunction)=> {
    const user = req.user

    const result = await pool.query(
        `
        SELECT kyc_status FROM users WHERE id = $1
        `, [user.userId]
    )

    if(result.rows[0].kyc_status !== 'verified') throw new AppError(403, 'KYC verification required')
    next()
}