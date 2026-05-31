import {Router} from "express";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {KycController} from "../controllers/kyc.controller.js";

const router: Router = Router();
const kycController = new KycController();

/**
 * @swagger
 * /api/kyc/upload:
 *   post:
 *     tags: [KYC]
 *     summary: Get a signed upload URL for KYC document
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [docType]
 *             properties:
 *               docType:
 *                 type: string
 *                 enum: [passport, proof_of_address, driving_license]
 *                 example: passport
 *     responses:
 *       200:
 *         description: Signed upload URL and document record
 */
router.post('/upload', authMiddleware, kycController.getUploadUrl);

/**
 * @swagger
 * /api/kyc/documents/{id}/url:
 *   get:
 *     tags: [KYC]
 *     summary: Get signed download URL for a KYC document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Signed download URL
 *       404:
 *         description: Document not found
 */
router.get('/documents/:id/url', authMiddleware, kycController.getDocumentUrl);

/**
 * @swagger
 * /api/kyc/submit:
 *   post:
 *     tags: [KYC]
 *     summary: Submit KYC for review
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KYC status updated to submitted
 */
router.post('/submit', authMiddleware, kycController.submit);

/**
 * @swagger
 * /api/kyc/verify/{userId}:
 *   patch:
 *     tags: [KYC]
 *     summary: Approve or reject user KYC (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *             required: [approved]
 *             properties:
 *               approved:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: KYC status updated
 */
router.patch('/verify/:userId', authMiddleware, kycController.verify);

export default router;
