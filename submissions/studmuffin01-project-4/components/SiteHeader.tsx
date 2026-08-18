import Link from "next/link";
import { academyMeta } from "@/content/academy";

/** Public nav — keep lean for learners. Wiring pages stay at /launch and /integration (not linked here). */
export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <span className="brand-mark">{academyMeta.name}</span>
        <span className="brand-title">SCORE · Prompt Like a Pro</span>
      </Link>
      <nav className="nav" aria-label="Primary">
        <Link href="/">Home</Link>
        <Link href="/modules">Modules</Link>
        <Link href="/pricing">Pricing</Link>
      </nav>
    </header>
  );
}
