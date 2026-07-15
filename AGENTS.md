# AGENTS.md — Birthday Briefing

Authoritative tech stack reference for all AI agents on this project.

<!-- markdownlint-disable MD013 MD022 MD025 MD031 MD032 MD034 -->
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
<!-- markdownlint-enable MD013 MD022 MD025 MD031 MD032 MD034 -->

## Beads: Data Safety and Workflow Rules

### Export after every mutation (bd v1.0.4)

<!-- bd-version: 1.0.4 -->

On bd v1.0.4 every command prints `auto-importing N bytes ... into empty
database` and rehydrates the working DB from `.beads/issues.jsonl`. A mutation
not yet flushed to the JSONL file is **silently reverted** by the next
command's re-import. Observed data loss: a `bd dep rm` rolled back before the
next command saw it; a later `bd dep add` then reported a phantom cycle.

**Mandatory workaround (bd 1.0.4 only):** export after **every** mutation —
never bundle exports at the end of a response:

```bash
bd export --all -o .beads/issues.jsonl   # run after EACH bd mutation
```

Re-evaluate when a bd release fixes auto-import without the v1.0.5 regression.

### Never commit `.beads/issues.jsonl`

`.beads/issues.jsonl` is gitignored and MUST NOT be `git add`ed or committed,
even though the export step above still writes it locally on every mutation.
It regenerates on every single issue create/claim/close; committing it
drowns real code changes in noise commits. bd's Dolt-backed sync
(`refs/dolt/data`) is the actual cross-machine sync mechanism — this file is
a local-only convenience export, redundant with it.

### Suppress git-add warning

If you see `auto-export: git add failed: exit status 1` after a bd mutation,
the cause is `export.git-add=true` (default) trying to stage
`.beads/issues.jsonl`, which is gitignored. Fix permanently:

```yaml
# .beads/config.yaml
export:
  git-add: false
```

This keeps local export (beads viewer stays in sync) while disabling git
staging.

### Never run `bd list --all`

**NEVER run `bd list --all`** — at ~350 issues it enters an unbounded output
loop (5.6 GB, 100% CPU, SIGKILL, nearly fills the 17 GB agent disk). For bulk
reads, query `.beads/issues.jsonl` directly with `grep`/`jq`. For live queries
use only scoped commands: `bd ready`, `bd list --status <s>`,
`bd list --priority <p>`, `bd show <id>`. If unavoidable, bound it:
`timeout 20 bd list --all`. (Bug tracked: 1fg7)

### Findings are always tied to WIP

A finding discovered during implementation must be filed as an issue and
connected to the active WIP (`in_progress` issue or current branch). A finding
not tied to active WIP must be converted to a normal feature request: its
headline must **not** contain the word "Finding", though the description may
note provenance.

### Findings gates are closed by humans only

**AI agents MUST NOT close a findings gate.** A findings gate is a human
review checkpoint — it signals that a set of findings has been collected and
is awaiting human sign-off. Only the human reviewer closes it after confirming
each child finding has been addressed. This applies regardless of how many
child tasks have been closed.

## Beads: Issue Types and Dependency Rules

### Issue Types

Built-in types and when to use each:

| Type        | Use when                                              |
|-------------|-------------------------------------------------------|
| `task`      | Default. General work item. (default when omitted)    |
| `bug`       | Something broken that must be fixed.                  |
| `feature`   | New user-facing capability.                           |
| `chore`     | Maintenance, cleanup, non-functional work.            |
| `epic`      | Large body of work grouping child issues.             |
| `spike`     | Timeboxed investigation to reduce uncertainty.        |
| `story`     | User story (user-centric feature description).        |
| `decision`  | Architectural or design decision to document.         |
| `milestone` | Marks completion of a set of related issues.          |
| `gate`      | Async coordination checkpoint (blocks until cleared). |
| `molecule`  | Beads work template — NOT Ansible Molecule testing.   |

### Attaching Issues to Epics (epics cannot be gated)

`bd dep add` connects **any pair of issue types except `epic`** — an epic
connects only to another epic. So an epic cannot be gated out of `bd ready`
by its non-epic children:

- `bd dep add` between an epic and a non-epic is rejected in **both**
  directions (`<epic> <non-epic>` and `<non-epic> <epic>`), each printing
  `Error: epics can only block other epics, not tasks` (the message always
  says "not tasks", whatever the real type). A non-epic therefore cannot block
  its epic. Epic↔epic edges ARE permitted; non-epic pairs gate normally (a
  task can block a task, a feature, etc.).
