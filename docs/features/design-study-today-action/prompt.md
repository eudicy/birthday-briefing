You are implementing a feature in the `birthday-briefing` repo (Next.js App Router, RSC-first, Vitest + RTL, Tailwind, shadcn/ui). Read `AGENTS.md` first for repo conventions (routing, styling, test strategy, shell-duplication pattern) — do not deviate from them.

Full specification: `docs/features/design-study-today-action/concept.md`. Read it in full before writing any code. It is the source of truth for scope; this prompt only sequences the work.

## Task

Add a second design-study wireframe screen, "Today's Birthday" action screen at `/design-study/today`, reached by tapping the Anna Keller row (the Today entry) on the existing `/design-study` screen (`app/design-study/page.tsx`).

## Constraints (do not violate)

- No `tel:`/`sms:` links, no `onClick`, no `"use client"` — the new screen has zero real interactivity, it is a static visual mock.
- Minimal content only: back link, avatar/initials "AK", name "Anna Keller", a "Today" badge, a Call button, a Message button. No relation tag, no note/gift-idea field, no message draft text.
- Reuse the exact phone-frame chrome classes from `app/design-study/page.tsx` (outer `rounded-[2.5rem] border-8 border-foreground/10 bg-card p-3`, inner `rounded-[1.75rem] bg-background p-6`) — do not invent new frame styling.
- Only the Anna Keller `<li>` on `/design-study` becomes a link. This Week / Next Week rows stay exactly as they are.
- Do not touch `app/page.tsx` or `app/layout.tsx`.
- Do not add avatars, action buttons, or any interactivity to the This Week / Next Week rows — out of scope per the concept doc.

## Steps

1. Create `app/design-study/today/page.tsx` (Server Component) per the concept doc's Layout spec.
2. Edit `app/design-study/page.tsx`: wrap the Today-group Anna Keller `<li>` in `next/link` to `/design-study/today`, add a hover/focus affordance (e.g. hover background shift and/or trailing chevron) so it visibly reads as tappable versus the static rows below it.
3. Extend `app/design-study/page.test.tsx` with an assertion that the Anna Keller row is a link with `href="/design-study/today"`.
4. Add `app/design-study/today/page.test.tsx` asserting: name "Anna Keller" renders, a Call button renders (`getByRole("button", { name: /call/i })`), a Message button renders (`getByRole("button", { name: /message/i })`), and a back link renders with `href="/design-study"`. Follow the conventions in `docs/architecture/concepts/test-strategy.md`.
5. Update `AGENTS.md`: the Project Structure tree and Routing prose currently don't mention `/design-study` at all (pre-existing gap) — add both `/design-study` and `/design-study/today` so the doc matches reality.
6. Run `npx vitest run` — must be fully green (new + all pre-existing tests).
7. Run `npm run lint` (or the repo's configured lint command) — must pass clean.
8. Manually verify with `npm run dev`: load `/`, click through to `/design-study`, click the Anna Keller row, confirm `/design-study/today` renders correctly in both light and dark mode, confirm the back link returns to `/design-study`.

## Definition of Done

Use the checklist in `docs/features/design-study-today-action/concept.md` under "Definition of Done" as the acceptance gate — every box must be true before calling this complete. Do not mark the task done with any item unchecked or unverified.

## Output

Work on a feature branch, not `main`. Summarize the diff and confirm every Definition of Done checkbox status when finished.
