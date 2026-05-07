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

const router = express.Router();

const BOT_USER_AGENT_PATTERN = /(bot|crawler|spider|slurp|bingpreview|facebookexternalhit|gptbot|chatgpt-user|claude|anthropic|ccbot|curl|wget|python-requests)/i;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;
const downloadRequestsByClient = new Map<string, number[]>();

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
    return true;
  }

  return BOT_USER_AGENT_PATTERN.test(userAgent);
};

const getClientIdentifier = (req: express.Request): string => {
  return req.ip || req.socket.remoteAddress || 'unknown-client';
};

export const resetTermsDownloadRateLimit = (): void => {
  downloadRequestsByClient.clear();
};

const blockBots: express.RequestHandler = (req, res, next) => {
  if (isBlockedBotTraffic(req.get('user-agent'))) {
    res.status(403).json({ message: 'Automated traffic is not allowed on this endpoint.' });
    return;
  }

  next();
};

const limitDownloadRate: express.RequestHandler = (req, res, next) => {
  const now = Date.now();
  const clientIdentifier = getClientIdentifier(req);
  const requests = downloadRequestsByClient.get(clientIdentifier) ?? [];
  const recentRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    res.status(429).json({ message: 'Too many requests. Please try again later.' });
    return;
  }

  recentRequests.push(now);
  downloadRequestsByClient.set(clientIdentifier, recentRequests);
  next();
};

router.get('/download', blockBots, limitDownloadRate, (req, res) => {
  const language = getPreferredLanguage(req.query.lang, req.get('accept-language'));
  const filePath = path.resolve(__dirname, '../../terms', termsFiles[language]);
  const downloadFileName = `terms-and-conditions-${language}.txt`;

  res.download(filePath, downloadFileName, (error) => {
    if (error && !res.headersSent) {
      res.status(500).json({ message: 'Unable to download terms and conditions.' });
    }
  });
});

export default router;
