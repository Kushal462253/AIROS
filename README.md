<div align="center">

# AIROS

### Artificial Intelligence Research Operating System

A production-grade AI platform that helps researchers discover, analyze, compare, and reason over scientific literature using multiple AI agents.

[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB.svg)](https://python.org)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-000000.svg)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com)

</div>

---

## Overview

AIROS is a multi-agent AI system designed for scientific research workflows. It enables researchers to:

- **Discover** relevant papers across domains
- **Analyze** evidence quality and methodology
- **Compare** findings and detect contradictions
- **Reason** over knowledge graphs to identify research gaps
- **Generate** novel hypotheses backed by evidence

## Architecture

```
┌────────────────────────────────────────────────────┐
│                 Frontend (Next.js)                  │
│          React · TypeScript · Tailwind CSS          │
│        Framer Motion · React Three Fiber            │
├────────────────────────────────────────────────────┤
│               API Gateway (FastAPI)                 │
│           REST · WebSocket · Auth                   │
├──────────────┬──────────────┬──────────────────────┤
│   AI Agents  │     MCP      │      Services        │
│  (Google ADK │  (Protocol)  │  (Business Logic)    │
│   + Gemini)  │              │                      │
├──────────────┴──────────────┴──────────────────────┤
│        Supabase PostgreSQL    │      ChromaDB       │
│         (Structured Data)     │   (Vector Store)    │
└───────────────────────────────┴────────────────────┘
```

## Folder Structure

```
AIROS/
├── frontend/                # Next.js application
│   └── src/
│       ├── app/             # App Router pages & layouts
│       ├── components/      # Reusable UI components
│       ├── hooks/           # Custom React hooks
│       ├── services/        # API client & integrations
│       ├── types/           # TypeScript type definitions
│       ├── utils/           # Helper functions
│       ├── styles/          # Design tokens & global styles
│       └── assets/          # Static assets
│
├── backend/                 # FastAPI application
│   └── app/
│       ├── api/             # Route handlers & endpoints
│       ├── core/            # Config, security, middleware
│       ├── models/          # Database ORM models
│       ├── schemas/         # Pydantic request/response models
│       ├── services/        # Business logic layer
│       └── utils/           # Shared utilities
│
├── agents/                  # Multi-agent system
│   ├── planner/             # Workflow orchestration
│   ├── retrieval/           # Literature discovery
│   ├── evidence/            # Evidence evaluation
│   ├── contradiction/       # Conflict detection
│   ├── knowledge_graph/     # Knowledge graph operations
│   ├── research_gap/        # Gap identification
│   ├── cross_domain/        # Cross-domain insights
│   ├── hypothesis/          # Hypothesis generation
│   ├── experiment/          # Experiment design
│   ├── memory/              # Long-term context
│   ├── reviewer/            # Quality assurance
│   └── copilot/             # Interactive assistant
│
├── database/                # Schema & migrations
├── mcp/                     # Model Context Protocol
├── docker/                  # Dockerfiles & Compose
├── docs/                    # Documentation
├── scripts/                 # Dev & deployment scripts
└── tests/                   # Test suites
```

## Installation

### Prerequisites

- **Node.js** 20+
- **Python** 3.11+
- **Docker** (optional, for containerized development)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/airos.git
cd airos

# Copy environment variables
cp .env.example .env

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

## Development

### Start the frontend

```bash
cd frontend
npm run dev
# → http://localhost:3000
```

### Start the backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000
# → http://localhost:8000/api/v1/docs (Swagger UI)
```

### Docker

```bash
cd docker
docker-compose up --build
```

### Health Check

```bash
curl http://localhost:8000/api/v1/health
# → {"status": "healthy", "project": "AIROS"}
```

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Frontend       | Next.js 14, React, TypeScript     |
| Styling        | Tailwind CSS, Framer Motion       |
| 3D / Visuals   | React Three Fiber, Drei           |
| Backend        | Python 3.11, FastAPI              |
| Authentication | Supabase Auth, Google OAuth       |
| Database       | Supabase PostgreSQL               |
| Vector Store   | ChromaDB                          |
| AI Engine      | Google Gemini, Google ADK         |
| Protocols      | MCP (Model Context Protocol)      |
| Deployment     | Docker, Google Cloud Run          |

## Roadmap

- [x] Project architecture and scaffolding
- [ ] Supabase authentication (Google OAuth + Email)
- [ ] Research dashboard UI
- [ ] Agent framework with Google ADK
- [ ] Retrieval agent with Semantic Scholar API
- [ ] Evidence evaluation pipeline
- [ ] Knowledge graph construction
- [ ] Contradiction detection engine
- [ ] Research gap analysis
- [ ] Cross-domain insight transfer
- [ ] Hypothesis generation
- [ ] Experiment design assistant
- [ ] MCP tool integrations
- [ ] Real-time collaboration
- [ ] Production deployment on Cloud Run

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/agent-name`)
3. Commit your changes (`git commit -m 'Add agent implementation'`)
4. Push to the branch (`git push origin feature/agent-name`)
5. Open a Pull Request

### Code Standards

- **Frontend**: TypeScript strict mode, ESLint, component-driven architecture
- **Backend**: Python type hints, Ruff linting, Pydantic validation
- **Testing**: pytest (backend), Jest (frontend)
- **Commits**: Conventional Commits format

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with purpose. Engineered for research.**

</div>
