// Mock database functions for demonstration purposes
const merchants = [
    { id: '1', name: 'Merchant One' },
    { id: '2', name: 'Merchant Two' }
];

const plans = [
    { merchantId: '1', plan: 'basic' },
    { merchantId: '2', plan: 'premium' }
];

const getMerchantById = async (id) => {
    return merchants.find(merchant => merchant.id === id) || null;
};

const getPlanByMerchantId = async (id) => {
    const plan = plans.find(p => p.merchantId === id);
    return plan ? plan.plan : null;
};

module.exports = { getMerchantById, getPlanByMerchantId };