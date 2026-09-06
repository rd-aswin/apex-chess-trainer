@echo off
title Apex Chess Trainer Launcher
cd /d "%~dp0"

echo =======================================================
echo   APEX CHESS TRAINER - 100%% Offline Superhuman Coach
echo   Stockfish 19 NNUE (AVX-512 Superhuman Engine, Level 20)
echo =======================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% equ 0 goto NODE_OK
echo [ERROR] Node.js is not installed or not in PATH!
echo Please install Node.js v18 or higher from https://nodejs.org
echo.
pause
exit /b 1

:NODE_OK
:: Ensure data directory exists
if not exist "data" mkdir data
if not exist "data\history.json" echo [] > data\history.json

:: Ensure Desktop Shortcut with custom icon exists
if exist "%USERPROFILE%\Desktop\Apex Chess Trainer.lnk" goto SHORTCUT_OK
echo [Setup] Creating Desktop Shortcut with custom Apex Chess logo...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$WshShell = New-Object -ComObject WScript.Shell; $s = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\Apex Chess Trainer.lnk'); $s.TargetPath = '%~dp0run.bat'; $s.WorkingDirectory = '%~dp0'; $s.IconLocation = '%~dp0app.ico, 0'; $s.Description = 'Apex Chess Trainer - Stockfish 19'; $s.WindowStyle = 1; $s.Save()" >nul 2>nul
:SHORTCUT_OK

:: Check if backend is already listening on port 5000
netstat -ano | findstr ":5000" | findstr "LISTENING" >nul 2>nul
if %errorlevel% equ 0 goto BACKEND_RUNNING
echo [1/3] Starting Stockfish 19 Backend Server (Port 5000)...
start "Apex Chess - Backend" cmd /k "cd /d "%~dp0server" && node index.js"
ping 127.0.0.1 -n 3 >nul
goto CHECK_FRONTEND

:BACKEND_RUNNING
echo [1/3] Backend server is already running on port 5000.

:CHECK_FRONTEND
:: Check if frontend is already listening on port 5173
netstat -ano | findstr ":5173" | findstr "LISTENING" >nul 2>nul
if %errorlevel% equ 0 goto FRONTEND_RUNNING
echo [2/3] Starting Chess Trainer Frontend (Vite)...
start "Apex Chess - Frontend" cmd /k "cd /d "%~dp0client" && npm.cmd run dev"
ping 127.0.0.1 -n 3 >nul
goto LAUNCH_APP

:FRONTEND_RUNNING
echo [2/3] Frontend server is already running on port 5173.

:LAUNCH_APP
echo [3/3] Opening Apex Chess Trainer in Standalone App Window...

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://localhost:5173
    goto FINISHED
)
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:5173
    goto FINISHED
)
start http://localhost:5173

:FINISHED
echo.
echo =======================================================
echo   Apex Chess Trainer is active!
echo   URL: http://localhost:5173
echo.
echo   Keep this launcher window open while training.
echo   Press any key to close this launcher.
echo =======================================================
echo.
pause
