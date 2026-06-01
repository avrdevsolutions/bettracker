import {Router} from "express";
import {UserController} from "../controllers/user.controller.js";

const router: Router = Router()
const userController = new UserController()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@test.com
 *               password:
 *                 type: string
 *                 example: test123
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 */
router.post('/register', userController.register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and get JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@test.com
 *               password:
 *                 type: string
 *                 example: test123
 *     responses:
 *       200:
 *         description: Returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', userController.login)

export default router
