import {Router} from "express";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {MatchController} from "../controllers/match.controller.js";

const router: Router = Router();
const matchController = new MatchController();

/**
 * @swagger
 * /api/matches:
 *   get:
 *     tags: [Matches]
 *     summary: Get all matches (cached 60s)
 *     responses:
 *       200:
 *         description: List of matches
 */
router.get('/', matchController.getAll);

/**
 * @swagger
 * /api/matches/{id}:
 *   get:
 *     tags: [Matches]
 *     summary: Get match by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Match details
 *       404:
 *         description: Match not found
 */
router.get('/:id', matchController.getById);

/**
 * @swagger
 * /api/matches/{id}/odds:
 *   patch:
 *     tags: [Matches]
 *     summary: Update match odds (broadcasts via WebSocket)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [odds_home, odds_draw, odds_away]
 *             properties:
 *               odds_home:
 *                 type: number
 *                 example: 2.5
 *               odds_draw:
 *                 type: number
 *                 example: 3.1
 *               odds_away:
 *                 type: number
 *                 example: 2.8
 *     responses:
 *       200:
 *         description: Updated match with new odds
 *       404:
 *         description: Match not found
 */
router.patch('/:id/odds', authMiddleware ,matchController.updateOdds);

/**
 * @swagger
 * /api/matches:
 *   post:
 *     tags: [Matches]
 *     summary: Create a new match
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [home_team, away_team, odds_home, odds_draw, odds_away, status, start_time]
 *             properties:
 *               home_team:
 *                 type: string
 *                 example: Arsenal
 *               away_team:
 *                 type: string
 *                 example: Chelsea
 *               odds_home:
 *                 type: number
 *                 example: 2.1
 *               odds_draw:
 *                 type: number
 *                 example: 3.0
 *               odds_away:
 *                 type: number
 *                 example: 3.5
 *               status:
 *                 type: string
 *                 enum: [upcoming, live, finished, cancelled]
 *                 example: upcoming
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-01T15:00:00Z"
 *     responses:
 *       201:
 *         description: Match created
 */
router.post('/', authMiddleware, matchController.create);

export default router;
