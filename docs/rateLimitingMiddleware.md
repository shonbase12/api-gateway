# Rate Limiting Middleware

## Overview
This middleware dynamically manages rate limits for merchants based on their pricing plan.

## Configuration
- **REDIS_URL**: Set the Redis connection URL through the environment variable.
- **RATE_LIMITS**: Define rate limits for different plans in JSON format (e.g., {"basic": 100, "premium": 500}).

## Error Handling
Descriptive error messages are returned to clients for better clarity in case of issues.

## Usage
To use this middleware, include it in your Express app and ensure to set the proper environment variables.

## Unit Testing
Ensure to write tests covering various scenarios including valid/invalid merchants, exceeded limits, and Redis failures.