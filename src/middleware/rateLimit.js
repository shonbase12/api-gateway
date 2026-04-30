const rateLimit = require('express-rate-limit');
const redis = require('redis');
const { getMerchantById, getPlanByMerchantId } = require('./database'); // Replace with actual database functions

const REDIS_RECONNECT_INTERVAL_MS = 5000;

// Create Redis client with retry strategy
const client = redis.createClient({
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                return new Error('Retry limit reached');
            }
            const delay = Math.min(retries * 100, REDIS_RECONNECT_INTERVAL_MS);
            console.log(`Redis reconnect attempt in ${delay}ms`);
            return delay;
        },
        connectTimeout: 5000
    }
});

let redisConnected = false;

client.on('connect', () => {
    redisConnected = true;
    console.info('Connected to Redis');
});

client.on('ready', () => {
    console.info('Redis client ready');
});

client.on('error', (err) => {
    redisConnected = false;
    console.error('Redis connection error:', err);
});

client.on('end', () => {
    redisConnected = false;
    console.warn('Redis connection closed');
});

// Function to check Redis connection health
const checkRedisConnection = async () => {
    if (!redisConnected) {
        throw new Error('Redis not connected');
    }
    try {
        await client.ping();
    } catch (err) {
        redisConnected = false;
        throw err;
    }
};

// Configuration for rate limits
const rateLimits = {
    basic: 100,   // 100 requests per minute
    premium: 500, // 500 requests per minute
    // Additional plans can be added here
};

// Middleware to set dynamic rate limits based on merchant pricing plan
const dynamicRateLimit = async (req, res, next) => {
    const timeout = setTimeout(() => {
        console.warn('Rate limiting middleware timed out.');
        return res.status(503).send('Service unavailable due to timeout.');
    }, 5000); // 5 seconds timeout

    try {
        const merchantId = req.user.merchantId; // Assuming merchant ID is available in the request
        if (!merchantId) {
            clearTimeout(timeout);
            console.warn('Merchant ID missing in request.');
            return res.status(400).send('Merchant ID is required.');
        }

        const merchant = await getMerchantById(merchantId);
        if (!merchant) {
            clearTimeout(timeout);
            console.warn(`Invalid Merchant ID: ${merchantId}`);
            return res.status(400).send('Invalid Merchant ID.');
        }

        const plan = await getPlanByMerchantId(merchantId);
        if (!plan || !rateLimits[plan]) {
            clearTimeout(timeout);
            console.warn(`Invalid or unsupported pricing plan for Merchant ID: ${merchantId}`);
            return res.status(400).send('Invalid or unsupported pricing plan.');
        }

        const limit = rateLimits[plan];
        let limiter;

        try {
            await checkRedisConnection();
            limiter = rateLimit({
                windowMs: 60 * 1000, // 1 minute
                max: limit,
                keyGenerator: (req) => req.user.merchantId,
                store: new rateLimit.RedisStore({ client }),
                message: 'Too many requests from this merchant, please try again later.',
            });
        } catch (redisError) {
            console.error('Redis error or disconnected, falling back to in-memory rate limiter:', redisError);
            // Fallback to in-memory store
            limiter = rateLimit({
                windowMs: 60 * 1000,
                max: limit,
                keyGenerator: (req) => req.user.merchantId,
                message: 'Too many requests from this merchant, please try again later.',
            });
        }

        limiter(req, res, () => {
            clearTimeout(timeout);
            next();
        });
    } catch (error) {
        clearTimeout(timeout);
        console.error('Error in rate limiting middleware:', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = { dynamicRateLimit };
