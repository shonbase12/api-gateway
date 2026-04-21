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
    try {
        const merchantId = req.user.merchantId; // Assuming merchant ID is available in the request
        if (!merchantId) {
            return res.status(400).send('Merchant ID is required.');
        }

        const merchant = await getMerchantById(merchantId);
        if (!merchant) {
            return res.status(400).send('Invalid Merchant ID.');
        }

        const plan = await getPlanByMerchantId(merchantId);
        if (!plan || !rateLimits[plan]) {
            return res.status(400).send('Invalid or unsupported pricing plan.');
        }

        const limit = rateLimits[plan];
        const limiter = rateLimit({
            windowMs: 60 * 1000, // 1 minute
            max: limit,
            keyGenerator: (req) => req.user.merchantId,
            store: new rateLimit.RedisStore({ client }),
            message: 'Too many requests from this merchant, please try again later.',
        });

        return limiter(req, res, next);
    } catch (error) {
        console.error('Error in rate limiting middleware:', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = { dynamicRateLimit };