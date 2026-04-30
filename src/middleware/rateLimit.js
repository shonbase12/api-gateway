const rateLimit = require('express-rate-limit');
const redis = require('redis');
const { getMerchantById, getPlanByMerchantId } = require('./database'); // Replace with actual database functions

const client = redis.createClient();

// Error handling for Redis connection
client.on('error', (err) => {
    console.error('Redis error:', err);
});

// Configuration for rate limits
const rateLimits = {
    basic: 100,   // 100 requests per minute
    premium: 500, // 500 requests per minute
    // Additional plans can be added here
};

// Middleware to set dynamic rate limits based on merchant pricing plan
const dynamicRateLimit = async (req, res, next) => {
    const timeout = setTimeout(() => {
        return res.status(503).send('Service unavailable due to timeout.');
    }, 5000); // 5 seconds timeout

    try {
        const merchantId = req.user.merchantId; // Assuming merchant ID is available in the request
        if (!merchantId) {
            clearTimeout(timeout);
            return res.status(400).send('Merchant ID is required.');
        }

        const merchant = await getMerchantById(merchantId);
        if (!merchant) {
            clearTimeout(timeout);
            return res.status(400).send('Invalid Merchant ID.');
        }

        const plan = await getPlanByMerchantId(merchantId);
        if (!plan || !rateLimits[plan]) {
            clearTimeout(timeout);
            return res.status(400).send('Invalid or unsupported pricing plan.');
        }

        const limit = rateLimits[plan];
        let limiter;
        try {
            limiter = rateLimit({
                windowMs: 60 * 1000, // 1 minute
                max: limit,
                keyGenerator: (req) => req.user.merchantId,
                store: new rateLimit.RedisStore({ client }),
                message: 'Too many requests from this merchant, please try again later.',
            });
        } catch (redisError) {
            console.error('Error setting up rate limiter with Redis store:', redisError);
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
