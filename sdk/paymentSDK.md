# Payment SDK Documentation

## Overview
This SDK provides methods to interact with the Payment API.

## Methods

### createPayment(data)
- **Description**: Creates a new payment.
- **Parameters**:
  - `data` (Object): The payment details to create.
- **Returns**: Promise resolving to the created payment object.
- **Error Handling**: Throws an error if the API response is not ok.

### getPaymentById(paymentId)
- **Description**: Retrieves payment details by ID.
- **Parameters**:
  - `paymentId` (String): The ID of the payment to retrieve.
- **Returns**: Promise resolving to the payment object.
- **Error Handling**: Throws an error if the API response is not ok.

### refundPayment(paymentId, refundDetails)
- **Description**: Refunds a payment by ID.
- **Parameters**:
  - `paymentId` (String): The ID of the payment to refund.
  - `refundDetails` (Object): The details of the refund.
- **Returns**: Promise resolving to the refund response.
- **Error Handling**: Throws an error if the API response is not ok.

## Usage
```javascript
const PaymentSDK = require('./sdk/paymentSDK');
const paymentApi = new PaymentSDK('https://api.example.com');

// Create a payment
paymentApi.createPayment(paymentData)
    .then(response => console.log(response))
    .catch(error => console.error(error));
```