- `--parent` attaches a child for display/scope only. It does NOT gate
  readiness and does NOT exclude the parent from `bd ready`.

```shell
bd update <child-id> --parent <epic-id>
```

An epic with open children therefore REMAINS in `bd ready`. Do not rely on
`bd ready` exclusion to track epic scope — read the epic's CHILDREN section
via `bd show <epic-id>` instead. See
[triage.md](docs/architecture/concepts/issue-tracking/triage.md) for the
validated dep-add type matrix and `--parent` / `bd ready` semantics
(bd v1.0.4).

### Beads Dependency Wiring — Cross-Tree Follow-Ups

Operationalizes Principle VIII (cross-tree blocking). When a policy or review
decision constrains in-flight work in another tree, wire the blocking dep
**immediately** — but mind the type rule: `bd dep add` cannot make an `epic`
block a non-epic (rejected; see "Attaching Issues to Epics" above). If the
follow-up is tracked as an epic, use a **non-epic** issue as the actual
blocker — a concrete task under that epic, or a `gate` checkpoint (verified:
a `gate` blocks a non-epic and gates it out of `bd ready`). Wire it as
`bd dep add <in-flight-issue> <non-epic-blocker>` (in-flight depends on
blocker).

**Signal the next action for the next session**: after wiring the deps, claim
both the blocked issue and the immediate actionable follow-up:

```bash
bd update <blocked-issue> --claim   # signals "this goal is in flight"
bd update <follow-up> --claim       # signals "work on this next"
```

Without claiming, triage ranks by graph score. A high-impact unrelated issue
will outrank the follow-up you actually need to work on, causing the next
session to pick up the wrong work.

## Collaboration with the User

- **Language**: English throughout. Apply the caveman skill by audience —
  `caveman full` for user-facing content (chat, code, comments, documentation,
  beads issues); `caveman wenyan-ultra` for internal and inter-agent content
  (thinking, subagents, MCP, tool calls, all files under `.omc/`). Code blocks,
  commit messages, and security warnings stay in normal English regardless of
  mode. The skills define each mode.
- **One question at a time**: when asking the user a question, ask one
  question at a time so they can focus.
- **Avoid ambiguity**: if instructions are unclear, contradictory, or
  conflict with rules or earlier instructions, describe the situation and
  ask clarifying questions before proceeding.
- **Hidden files**: the LS tool does not show hidden files; use
  `ls -la <path>` via Bash to check for hidden files or directories.

---

## Product Vision

See [`README.md`](README.md) for the product description, target audience, and problem/solution framing that all landing page copy is based on.

## Scope

Current phase: landing page plus a legally-required `/imprint` route, plus a `/design-study` wireframe gallery (and its nested `/design-study/today` action screen) — four routes total: email waitlist signup for the upcoming app announcement, the Impressum, and Next.js/React design-study mockups for demoing planned app value moments. No Flutter app code lives in this repo. App development (iOS/Android/Web) starts after this landing page ships and is live on Vercel. Don't scaffold app-related code here unless explicitly asked.

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

<!-- BEGIN:nextjs-agent-rules -->
### This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## Project Structure

```
app/
  layout.tsx          # root layout, fonts, metadata
  page.tsx            # landing page
  imprint/
    page.tsx          # /imprint route — legally required Impressum
  design-study/
    page.tsx          # /design-study route — upcoming-birthdays wireframe mockup
    today/
      page.tsx        # /design-study/today route — today's-birthday action wireframe
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

This is primarily a single-page marketing site with four routes total: `app/page.tsx` (landing page), `app/imprint/page.tsx` (Impressum, legal compliance), `app/design-study/page.tsx` (upcoming-birthdays wireframe mockup), and `app/design-study/today/page.tsx` (nested today's-birthday action wireframe, reached from the `/design-study` screen). The root layout (`app/layout.tsx`) sets global metadata, fonts (next/font), and wraps children. Each route duplicates its own page shell (`<main>` + `<Footer/>`) rather than hoisting it into the layout — see the imprint page's ADR for the rule-of-three follow-up. All page-level components are React Server Components by default. Only add `"use client"` to components that need interactivity (e.g. `SignupForm`). No dynamic routes needed for this increment.

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


