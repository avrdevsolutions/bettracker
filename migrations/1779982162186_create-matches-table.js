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
        CREATE TABLE matches (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      home_team  VARCHAR(100) NOT NULL,
      away_team  VARCHAR(100) NOT NULL,
      odds_home  DECIMAL(5,2) NOT NULL,
      odds_draw  DECIMAL(5,2) NOT NULL,
      odds_away  DECIMAL(5,2) NOT NULL,
      status     VARCHAR(20) NOT NULL DEFAULT 'upcoming'
                   CHECK (status IN ('upcoming', 'live', 'finished', 'cancelled')),
      start_time TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
    `)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`DROP TABLE IF EXISTS matches`)
};
