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

The pages above render entirely from local demo data (`src/data/*.ts`) — that's
deliberate, so the component library works with zero configuration when reused
elsewhere. Alongside it, the project has a real, secure backend layer for wiring
pages up to an actual AI provider. It follows one hard rule:

> **Provider API keys (OpenRouter, etc.) never reach the browser.** The client
> only ever calls our own `/api/*` endpoints; those serverless functions hold
> the real secrets and talk to the AI provider server-side.

```
src/
  config/env.ts          # typed access to client-safe VITE_* vars only
  services/
    apiClient.ts          # fetch wrapper for OUR backend: timeout, abort, typed errors
    apiError.ts            # ApiError + friendlyErrorMessage() for user-facing copy
  lib/
    jsonExtract.ts          # pulls JSON out of a raw LLM completion (fenced or bare)
    __tests__/               # unit tests for the above
  features/
    resume-critique/         # one domain module = types + api + hook, e.g.:
      types.ts                 # ResumeCritiqueResult, ResumeDocSection, ...
      api.ts                    # requestResumeCritique() -> POST /api/critique
      useResumeCritique.ts        # status/data/error + run()/reset(), abortable
      __tests__/                   # mocks fetch at the boundary, proves the full flow

api/                        # Vercel serverless functions (Node runtime, never bundled to client)
  _lib/
    env.ts                    # server-only secrets via process.env (no VITE_ prefix)
    http.ts                    # withHandler() method guard + consistent JSON error shape
    openrouter.ts                # calls the AI provider: key rotation, retry/backoff on 429
    critique.ts                    # the critique prompt + response validation
  critique.ts                 # POST /api/critique — the actual HTTP endpoint
```

**Adding a new AI-backed feature** follows the same shape every time: a prompt +
parser in `api/_lib/<feature>.ts`, a thin `api/<feature>.ts` HTTP handler, and a
`src/features/<feature>/` module (types/api/hook) that the UI calls through
`apiClient` — never `fetch` directly, so timeouts, aborts, and error handling
stay consistent everywhere.

### Environment variables

Copy `.env.example` to `.env.local` (already git-ignored) and fill in real values.

| Variable | Where it's read | Required |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | `api/_lib/env.ts` (server-only) | Yes, to actually call the AI provider |
| `OPENROUTER_API_KEY_2` | `api/_lib/env.ts` (server-only) | No — optional fallback key for rate-limit resilience |
| `OPENROUTER_API_URL` | `api/_lib/env.ts` (server-only) | No — defaults to OpenRouter's endpoint |
| `OPENROUTER_MODEL` | `api/_lib/env.ts` (server-only) | No — defaults to `google/gemini-2.0-flash` |
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
