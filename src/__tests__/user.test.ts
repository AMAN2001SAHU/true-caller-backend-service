import request from 'supertest';
import app from './../app';

describe('User Authentication', () => {
  it('Should register the user', async () => {
    const response = await request(app).post('/api/v1/register').send({
      name: 'Perry Balmer',
      phoneNumber: '6546678232',
      password: 'random456',
      email: 'perry.balmer@mail.com',
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'Perry Balmer');
    expect(response.body).toHaveProperty('phoneNumber', '6546678232');
    expect(response.body).toHaveProperty('email', 'perry.balmer@mail.com');
    expect(response.body).toHaveProperty('token');
  });

  it('Should not register if phone number already exists', async () => {
    const response = await request(app).post('/api/v1/register').send({
      name: 'Perry Balmer',
      phoneNumber: '6546678232',
      password: 'random456',
      email: 'perry.balmer@mail.com',
    });
    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('message', 'User already exists');
  });

  it('Should login the user', async () => {
    const response = await request(app).post('/api/v1/login').send({
      phoneNumber: '6546678232',
      password: 'random456',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'Perry Balmer');
    expect(response.body).toHaveProperty('phoneNumber', '6546678232');
    expect(response.body).toHaveProperty('email', 'perry.balmer@mail.com');
    expect(response.body).toHaveProperty('token');
  });

  it('Should not login the user if the password is wrong', async () => {
    const response = await request(app).post('/api/v1/login').send({
      phoneNumber: '6546678232',
      password: 'wrong password',
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });
});
