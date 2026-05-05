import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import termsRouter, { SUPPORTED_LANGUAGES } from './terms';

const app = express();
app.use(express.json());
app.use('/terms', termsRouter);

describe('Terms API', () => {
  describe('GET /terms/download', () => {
    it('should return English terms by default (no lang param)', async () => {
      const response = await request(app).get('/terms/download');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/text\/plain/);
      expect(response.headers['content-disposition']).toContain('terms-and-conditions-en.txt');
      expect(response.text).toContain('OCTOCAT SUPPLY');
    });

    it('should return English terms with lang=en', async () => {
      const response = await request(app).get('/terms/download?lang=en');
      expect(response.status).toBe(200);
      expect(response.headers['content-disposition']).toContain('terms-and-conditions-en.txt');
      expect(response.text).toContain('TERMS AND CONDITIONS');
    });

    it('should return French terms with lang=fr', async () => {
      const response = await request(app).get('/terms/download?lang=fr');
      expect(response.status).toBe(200);
      expect(response.headers['content-disposition']).toContain('terms-and-conditions-fr.txt');
      expect(response.text).toContain('CONDITIONS GÉNÉRALES');
    });

    it('should return German terms with lang=de', async () => {
      const response = await request(app).get('/terms/download?lang=de');
      expect(response.status).toBe(200);
      expect(response.headers['content-disposition']).toContain('terms-and-conditions-de.txt');
      expect(response.text).toContain('ALLGEMEINE GESCHÄFTSBEDINGUNGEN');
    });

    it('should return Spanish terms with lang=es', async () => {
      const response = await request(app).get('/terms/download?lang=es');
      expect(response.status).toBe(200);
      expect(response.headers['content-disposition']).toContain('terms-and-conditions-es.txt');
      expect(response.text).toContain('TÉRMINOS Y CONDICIONES');
    });

    it('should return 400 for an unsupported language', async () => {
      const response = await request(app).get('/terms/download?lang=xx');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Unsupported language');
    });

    it('should serve all supported languages without error', async () => {
      for (const lang of SUPPORTED_LANGUAGES) {
        const response = await request(app).get(`/terms/download?lang=${lang}`);
        expect(response.status).toBe(200);
        expect(response.headers['content-disposition']).toContain(`terms-and-conditions-${lang}.txt`);
        expect(response.text.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Bot protection on GET /terms/download', () => {
    it('should block Googlebot', async () => {
      const response = await request(app)
        .get('/terms/download')
        .set('User-Agent', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should block GPTBot (OpenAI)', async () => {
      const response = await request(app)
        .get('/terms/download')
        .set('User-Agent', 'GPTBot/1.0 (+https://openai.com/gptbot)');
      expect(response.status).toBe(403);
    });

    it('should block ClaudeBot (Anthropic)', async () => {
      const response = await request(app)
        .get('/terms/download')
        .set('User-Agent', 'ClaudeBot/1.0 (+https://anthropic.com/claude-web)');
      expect(response.status).toBe(403);
    });

    it('should block Bingbot', async () => {
      const response = await request(app)
        .get('/terms/download')
        .set('User-Agent', 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)');
      expect(response.status).toBe(403);
    });

    it('should block PerplexityBot', async () => {
      const response = await request(app)
        .get('/terms/download')
        .set('User-Agent', 'PerplexityBot/1.0 (+https://perplexity.ai/perplexitybot)');
      expect(response.status).toBe(403);
    });

    it('should allow regular browser user agents', async () => {
      const response = await request(app)
        .get('/terms/download?lang=en')
        .set(
          'User-Agent',
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );
      expect(response.status).toBe(200);
    });

    it('should allow requests with no User-Agent header', async () => {
      const response = await request(app)
        .get('/terms/download?lang=en')
        .unset('User-Agent');
      expect(response.status).toBe(200);
    });
  });
});
