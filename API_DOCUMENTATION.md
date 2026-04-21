# API Route Documentation for Payments

## 1. Create Payment
- **Endpoint**: `POST /v1/payments`
- **Description**: Creates a new payment.
- **Middleware**: 
  - `authenticate`
  - `rateLimit`
- **Request Body**:
  ```json
  {
      "amount": 100.00,
      "currency": "USD",
      "paymentMethod": {
          "type": "card",
          "cardNumber": "4111111111111111",
          "expirationDate": "12/25",
          "cvv": "123"
      }
  }
  ```
- **Responses**:
  - **201 Created**:
    ```json
    {
        "id": "payment_id",
        "status": "created",
        "amount": 100.00,
        "currency": "USD"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
        "error": "Invalid parameters"
    }
    ```
  - **401 Unauthorized**: 
    ```json
    {
        "error": "User not authenticated"
    }
    ```
  - **429 Too Many Requests**: 
    ```json
    {
        "error": "Rate limit exceeded"
    }
    ```

## 2. Get Payment by ID
- **Endpoint**: `GET /v1/payments/:id`
- **Description**: Retrieves payment details by ID.
- **Middleware**: 
  - `authenticate`
- **Path Parameters**:
  - `id`: (String) Payment unique identifier.
- **Responses**:
  - **200 OK**:
    ```json
    {
        "id": "payment_id",
        "amount": 100.00,
        "status": "completed",
        "currency": "USD"
    }
    ```
  - **404 Not Found**:
    ```json
    {
        "error": "Payment not found"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
        "error": "User not authenticated"
    }
    ```

## 3. Refund Payment
- **Endpoint**: `POST /v1/payments/:id/refund`
- **Description**: Processes a refund for a specified payment ID.
- **Middleware**: 
  - `authenticate`
- **Path Parameters**:
  - `id`: (String) Payment unique identifier.
- **Request Body**:
  ```json
  {
      "amount": 50.00
  }
  ```
- **Responses**:
  - **200 OK**:
    ```json
    {
        "id": "payment_id",
        "status": "refunded",
        "amount": 50.00
    }
    ```
  - **404 Not Found**:
    ```json
    {
        "error": "Payment not found"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
        "error": "User not authenticated"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
        "error": "Invalid parameters"
    }
    ```
