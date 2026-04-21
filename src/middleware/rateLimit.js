const rateLimit = require('express-rate-limit');
const redis = require('redis');
const client = redis.createClient();

// Middleware to set dynamic rate limits based on merchant pricing plan
const dynamicRateLimit = async (req, res, next) => {
    try {
        const merchantId = req.user.merchantId; // Assuming merchant ID is available in the request
        if (!merchantId) {
            return res.status(400).send('Merchant ID is required.');
        }

        const plan = await getMerchantPlan(merchantId); // Function to retrieve the merchant's pricing plan
        if (!plan) {
            return res.status(400).send('Invalid pricing plan.');
        }
        let limit;

        // Set rate limits based on the pricing plan
        switch (plan) {
            case 'basic':
                limit = 100; // 100 requests per minute
                break;
            case 'premium':
                limit = 500; // 500 requests per minute
                break;
            default:
                limit = 100; // Default to basic plan
                break;
        }

        const limiter = rateLimit({
            windowMs: 60 * 1000, // 1 minute
            max: limit,
            keyGenerator: (req) => req.user.merchantId, // Use merchant ID as key
            store: new rateLimit.RedisStore({ client }), // Store in Redis
            message: 'Too many requests from this merchant, please try again later.',
        });

        // Log rate limit usage
        console.log(`Merchant ID: ${merchantId}, Plan: ${plan}, Limit: ${limit}`);

        return limiter(req, res, next);
    } catch (error) {
        console.error('Error in rate limiting middleware:', error);
        return res.status(500).send('Internal Server Error');
    }
};

// Optional: Fetch rate limits from a configuration
const rateLimits = {
    basic: 100,
    premium: 500,
};

module.exports = { dynamicRateLimit, rateLimits };