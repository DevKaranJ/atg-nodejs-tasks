const request = require('supertest');
const app = require('../app'); // Assuming app.js exports the Express app
const { expect } = require('chai');

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'password123'
        });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('token');
    });

    it('should return an error for duplicate username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'testuser2@example.com',
          password: 'password123'
        });
      expect(res.status).to.equal(400);
      expect(res.body.message).to.include('Username already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
    });

    it('should return an error for invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });
      expect(res.status).to.equal(400);
      expect(res.body.message).to.include('Invalid password');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should generate a reset token for valid email', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          email: 'testuser@example.com'
        });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.include('Password reset token generated successfully');
    });

    it('should return an error for invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          email: 'invalid@example.com'
        });
      expect(res.status).to.equal(404);
      expect(res.body.message).to.include('User with this email not found');
    });
  });

  describe('POST /api/auth/update-password', () => {
    it('should return an error for invalid token', async () => {
      const res = await request(app)
        .post('/api/auth/update-password')
        .send({
          token: 'invalid_token',
          newPassword: 'newpassword123'
        });
      expect(res.status).to.equal(400);
      expect(res.body.message).to.include('Invalid or expired token');
    });
  });
});
