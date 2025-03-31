const request = require('supertest');
const { app, server } = require('../server');

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

describe('GET /api/hello', () => {
  it('should return hello message', async () => {
    const response = await request(app)
      .get('/api/hello')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.message).toBe('Hello from Node.js!');
  });
});