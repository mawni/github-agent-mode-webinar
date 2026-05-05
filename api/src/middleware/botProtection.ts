import { Request, Response, NextFunction } from 'express';

/**
 * Known bot and crawler User-Agent patterns to block.
 * Includes major search engine bots and AI crawlers.
 */
const BOT_PATTERNS = [
  // Search engine bots
  /Googlebot/i,
  /Bingbot/i,
  /Slurp/i,           // Yahoo
  /DuckDuckBot/i,
  /Baiduspider/i,
  /YandexBot/i,
  /Sogou/i,
  /Exabot/i,
  /facebot/i,
  /ia_archiver/i,     // Alexa / Wayback Machine
  /Applebot/i,
  /Twitterbot/i,
  /LinkedInBot/i,
  /Pinterest/i,
  /Discordbot/i,

  // AI and LLM crawlers
  /GPTBot/i,
  /ChatGPT-User/i,
  /OAI-SearchBot/i,
  /ClaudeBot/i,
  /Claude-Web/i,
  /anthropic-ai/i,
  /PerplexityBot/i,
  /Bytespider/i,      // ByteDance / TikTok AI
  /YouBot/i,
  /cohere-ai/i,
  /FacebookBot/i,
  /Omgili/i,
  /Diffbot/i,
  /Scrapy/i,

  // Generic crawlers / scrapers
  /crawler/i,
  /spider/i,
  /scraper/i,
  /headlesschrome/i,
  /PhantomJS/i,
];

/**
 * Middleware that returns 403 Forbidden when the request originates from
 * a known search-engine or AI bot, based on the User-Agent header.
 */
export function botProtection(req: Request, res: Response, next: NextFunction): void {
  const userAgent = req.headers['user-agent'] ?? '';

  const isBot = BOT_PATTERNS.some((pattern) => pattern.test(userAgent));

  if (isBot) {
    res.status(403).json({ error: 'Access denied: automated crawlers are not permitted.' });
    return;
  }

  next();
}
