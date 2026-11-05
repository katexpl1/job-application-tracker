# Job Tracker

A job application tracker I built with Next.js 16, Supabase and TypeScript. You can track your applications, keep notes on each one, and generate a cover letter with AI.

## What it does

- Track job applications with status, salary range, notes, pros and cons
- Generate cover letters with Claude. It streams, so you watch the text get written instead of waiting for the whole thing
- Login with Supabase auth
- Clicking an application opens it in a modal, but opening the URL directly shows the full page

## Tech stack

- **Next.js 16** (App Router) for routing, server rendering and the API
- **Supabase** for the database (PostgreSQL) and auth
- **React Query** for client side data fetching and caching
- **styled-components** for styling (no Tailwind)
- **blunt-ui**, my own component library ([npmjs.com/package/blunt-ui](https://npmjs.com/package/blunt-ui))
- **Claude API** for the cover letter generation
- **Vitest + React Testing Library** for tests

## How it's structured

```
src/
  app/                        Next.js routes
    api/applications/         API routes (each one checks auth and ownership)
      [id]/cover-letter/      streaming Claude endpoint
      [id]/details/           notes, pros/cons, cover letter
    applications/[id]/        detail page
    @modal/                   intercepting route for the modal version
    ApplicationsList/         home page list + server queries
  components/
    AddApplicationModal/      add form + server action
  lib/                        shared hooks, models, auth, Supabase clients
    applications/             domain types, enums, validators
    models/                   API types + generated Supabase types
proxy.ts                      redirects you to /login if you're not signed in
```

The home page and the detail page fetch their data on the server and pass it down, so you see content right away instead of a loading spinner. React Query takes over on the client after that (for sorting, deleting, saving). Creating and deleting go through server actions.

## Data model

There are two tables:

- `applications` - the fields you see in the list (company, role, location, status, etc.)
- `application_details` - the extra stuff you only see when you open an application (contact, notes, pros/cons, cover letter)

The detail view loads both and merges them. Saves go to whichever table the field belongs to.

## Auth

Two layers:

1. `proxy.ts` runs before every request and sends you to `/login` if there's no session
2. Every API route also checks auth on its own and filters queries by your user id, so you can't read someone else's data even if you hit the API directly

## Running it

```bash
npm install
npm run dev
```

You need a `.env` file with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_DEMO_EMAIL=
NEXT_PUBLIC_DEMO_PASSWORD=
```

## Scripts

```bash
npm run dev       # dev server
npm run build     # production build
npm run test      # run tests
npm run lint      # eslint
npm run format    # eslint --fix
npm run tsc       # type check
npm run db:types  # regenerate Supabase types from the schema
```

## A note on the Supabase types

The types in `src/lib/models/database.types.ts` are generated from the actual database schema with `npm run db:types`. Don't edit that file by hand, it gets overwritten. Run the command again whenever you change the schema.
