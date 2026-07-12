# Test Strategy — Landing Page

Scope: current phase is the landing page only (email waitlist signup for the app announcement). See [`CLAUDE.md`](../../../CLAUDE.md#scope). App test strategy (Flutter) is a separate, later effort.

Surface: 1 route, 3 server components (`HeroSection`, `FeatureList`, `Footer`), 1 client component with `useActionState` (`SignupForm`), 1 server action calling Brevo (`app/actions/subscribe.ts`). No test framework installed yet — only ESLint.

## Unit / Component

Stack: `vitest` + `@testing-library/react` + `jsdom`.

`subscribe.ts` (mock `@getbrevo/brevo`):
- invalid email → `{ success: false }`
- dry-run when `BREVO_API_KEY` / `BREVO_LIST_ID` are unset
- successful contact creation
- `duplicate_parameter` error → friendly success message
- generic Brevo error → error message

`SignupForm.tsx`:
- mock the server action, test render + submit (pending state, success/error message shown via `role="status"`)

`HeroSection` / `FeatureList` / `Footer`:
- smoke render, correct content/links

## End-to-End

Stack: `playwright` (Next.js's recommended choice, better fit than Cypress for App Router / Server Actions).

- flow: load page → fill signup form → submit → success message visible
- invalid email → client-side validation blocks submit (`type="email"`, `required`)
- E2E env: do not set `BREVO_API_KEY` → exercises the dry-run path, no real Brevo call needed
- optional: CTA anchor scroll (`#signup`), responsive check (mobile viewport)

## Running E2E locally on a headless VM

No X server / Xvfb needed — headless Chromium doesn't require one (details: [`executing-playwright-locally.md`](executing-playwright-locally.md)).

```bash
sudo apt-get update
sudo apt-get install -y \
  fonts-liberation libasound2t64 libatk-bridge2.0-0t64 libatk1.0-0t64 \
  libatspi2.0-0t64 libcairo2 libcups2t64 libdbus-1-3 libdrm2 libegl1 \
  libgbm1 libglib2.0-0t64 libgtk-3-0t64 libnspr4 libnss3 libpango-1.0-0 \
  libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxdamage1 libxext6 \
  libxfixes3 libxrandr2 libxshmfence1
npx playwright install chromium
npm run test:e2e
```

Skip `--with-deps` — pulls in unneeded Xvfb/X11/font packages. Package names above are for Ubuntu 24.04 (`t64`-suffixed); other distros/versions may differ.

## CI

Two GitHub Actions jobs, triggered on push/PR against `main`:
- `unit`: `lint` + `typecheck` (`tsc --noEmit`) + `vitest run` + `next build`
- `e2e`: `playwright install --with-deps chromium` + `playwright test` (against `next dev`)

Known gaps, accepted for now:
- Unit tests fully mock `@getbrevo/brevo`, and E2E forces the dry-run path (no `BREVO_API_KEY` set) — the real Brevo call shape is never exercised end-to-end. There's no way to hit the real API with credentials in CI.
- E2E runs against `next dev`, not a production build. `subscribe.ts` branches its dry-run behavior on `NODE_ENV !== "production"`, and `next start` hard-forces `NODE_ENV=production` with no override — so testing E2E against a real production build would always hit the "signup unavailable" error path instead of dry-run, since no real Brevo keys exist in CI. Making E2E exercise a production build meaningfully needs a dedicated test-mode bypass in `subscribe.ts`, which is out of scope for this test-infra setup.

## Out of scope

Visual regression testing, load testing — overkill for a waitlist page at this stage.
