// Shared error handling module

class AppError extends Error {
    constructor(message, status, code, details) {
        super(message);
        this.status = status || 500;
        this.code = code || 'APP_ERROR';
        this.details = details || null;
    }
}

class ValidationError extends AppError {
    constructor(message, details) {
        super(message || 'Validation Error', 400, 'VALIDATION_ERROR', details);
    }
}

class AuthenticationError extends AppError {
    constructor(message, details) {
        super(message || 'Authentication Error', 401, 'AUTHENTICATION_ERROR', details);
    }
}

class NotFoundError extends AppError {
    constructor(message, details) {
        super(message || 'Not Found', 404, 'NOT_FOUND', details);
    }
}

// Structured logging function
function logError(err, req) {
    const logDetails = {
        message: err.message,
        status: err.status || 500,
        code: err.code || 'APP_ERROR',
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
    };
    console.error(JSON.stringify(logDetails));
}

// Error handling middleware
function errorHandler(err, req, res, next) {
    logError(err, req);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500,
            code: err.code || 'APP_ERROR',
            details: err.details || null,
        },
    });
}

module.exports = {
    errorHandler,
    AppError,
    ValidationError,
    AuthenticationError,
    NotFoundError,
    logError
};