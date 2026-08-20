# One-shot: PDF check + commit + push + update PR #296
# Run in PowerShell from anywhere:
#   powershell -ExecutionPolicy Bypass -File "C:\Users\raarneaud\Desktop\Ludwitt\hult-cohort-program\submissions\venture-studmuffin01\scripts\push-pack.ps1"

$ErrorActionPreference = "Stop"
$repo = "C:\Users\raarneaud\Desktop\Ludwitt\hult-cohort-program"
$venture = Join-Path $repo "submissions\venture-studmuffin01"
$docs = Join-Path $venture "docs"

Set-Location $repo

# Regenerate PDFs if Node or Python available
$genNode = Join-Path $venture "scripts\generate_pdfs.mjs"
$genPy = Join-Path $venture "scripts\generate_pdfs.py"
if (Get-Command node -ErrorAction SilentlyContinue) {
  node $genNode
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
  python $genPy
}

if (-not (Test-Path (Join-Path $docs "one-pager.pdf"))) { throw "Missing one-pager.pdf" }
if (-not (Test-Path (Join-Path $docs "pitch-deck.pdf"))) { throw "Missing pitch-deck.pdf" }
Write-Host "PDFs present." -ForegroundColor Green

git fetch origin 2>$null
git checkout "participants/summer26/phase-2-venture/studmuffin01"

git add `
  "submissions/venture-studmuffin01/docs/" `
  "submissions/venture-studmuffin01/README.md" `
  "submissions/venture-studmuffin01/SUBMISSION_PR.md" `
  "submissions/venture-studmuffin01/INVESTOR_LOG.md" `
  "submissions/venture-studmuffin01/scripts/"

git status --short

git commit -m "Add venture survey discovery packet and investor PDF exports"
if ($LASTEXITCODE -ne 0) {
  Write-Host "Commit may have failed or nothing to commit — continuing if already committed." -ForegroundColor Yellow
}

# Push to fork (origin often is Studmuffin01 fork when working from participant machine)
git push -u origin "participants/summer26/phase-2-venture/studmuffin01"
# Also try common remote name
git remote -v

$body = @"
## Summary
AI Prompting Academy — MVP workplace AI LMS for professional prompt craft (SCORE / Prompt Like a Pro), with individual + team pricing.

## Investor deck
``submissions/venture-studmuffin01/docs/pitch-deck.pdf``

## One-pager
``submissions/venture-studmuffin01/docs/one-pager.pdf``

## Business plan
``submissions/venture-studmuffin01/docs/business-plan.md``

## Customer discovery
``submissions/venture-studmuffin01/docs/survey-summary.md`` — 35 survey responses (13–15 Aug 2026); 11 pilot leads. Validates problem + soft WTP. Not counted as product users or investor engagement.

## App URL + user metrics
- App: https://prompt-like-a-pro-red.vercel.app
- Metrics source: self-hosted Ludwitt reference API (venture app id: TBD)
- Snapshot (date): TBD — filling before merge (≥25 qualified external users)
- Note: survey respondents are not counted toward the ≥25 user gate

## Investor touch log
``submissions/venture-studmuffin01/INVESTOR_LOG.md`` (PII redacted) — entry pending qualified investor send

## Notes
Used reference API for venture metrics per staff guidance (Week 4 Ludwitt host/docs issues).
Discovery packet and PDFs added after PR open; requesting staff review of evidence pack.
"@

gh pr edit 296 --repo rogerSuperBuilderAlpha/hult-cohort-program --body $body
gh pr view 296 --repo rogerSuperBuilderAlpha/hult-cohort-program --json url,title,commits --jq "{url: .url, title: .title, commits: (.commits | length)}"

Write-Host "`nDone. Open: https://github.com/rogerSuperBuilderAlpha/hult-cohort-program/pull/296" -ForegroundColor Green
