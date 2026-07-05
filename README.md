# ResumeAI — Resume Critique UI

React + TypeScript + Tailwind CSS implementation of the Resume Critique dashboard,
built as a reusable component library.

```bash
npm install
npm run dev       # start dev server
npm run build     # type-check + production build
npm test          # run unit/integration tests once
npm run test:watch
npm run typecheck # type-check only (app, node config, and api/ functions)
npm run lint
```

## Reusing the components

Everything is exported from a single barrel — copy `src/components`, `src/lib`,
`src/types`, `tailwind.config.ts` and `src/index.css` into another project and import:

```tsx
import { Button, Card, ScoreRing, Sidebar, TopBar, AppShell } from "./components";
```

Components never use raw hex values; all colors, type scales, radii and spacing come
from the design tokens in [tailwind.config.ts](tailwind.config.ts), so the whole
system re-themes from that one file.

## Component inventory

| Layer | Components |
| --- | --- |
| `ui/` (primitives) | `Button` (primary/outline/ghost/text), `IconButton`, `Icon`, `Card`, `Badge`, `Tag`, `Avatar`, `ProgressBar`, `ScoreRing`, `Toggle`, `SearchInput`, `Fab`, `TextField`, `SelectField`, `Menu`, `Dialog` |
| `layout/` | `AppShell` (sidebar + header + content), `Sidebar` (data-driven nav, CTA, user), `TopBar` (title, status, action slots) |
| `resume/` | `ResumePaper`, `ResumeSection`, `ExperienceItem`, `SkillList`, `Highlight` (AI revision/strength annotations) |
| `insights/` | `ScoreCard`, `MetricCard`, `CritiqueCard`, `ImprovementList`, `MentorQuote` |
| `editor/` | `OutlinePanel`, `SuggestionCard`, `RefinementPanel`, `ResumeDocument`/`DocSection`/`DocExperience`, `AiMarker`, `ScorePill` |
| `dashboard/` | `GaugeCard`, `KeywordGrid`, `ChecklistCard`, `RelevanceCard`, `CareerPathCard`, `JobMatchPanel`/`JobCard` (+ skeleton) |
| `analytics/` | `KpiCard`, `ActivityFeed`, `LinkPerformance`, `GeoDistribution` |

`src/pages/ResumeCritiquePage.tsx` composes them into the full screen and wires the
interaction where hovering an AI-suggested span in the resume highlights and scrolls
to the linked critique card. Demo content lives in `src/data/resume.ts`; the domain
types (`Critique`, `Improvement`, `ScoreMetric`, …) are in `src/types/resume.ts`.

## Production architecture

The component library still works with zero configuration — every page falls back
to local demo data (`src/data/*.ts`) whenever no backend is configured, a call is
in flight, or a call fails, so copying a page into another project never breaks.
But two flows are now genuinely live against real backends, not just demo data:

- **Resume Critique & Build pages** run the actual resume text shown on each page
  through `/api/critique` on load, and replace the demo score/findings/suggestions
  with the real AI response the moment it resolves (see `useResumeCritique` and the
  presentation mappers in `src/features/resume-critique/present.ts`).
- **Dashboard's "Matched Jobs" panel** calls a real job-search API (`/api/jobs`,
  proxying JSearch/RapidAPI) and scores each live listing against the resume's own
  skills client-side (`src/lib/jobMatch.ts`) — nothing here is canned.

Both degrade the same honest way: a small "Analyzing with AI…" / error line appears
above the affected panel, and the page keeps rendering demo content underneath it
rather than blanking out.

This all sits on a secure backend layer that follows one hard rule:

> **Provider API keys (OpenRouter, etc.) never reach the browser.** The client
> only ever calls our own `/api/*` endpoints; those serverless functions hold
> the real secrets and talk to the AI provider server-side.

```
src/
  app/
    queryClient.ts          # shared TanStack Query client (retry policy, staleTime)
  App.tsx                  # <BrowserRouter> + route table; bridges onNavigate(pageId) to real paths
  config/env.ts          # typed access to client-safe VITE_* vars only
  services/
    apiClient.ts          # fetch wrapper for OUR backend: timeout, abort, typed errors
    apiError.ts            # ApiError + friendlyErrorMessage() for user-facing copy
  lib/
    jsonExtract.ts          # pulls JSON out of a raw LLM completion (fenced or bare)
    text.ts                  # truncateText() — generic char-budget truncation
    aiErrorMapping.ts          # pure: provider HTTP status -> {code, message, httpStatus} for OUR api
    jobMatch.ts                 # pure: generic keyword-overlap scorer, resume skills vs. any job text
    __tests__/                   # unit tests for all of the above, no network involved
  features/
    resume-critique/         # one domain module = types + api + hook + presentation mappers:
      types.ts                 # ResumeCritiqueResult, ResumeDocSection, ...
      api.ts                    # requestResumeCritique() -> POST /api/critique
      useResumeCritique.ts        # TanStack Query-backed: cache, auto-cancel stale runs, status/data/error
      present.ts                   # maps the API shape onto the UI's Critique/Improvement/ScoreMetric/
                                    # SuggestionGroup types — pure, unit-tested, no page knows the API shape
      __tests__/                   # mocks fetch at the boundary, proves the full flow
    job-matching/             # same shape, for job search:
      types.ts, api.ts, useJobMatches.ts, present.ts

api/                        # Vercel serverless functions (Node runtime, never bundled to client)
  _lib/
    env.ts                    # server-only secrets via process.env (no VITE_ prefix)
    http.ts                    # withHandler() method guard + consistent JSON error shape
    openrouter.ts                # calls the AI provider: key rotation, retry/backoff on 429,
                                  # transport failures mapped via src/lib/aiErrorMapping.ts
    parseAiJson.ts                # parses a completion as JSON; if malformed, asks the model
                                   # once to repair its own output before giving up
    critique.ts                    # the critique prompt + business-shape validation
    jobSearch.ts                     # JSearch/RapidAPI client — structured params in, no text-sniffing
  critique.ts                 # POST /api/critique
  jobs.ts                       # GET /api/jobs?role=...&location=...&country=... — 501 jobs_not_configured
                                # when RAPIDAPI_KEY is absent, matching adaptmycv's "sidebar just
                                # doesn't appear without a key" precedent, just as an explicit error code
```

