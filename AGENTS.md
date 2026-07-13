<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Birthday Briefing

Authoritative tech stack reference for all AI agents on this project.

---

## Product Vision

See [`README.md`](README.md) for the product description, target audience, and problem/solution framing that all landing page copy is based on.

## Scope

Current phase: landing page plus a legally-required `/imprint` route — two routes total: email waitlist signup for the upcoming app announcement, and the Impressum. No Flutter app code lives in this repo. App development (iOS/Android/Web) starts after this landing page ships and is live on Vercel. Don't scaffold app-related code here unless explicitly asked.

---

## Development Protocol

Before starting any non-trivial feature/chore branch (new work, not a one-line fix), invoke `Skill("developing")` and follow it: ralplan → ralph → local tests green → architect review → deslop → local tests green → push → PR → CI green. Don't skip straight to coding on multi-step work.

**Ralph → developing handoff:** When `ralph` hits its own Step 8 (`/oh-my-claudecode:cancel`), do not stop and wait for user input — immediately continue the same `developing` run in the same turn. Ralph's own loop already did architect review (its Step 7) and the deslop pass (its Step 7.5, unless `--no-deslop` was passed to it) — skip redoing whichever of those already ran; run the deslop pass now only if ralph was invoked with `--no-deslop`. Then finish the rest of `developing` unconditionally: local tests green → push → PR → CI-green loop. Ralph's cancel is a checkpoint inside `developing`, not a completion or a reporting moment.

---

## Tech Stack

| Framework / Tool | Context7 Library ID          |
|------------------|------------------------------|
| Next.js          | vercel/next.js               |
| React            | websites/react_dev_learn     |
| shadcn/ui        | websites/ui_shadcn           |
| Tailwind CSS     | tailwindlabs/tailwindcss.com |
| Magic UI         | websites/magicui_design      |
| Brevo            | getbrevo/brevo-node          |
| next-themes      | pacocoursey/next-themes      |
| Vercel           | vercel/vercel                |

---

## Project Structure

```
app/
  layout.tsx          # root layout, fonts, metadata
  page.tsx            # landing page
  imprint/
    page.tsx          # /imprint route — legally required Impressum
  actions/
    subscribe.ts      # server action: submit email to Brevo
components/
  HeroSection.tsx
  ProblemSection.tsx
  SignupForm.tsx
  FeatureList.tsx
  Footer.tsx
  ThemeProvider.tsx
  ThemeToggle.tsx
public/               # static assets
.env.local            # BREVO_API_KEY, BREVO_LIST_ID (never commit)
.env.local.example    # template for .env.local, committed
```

Keep all components in `components/`. Server actions live in `app/actions/`. No `pages/` directory — App Router only.

---

## Routing (App Router)

This is primarily a single-page marketing site with one additional static route for legal compliance: `app/page.tsx` (landing page) and `app/imprint/page.tsx` (Impressum). The root layout (`app/layout.tsx`) sets global metadata, fonts (next/font), and wraps children. Each route duplicates its own page shell (`<main>` + `<Footer/>`) rather than hoisting it into the layout — see the imprint page's ADR for the rule-of-three follow-up. All page-level components are React Server Components by default. Only add `"use client"` to components that need interactivity (e.g. `SignupForm`). No dynamic routes needed for this increment.

---

## Form Handling

The email signup form uses a Next.js Server Action defined in `app/actions/subscribe.ts`. On submit, the action calls the Brevo Contacts API (`POST /v3/contacts`) using the `@getbrevo/brevo` Node SDK, passing the submitted email and adding it to a designated list. The `BREVO_API_KEY` and `BREVO_LIST_ID` are read from environment variables — never from the client. Return a typed result (`{ success: boolean; message: string }`) for the form to display feedback. No third-party form libraries needed.

```ts
// app/actions/subscribe.ts (pattern)
"use server"
import { BrevoClient } from "@getbrevo/brevo"

export async function subscribe(email: string) {
  const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! })
  await client.contacts.createContact({
    email,
    listIds: [Number(process.env.BREVO_LIST_ID)],
  })
  return { success: true, message: "You're on the list!" }
}
```

---

## Component List

Only build what this landing page needs:

| Component        | Type          | Purpose                                      |
|------------------|---------------|----------------------------------------------|
| `HeroSection`    | Server        | Headline, subheadline, CTA scroll anchor     |
| `ProblemSection` | Server        | Problem & audience framing, based on README.md |
| `FeatureList`    | Server        | Solution section: 3 key benefits (icon + text) |
| `SignupForm`     | Client        | Email input + submit button, calls server action |
| `Footer`         | Server        | Copyright, links to Contact and `/imprint`   |
| `ThemeProvider`  | Client        | Wraps `next-themes`, applies `.dark` class to `<html>` |
| `ThemeToggle`    | Client        | Light/Dark/System theme switcher, top-right of layout |

Use Magic UI's `AnimatedGradientText` or `BlurFade` for the hero headline. Use shadcn/ui `Input`, `Button`, `Label`, and `DropdownMenu` inside client components. `next-themes` handles theme persistence/system detection; no other theming libraries.

---

## Styling Conventions

Use Tailwind CSS utility classes exclusively — no custom CSS files except `app/globals.css` for base resets and CSS variables. Follow shadcn/ui conventions: CSS variables for theme colors (`--background`, `--foreground`, `--primary`), defined in `globals.css`. Use responsive prefixes (`sm:`, `md:`, `lg:`) mobile-first. Spacing scale: use `4`, `8`, `12`, `16`, `24` multiples. Keep layout simple: `max-w-4xl mx-auto px-4` container. No inline styles.

---

## Deployment

Host on Vercel. Connect the GitHub repo (`eudicy/birthday-briefing`) in the Vercel dashboard — every push to `main` triggers an automatic production deployment. No `vercel.json` is needed for a standard Next.js App Router project; Vercel auto-detects the framework. Set `BREVO_API_KEY` and `BREVO_LIST_ID` as environment variables in the Vercel project settings (not in `.env.local`, which is local-only). Use Vercel's preview deployments for PRs.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:970c3bf2 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

This protocol applies when ending a Beads implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Handle git/sync by active profile**:
   ```bash
   # Conservative/minimal/default: report status and proposed commands; wait for approval.
   git status

   # Team-maintainer opt-in only, unless current instructions forbid it:
   git pull --rebase
   bd dolt push
   git push
   git status
   ```
5. **Hand off** - Summarize changes, validation, issue status, and any blocked sync/commit/push step

**Critical rules:**
- Explicit user or orchestrator instructions override this Beads block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END BEADS INTEGRATION -->

<!-- BEGIN BEADS CODEX SETUP: generated by bd setup codex -->
## Beads Issue Tracker

Use Beads (`bd`) for durable task tracking in repositories that include it. Use the `beads` skill at `.agents/skills/beads/SKILL.md` (project install) or `~/.agents/skills/beads/SKILL.md` (global install) for Beads workflow guidance, then use the `bd` CLI for issue operations.

### Quick Reference

```bash
bd ready                # Find available work
bd show <id>            # View issue details
bd update <id> --claim  # Claim work
bd close <id>           # Complete work
bd prime                # Refresh Beads context
```

### Rules

- Use `bd` for all task tracking; do not create markdown TODO lists.
- Run `bd prime` when Beads context is missing or stale. Codex 0.129.0+ can load Beads context automatically through native hooks; use `/hooks` to inspect or toggle them.
- Keep persistent project memory in Beads via `bd remember`; do not create ad hoc memory files.

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.
<!-- END BEADS CODEX SETUP -->
