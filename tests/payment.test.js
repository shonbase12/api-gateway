const { createPayment, getPayment, refundPayment } = require('../src/sdk/payment');

// Mock the fetch function globally
global.fetch = jest.fn();

describe('Payment SDK', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createPayment', () => {
        it('should successfully create a payment', async () => {
            const mockResponse = { id: 'payment1', status: 'created' };
            fetch.mockResolvedValueOnce({ json: () => mockResponse });

            const paymentDetails = { amount: 100, currency: 'USD' };
            const response = await createPayment(paymentDetails);

            expect(fetch).toHaveBeenCalledWith('/v1/payments', expect.objectContaining({ method: 'POST' }));
            expect(response).toEqual(mockResponse);
        });

        it('should handle fetch failure', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(createPayment({})).rejects.toThrow('Network error');
        });
    });

    describe('getPayment', () => {
        it('should successfully get a payment by ID', async () => {
            const mockResponse = { id: 'payment1', status: 'completed' };
            fetch.mockResolvedValueOnce({ json: () => mockResponse });

            const response = await getPayment('payment1');

            expect(fetch).toHaveBeenCalledWith('/v1/payments/payment1', expect.objectContaining({ method: 'GET' }));
            expect(response).toEqual(mockResponse);
        });

        it('should handle fetch failure', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(getPayment('payment1')).rejects.toThrow('Network error');
        });
    });

    describe('refundPayment', () => {
        it('should successfully refund a payment by ID', async () => {
            const mockResponse = { id: 'payment1', status: 'refunded' };
            fetch.mockResolvedValueOnce({ json: () => mockResponse });

            const response = await refundPayment('payment1');

            expect(fetch).toHaveBeenCalledWith('/v1/payments/payment1/refund', expect.objectContaining({ method: 'POST' }));
            expect(response).toEqual(mockResponse);
        });

        it('should handle fetch failure', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(refundPayment('payment1')).rejects.toThrow('Network error');
        });
    });

});
