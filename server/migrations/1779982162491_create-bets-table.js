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
        CREATE TABLE bets (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id),
            match_id UUID NOT NULL REFERENCES matches(id),
            amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
            odds_at_placement DECIMAL(5,2) NOT NULL,    -- snapshot! odds change
            selection VARCHAR(20) NOT NULL,
                    CHECK (selection IN ('home', 'draw', 'away')),
            status VARCHAR(20) NOT NULL DEFAULT 'pending',
                    CHECK (status IN ('pending', 'won', 'lost')),
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
    pgm.sql(`DROP TABLE IF EXISTS bets;`);
};
