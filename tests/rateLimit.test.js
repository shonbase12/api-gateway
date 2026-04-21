const { validateMerchantId, getMerchantPlan } = require('./src/middleware/rateLimit');

describe('Merchant ID Validation', () => {
    test('Valid merchant ID returns true', async () => {
        const result = await validateMerchantId('1');
        expect(result).toBe(true);
    });

    test('Invalid merchant ID returns false', async () => {
        const result = await validateMerchantId('999');
        expect(result).toBe(false);
    });

    test('Error during validation returns false', async () => {
        // Simulate an error by modifying the database function
        const originalFindMerchantById = database.findMerchantById;
        database.findMerchantById = async () => { throw new Error('Database error'); };

        const result = await validateMerchantId('1');
        expect(result).toBe(false);

        // Restore the original function
        database.findMerchantById = originalFindMerchantById;
    });
});


describe('Plan Retrieval', () => {
    test('Valid merchant ID returns correct plan', async () => {
        const result = await getMerchantPlan('1');
        expect(result).toBe('basic');
    });

    test('Invalid merchant ID returns null', async () => {
        const result = await getMerchantPlan('999');
        expect(result).toBe(null);
    });

    test('Error during plan retrieval returns null', async () => {
        // Simulate an error by modifying the database function
        const originalFindPlanByMerchantId = database.findPlanByMerchantId;
        database.findPlanByMerchantId = async () => { throw new Error('Database error'); };

        const result = await getMerchantPlan('1');
        expect(result).toBe(null);

        // Restore the original function
        database.findPlanByMerchantId = originalFindPlanByMerchantId;
    });
});