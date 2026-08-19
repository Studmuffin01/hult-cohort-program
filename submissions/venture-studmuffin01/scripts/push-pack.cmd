@echo off
setlocal enabledelayedexpansion
cd /d C:\Users\raarneaud\Desktop\Ludwitt\hult-cohort-program
if errorlevel 1 (
  echo Failed to cd to repo
  exit /b 1
)

echo === Check PDFs ===
if not exist "submissions\venture-studmuffin01\docs\one-pager.pdf" (
  echo Missing one-pager.pdf
  exit /b 1
)
if not exist "submissions\venture-studmuffin01\docs\pitch-deck.pdf" (
  echo Missing pitch-deck.pdf
  exit /b 1
)
echo PDFs OK

echo === Checkout branch ===
git checkout participants/summer26/phase-2-venture/studmuffin01
if errorlevel 1 exit /b 1

echo === Stage files ===
git add submissions/venture-studmuffin01/docs/
git add submissions/venture-studmuffin01/README.md
git add submissions/venture-studmuffin01/SUBMISSION_PR.md
git add submissions/venture-studmuffin01/INVESTOR_LOG.md
git add submissions/venture-studmuffin01/scripts/
git status --short

echo === Commit ===
git commit -m "Add venture survey discovery packet and investor PDF exports"
REM continue even if nothing to commit

echo === Push ===
REM Prefer "fork" (Studmuffin01); fall back to origin only if that is the fork
git remote -v
git push -u fork participants/summer26/phase-2-venture/studmuffin01
if errorlevel 1 (
  echo Push to fork failed — trying origin...
  git push -u origin participants/summer26/phase-2-venture/studmuffin01
  if errorlevel 1 (
    echo Push failed — check remotes. Need write access to Studmuffin01 fork.
    exit /b 1
  )
)

echo === Update PR #296 body ===
gh pr edit 296 --repo rogerSuperBuilderAlpha/hult-cohort-program --body-file submissions\venture-studmuffin01\scripts\pr-body-296.md
if errorlevel 1 (
  echo gh pr edit failed — paste body from SUBMISSION_PR.md into the PR manually
)

echo.
echo Done. Open: https://github.com/rogerSuperBuilderAlpha/hult-cohort-program/pull/296
endlocal
