# Job Tracker

A full-stack job application tracker built with Next.js 16, Supabase, and TypeScript. Track applications, add notes, and generate AI-powered cover letters.

## Features

- Track job applications with status, salary range, notes, pros/cons
- AI cover letter generation using Claude (streaming, so you see it being written in real time)
- Authentication via Supabase — protected at both the proxy and API route level
- Modal view when navigating from the list, full page when opening a direct URL

## Tech stack

- **Next.js 16** (App Router) — file-based routing, intercepting routes for the modal, route handlers for the API
- **Supabase** — PostgreSQL database + auth
- **React Query** — server state, caching, mutations
- **styled-components** — all styling, no Tailwind
- **blunt-ui** — my own React component library (neo-brutalism style, [npmjs.com/package/blunt-ui](https://npmjs.com/package/blunt-ui))
- **Anthropic Claude API** — streaming cover letter generation
- **Vitest + React Testing Library** — unit and integration tests

## Architecture

```
app/
  api/applications/        # REST API (auth + ownership checks on every route)
    [id]/cover-letter/     # Streaming Claude endpoint
    [id]/details/          # Application notes, pros/cons, cover letter
  applications/[id]/       # Detail page + ApplicationDetailsContent component
  @modal/                  # Intercepting route — shows detail as modal when navigating from list
  lib/                     # Shared: hooks, models, auth, Supabase clients
  login/                   # Login page
proxy.ts                   # Auth guard — redirects unauthenticated users to /login
```

### Data model

Two tables in Supabase:

- `applications` — list fields (company, role, location, status, etc.)
- `application_details` — detail-only fields (contact, notes, pros/cons, cover letter)

The detail view fetches both in a single GET and merges them. Saves go to the right table separately.

### Auth

Double-layered:
1. `proxy.ts` intercepts every request and redirects to `/login` if no session
2. Every API route handler independently checks auth via `authenticateUser()` and filters all DB queries by `userId`

## Running locally

```bash
npm install
npm run dev
```

You'll need a `.env` with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```

## Scripts

```bash
npm run dev          # start dev server
npm run build        # production build
npm run test         # run tests
npm run lint         # ESLint
npm run format       # ESLint --fix
npm run tsc          # type check
```
