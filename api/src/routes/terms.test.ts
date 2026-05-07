import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createTermsRateLimiter, createTermsRouter } from './terms';

let app: express.Express;

describe('Terms download API', () => {
  beforeEach(() => {
    app = express();
    app.use('/terms', createTermsRouter(createTermsRateLimiter()));
  });

  it('downloads terms in requested language', async () => {
    const response = await request(app)
      .get('/terms/download?lang=fr')
      .set('User-Agent', 'Mozilla/5.0')
      .expect(200);

    expect(response.headers['content-disposition']).toContain('terms-and-conditions-fr.txt');
    expect(response.text).toContain('Conditions générales');
  });

  it('falls back to supported Accept-Language value when query language is invalid', async () => {
    const response = await request(app)
      .get('/terms/download?lang=unknown')
      .set('Accept-Language', 'de-DE,de;q=0.9,en;q=0.8')
      .set('User-Agent', 'Mozilla/5.0')
      .expect(200);

    expect(response.headers['content-disposition']).toContain('terms-and-conditions-de.txt');
  });

  it('blocks crawler and AI bot traffic', async () => {
    const response = await request(app)
      .get('/terms/download')
      .set('User-Agent', 'Mozilla/5.0 (compatible; GPTBot/1.0)')
      .expect(403);

    expect(response.body).toEqual({
      message: 'Automated traffic is not allowed on this endpoint.'
    });
  });

  it('rate limits repeated download requests', async () => {
    for (let i = 0; i < 10; i += 1) {
      await request(app)
        .get('/terms/download')
        .set('User-Agent', 'Mozilla/5.0')
        .expect(200);
    }

    const response = await request(app)
      .get('/terms/download')
      .set('User-Agent', 'Mozilla/5.0')
      .expect(429);

    expect(response.body).toEqual({
      message: 'Too many requests. Please try again later.'
    });
  });
});
