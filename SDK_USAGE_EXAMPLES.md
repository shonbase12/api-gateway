# SDK Usage Examples for Payment Processing Methods

## Create a Payment
```javascript
const paymentDetails = { /* payment details object */ };
const newPayment = await createPayment(paymentDetails);
```

## Get Payment Details
```javascript
const paymentId = '123'; // example payment ID
const paymentInfo = await getPayment(paymentId);
```

## Refund a Payment
```javascript
const paymentId = '123'; // example payment ID
const refundResponse = await refundPayment(paymentId);
```
