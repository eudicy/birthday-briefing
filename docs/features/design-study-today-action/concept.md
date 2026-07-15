# Concept — Design Study: Today's Birthday Action Screen

Goal: second app UI screen, reached from screen 1 (`/design-study`). Not real app, no backend, no data source. Pure visual mock inside phone frame, matching screen 1's chrome.

## Why this screen

Screen 1 (`/design-study`) proves value #1: auto-consolidated birthday list, zero setup. Value #2, named by product owner: when a birthday is today, the nudge should lead straight into action — call or message — in one tap. This screen shows that payoff. Ranked above an address-book-import/onboarding screen: import is OS-permission plumbing, not a demoable value moment, and reads flat in a marketing wireframe gallery.

## Entry point

The "Anna Keller" row — the sole entry in the Today group on `/design-study` — becomes a real link into this screen. It must read as visibly tappable (hover/focus affordance, e.g. trailing chevron or stronger hover background) so it's immediately obvious how to invoke the next action. This Week / Next Week rows stay static, out of scope.

## Route

New page, own route: `/design-study/today`. Server component — no client interactivity needed, nothing on this screen is wired to real behavior. Duplicate the page shell pattern used by `/design-study` and `/imprint` (own `<main>` + `Footer`, no shared layout hoist — see AGENTS.md Routing section).

## Layout spec

- Reuse the exact phone-frame chrome from `/design-study`: outer `rounded-[2.5rem] border-8 border-foreground/10 bg-card p-3`, inner `rounded-[1.75rem] bg-background p-6`. Same neutral generic frame, no OS-specific chrome.
- Inside frame, top to bottom:
  1. Back link: "← Back to Upcoming Birthdays" → `/design-study` (one level shallower than screen 1's "← Back to home").
  2. Avatar: circle with initials "AK" (no photo asset).
  3. Name: "Anna Keller".
  4. Badge/label: "🎉 Today" — ties visually back to the Today group on screen 1.
  5. Two action controls: **Call** and **Message**. Styled as primary, inviting, large tap targets (mobile-mockup scale) — must NOT look disabled/greyed even though inert.
- Theme tokens only (`--background`, `--foreground`, `--primary`, etc.), full light/dark support via existing `ThemeProvider`. No new palette.

## Mock data

Reuses screen 1's existing Today entry — no new mock array needed, just the one hardcoded name: `Anna Keller`.

## Interactivity

None. Call and Message render as `<button type="button">` with no `onClick`, no `tel:`/`sms:` href. Purely visual, matching the static-mockup nature of screen 1.

## Styling

Tailwind utility classes only, same conventions as rest of repo (see AGENTS.md Styling Conventions). Mobile-first responsive, same frame-centering behavior as `/design-study`.

## Out of scope

- Relationship tag (partner/family/colleague)
- Note / gift-idea field
- Prefilled message draft text or preview
- Real `tel:`/`sms:` intents, any client-side interactivity
- Multiple birthdays / dynamic routing by contact — this screen is hardcoded to the single Today entry (Anna Keller)
- Countdown text, bottom tab bar/nav, iOS/Android-specific chrome
- Any Flutter code — this is a Next.js/React design study, not the app itself

## Definition of Done

- [ ] `/design-study/today` route renders standalone (own page shell, no shared layout hoist)
- [ ] Anna Keller row on `/design-study` is a working link to `/design-study/today`, visually marked as tappable
- [ ] Phone frame chrome matches `/design-study` exactly (same classes/structure)
- [ ] Screen shows: back link, avatar "AK", name "Anna Keller", "Today" badge, Call button, Message button
- [ ] Call/Message controls have no `tel:`/`sms:`/`onClick` — purely visual, styled as active (not disabled)
- [ ] No relation tag, note, or gift-idea field present (minimal scope honored)
- [ ] Back link returns to `/design-study`
- [ ] Light + dark mode both look correct (existing theme tokens, no new palette)
- [ ] Responsive: no layout break at mobile and desktop viewport widths
- [ ] `design-study/page.test.tsx` extended with link assertion (Anna Keller row → `/design-study/today`)
- [ ] New `design-study/today/page.test.tsx` covers heading/name, Call button, Message button, back link — following `docs/architecture/concepts/test-strategy.md` conventions
- [ ] Lint + full existing test suite pass
- [ ] AGENTS.md Project Structure + Routing sections updated to list `/design-study` and `/design-study/today` (both currently undocumented — pre-existing gap, fixed in same pass)
- [ ] `app/page.tsx`, `app/layout.tsx` unchanged
