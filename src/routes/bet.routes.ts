import {Router} from "express";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {BetController} from "../controllers/bet.controller.js";
import {kycMiddleware} from "../middleware/kyc.middleware.js";

const router: Router = Router();
const betController = new BetController();

router.use(authMiddleware, kycMiddleware);

/**
 * @swagger
 * /api/bets:
 *   post:
 *     tags: [Bets]
 *     summary: Place a bet (requires KYC verified)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [match_id, amount, selection]
 *             properties:
 *               match_id:
 *                 type: string
 *                 format: uuid
 *               amount:
 *                 type: number
 *                 example: 50
 *               selection:
 *                 type: string
 *                 enum: [home, draw, away]
 *                 example: home
 *     responses:
 *       201:
 *         description: Bet placed
 *       400:
 *         description: Insufficient balance or match not open
 *       403:
 *         description: KYC verification required
 */
router.post('/' ,betController.placeBet);

/**
 * @swagger
 * /api/bets/mine:
 *   get:
 *     tags: [Bets]
 *     summary: Get my bets (requires KYC verified)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user bets
 *       403:
 *         description: KYC verification required
 */
router.get('/mine', betController.getMyBets);

export default router;
