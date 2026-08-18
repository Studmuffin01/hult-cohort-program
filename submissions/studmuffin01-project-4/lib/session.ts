import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export const SESSION_COOKIE = "score_session";

export type LearnerSession = {
  userId: string;
  email?: string;
  appId?: string;
  sessionId: string;
  launchedAt: string;
  source: "ludwitt" | "dev-bypass" | "public";
};

export async function readSession(): Promise<LearnerSession | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as LearnerSession;
    if (!parsed.userId || !parsed.sessionId) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeSessionCookie(session: LearnerSession): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

/** Call only from Route Handlers / Server Actions. */
export async function writeDevBypassSession(): Promise<LearnerSession> {
  const session: LearnerSession = {
    userId: "dev-local-user",
    email: "dev@localhost",
    sessionId: randomUUID(),
    launchedAt: new Date().toISOString(),
    source: "dev-bypass",
  };
  await writeSessionCookie(session);
  return session;
}

/**
 * Public self-serve start (outreach). Unique userId per new browser session so
 * strangers count toward Ludwitt metrics without a minted launch token.
 * Reuses an existing cookie session if present (same browser = same user).
 */
export async function writePublicLearnerSession(): Promise<{
  session: LearnerSession;
  created: boolean;
}> {
  const existing = await readSession();
  if (existing) {
    return { session: existing, created: false };
  }

  const session: LearnerSession = {
    userId: randomUUID(),
    sessionId: randomUUID(),
    launchedAt: new Date().toISOString(),
    source: "public",
    appId: process.env.LUDWITT_APP_ID?.trim() || undefined,
  };
  await writeSessionCookie(session);
  return { session, created: true };
}
