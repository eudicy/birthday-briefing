# Concept — Design Study: Upcoming Birthdays

Goal: first app UI screen, max value proof, live on landing site as clickable design study. Not real app, no backend, no data source. Pure visual mock inside phone frame.

## Why this screen

Core product promise: auto-consolidate birthdays, right-time nudge. This screen shows that promise in one glance — no onboarding, no setup, no explanation needed. Best "aha" per pixel.

## Entry point

Landing page gets one new CTA button (placement: Hero or Footer section, dev pick based on visual balance). Label e.g. "View Design Study" or "See the App". Links to new route below.

## Route

New page, own route: `/design-study`. Server component (no client interactivity needed — page is static). Duplicate page shell pattern used by `/imprint` (own `<main>` + `Footer`, no shared layout hoist — see AGENTS.md Routing section).

## Layout spec

- Page: centered phone frame, neutral generic style — rounded rect body, thin bezel, no OS-specific chrome (no notch, no Android nav buttons, no status bar icons).
- Frame background/foreground: reuse existing theme tokens (`--background`, `--foreground`, `--primary` etc from `globals.css`), full light/dark support via existing `ThemeProvider`. No new palette.
- Inside frame, top to bottom:
  1. Header: "Upcoming Birthdays" (screen title, plain heading)
  2. Three grouped sections, in fixed order:
     - **Today**
     - **This Week**
     - **Next Week**
  3. Each group: section label + list of rows below it.
  4. Each row: **Name** + **Date** only. No avatar, no relationship tag, no action button, no countdown text.
  5. Empty group (zero mock entries): hide section entirely, OR show muted "No birthdays" placeholder — dev pick, consistent across all three groups.

## Mock data

Hardcoded, static array in the page/component — no fetch, no DB, no props from outside.

Suggested distribution (dev may adjust names/dates, keep counts):
- Today: 1 entry
- This Week: 2 entries
- Next Week: 2–3 entries

Example shape:

```ts
type MockBirthday = { name: string; date: string };

const today: MockBirthday[] = [{ name: "Anna Keller", date: "Jul 14" }];
const thisWeek: MockBirthday[] = [
  { name: "Markus Lehner", date: "Jul 16" },
  { name: "Sophie Braun", date: "Jul 18" },
];
const nextWeek: MockBirthday[] = [
  { name: "Jonas Weber", date: "Jul 22" },
  { name: "Lea Fischer", date: "Jul 25" },
];
```

## Styling

Tailwind utility classes only, shadcn/ui primitives where they fit (`Card`, list styling) — same conventions as rest of landing repo (see AGENTS.md Styling Conventions). Mobile-first responsive: frame should look correct on both desktop viewport (frame centered, page background visible around it) and mobile viewport (frame may fill more of the screen width).

## Out of scope

- Avatars / profile images
- Relationship tags (partner/family/colleague)
- Quick-action buttons (gift idea, call, message)
- Countdown text ("in 5 days")
- Bottom tab bar / nav
- iOS or Android specific chrome (notch, status bar icons, home indicator, nav buttons)
- Any interactivity inside the phone frame (rows are not clickable/tappable)
- Real data source, API, or state management
- Any Flutter code — this is a Next.js/React design study, not the app itself

## Definition of Done

- [ ] `/design-study` route renders standalone (own page shell, no shared layout hoist)
- [ ] Landing page has one new CTA button linking to `/design-study`
- [ ] Phone frame renders centered, neutral generic style, no OS chrome
- [ ] Header "Upcoming Birthdays" visible inside frame
- [ ] Three groups render in order: Today, This Week, Next Week
- [ ] Each row shows Name + Date only
- [ ] Mock data hardcoded in component, matches suggested distribution
- [ ] Light + dark mode both look correct (uses existing theme tokens, no new palette)
- [ ] Responsive: no layout break at mobile and desktop viewport widths
- [ ] No client-side interactivity added beyond existing landing-page CTA link
- [ ] Lint + existing test suite pass; new route covered by at minimum a smoke test (render check), following `docs/architecture/concepts/test-strategy.md` conventions
