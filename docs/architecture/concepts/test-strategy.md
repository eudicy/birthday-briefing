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

## CI

`lint` + `typecheck` (`tsc --noEmit`) + `vitest run` + `next build` + `playwright test` in GitHub Actions, triggered on PRs against `feat/landing-page` / `main`.

## Out of scope

Visual regression testing, load testing — overkill for a waitlist page at this stage.
