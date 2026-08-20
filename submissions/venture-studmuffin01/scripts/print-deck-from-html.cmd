@echo off
setlocal
cd /d C:\Users\raarneaud\Desktop\Ludwitt\hult-cohort-program\submissions\venture-studmuffin01\docs

set HTML=%CD%\pitch-deck.html
set OUT=%CD%\pitch-deck.pdf

echo === Better PDF: print pitch-deck.html in Chrome/Edge ===
echo.
echo 1. Open this file in Chrome or Edge:
echo    %HTML%
echo.
echo 2. Ctrl+P
echo 3. Destination: Save as PDF
echo 4. More settings: Landscape, Background graphics ON
echo 5. Save as pitch-deck.pdf in this same docs folder (overwrite)
echo.
echo Then re-upload to Google Drive and test the share link.
start "" "%HTML%"
endlocal
