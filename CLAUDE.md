# CLAUDE.md — job-tracker

## Tech stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **styled-components** — all styling
- **Supabase** — database and auth
- **blunt-ui** — component library
- **Jest + Testing Library** — unit tests

## File structure

Feature folders follow the same `FeatureName.<role>.ts(x)` convention throughout:

```
FeatureName/
  tests/                        # all test files
    FeatureName.test.tsx
    FeatureName.helpers.test.ts (if needed)
  FeatureName.tsx               # main component
  FeatureName.types.ts          # TypeScript interfaces and enums
  FeatureName.styles.ts         # styled-components only
  FeatureName.helpers.ts        # pure utility functions (if needed)
  FeatureName.hooks.ts          # React hooks (if needed)
  FeatureName.consts.ts         # constants and enum-based option arrays
```

**No `index.tsx` re-export files.** Import directly from the source file:

```ts
// correct
import { ApplicationDetailsContent } from "@/app/applications/[id]/ApplicationDetailsContent/ApplicationDetailsContent";

// wrong — index re-exports are for libraries, not apps
import { ApplicationDetailsContent } from "@/app/applications/[id]/ApplicationDetailsContent";
```

API routes follow the same convention — test files go in a `tests/` subfolder:

```
app/api/resource/
  tests/
    route.test.ts
  route.ts
```

**No test files at the root of a feature folder.** All `*.test.ts(x)` files live inside `tests/`.

## Enums

Unlike blunt-ui (which uses string union types because it's a library), this app uses **TypeScript enums** for domain values. Enums give autocomplete and prevent typos in application code.

```ts
// correct — in FeatureName.consts.ts
export enum ApplicationStatus {
  Applied = "Applied",
  InReview = "In review",
  Interview = "Interview",
  Offer = "Offer",
  Rejected = "Rejected",
}

// correct — using enum members
const status = ApplicationStatus.Applied;

// wrong — raw string literals for domain values
const status = "Applied";
```

Enums for domain constants (statuses, types, sources) live in the nearest `.consts.ts` file. If shared across multiple features, they go in `app/lib/models/`.

## Types (`.types.ts`)

- TypeScript interfaces for component props and data shapes
- Re-export types with `export type` from `index.tsx` where needed

## Consts (`.consts.ts`)

- Enums for domain values
- Option arrays for Select components (built from enum members)
- Named constants

## Styling

- styled-components only — **no inline styles**, no CSS modules
- Always in a separate `FeatureName.styles.ts` file
- Import as `import * as Styled from "./FeatureName.styles"` for clarity
- Use theme tokens for colors, spacing and font sizes — no hardcoded hex values or magic numbers:

  ```ts
  // correct
  color: ${({ theme }) => theme.colors.neutral[500]};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  // wrong
  color: #666;
  font-size: 14px;
  style={{ color: "#666", padding: "16px" }}  // wrong — no inline styles ever
  ```

## Code style

- Always use braces for early returns, always on separate lines:

  ```ts
  // correct
  if (!str) {
    return null;
  }

  // wrong
  if (!str) return null;

  // wrong — braces but not on separate lines
  if (!str) { return null; }
  ```

- No abbreviations in variable names
- No `any` — use proper types or `unknown`

## Testing

Tests live in `tests/` subfolder of each feature folder. Use the shared `render` from `app/mocks/test-utils.tsx`.

API route tests use MSW handlers from `app/mocks/handlers.ts`.

## Next.js conventions

Zapytania do bazy danych wynoszone są poza `page.tsx` do osobnych plików:

```
FeatureName/
  FeatureName.queries.ts   ← zapytania Supabase (Server Component data fetching)
  FeatureName.actions.ts   ← Server Actions (mutacje wywoływane przez użytkownika)
```

`page.tsx` powinien być czysty — tylko auth, wywołanie query i przekazanie danych do komponentu:

```ts
// correct
export default async function Page() {
  const { user, supabase } = await authenticateUser();
  const data = await getApplications(supabase, user!.id);
  return <ApplicationsList initialData={data} />;
}

// wrong — surowe zapytania Supabase bezpośrednio w page.tsx
export default async function Page() {
  const { data } = await supabase.from("applications").select("*")...
}
```

Dane fetchowane na serwerze przekazywane są jako `initialData` do React Query w komponentach klienckich — użytkownik widzi dane od razu bez loading state.

## Proxy (middleware)

`src/proxy.ts` (w Next.js 16 zastępuje `middleware.ts`) chroni wszystkie strony automatycznie — sprawdza sesję przed każdym requestem i redirectuje na `/login` jeśli użytkownik nie jest zalogowany. Dzięki temu `page.tsx` nie musi tego robić ręcznie.

**Lokalizacja jest krytyczna:** przy katalogu `src/` plik proxy MUSI być w `src/proxy.ts` (obok `src/app`), nie w root projektu. W root Next.js go nie wykryje — proxy nie zadziała, niezalogowani użytkownicy dojdą do server componentów i `user!.id` się wywali. Build pokazuje `ƒ Proxy (Middleware)` gdy proxy jest poprawnie wykrywany.

Mimo proxy, strony serwerowe i tak robią defensywnie `if (!user) { redirect("/login"); }` — na wypadek gdyby proxy miało edge case. Nie polegaj wyłącznie na proxy do ochrony przed `null` userem.

Przy redirectcie proxy musi przekazać odświeżone cookies sesji do nowej odpowiedzi — inaczej sesja może zostać utracona.

`authenticateUser()` zostaje w `page.tsx` — ale tylko po to żeby dostać `supabase` klienta i `user.id` do fetchowania danych. Sprawdzanie `if (!user) { redirect }` jest zbędne bo proxy to już zrobił.

## Supabase types

Typy bazy danych są generowane automatycznie ze schematu Supabase — nie pisz ich ręcznie. Uruchom gdy schemat bazy się zmieni:

```bash
npm run db:types
```

Wygenerowane typy używane są w `src/lib/models/index.ts` jako aliasy:

```ts
export type IApplicationRecord = Database["public"]["Tables"]["applications"]["Row"];
```

Klienty Supabase muszą mieć podany typ `Database`:

```ts
createBrowserClient<Database>(...)
createServerClient<Database>(...)
```

Dzięki temu TypeScript wie dokładnie jakie kolumny i typy ma każda tabela — wpisanie złej nazwy kolumny to błąd kompilacji.

## Workflow

After making changes, run:

```
npm run tsc     # zero errors required
npm test        # all tests must pass
npm run format  # eslint --fix (lints the whole project, incl. proxy.ts)
npm run build   # catches prerender/SSR errors that tsc and tests miss
```

`npm run build` is important: it runs the same static prerendering Vercel does.
A page can pass `tsc` and tests but still fail the build - e.g. a Server Component
that renders a styled-component. styled-components reads the theme from a client
`ThemeProvider` (React context), and Server Components cannot read client context.
If a route has no dynamic data (no `authenticateUser()`/cookies) it gets statically
prerendered at build time, where the theme is unavailable and the build crashes.
Fix by fetching data on the server (which makes the route dynamic), like the other pages do.
