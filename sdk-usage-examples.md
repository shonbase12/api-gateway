# SDK Usage Examples for Payments API

## Installation Instructions
To use the SDK, follow these steps:
1. Install the SDK using npm:
   ```bash
   npm install your-sdk-name
   ```
2. Import the SDK in your project:
   ```javascript
   const sdk = require('your-sdk-name');
   ```

## Usage Examples
### Creating a Payment
```javascript
const payment = await sdk.createPayment({
  amount: 100,
  currency: 'USD',
  method: 'credit_card',
});
```

### Retrieving a Payment
```javascript
const payment = await sdk.getPayment(paymentId);
```

### Refunding a Payment
```javascript
const refund = await sdk.refundPayment(paymentId);
```

## Error Handling
Ensure to handle errors appropriately:
```javascript
try {
  const payment = await sdk.createPayment({ ... });
} catch (error) {
  console.error('Error creating payment:', error);
}
```
