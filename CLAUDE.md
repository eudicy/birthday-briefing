# CLAUDE.md — Birthday Briefing

Authoritative tech stack reference for all AI agents on this project.

---

## Scope

Current phase: landing page only — single route, email waitlist signup for the upcoming app announcement. No Flutter app code lives in this repo. App development (iOS/Android/Web) starts after this landing page ships and is live on Vercel. Don't scaffold app-related code here unless explicitly asked.

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
| Vercel           | vercel/vercel                |

---

## Project Structure

```
app/
  layout.tsx          # root layout, fonts, metadata
  page.tsx            # landing page (single route)
  actions/
    subscribe.ts      # server action: submit email to Brevo
components/
  HeroSection.tsx
  SignupForm.tsx
  FeatureList.tsx
  Footer.tsx
public/               # static assets
.env.local            # BREVO_API_KEY (never commit)
```

Keep all components in `components/`. Server actions live in `app/actions/`. No `pages/` directory — App Router only.

---

## Routing (App Router)

This is a single-page marketing site. Use one route: `app/page.tsx`. The root layout (`app/layout.tsx`) sets global metadata, fonts (next/font), and wraps children. All page-level components are React Server Components by default. Only add `"use client"` to components that need interactivity (e.g. `SignupForm`). No dynamic routes needed for this increment.

---

## Form Handling

The email signup form uses a Next.js Server Action defined in `app/actions/subscribe.ts`. On submit, the action calls the Brevo Contacts API (`POST /v3/contacts`) using the `@getbrevo/brevo` Node SDK, passing the submitted email and adding it to a designated list. The `BREVO_API_KEY` and `BREVO_LIST_ID` are read from environment variables — never from the client. Return a typed result (`{ success: boolean; message: string }`) for the form to display feedback. No third-party form libraries needed.

```ts
// app/actions/subscribe.ts (pattern)
"use server"
import * as Brevo from "@getbrevo/brevo"

export async function subscribe(email: string) {
  const client = new Brevo.ContactsApi()
  client.setApiKey(Brevo.ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY!)
  await client.createContact({ email, listIds: [Number(process.env.BREVO_LIST_ID)] })
  return { success: true, message: "You're on the list!" }
}
```

---

## Component List

Only build what this landing page needs:

| Component        | Type          | Purpose                                      |
|------------------|---------------|----------------------------------------------|
| `HeroSection`    | Server        | Headline, subheadline, CTA scroll anchor     |
| `SignupForm`     | Client        | Email input + submit button, calls server action |
| `FeatureList`    | Server        | 3 key benefits (icon + text)                 |
| `Footer`         | Server        | Copyright, minimal links                     |

Use Magic UI's `AnimatedGradientText` or `BlurFade` for the hero headline. Use shadcn/ui `Input`, `Button`, and `Label` inside `SignupForm`. No other UI libraries.

---

## Styling Conventions

Use Tailwind CSS utility classes exclusively — no custom CSS files except `app/globals.css` for base resets and CSS variables. Follow shadcn/ui conventions: CSS variables for theme colors (`--background`, `--foreground`, `--primary`), defined in `globals.css`. Use responsive prefixes (`sm:`, `md:`, `lg:`) mobile-first. Spacing scale: use `4`, `8`, `12`, `16`, `24` multiples. Keep layout simple: `max-w-4xl mx-auto px-4` container. No inline styles.

---

## Deployment

Host on Vercel. Connect the GitHub repo (`eudicy/birthday-briefing`) in the Vercel dashboard — every push to `main` triggers an automatic production deployment. No `vercel.json` is needed for a standard Next.js App Router project; Vercel auto-detects the framework. Set `BREVO_API_KEY` and `BREVO_LIST_ID` as environment variables in the Vercel project settings (not in `.env.local`, which is local-only). Use Vercel's preview deployments for PRs.
