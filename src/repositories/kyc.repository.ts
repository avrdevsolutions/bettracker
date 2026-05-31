import {pool} from "../config/database.js";
import {DocStatus, DocType} from "../models/kyc.model.js";
import {KycStatus} from "../models/user.model.js";

export class KycRepository {
    async findByUserId(userId: string) {
        const result = await pool.query(
            `SELECT * FROM kyc_documents 
            WHERE kyc_documents.user_id = $1
            `, [userId]
        )
        return result.rows[0] || undefined
    }

    async findAll() {
        const results = await pool.query(
            `SELECT * FROM kyc_documents`
        )
        return results.rows || undefined
    }

    async findById(id: string) {
        const result = await pool.query(
            `SELECT * FROM kyc_documents 
            WHERE kyc_documents.id = $1
            `, [id]
        )
        return result.rows[0] || undefined
    }

    async create(userId: string, docType: DocType, s3Key: string) {
        const result = await pool.query(`
            INSERT INTO kyc_documents (user_id, doc_type, s3_key) VALUES ($1, $2, $3) RETURNING *`,
                [userId, docType, s3Key]
        )
        return result.rows[0] || undefined
    }

    async updateKycStatus(userId: string, status: KycStatus) {
        const result = await pool.query(`
            UPDATE users SET kyc_status = $1 WHERE id = $2 RETURNING *`,
            [status,userId])
        return result.rows[0] || undefined
    }

    async updateDocStatus(userId: string, status: DocStatus) {
        const result = await pool.query(`
            UPDATE kyc_documents SET status = $1 WHERE user_id = $2 RETURNING *`,
            [status,userId])
        return result.rows[0] || undefined
    }
}