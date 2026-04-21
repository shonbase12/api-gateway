# API Gateway

NovaPay public API gateway. This service acts as a central point for handling authentication, rate limiting, and request routing for all incoming API requests.

## Description
The API Gateway is responsible for:
- **Authentication**: Validates JWT tokens to ensure that requests are coming from authenticated users.
- **Rate Limiting**: Controls the number of requests a user can make in a given timeframe to prevent abuse.
- **Request Routing**: Directs incoming requests to the appropriate backend services based on the request path and methods.

## Key Features
- JWT-based authentication for secure access to APIs.
- Configurable rate limiting policies.
- Flexible routing mechanism to various backend services.

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