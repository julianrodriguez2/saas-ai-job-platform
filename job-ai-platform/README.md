# Job AI Platform (Increment 1)

Monorepo boilerplate for an AI-powered Job Search Platform SaaS.

## Stack

- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL + Prisma ORM
- Shared: Cross-package TypeScript types
- Integrations: Placeholder structure for Google OAuth and OpenAI service

## Project Structure

```text
job-ai-platform/
  frontend/
  backend/
  shared/
  .env.example
  docker-compose.yml
  README.md
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env file:

```bash
# macOS/Linux
cp .env.example .env

# PowerShell (Windows)
Copy-Item .env.example .env
```

3. Start PostgreSQL:

```bash
docker compose up -d postgres
```

4. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start backend and frontend in separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:4000`

## Increment 1 Scope

- Boilerplate architecture only
- Route/controller wiring only (no business logic)
- Prisma schema only (no feature queries yet)
- UI page scaffolding with reusable sidebar layout
- API client and one example frontend-to-backend call
