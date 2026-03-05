const rateLimit = (req, res, next) => {
    // TODO: per-merchant rate limits based on pricing plan
    const limit = 100; // requests per minute
    next();
};

module.exports = { rateLimit };
