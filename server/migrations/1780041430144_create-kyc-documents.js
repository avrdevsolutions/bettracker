/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.sql(`
        CREATE TABLE kyc_documents (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id),
            doc_type VARCHAR(50) NOT NULL,
                CHECK(doc_type IN ('passport', 'proof_of_address', 'driving_license')),
            s3_key VARCHAR(500),
            status VARCHAR(20) DEFAULT 'pending',
                CHECK (status IN ('pending', 'approved', 'rejected')),
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
    `)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
        DROP TABLE IF EXISTS kyc_documents
    `)
};
