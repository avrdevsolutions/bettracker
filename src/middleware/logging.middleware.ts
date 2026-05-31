import {NextFunction, Response, Request} from "express";
import {logger} from "../utils/logger.js";

export const loggingMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const startTime = Date.now()
    const traceId = crypto.randomUUID();
    req.traceId = traceId
    res.on('finish', () => {
        const duration = Date.now() - startTime
        const logData = { traceId, method: req.method, path: req.path, statusCode: res.statusCode, duration, userId: req.user?.userId }

        if (res.statusCode >= 500) {
            logger.error(logData)
        } else if (res.statusCode >= 400) {
            logger.warn(logData)
        } else {
            logger.info(logData)
        }
    })
    next()
}