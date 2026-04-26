#!/bin/bash
# Depth OS Build Script for Linux
# This script builds the application for Linux distribution

set -e

echo "=========================================="
echo "  Depth OS - Linux Build Script"
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

echo -e "${GREEN}[4/5]${NC} Creating Linux distribution package..."
mkdir -p release/linux

# Get the script's directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
cd "$PROJECT_ROOT"

# Create AppImage structure
mkdir -p release/linux/AppDir
cd release/linux/AppDir

# Copy built files
cp -r "$PROJECT_ROOT/dist/"* .

# Create AppRun script
cat > AppRun << 'EOF'
#!/bin/bash
self=$(readlink -f "$0")
here=${self%/*}
export PATH="${here}/usr/bin:${PATH}"
export LD_LIBRARY_PATH="${here}/usr/lib:${LD_LIBRARY_PATH}"
exec "${here}/usr/bin/depth-os" "$@"
EOF
chmod +x AppRun

# Create AppImage.yml for appimagetool
cat > AppImage.yml << 'EOF'
app: DepthOS
appid: com.depthos.app
icon: depth-os.png
args:
  - $APPRDIR
runtime:
  path: /usr/bin/bash
  args:
    - $APPRDIR/AppRun
EOF

cd "$PROJECT_ROOT"
echo -e "${GREEN}[5/5]${NC} Build complete!"
echo ""
echo "Output location: $PROJECT_ROOT/release/linux/"
ls -la "$PROJECT_ROOT/release/linux/"

# Create tar archive
cd "$PROJECT_ROOT/release/linux"
tar -czvf depth-os-linux.tar.gz AppDir/
echo ""
echo "Created: depth-os-linux.tar.gz"
