
import request from 'supertest';
import app from '../src/app'; 

describe('API Tests', () => {
  it('should return a 200 status code for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe("Hola esto es una prueba");
  });

 
});
