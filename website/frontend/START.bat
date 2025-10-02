@echo off
title iBanking - Tuition Payment System
color 0A

echo ========================================
echo   iBanking - He thong thanh toan hoc phi
echo   With Beautiful Animations ^& Effects
echo ========================================
echo.

if not exist "node_modules" (
    echo [1/2] Dang cai dat dependencies...
    echo.
    call npm install
    echo.
    echo Dependencies da duoc cai dat!
    echo.
) else (
    echo Dependencies da co san!
    echo.
)

echo [2/2] Dang khoi dong server...
echo.
echo Server se chay tai: http://localhost:3000
echo Nhan Ctrl+C de dung server
echo.
call npm run dev

pause

