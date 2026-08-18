"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  /** Where to send the learner after a session exists */
  href?: string;
  label?: string;
  className?: string;
};

/**
 * Outreach CTA: start a countable learning session, then open the first module
 * (or href) so lesson_started fires without a minted Ludwitt token.
 */
export function StartLearningButton({
  href = "/modules/cold-open",
  label = "Start learning",
  className = "btn",
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/start", { method: "POST" });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Could not start learning session");
      }
      router.push(href);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Start failed");
      setBusy(false);
    }
  }

  return (
    <span className="start-learning-wrap">
      <button
        type="button"
        className={className}
        onClick={start}
        disabled={busy}
      >
        {busy ? "Starting…" : label}
      </button>
      {error ? (
        <span className="error" style={{ display: "block", marginTop: "0.5rem" }}>
          {error}
        </span>
      ) : null}
    </span>
  );
}
