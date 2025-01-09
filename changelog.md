# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-01-09
### Added
- **User Registration**: API implemented to register users with validation, password hashing, and database storage.
- **User Login**: API for logging in with JWT generation after successful authentication.
- **Password Reset**: Added an API to generate a reset token for users who have forgotten their passwords (without email service).
- **Password Update**: API implemented to update the password using either a JWT token (for logged-in users) or a reset token (for users who forgot their password).

### Changed
- Integrated **JWT** for user login to provide secure access to the application.
- Added error handling for cases like duplicate usernames and emails during user registration.
- Enhanced security by hashing passwords before saving them to the database.
- Added checks and validation for email format during password reset requests.

### Notes
- Password update functionality works with two different flows: JWT-based for logged-in users and reset token-based for users who forget their password.
- Ensure that the correct token (JWT or reset token) is provided depending on the user’s status.