The split is deliberate: `aiErrorMapping.ts` and `text.ts` are pure decision logic (no
network, no secrets) so they live in `src/lib` and are unit-tested directly; `openrouter.ts`
and `parseAiJson.ts` are the network *orchestration* that uses them, so they live in
`api/_lib` where the provider secrets are available. Nothing about "what message does a
429 deserve" needs a live API call to test, so it isn't tested through one.

**Adding a new AI-backed feature** follows the same shape every time: a prompt +
parser in `api/_lib/<feature>.ts`, a thin `api/<feature>.ts` HTTP handler, and a
`src/features/<feature>/` module (types/api/hook) that the UI calls through
`apiClient` — never `fetch` directly, so timeouts, aborts, and error handling
stay consistent everywhere.

### Routing and state management

- **Routing**: `react-router` (`BrowserRouter`), one route per page in `src/App.tsx`.
  Pages don't import the router directly — they still take an `onNavigate(pageId)`
  prop (Sidebar, header menus, and cross-page links all call it the same way they
  did before routing existed); `App.tsx` is the only place that maps a page id to
  a real path and calls `useNavigate()`. That keeps every page component reusable
  outside this router setup if you copy it into another project. Because routes
  are real paths now (not `#hash` fragments), deep links and refresh both work —
  `vercel.json` rewrites unmatched paths to `index.html` so this keeps working
  once deployed as a static SPA.
- **State management**: no global client-state store (Redux/Zustand) — the state
  worth centralizing here is *server* state (AI results with loading/error/staleness),
  which is what `@tanstack/react-query` is for. `useResumeCritique` wraps a `useQuery`
  keyed on the submitted resume text: resubmitting identical text is served from
  cache instead of re-billing the AI provider, and submitting new text while a
  previous run is in flight cancels the stale request automatically. Purely local
  UI state (an open dialog, a form draft) stays as component `useState`, on purpose —
  routing it through Query or a global store would be the wrong tool for it.

### Environment variables

Copy `.env.example` to **`.env`** (not `.env.local`) and fill in real values — both
files are git-ignored, but only `.env` gets picked up by `vercel dev`'s serverless
function runtime in local testing; `vite`'s own dev server reads either, so `.env`
is the one that works for both halves of the app.

To actually exercise `/api/critique` locally against a real provider (not just the
UI), run `npx vercel dev` instead of `npm run dev` — the plain Vite dev server has
no serverless runtime, so `/api/*` routes 404 under it.

| Variable | Where it's read | Required |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | `api/_lib/env.ts` (server-only) | Yes, to actually call the AI provider |
| `OPENROUTER_API_KEY_2` | `api/_lib/env.ts` (server-only) | No — optional fallback key for rate-limit resilience |
| `OPENROUTER_API_URL` | `api/_lib/env.ts` (server-only) | No — defaults to OpenRouter's endpoint |
| `OPENROUTER_MODEL` | `api/_lib/env.ts` (server-only) | No — defaults to `google/gemini-2.0-flash` |
| `RAPIDAPI_KEY` | `api/_lib/env.ts` (server-only) | No — job matching returns a clear `jobs_not_configured` error without it |
| `VITE_API_BASE_URL` | `src/config/env.ts` (client) | No — defaults to same-origin `/api` |

Only `VITE_`-prefixed variables are ever inlined into the browser bundle by Vite;
everything else above is invisible to client code by construction.

### Testing

Vitest + Testing Library, mirroring the pattern of testing pure logic directly
and integration-testing hooks against a mocked `fetch` boundary rather than
hitting a real API in tests. Run `npm test` or `npm run test:watch`.

### Deployment (Vercel)

`vercel.json` builds the Vite app to `dist/` and deploys every file under `api/`
as its own serverless function. Set the server-only env vars above in the Vercel
project settings (Production/Preview/Development) — never in `VITE_`-prefixed form.

### CI

`.github/workflows/ci.yml` runs lint → typecheck → test → build on every push
and pull request against `main`.
