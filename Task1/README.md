# Task1 - Authentication API

## Overview
This Task1 folder contains the implementation of an authentication API using Node.js and Express. The API provides endpoints for user registration, login, password reset, and password update.

## API Documentation

### Base URL
```
http://localhost:5000/api/auth
```

### Endpoints

#### 1. User Registration
- **URL**: `/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "User registered successfully",
      "userId": "number",
      "token": "string"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Error message"
    }
    ```

#### 2. User Login
- **URL**: `/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Login successful",
      "token": "string"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Error message"
    }
    ```

#### 3. Reset Password
- **URL**: `/reset-password`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Password reset token generated successfully. Please check the console for the token."
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Error message"
    }
    ```

#### 4. Update Password
- **URL**: `/update-password`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "token": "string", // Optional if using JWT
    "newPassword": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Password updated successfully."
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Error message"
    }
    ```

## Running the Application
1. Clone the repository.
2. Navigate to the `Task1` directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the `Task1` directory with the necessary environment variables.
5. Run the database setup script:
   ```bash
   node setupDatabase.js
   ```
   This will create the database and schema without any manual input.
6. Start the server:
   ```bash
   npm start
   ```
7. The server will run on `http://localhost:5000`.

## Environment Variables
Make sure to create a `.env` file in the `Task1` directory with the following variables:
```
PORT=5000
JWT_SECRET=your_jwt_secret
