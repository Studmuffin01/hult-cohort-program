/** Generate simple investor PDFs without deps. Run: node generate_pdfs.mjs */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DOCS = join(dirname(fileURLToPath(import.meta.url)), "..", "docs");

function escape(s) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function pageStream(lines, startY = 750, fontSize = 12, leading = 16) {
  const cmds = ["BT", `/F1 ${fontSize} Tf`];
  let y = startY;
  for (const line of lines) {
    cmds.push(`1 0 0 1 50 ${y} Tm (${escape(line)}) Tj`);
    y -= leading;
    if (y < 50) break;
  }
  cmds.push("ET");
  return cmds.join("\n");
}

function buildPdf(pages) {
  const n = pages.length;
  const pageNums = Array.from({ length: n }, (_, i) => 4 + 2 * i);
  const contentNums = Array.from({ length: n }, (_, i) => 5 + 2 * i);
  const kids = pageNums.map((p) => `${p} 0 R`).join(" ");

  const ordered = [
    Buffer.from("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"),
    Buffer.from(`2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${n} >>\nendobj\n`),
    Buffer.from("3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"),
  ];

  for (let i = 0; i < pages.length; i++) {
    const stream = pageStream(pages[i]);
    ordered.push(
      Buffer.from(
        `${pageNums[i]} 0 obj\n` +
          `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] ` +
          `/Contents ${contentNums[i]} 0 R /Resources << /Font << /F1 3 0 R >> >> >>\n` +
          `endobj\n`
      )
    );
    ordered.push(
      Buffer.from(
        `${contentNums[i]} 0 obj\n<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream\nendobj\n`,
        "latin1"
      )
    );
  }

  const out = [Buffer.from("%PDF-1.4\n")];
  const offsets = [0];
  for (const obj of ordered) {
    offsets.push(Buffer.concat(out).length);
    out.push(obj);
  }

  const body = Buffer.concat(out);
  const xrefPos = body.length;
  let xref = `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  xref += `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;

  return Buffer.concat([body, Buffer.from(xref)]);
}

const onePager = [
  [
    "AI Prompting Academy — One-pager",
    "",
    "Workplace learning platform for practical AI prompting skills.",
    "Rawle Arneaud · Founder, AI Prompting Academy",
    "",
    "PROBLEM",
    "Copilot is rolled out; drafts stay mushy, invented, or unusable upstairs.",
    "Tip threads and long MOOCs do not create an on-the-job habit.",
    "",
    "PRODUCT",
    "- SCORE curriculum (Prompt Like a Pro) in an Academy LMS shell",
    "- Modules, quizzes, baseline to retest, progress tracking",
    "- Individuals + team seats (/pricing)",
    "",
    "WHY NOW",
    "GenAI is mandated at work; skill gap is method, not model access.",
    "",
    "PRICING (pilot hypothesis)",
    "Individual: $29 one-time / $9 mo | Team: $199 / 10 seats",
    "",
    "TRACTION",
    "- Live: https://prompt-like-a-pro-red.vercel.app",
    "- Customer discovery: 35 survey responses (13-15 Aug 2026)",
    "- 11 pilot leads (asked to be contacted)",
    "- Product users: 10 qualified external (20 Aug 2026 snapshot)",
    "- Survey respondents are not product users",
    "",
    "ASK",
    "20 minutes for deck/pricing feedback, or intro to an L&D buyer.",
  ],
];

const deckPages = [
  ["AI Prompting Academy", "", "Workplace AI learning for prompt craft", "", "Rawle Arneaud · Founder", "https://prompt-like-a-pro-red.vercel.app"],
  ["Problem", "", "Professionals have Copilot. Prompts still fail.", "- Vague asks -> mushy drafts", "- Invented certainty -> unsafe to send", "- Rewrites erase the time AI should save"],
  ["Insight", "", "The skill gap is METHOD, not model access.", "Teams need a short, repeatable way to ask."],
  ["Solution", "", "AI Prompting Academy — workplace learning platform.", "First course: SCORE (Prompt Like a Pro)."],
  ["Product", "", "- ~60 min SCORE curriculum", "- Modules, quizzes, baseline -> retest", "- Individual + team access at /pricing"],
  ["Demo", "", "https://prompt-like-a-pro-red.vercel.app", "Apply SCORE to a real email or status update."],
  ["Customer discovery", "", "35 survey responses (13-15 Aug 2026)", "- Pain: generic output, rewrite, trust, prompts", "- WTP: mostly free / under TT$150; minority TT$150-300", "- 11 asked to be contacted (pilot leads)", "", "Insight: gap is prompt effectiveness, not AI access."],
  ["Business model", "", "Individual: $29 / $9 mo (hypothesis)", "Team: $199 / 10 seats (hypothesis)", "Enterprise: custom (roadmap)"],
  ["Traction", "", "- Production app live", "- 35 survey / 11 pilot leads", "- 10 qualified external users (20 Aug 2026)", "- Survey != product users"],
  ["The ask", "", "20 minutes for feedback or an intro", "to an L&D / workplace-AI training buyer."],
  ["Close", "", "Prompt craft for Copilot that managers can forward.", "", "https://prompt-like-a-pro-red.vercel.app", "Rawle Arneaud · Founder"],
];

mkdirSync(DOCS, { recursive: true });
const onePath = join(DOCS, "one-pager.pdf");
const deckPath = join(DOCS, "pitch-deck.pdf");
writeFileSync(onePath, buildPdf(onePager));
writeFileSync(deckPath, buildPdf(deckPages));
console.log("Wrote", onePath);
console.log("Wrote", deckPath);
