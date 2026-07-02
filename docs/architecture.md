# AIROS Architecture

## System Overview

AIROS is a multi-layered platform built on a modular architecture:

```
┌─────────────────────────────────────────┐
│              Frontend (Next.js)          │
├─────────────────────────────────────────┤
│              API Gateway (FastAPI)       │
├──────────┬──────────┬───────────────────┤
│  Agents  │   MCP    │     Services      │
├──────────┴──────────┴───────────────────┤
│     Supabase PostgreSQL  │   ChromaDB   │
└──────────────────────────┴──────────────┘
```

## Design Principles

- **Separation of Concerns** — Each layer has a single responsibility
- **Clean Architecture** — Dependencies point inward
- **Agent Modularity** — Each agent is independently deployable
- **MCP-Ready** — Tools and data sources are protocol-compliant
