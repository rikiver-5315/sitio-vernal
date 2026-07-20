import crypto from 'crypto';

export function generateFingerprint(req) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  const acceptLanguage = req.headers['accept-language'] || 'unknown';

  // Daily granularity: all requests from same user on same day get same fingerprint
  const date = new Date();
  const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const combined = `${ip}|${userAgent}|${acceptLanguage}|${dayKey}`;

  return crypto
    .createHash('sha256')
    .update(combined)
    .digest('hex');
}
