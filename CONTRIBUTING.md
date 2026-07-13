# Contributing

## Prerequisites

- Node.js 20+
- npm (bundled with Node)
- A [Brevo](https://www.brevo.com/) account for the email signup backend

## Brevo account setup

1. Sign up at [brevo.com](https://www.brevo.com/) and log in.
2. Create a contact list under **Contacts > Lists**, note its list ID (shown in the list's URL/settings).
3. Generate an API key under **SMTP & API > API Keys**.

## `.env.local` setup

Copy the example file and fill in your Brevo credentials:

```bash
cp .env.local.example .env.local
```

```
BREVO_API_KEY=your-brevo-api-key
BREVO_LIST_ID=your-brevo-list-id
```

`.env.local` is gitignored and never committed. If `BREVO_API_KEY`/`BREVO_LIST_ID` are left unset outside production, the signup Server Action (`app/actions/subscribe.ts`) falls back to a dry-run mode that logs the submission server-side and returns a success message without calling Brevo — useful for local development without real credentials.

## Dev server

```bash
npm install
npm run dev
```

Serves the landing page at [http://localhost:3000](http://localhost:3000).

## Linting, type checking, and tests

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run test        # Vitest unit/component tests
npm run test:e2e    # Playwright end-to-end tests
npm run test:all    # unit + e2e
npm run build       # production build
```

See [`docs/architecture/concepts/test-strategy.md`](docs/architecture/concepts/test-strategy.md) for details on the test setup, including running Playwright locally on a headless VM.
