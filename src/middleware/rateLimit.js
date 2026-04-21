const rateLimit = require('express-rate-limit');
const redis = require('redis');
const client = redis.createClient();

// Mock database for demonstration purposes
const database = {
    findMerchantById: async (id) => {
        // Simulated database lookup
        const merchants = [{ id: '1', name: 'Merchant One' }, { id: '2', name: 'Merchant Two' }];
        return merchants.find(merchant => merchant.id === id) || null;
    },
    findPlanByMerchantId: async (id) => {
        // Simulated plan retrieval
        const plans = [{ merchantId: '1', plan: 'basic' }, { merchantId: '2', plan: 'premium' }];
        const plan = plans.find(p => p.merchantId === id);
        return plan ? plan.plan : null;
    },
};

// Helper function to validate merchant ID
const validateMerchantId = async (merchantId) => {
    try {
        const merchant = await database.findMerchantById(merchantId);
        return merchant !== null; // Return true if merchant exists, false otherwise
    } catch (error) {
        console.error('Error validating merchant ID:', error);
        return false;
    }
};

// Helper function to retrieve merchant plan
const getMerchantPlan = async (merchantId) => {
    try {
        const plan = await database.findPlanByMerchantId(merchantId);
        return plan || null; // Return plan if found, otherwise return null
    } catch (error) {
        console.error('Error retrieving merchant plan:', error);
        return null;
    }
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

        const plan = await getMerchantPlan(merchantId);
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

module.exports = { dynamicRateLimit, validateMerchantId, getMerchantPlan };