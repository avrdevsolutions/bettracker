const log = (level: string, data: object) => {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), level, ...data }))
}

export const logger = {
    info: (data: object) => log('info', data),
    warn: (data: object) => log('warn', data),
    error: (data: object) => log('error', data),
}