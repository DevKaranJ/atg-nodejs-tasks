# Cryptocurrency Price Monitoring and Alerting System

This project implements a real-time cryptocurrency price monitoring and alerting system with caching optimizations.

## API Endpoints

### 1. Get Current Prices
- **Endpoint**: `/prices`
- **Method**: `GET`
- **Description**: Fetches the latest cryptocurrency prices from the API.

### 2. Check Price Change
- **Endpoint**: `/check-price-change`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "cryptoId": "BTC",
        "previousPrice": 100000,
        "currentPrice": 105000,
        "threshold": 5
    }
    ```
- **Description**: Checks if the price change exceeds the defined threshold and triggers an alert if necessary.

### 3. Get Cached Prices
- **Endpoint**: `/cached-prices`
- **Method**: `GET`
- **Description**: Retrieves cached cryptocurrency prices from Redis.

### 4. Set User-defined Alert Criteria
- **Endpoint**: `/set-alert-criteria`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "threshold": 10
    }
    ```
- **Description**: Allows users to set their own price change thresholds for alerts.

## Caching
The system uses Redis to cache the latest cryptocurrency prices for efficient retrieval.

## Notifications
Alerts are emitted as events that can be captured on the frontend to display real-time notifications.

## Installation
To install the necessary dependencies, run:
```bash
npm install
```

## Running the Application
To start the application, use:
```bash
npm run dev
```

## Features
- Real-time cryptocurrency price monitoring.
- Alerting system for price changes.
- Caching mechanism using Redis for efficient data retrieval.
- API endpoints for fetching current prices, checking price changes, and setting user-defined alert criteria.

