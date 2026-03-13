# Job AI Platform (Increments 1-5)

Monorepo for an AI-powered Job Search Platform SaaS with:
- Next.js frontend (App Router + NextAuth + protected pages)
- Express backend (JWT-protected API middleware + AI resume generation/edit service)
- PostgreSQL + Prisma schema

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind, NextAuth (Google OAuth)
- Backend: Node.js, Express, TypeScript, JWT auth middleware, OpenAI integration
- Database: PostgreSQL + Prisma ORM
- Shared: Cross-package TypeScript types

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

## Environment Variables

Set in `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/job_ai_platform?schema=public
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_with_a_long_random_secret
JWT_SECRET=replace_with_a_long_random_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Google OAuth Credential Setup

1. Open Google Cloud Console and create/select a project.
2. Configure OAuth consent screen (External/Internal as needed).
3. Create OAuth Client ID credentials (Web application).
4. Add authorized redirect URI:
   - `http://localhost:3000/api/auth/callback/google`
5. Copy generated Client ID and Client Secret to `.env`:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
6. Set `NEXTAUTH_SECRET` and `JWT_SECRET` to strong random values.

## Auth Flow (Increment 2)

- NextAuth handles Google sign-in at `/api/auth/[...nextauth]`
- On first successful login, user is upserted into Prisma `User`
- Frontend session includes `backendAccessToken` (JWT)
- Frontend API client sends `Authorization: Bearer <token>`
- Backend validates token in `authMiddleware` and populates `req.user`
- Protected endpoint available at `GET /users/me`

## Profile + Onboarding (Increment 3)

- User has a 1:1 `Profile` in Prisma
- Onboarding wizard captures role, skills, work history, and education
- Profile is required before dashboard/job/resume features
- Profile endpoints:
  - `GET /profile`
  - `POST /profile`
  - `PUT /profile`

## AI Resume Builder (Increment 4)

- Resume generation endpoint:
  - `POST /resume/generate`
- Resume retrieval endpoints:
  - `GET /resume`
  - `GET /resume/:id`
- Supports either:
  - `jobUrl` (parsed with `axios` + `cheerio`)
  - `jobDescription` (raw text)
- Flow:
  1. Extract/normalize job description
  2. Analyze job requirements with OpenAI
  3. Combine job analysis + user profile
  4. Generate ATS-oriented structured resume JSON
  5. Store in Prisma `Resume.generatedContent`

## Resume Editor (Increment 5)

- Resume editor route:
  - `GET /resume/:id` (load existing)
  - `PUT /resume/:id` (autosave edits)
- Editable sections:
  - Summary
  - Skills
  - Experience
  - Education
- Autosave:
  - Client-side debounce: 2 seconds after last change
  - Backend increments `version` and updates `lastEditedAt`
- Two-column editor layout:
  - Left: Summary, Skills
  - Right: Experience, Education

## Prisma Migration Commands

Run after schema changes:

```bash
# Increment 3 profile model
npm --workspace backend exec prisma migrate dev --name add_user_profile

# Increment 4 resume model fields
npm --workspace backend exec prisma migrate dev --name add_ai_resume_fields

# Increment 5 resume editor fields
npm --workspace backend exec prisma migrate dev --name add_resume_editor_fields
```
