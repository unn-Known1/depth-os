#!/bin/bash
# Depth OS Build Script for Windows (using Git Bash / MSYS2 / WSL)
# This script builds the application for Windows distribution

set -e

echo "=========================================="
echo "  Depth OS - Windows Build Script"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}[1/5]${NC} Checking dependencies..."
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}pnpm not found. Installing pnpm...${NC}"
    npm install -g pnpm
fi

echo -e "${GREEN}[2/5]${NC} Installing dependencies..."
pnpm install

echo -e "${GREEN}[3/5]${NC} Building frontend with Vite..."
pnpm run build

echo -e "${GREEN}[4/5]${NC} Creating Windows distribution package..."
mkdir -p release/windows
cd release/windows

# Copy built files
cp -r ../../dist/* ./dist/

# Create installer using NSIS-style structure
cat > setup.nsi << 'EOF'
; Depth OS Windows Installer
; Requires NSIS (Nullsoft Scriptable Install System)

!include "MUI2.nsh"

Name "Depth OS"
OutFile "DepthOS-Setup.exe"
InstallDir "$PROGRAMFILES\DepthOS"
RequestExecutionLevel admin

!define MUI_ICON "depth-os.ico"
!define MUI_UNICON "depth-os.ico"

Function .onInit
  SetOutPath "$INSTDIR"
File /r "dist\*.*"
CreateDirectory "$SMPROGRAMS\Depth OS"
CreateShortCut "$SMPROGRAMS\Depth OS\Depth OS.lnk" "$INSTDIR\index.html"
CreateShortCut "$DESKTOP\Depth OS.lnk" "$INSTDIR\index.html"
FunctionEnd

Section "Install"
  SetOutPath "$INSTDIR"
  File /r "dist\*.*"
  WriteRegStr HKLM "Software\DepthOS" "" "$INSTDIR"
SectionEnd
EOF

# Alternative: Create portable ZIP
cd dist
powershell -Command "Compress-Archive -Path '*' -DestinationPath '../DepthOS-Windows-Portable.zip' -Force"
cd ..

echo -e "${GREEN}[5/5]${NC} Build complete!"
echo ""
echo "Output location: release/windows/"
ls -la release/windows/

echo ""
echo "Created: DepthOS-Windows-Portable.zip"
echo "Note: For installer, install NSIS and run: makensis setup.nsi"
