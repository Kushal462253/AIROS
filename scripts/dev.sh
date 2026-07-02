#!/usr/bin/env bash
# AIROS — Start Development Servers
# Usage: ./scripts/dev.sh

set -euo pipefail

echo "Starting AIROS development environment..."

# Start backend
echo "Starting backend on :8000..."
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Start frontend
echo "Starting frontend on :3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "AIROS is running:"
echo "  Frontend → http://localhost:3000"
echo "  Backend  → http://localhost:8000"
echo "  API Docs → http://localhost:8000/api/v1/docs"
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
