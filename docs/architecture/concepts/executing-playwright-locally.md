# Running Playwright E2E Locally, Matching CI

Question: CI's `e2e` job (see [`test-strategy.md`](test-strategy.md#ci)) runs `playwright install --with-deps chromium` on `runs-on: ubuntu-latest`. Can we install the same system deps locally to run `npm run test:e2e` outside CI? `--with-deps` pulled in 74 packages including `xvfb`, `xserver-common`, `x11-xkb-utils`, `xauth`, and a handful of `xfonts-*` — is a full X server stack actually required on a local dev machine?

## Finding 1: CI is not a Docker container

`e2e` job has `runs-on: ubuntu-latest`, no `container:` key. It's a GitHub-hosted Ubuntu VM, not a Docker container. Doesn't change the answer below, but the original premise ("tests run in Docker") was wrong.

## Finding 2: GitHub's `ubuntu-latest` image already ships Chrome/Chromium/Firefox/Edge + Xvfb

Per [`actions/runner-images` Ubuntu 24.04 readme](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md), the standard image pre-installs Chrome, Chromium, Edge, Firefox, their WebDriver binaries, and `xvfb`, as part of the "Browsers and Drivers" toolset. Installing those browsers already pulls in most of the shared libraries Playwright's Chromium needs. That's why CI's `--with-deps` step is fast and unremarkable in the workflow logs — most of the 74 packages are already satisfied; apt just fills small gaps.

A fresh local machine or minimal container doesn't have that head start, hence the `libnspr4.so: cannot open shared object file` crash we hit when trying to launch the already-downloaded Chromium binary without any deps installed.

## Finding 3: `install-deps` bundles two unrelated dependency buckets

Playwright's own dependency table (`playwright-core/src/server/registry/nativeDeps.ts`) splits system packages into:

- **`tools`** — `xvfb`, `xfonts-*`, `xauth`, most font packages. Applied unconditionally regardless of which browser you target.
- **`chromium`** (browser-specific) — ~26 plain shared libraries: `libnspr4`, `libnss3`, `libatk1.0-0`, `libatk-bridge2.0-0`, `libcups2`, `libdrm2`, `libgbm1`, `libglib2.0-0`, `libgtk-3-0`, `libpango-1.0-0`, `libx11-6`, `libxcomposite1`, `libxdamage1`, `libxfixes3`, `libxrandr2`, `libxshmfence1`, etc. No X server package in this list — `fonts-liberation` is the one font package that lives here instead of in `tools`, since Chromium itself requires it for text rendering.

`npx playwright install --with-deps chromium` installs both buckets together — that's where `xvfb`/`xserver-common`/`x11-xkb-utils` come from in the dry-run output, not from Chromium's actual runtime linkage.

## Finding 4: headless Chromium does not need Xvfb / a running X server

Confirmed by the Playwright team directly: "you don't need [Xvfb] when running playwright in headless mode" ([microsoft/playwright#28711](https://github.com/microsoft/playwright/issues/28711)). Xvfb is only needed for **headed** mode (`headless: false`, e.g. watching a test run live or VNC-based debugging). `playwright.config.ts` in this repo doesn't set `headless: false` anywhere — the `chromium` project uses `devices["Desktop Chrome"]` defaults, which is headless. So a running X server is not required to run `npm run test:e2e` locally.

## Recommendation

Skip `--with-deps` (it drags in the full `tools` bucket: Xvfb, X server, X fonts). Install only the Chromium runtime shared libraries directly via apt (plus `fonts-liberation`, the one font package Chromium's own bucket requires). On this machine (Ubuntu 24.04 / noble, `t64`-suffixed packages):

```bash
sudo apt-get update
sudo apt-get install -y \
  fonts-liberation libasound2t64 libatk-bridge2.0-0t64 libatk1.0-0t64 \
  libatspi2.0-0t64 libcairo2 libcups2t64 libdbus-1-3 libdrm2 libegl1 \
  libgbm1 libglib2.0-0t64 libgtk-3-0t64 libnspr4 libnss3 libpango-1.0-0 \
  libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxdamage1 libxext6 \
  libxfixes3 libxrandr2 libxshmfence1
```

No X server, no display manager, no `DISPLAY` env var needed — these are client-side shared libraries only, safe to install on a headless dev box or server. `npx playwright install chromium` (without `--with-deps`) to fetch/verify the browser binary, then `npm run test:e2e`.

## Confirmed

Verified on this machine (headless dev VM, Ubuntu 24.04, no `DISPLAY`): running `npx playwright install chromium` then `npm run test:e2e` passes:

```
Running 2 tests using 1 worker
  ✓  1 [chromium] › e2e/signup.spec.ts:3:5 › visitor can join the waitlist (1.7s)
  ✓  2 [chromium] › e2e/signup.spec.ts:12:5 › invalid email is blocked client-side and never reaches the success message (1.0s)
  2 passed (15.4s)
```

No Xvfb, no display manager, no `DISPLAY` env var set. Confirms Finding 4: headless Chromium runs fine on a headless VM with no X server. Note: on this machine the trimmed shared-library list (`libnspr4`, `libnss3`, `libgtk-3-0t64`, etc.) was already present before this run, so this doesn't independently verify the apt list in the Recommendation above is complete on a bare machine — that remains untested.

## Caveats

- Not byte-for-byte CI parity: CI still runs full `--with-deps`, which is more robust against Playwright bumping its required-package list on a browser update. The trimmed list above needs revisiting if `@playwright/test` is upgraded and a future run reports a new missing `.so`.
- Font packages (`fonts-noto-color-emoji`, `fonts-wqy-zenhei`, etc.) in the `tools` bucket affect rendering of non-Latin/emoji glyphs, relevant for visual/screenshot diffing. Out of scope here — this repo has no screenshot assertions (see [`test-strategy.md`](test-strategy.md#out-of-scope)).
- Node version mismatch (CI pins Node 20, local dev may run a newer major) is a separate, already-known gap — not addressed by this doc.
