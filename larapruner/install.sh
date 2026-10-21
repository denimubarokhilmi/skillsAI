#!/usr/bin/env bash
# Larapruner installer
# Usage: bash install.sh

set -e

INSTALL_DIR="$HOME/.codex/tools/larapruner"
BIN_DIR="$INSTALL_DIR/bin"
SRC_DIR="$INSTALL_DIR/src"

echo "Installing Larapruner..."

# Check PHP
if ! command -v php &>/dev/null; then
    echo "Error: PHP is required but not installed."
    echo "  Ubuntu/Debian: sudo apt install php-cli"
    echo "  macOS:         brew install php"
    echo "  Windows:       https://www.php.net/downloads"
    exit 1
fi

PHP_VER=$(php -r 'echo PHP_MAJOR_VERSION;')
if [ "$PHP_VER" -lt 8 ]; then
    echo "Error: PHP 8.0+ required (found PHP $PHP_VER)"
    exit 1
fi

# Create dirs
mkdir -p "$BIN_DIR" "$SRC_DIR"

# Copy files (works if run from repo root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cp "$SCRIPT_DIR/bin/larapruner" "$BIN_DIR/larapruner"
cp "$SCRIPT_DIR/src/"*.php "$SRC_DIR/"
chmod +x "$BIN_DIR/larapruner"

# PATH check
if ! echo "$PATH" | grep -q "$BIN_DIR"; then
    echo ""
    echo "Add this to your ~/.bashrc or ~/.zshrc:"
    echo "  export PATH=\"\$PATH:$BIN_DIR\""
    echo ""
    echo "Then reload: source ~/.bashrc"
fi

echo "Done! Verify with: larapruner --version"
