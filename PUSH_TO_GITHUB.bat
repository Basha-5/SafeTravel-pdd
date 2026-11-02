@echo off
title Push SafeTravel Test Cases to GitHub
color 0A

echo ====================================================
echo  SafeTravel - Push All Test Cases to GitHub
echo ====================================================
echo.

cd /d "c:\Users\srava\OneDrive\Desktop\SafeTravel"

echo [1/2] Setting remote origin...
git remote set-url origin https://github.com/Basha-5/SafeTravel-pdd.git

echo [2/2] Pushing to GitHub...
echo A browser window or sign-in prompt will appear.
echo Sign in as Basha-5.
echo.
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ====================================================
    echo [SUCCESS] PUSH COMPLETED! All test cases are now on GitHub!
    echo Refresh: https://github.com/Basha-5/SafeTravel-pdd
    echo ====================================================
) else (
    echo [ERROR] Push failed with code %ERRORLEVEL%.
)

echo.
pause
