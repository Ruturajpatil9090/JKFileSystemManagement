#!/bin/bash

# Navigate to the directory where your ReactJS and Node.js code is located
cd D/Choice Center


# Wait for a moment to allow the backend to start before starting the frontend


# Start the ReactJS frontend in a new command prompt window
npm run dev


REM Wait for a moment
timeout /t 2

REM Run the second batch file
call "D:\Choice Center\Server\choicecenter1.bat"

REM Keep the command prompt open (remove the line below if you don't want to keep it open)
pause