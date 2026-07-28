const hits = new Map<string, { count: number; resetAt: number }>();

/** Simple in-memory rate limit for public forms (best-effort per instance). */
export function rateLimit(
  key: string,
  limit = 8,
  windowMs = 60 * 60 * 1000,
): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}
