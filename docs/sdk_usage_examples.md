# SDK Usage Examples for Payments API

## 1. Create Payment

```javascript
const sdk = require('your-sdk'); // Adjust the path as needed

const createPayment = async (paymentData) => {
    try {
        const response = await sdk.payments.create(paymentData);
        console.log('Payment created:', response);
    } catch (error) {
        console.error('Error creating payment:', error);
    }
};
```

## 2. Retrieve Payment

```javascript
const sdk = require('your-sdk'); // Adjust the path as needed

const getPayment = async (paymentId) => {
    try {
        const response = await sdk.payments.get(paymentId);
        console.log('Payment details:', response);
    } catch (error) {
        console.error('Error retrieving payment:', error);
    }
};
```

## 3. Refund Payment

```javascript
const sdk = require('your-sdk'); // Adjust the path as needed

const refundPayment = async (paymentId) => {
    try {
        const response = await sdk.payments.refund(paymentId);
        console.log('Payment refunded:', response);
    } catch (error) {
        console.error('Error refunding payment:', error);
    }
};
```