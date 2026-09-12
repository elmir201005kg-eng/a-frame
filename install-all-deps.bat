@echo off
echo Installing authentication dependencies...
npm install bcryptjs jose next-intl
npm install --save-dev @types/bcryptjs
echo Done!
pause
