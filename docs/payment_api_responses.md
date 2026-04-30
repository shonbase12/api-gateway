# Payment API Response Shapes

This document specifies the response shapes for the payment-related API operations exposed by the NovaPay API Gateway.

## 1. Create Payment (POST /v1/payments)

### Successful Response
- **Status Code:** 201 Created
- **Content-Type:** application/json
- **Body:**
```json
{
  "paymentId": "string",
  "status": "string",
  "amount": number,
  "currency": "string",
  "createdAt": "ISO8601 timestamp",
  "metadata": { "key": "value" }
}
```
- **Description:** Returns the unique identifier of the created payment, its current status, amount, currency, creation timestamp, and any associated metadata.

## 2. Get Payment (GET /v1/payments/{paymentId})

### Successful Response
- **Status Code:** 200 OK
- **Content-Type:** application/json
- **Body:**
```json
{
  "paymentId": "string",
  "status": "string",
  "amount": number,
  "currency": "string",
  "createdAt": "ISO8601 timestamp",
  "refundedAmount": number,
  "metadata": { "key": "value" }
}
```
- **Description:** Returns detailed information about the payment including any refunded amount.

## 3. Refund Payment (POST /v1/payments/{paymentId}/refund)

### Successful Response
- **Status Code:** 200 OK
- **Content-Type:** application/json
- **Body:**
```json
{
  "refundId": "string",
  "paymentId": "string",
  "status": "string",
  "amount": number,
  "createdAt": "ISO8601 timestamp"
}
```
- **Description:** Returns details about the refund transaction including refund identifier, associated payment ID, status, refunded amount, and timestamp.

## Error Responses (Standardized)

### Error Response Shape
- **Status Code:** Various (4xx, 5xx)
- **Content-Type:** application/json
- **Body:**
```json
{
  "statusCode": number,
  "error": "string",
  "message": "string",
  "details": { "key": "value" },
  "timestamp": "ISO8601 timestamp",
  "requestId": "string"
}
```
- **Description:** Standardized error response containing HTTP status code, error type/code, human-readable message, optional additional details, timestamp of error occurrence, and a unique request identifier for tracing.

---

The above response shapes are standardized across the NovaPay API Gateway to provide consistent and predictable API interactions for payment operations.

For additional error handling details, refer to the [error handling documentation](error_handling_enhancements.md).
