import { LoginAttempt } from "../models/loginAttempt";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimitKey(email: string, ip: string): string {
  return `${(email ?? "").toLowerCase()}|${ip ?? "unknown"}`;
}

export async function checkLoginRateLimit(key: string): Promise<RateLimitResult> {
  const now = Date.now();

  const attempt = await LoginAttempt.findOne({ key });

  if (!attempt) {
    return { allowed: true, remaining: MAX_ATTEMPTS, retryAfterSeconds: 0 };
  }

  const expired = now - new Date(attempt.windowStart).getTime() > WINDOW_MS;
  if (expired) {
    return { allowed: true, remaining: MAX_ATTEMPTS, retryAfterSeconds: 0 };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - attempt.count);
  if (remaining > 0) {
    return { allowed: true, remaining, retryAfterSeconds: 0 };
  }

  const retryAfterSeconds = Math.ceil(
    (new Date(attempt.windowStart).getTime() + WINDOW_MS - now) / 1000
  );
  return { allowed: false, remaining: 0, retryAfterSeconds };
}

export async function recordLoginFailure(key: string): Promise<void> {
  const now = Date.now();

  const attempt = await LoginAttempt.findOne({ key });

  if (!attempt) {
    await LoginAttempt.create({ key, count: 1, windowStart: new Date(now) });
    return;
  }

  const expired = now - new Date(attempt.windowStart).getTime() > WINDOW_MS;
  if (expired) {
    attempt.count = 1;
    attempt.windowStart = new Date(now);
  } else {
    attempt.count += 1;
  }

  await attempt.save();
}

export async function resetLoginRateLimit(key: string): Promise<void> {
  await LoginAttempt.deleteOne({ key });
}