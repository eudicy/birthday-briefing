---
name: developing
description: "Standard dev session protocol for this repo: ralplan, Ralph, architect review, deslop, push, PR, CI-green loop. Use for any non-trivial feature/chore branch in birthday-briefing."
---

# Developing (session protocol)

Fixed sequence for any non-trivial branch in this repo. Don't skip steps or report done early — no polite-stop between steps.

## Steps

1. **`ralplan`** — plan the work, get PRD/stories with task-specific acceptance criteria (not generic boilerplate).
2. **`ralph`** — execute against the plan, story by story, verifying each acceptance criterion with fresh evidence before marking it done.
3. **Local tests green** — `npm run lint && npm run typecheck && npm run test:all` (and `npm run build`). `test:all` runs unit then e2e; e2e needs Playwright's Chromium deps installed locally (see [`docs/architecture/concepts/test-strategy.md`](../../../docs/architecture/concepts/test-strategy.md#running-e2e-locally-on-a-headless-vm)). Fix before moving on.
4. **Architect review** — `Task(subagent_type="oh-my-claudecode:architect", ...)` against `git diff main...<branch>`. Read-only, verdict APPROVED/REJECTED with concrete file:line findings.
5. **Deslop pass** — `Skill("ai-slop-cleaner")` in standard mode, scoped to files changed in this session only. Fix architect findings in this pass too if they're cleanup-shaped; fix logic findings directly.
6. **Local tests green again** — re-run step 3's full command after the fixes/deslop. This is the actual regression gate, not step 3.
7. **Push** — `git push -u origin <branch>`.
8. **PR** — `gh pr create` with a real summary + test plan, not a placeholder.
9. **CI green loop** — poll `gh pr checks <n>` until no `pending`. On failure: `gh run view <run-id> --job <job-id> --log-failed`, fix, commit, push, repeat. Don't hand back to the user until every check is `pass`.

## Known gotchas (hit in PR #2, chore/testing-setup)

- **Pushing `.github/workflows/*.yml` needs a PAT with the `workflow` scope.** A push touching that path fails with `refusing to allow a Personal Access Token to create or update workflow ... without workflow scope`. This needs the human to expand the token scope — you can't self-serve it.
- **Don't assume "run E2E against a production build" is a free CI upgrade.** If app code branches on `NODE_ENV` (e.g. a dry-run fallback when API keys are unset, like `app/actions/subscribe.ts`'s Brevo check), `next start` hard-forces `NODE_ENV=production` with no override — so a prod-build E2E run can hit a completely different code path (a hard failure instead of dry-run success) than `next dev` does. Check every `NODE_ENV`-dependent branch in the touched app code before switching Playwright's `webServer.command` to a build+start flow. When in doubt, keep E2E on `next dev` and note the prod-build gap as an accepted, documented limitation rather than silently "fixing" it.
- Node version bumps: check `next`'s actual `engines.node` requirement (`node_modules/next/package.json`) before bumping CI Node version for a single test's sake — prefer removing the version-sensitive API (e.g. swap `Promise.withResolvers` for a manual deferred) over raising the floor for everyone.
