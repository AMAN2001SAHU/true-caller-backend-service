import request from 'supertest';
import app from '../../app';
import { loginAndGetToken } from './token.util';

export const createContactId = async () => {
  const token = await loginAndGetToken();
  const response = await request(app)
    .post('/api/v1/create-contact')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Joshua Penny',
      phoneNumber: '7885744233',
    });

  return response.body.id;
};
