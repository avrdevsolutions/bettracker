export const config = {
    port: parseInt(process.env.PORT || '3000'),
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    jwtExpiresIn: '1h',
    dbUrl: process.env.DATABASE_URL || 'postgres://bettracker:bettracker@localhost:5432/bettracker'
}