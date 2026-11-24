@echo off
chcp 65001 >nul

set DB=evaluation_db
set USER=root
set PASS=rootpass

docker compose exec -T db mysqldump -u%USER% -p%PASS% --single-transaction %DB% > backup.sql


echo Backup done: backup.sql
pause