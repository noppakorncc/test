@echo off
chcp 65001 >nul

set CONTAINER=db
set DB=evaluation_db
set USER=root
set PASS=rootpass

docker exec -i %CONTAINER% mysql -u%USER% -p%PASS% %DB% < backup.sql

echo Restore done
pause   