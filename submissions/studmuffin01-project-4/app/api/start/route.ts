import { NextResponse } from "next/server";
import { writePublicLearnerSession } from "@/lib/session";

/**
 * Public self-serve entry for outreach.
 * Creates a learning session cookie (or reuses one), so module lesson_started
 * events can reach the Ludwitt metrics API without a minted /launch token.
 */
export async function POST() {
  const { session, created } = await writePublicLearnerSession();
  return NextResponse.json({
    ok: true,
    created,
    source: session.source,
    // Never return secrets; userId is fine for client debugging
    userId: session.userId,
  });
}
