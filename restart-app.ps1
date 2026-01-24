# Restart Script for HisaabKitab
# This script kills any running backend/Electron processes and restarts them

Write-Host "Stopping any running HisaabKitab processes..." -ForegroundColor Yellow

# Kill Electron processes
Get-Process | Where-Object {$_.ProcessName -like "*electron*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Kill Node processes running backend
Get-Process | Where-Object {$_.ProcessName -eq "node" -and $_.Path -like "*HisaabKitab*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

Write-Host "Starting HisaabKitab..." -ForegroundColor Green
npm start






