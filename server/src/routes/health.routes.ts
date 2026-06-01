import {Router, Request, Response} from "express";
import {pool} from "../config/database.js";
import {redis} from "../config/redis.js";

const router: Router = Router();

router.get('/live', (req:Request, res:Response) => res.status(200).json({status: 'ok'}))
router.get('/ready', async (req:Request, res:Response) => {

    try {
       await Promise.all([pool.query(`SELECT 1`), redis.ping()])
        return res.status(200).json({status: 'ok'})
    } catch (err) {
        return res.status(503).json({status: 'error'})
    }



})

export default router