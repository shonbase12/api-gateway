const rateLimit = require('express-rate-limit');
const redis = require('redis');
const client = redis.createClient();

// Helper function to validate merchant ID
const validateMerchantId = async (merchantId) => {
    // Logic to validate if the merchant ID exists in the database
    // Return true if valid, false otherwise
};

// Helper function to retrieve merchant plan
const getMerchantPlan = async (merchantId) => {
    // Logic to fetch the merchant's plan from the database
};

// Middleware to set dynamic rate limits based on merchant pricing plan
const dynamicRateLimit = async (req, res, next) => {
    try {
        const merchantId = req.user.merchantId; // Assuming merchant ID is available in the request
        if (!merchantId) {
            return res.status(400).send('Merchant ID is required.');
        }

        const isValid = await validateMerchantId(merchantId);
        if (!isValid) {
            return res.status(400).send('Invalid Merchant ID.');
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

        return limiter(req, res, next);
    } catch (error) {
        console.error('Error in rate limiting middleware:', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = { dynamicRateLimit };