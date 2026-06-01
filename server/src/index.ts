import express, {Request, Response, NextFunction} from 'express'
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import {AppError} from "./errors/AppError.js";
import betRoutes from "./routes/bet.routes.js";
import matchRoutes from "./routes/match.routes.js";
import kycRoutes from "./routes/kyc.routes.js";
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from "./config/swagger.js";
import * as http from "node:http";
import {WebSocketServer} from "ws";
import {setupWebSocket} from "./websocket/ws.manager.js";
import {loggingMiddleware} from "./middleware/logging.middleware.js";
import healthRoutes from "./routes/health.routes.js";

const app = express()
app.use(express.json())

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(loggingMiddleware)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/bets', betRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/kyc', kycRoutes)


// error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    // Unknown error — log it, send generic 500
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

// const server = app.listen(3000, () => console.log('Bettracker API on port 3000'));
const server = http.createServer(app)
const wss = new WebSocketServer({ server })
server.listen(3000)
setupWebSocket(wss)
process.on('SIGTERM', () => server.close(() => process.exit(0)));