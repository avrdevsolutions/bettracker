import {Router} from "express";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {UserController} from "../controllers/user.controller.js";

const router:Router = Router()
const userController = new UserController()

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Not authenticated
 */
router.get('/me', authMiddleware, userController.getProfile)

export default router;
