#!/bin/bash
# Depth OS Native Installer for Linux

set -e

INSTALL_DIR="$HOME/.local/share/depth-os"
APP_NAME="Depth OS"
APP_ID="com.depthos.app"
DESKTOP_DIR="$HOME/.local/share/applications"

echo "Installing $APP_NAME..."

# Create installation directory
mkdir -p "$INSTALL_DIR"

# Ensure the project is built
if [ ! -d "dist" ]; then
    echo "Building project..."
    pnpm run build
fi

# Copy built files
cp -r dist/* "$INSTALL_DIR/"
cp public/favicon.svg "$INSTALL_DIR/icon.svg"

# Create a launcher script
cat > "$INSTALL_DIR/launch.sh" << EOF
#!/bin/bash
cd "$INSTALL_DIR"
# Use a simple python server to serve the files and open in default browser
# We use a random port to avoid conflicts
PORT=5173
python3 -m http.server \$PORT &
SERVER_PID=\$!
sleep 1
xdg-open "http://localhost:\$PORT"
# Wait for the browser to close or just keep the server running
# For simplicity, we'll let it run until manually killed or session ends
wait \$SERVER_PID
EOF
chmod +x "$INSTALL_DIR/launch.sh"

# Create desktop entry
cat > "$DESKTOP_DIR/depth-os.desktop" << EOF
[Desktop Entry]
Name=$APP_NAME
Comment=A 3D immersive desktop environment
Exec=$INSTALL_DIR/launch.sh
Icon=$INSTALL_DIR/icon.svg
Terminal=false
Type=Application
Categories=Utility;Productivity;
EOF

echo "Installation complete!"
echo "You can now find $APP_NAME in your application menu."
