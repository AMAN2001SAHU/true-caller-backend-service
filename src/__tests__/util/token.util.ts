import request from 'supertest';
import app from '../../app';

export const loginAndGetToken = async () => {
  await request(app).post('/api/v1/register').send({
    name: 'Test User',
    phoneNumber: '1234567890',
    password: 'TestPassword123',
  });

  const response = await request(app).post('/api/v1/login').send({
    phoneNumber: '1234567890',
    password: 'TestPassword123',
  });

  return response.body.token;
};
