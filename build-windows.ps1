# Depth OS Build Script for Windows (PowerShell)
# This script builds the application for Windows distribution
# Run with: .\build-windows.ps1

param(
    [switch]$Clean,
    [switch]$Portable,
    [switch]$Installer
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Depth OS - Windows Build Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host "`n[1/6] Checking dependencies..." -ForegroundColor Green

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check pnpm
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

Write-Host "[2/6] Installing dependencies..." -ForegroundColor Green
pnpm install

if ($Clean) {
    Write-Host "[3/6] Cleaning build artifacts..." -ForegroundColor Green
    if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
    if (Test-Path "release") { Remove-Item -Recurse -Force "release" }
}

Write-Host "[4/6] Building frontend with Vite..." -ForegroundColor Green
pnpm run build

Write-Host "[5/6] Creating Windows distribution package..." -ForegroundColor Green

# Create release directory
$releaseDir = "release\windows"
if (-not (Test-Path $releaseDir)) {
    New-Item -ItemType Directory -Path $releaseDir -Force | Out-Null
}

# Copy built files
Copy-Item -Path "dist\*" -Destination "$releaseDir\dist" -Recurse -Force

# Create portable ZIP
Write-Host "Creating portable ZIP..." -ForegroundColor Yellow
$zipPath = "$releaseDir\DepthOS-Windows-Portable.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "dist\*" -DestinationPath $zipPath -Force

Write-Host "[6/6] Build complete!" -ForegroundColor Green

Write-Host "`nOutput location: $releaseDir" -ForegroundColor Cyan
Get-ChildItem $releaseDir | Format-Table Name, Length -AutoSize

Write-Host "`nCreated: DepthOS-Windows-Portable.zip" -ForegroundColor Green

if ($Installer) {
    Write-Host "`nFor NSIS installer, install NSIS and run:" -ForegroundColor Yellow
    Write-Host "  cd $releaseDir" -ForegroundColor White
    Write-Host "  makensis setup.nsi" -ForegroundColor White
}
