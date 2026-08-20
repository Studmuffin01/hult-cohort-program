@echo off
setlocal
cd /d C:\Users\raarneaud\Desktop\Ludwitt\hult-cohort-program

echo === Check for unresolved merge conflicts ===
git diff --name-only --diff-filter=U submissions\venture-studmuffin01\ 2>nul | findstr /R "." >nul
if not errorlevel 1 (
  echo.
  echo Git still has unmerged venture files. Stage them first:
  echo   git add submissions/venture-studmuffin01/
  echo.
  exit /b 1
)

for /f "delims=" %%B in ('git branch --show-current 2^>nul') do set CURRENT=%%B
set TARGET=participants/summer26/phase-2-venture/studmuffin01

if /I not "%CURRENT%"=="%TARGET%" (
  echo === Switch to venture branch ===
  git fetch fork %TARGET% 2>nul
  git checkout %TARGET%
  if errorlevel 1 (
    echo Checkout failed
    exit /b 1
  )
) else (
  echo === Already on venture branch ===
)

echo === Regenerate PDFs ===
set GEN_OK=0

where node >nul 2>&1
if not errorlevel 1 (
  node submissions\venture-studmuffin01\scripts\generate_pdfs.mjs
  if not errorlevel 1 set GEN_OK=1
)

if "%GEN_OK%"=="0" (
  where py >nul 2>&1
  if not errorlevel 1 (
    py -3 submissions\venture-studmuffin01\scripts\generate_pdfs.py
    if not errorlevel 1 set GEN_OK=1
  )
)

if "%GEN_OK%"=="0" (
  where python >nul 2>&1
  if not errorlevel 1 (
    python submissions\venture-studmuffin01\scripts\generate_pdfs.py
    if not errorlevel 1 set GEN_OK=1
  )
)

if "%GEN_OK%"=="0" (
  echo.
  echo Could not find Node or Python on PATH.
  echo.
  echo Option A — install Node LTS from https://nodejs.org/ then re-run this script.
  echo Option B — manual browser export:
  echo   1. Open submissions\venture-studmuffin01\docs\one-pager.html in Chrome/Edge
  echo   2. Ctrl+P ^> Save as PDF ^> save as one-pager.pdf in the same docs folder
  echo   3. Repeat for pitch-deck.html ^> pitch-deck.pdf
  echo.
  exit /b 1
)

echo === Status ===
git status --short submissions\venture-studmuffin01\

echo.
echo Done. Attach from:
echo   submissions\venture-studmuffin01\docs\one-pager.pdf
echo   submissions\venture-studmuffin01\docs\pitch-deck.pdf
echo Venture overview (copy to Word if needed):
echo   submissions\venture-studmuffin01\docs\venture-overview.md
endlocal
