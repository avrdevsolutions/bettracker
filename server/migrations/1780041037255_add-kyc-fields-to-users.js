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
      ALTER TABLE users
          ADD COLUMN full_name VARCHAR(200),
          ADD COLUMN address TEXT,
          ADD COLUMN kyc_status VARCHAR(20) NOT NULL DEFAULT 'pending'
            CHECK (kyc_status IN ('pending', 'submitted', 'verified', 'rejected'))
    `)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
        ALTER TABLE users
            DROP COLUMN full_name,
            DROP COLUMN address,
            DROP COLUMN kyc_status;
    `)
};
