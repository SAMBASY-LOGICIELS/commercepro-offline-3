@echo off
chcp 65001 >nul
title Creation de CommercePro Offline (.exe)
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js n'est pas installe.
  echo Telechargez la version LTS sur https://nodejs.org , installez-la, puis relancez ce fichier.
  pause
  exit /b 1
)

echo [1/2] Installation des outils (Internet requis, quelques minutes la premiere fois)...
call npm install
if errorlevel 1 goto :err

echo [2/2] Creation des fichiers .exe...
call npm run dist:win
if errorlevel 1 goto :err

echo.
echo Termine ! Vos fichiers sont dans le dossier "dist" :
echo   - CommercePro-Offline-Installateur-x.x.x.exe  (installation classique)
echo   - CommercePro-Offline-Portable-x.x.x.exe      (sans installation, cle USB)
explorer dist
pause
exit /b 0

:err
echo.
echo Une erreur est survenue. Verifiez votre connexion Internet puis relancez.
pause
exit /b 1
