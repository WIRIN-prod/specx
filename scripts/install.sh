#!/usr/bin/env bash
set -euo pipefail

# specX install script — installs @specx/cli via npm
echo "Installing @specx/cli..."
npm install -g @specx/cli@latest
echo "Done. Run: specx init"
