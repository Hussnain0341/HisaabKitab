@echo off
echo Stopping all Electron and Node processes...
taskkill /F /IM electron.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Starting application...
npm start






