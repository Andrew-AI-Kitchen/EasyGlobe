@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 launcher.py
  goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
  python launcher.py
  goto :end
)
echo Python 3 is required. Install it from https://python.org and try again.
pause
:end
