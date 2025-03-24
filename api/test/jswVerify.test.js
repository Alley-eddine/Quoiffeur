import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import jwtVerify from '../middleware/jwtVerify.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Tests du middleware jwtVerify', () => {
  let app;
  
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.get('/protected', jwtVerify, (req, res) => {
      res.status(200).send('Protected route accessed');
    });
  });


describe('Tests du middleware jwtVerify', () => {
  it('devrait retourner 401 si l\'en-tête d\'autorisation est manquant', async () => {
    const response = await request(app).get('/protected');
    expect(response.status).toBe(401);
    expect(response.text).toBe('Authorization header is missing');
  });

  it('devrait retourner 401 si l\'en-tête d\'autorisation est mal formé', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer');
    expect(response.status).toBe(401);
    expect(response.text).toBe('Malformed authorization header');
  });

  it('devrait retourner 403 si le token est invalide', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalidtoken');
    expect(response.status).toBe(403);
    expect(response.text).toContain('Token verification failed');
  });

  it('devrait retourner 200 si le token est valide', async () => {
    const token = jwt.sign({ _id: 'user_id' }, process.env.SECRET_KEY);
    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.text).toBe('Protected route accessed');
  });
});
});