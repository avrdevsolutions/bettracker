export const config = {
    port: parseInt(process.env.PORT || '3000'),
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    jwtExpiresIn: '1h',
    dbUrl: `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT || '5432'}/${process.env.DATABASE_NAME}`
}