@echo off
cd /d "%~dp0"

echo ==========================
echo Updating w1n8 blog...
echo ==========================

git add .
git commit -m "update blog"
git push

echo ==========================
echo Done.
echo ==========================

pause