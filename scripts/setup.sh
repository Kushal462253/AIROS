#!/usr/bin/env bash
# AIROS — Setup Script
# Usage: ./scripts/setup.sh

set -euo pipefail

echo "Setting up AIROS development environment..."

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env from .env.example"
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo ""
echo "Setup complete. Run './scripts/dev.sh' to start development."
