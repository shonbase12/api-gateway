# API Gateway

NovaPay Public API Gateway

The NovaPay API Gateway serves as a unified entry point for clients to access various NovaPay services. This service acts as a central point for handling authentication, rate limiting, and request routing to ensure efficient and secure communication between clients and backend services.

## Description
The API Gateway is responsible for:
- **Authentication**: Validates JWT tokens to ensure that requests are coming from authenticated users.
- **Rate Limiting**: Protects backend services from being overwhelmed by limiting the number of requests a client can make in a given time frame.
- **Request Routing**: Directs incoming requests to the appropriate backend service based on the request path and method.

## Key Features
- JWT-based authentication for secure access to APIs.
- Configurable rate limiting policies.
- Flexible routing mechanism to various backend services.
- Logging and Monitoring: Tracks API usage and performance metrics to help identify issues and improve service quality.

## Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone https://github.com/shonbase12/api-gateway.git
   cd api-gateway
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Run the service**:
   ```bash
   npm start
   ```

5. **Configuration**:
   - Create a `.env` file in the root directory and add the following variables:
     ```
     PORT=3000
     JWT_SECRET=<your_jwt_secret>
     ```

## Usage Examples
- **Authenticate a User**:
  To authenticate a user and receive a JWT token, make a POST request to `/auth/login` with the following payload:
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```

- **Access a Protected Resource**:
  Use the JWT token received from the authentication step to access protected endpoints:
  ```bash
  curl -H "Authorization: Bearer <your_jwt_token>" http://localhost:3000/api/resource
  ```

## API Endpoints
- **POST /auth/login**: Authenticate a user.
- **GET /api/resource**: Access a protected resource.

For more details on the API endpoints, please refer to the [API Documentation](link-to-api-docs).

## Conclusion
The NovaPay API Gateway simplifies the interaction between clients and backend services while ensuring security and performance. For more detailed documentation, refer to the [NovaPay Developer Portal](#).