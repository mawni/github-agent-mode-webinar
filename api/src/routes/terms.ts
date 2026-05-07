/**
 * @swagger
 * tags:
 *   name: Terms
 *   description: Terms and conditions download endpoints
 */

/**
 * @swagger
 * /api/terms/download:
 *   get:
 *     summary: Download terms and conditions document
 *     tags: [Terms]
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, fr, de, es]
 *         required: false
 *         description: Preferred language code
 *     responses:
 *       200:
 *         description: Terms and conditions file download
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Bot and crawler traffic blocked
 *       429:
 *         description: Too many requests
 */

import express from 'express';
import path from 'path';
import { rateLimit } from 'express-rate-limit';

const BOT_USER_AGENT_PATTERN = /\b(bot|crawler|spider|slurp|bingpreview|facebookexternalhit|gptbot|chatgpt-user|claude|anthropic|ccbot|python-requests)\b/i;
const DOWNLOAD_RATE_LIMIT_WINDOW_MS = Number(process.env.TERMS_RATE_LIMIT_WINDOW_MS) || 60_000;
const DOWNLOAD_RATE_LIMIT_MAX_REQUESTS = Number(process.env.TERMS_RATE_LIMIT_MAX_REQUESTS) || 10;
const TERMS_DIRECTORY_PATH = process.env.TERMS_DIRECTORY_PATH
  ? path.resolve(process.env.TERMS_DIRECTORY_PATH)
  : path.resolve(__dirname, '../../terms');

const termsFiles = {
  en: 'terms-en.txt',
  fr: 'terms-fr.txt',
  de: 'terms-de.txt',
  es: 'terms-es.txt'
} as const;

type SupportedLanguage = keyof typeof termsFiles;

const isSupportedLanguage = (value: string): value is SupportedLanguage => {
  return value in termsFiles;
};

const getPreferredLanguage = (queryLanguage: unknown, acceptLanguageHeader?: string): SupportedLanguage => {
  if (typeof queryLanguage === 'string') {
    const normalizedQueryLanguage = queryLanguage.toLowerCase().trim().split('-')[0];
    if (isSupportedLanguage(normalizedQueryLanguage)) {
      return normalizedQueryLanguage;
    }
  }

  if (acceptLanguageHeader) {
    const languageRanges = acceptLanguageHeader.split(',');
    for (const languageRange of languageRanges) {
      const normalizedLanguage = languageRange.trim().toLowerCase().split(';')[0].split('-')[0];
      if (isSupportedLanguage(normalizedLanguage)) {
        return normalizedLanguage;
      }
    }
  }

  return 'en';
};

const isBlockedBotTraffic = (userAgent?: string): boolean => {
  if (!userAgent) {
    return false;
  }

  return BOT_USER_AGENT_PATTERN.test(userAgent);
};

const blockBots: express.RequestHandler = (req, res, next) => {
  if (isBlockedBotTraffic(req.get('user-agent'))) {
    res.status(403).json({ message: 'Automated traffic is not allowed on this endpoint.' });
    return;
  }

  next();
};

export const createTermsRateLimiter = (): express.RequestHandler => {
  return rateLimit({
    windowMs: DOWNLOAD_RATE_LIMIT_WINDOW_MS,
    max: DOWNLOAD_RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please try again later.' }
  });
};

const sharedTermsRateLimiter = createTermsRateLimiter();

export const createTermsRouter = (rateLimiterMiddleware: express.RequestHandler = sharedTermsRateLimiter): express.Router => {
  const router = express.Router();

  router.get('/download', blockBots, rateLimiterMiddleware, (req, res) => {
    const language = getPreferredLanguage(req.query.lang, req.get('accept-language'));
    const filePath = path.resolve(TERMS_DIRECTORY_PATH, termsFiles[language]);
    const downloadFileName = `terms-and-conditions-${language}.txt`;

    res.download(filePath, downloadFileName, (error) => {
      if (error && !res.headersSent) {
        console.error('Terms download failed:', error);
        res.status(500).json({ message: 'Unable to download terms and conditions.' });
      }
    });
  });

  return router;
};

export default createTermsRouter();
