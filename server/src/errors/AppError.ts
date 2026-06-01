export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string)
    {
        super(message);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(404, message);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(409, message);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}

export class InvalidCredentials extends AppError {
    constructor(message = 'Invalid Credentials') {
        super(401, message);
    }
}