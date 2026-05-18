# Payment SDK Response Shapes

## createPayment(data)
- **Response Structure**: 
  - `id`: string
  - `status`: string
  - `createdAt`: string

## getPaymentById(paymentId)
- **Response Structure**: 
  - `id`: string
  - `status`: string
  - `amount`: number
  - `createdAt`: string

## refundPayment(paymentId, refundDetails)
- **Response Structure**: 
  - `id`: string
  - `status`: string
  - `refundedAt`: string
