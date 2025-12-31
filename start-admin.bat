@echo off
echo Starting House of SERE Admin Panel...
echo.
echo Starting backend server on port 8080...
start "Backend Server" cmd /k "cd /d %~dp0 && npm run server"
timeout /t 3 /nobreak > nul
echo.
echo Starting frontend server on port 8080...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo Both servers are starting...
echo Frontend: http://localhost:8080
echo Backend: http://localhost:8080
echo Admin Login: http://localhost:8080/admin/login
echo Admin Dashboard: http://localhost:8080/admin/dashboard
echo.
echo Credentials:
echo Username: admin
echo Password: houseofsere2024
pause