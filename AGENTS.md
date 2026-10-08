<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MonsoonRoute — AGENTS.md

> **Status:** FROZEN EXECUTION INSTRUCTIONS  
> **Project:** MonsoonRoute  
> **Hackathon:** Environmental Hacks 2026 — Heat & Water  
> **Implementation:** October 8–10, 2026  
> **Day 4:** October 11 — testing, bug fixes, stabilization, demo, submission only

---

# 0. READ THIS FIRST

You are the coding agent implementing **MonsoonRoute**.

This file is the operational instruction layer for the implementation.

The project has already been designed. Your job is **execution, not architecture**.

You must:

1. read the frozen project documents before changing code;
2. determine the current stage from the **Progress Tracker** in this file;
3. implement **only that stage**;
4. run the checks specified by the implementation/testing documents;
5. mark the stage complete only after its acceptance criteria pass;
6. advance `CURRENT STAGE` to the next unfinished stage;
7. continue sequentially;
8. stop and report a blocker when a required decision is genuinely missing.

You must **not redesign the application while implementing it**.

> **Core rule:** Read → implement the current stage → verify → update progress → move to the next stage.

---

# 1. CRITICAL CORRECTION ABOUT THE STAGE COUNT

The current frozen `docs/implementation-plan.md` contains **49 numbered implementation stages, not 42**.

The exact stage sequence currently defined by the implementation plan is:

```text
Stage 1  → Next.js Foundation
Stage 2  → Design Tokens
Stage 3  → Google Maps JavaScript Integration
Stage 4  → Google Place Autocomplete
Stage 5  → Browser Geolocation
Stage 6  → Shared Type Contracts
Stage 7  → Route Contracts
Stage 8  → Zod Request Validation
Stage 9  → Google Routes API Provider
Stage 10 → Route Midpoint
Stage 11 → Open-Meteo Provider
Stage 12 → Hotspot Dataset
Stage 13 → Spatial Candidate Filtering
Stage 14 → Point Hotspot Distance
Stage 15 → Polygon Hotspot Handling
Stage 16 → One Hotspot, One Exposure
Stage 17 → Waterlogging Risk Formula
Stage 18 → Rain Analysis
Stage 19 → Environmental Risk
Stage 20 → Time Penalty
Stage 21 → Decision Score
Stage 22 → Critical Risk Gate
Stage 23 → Route Ranking
Stage 24 → Recommendation Contract
Stage 25 → Evidence Generation
Stage 26 → Final Internal RouteAnalysis
Stage 27 → /api/analyze-route
Stage 28 → Frontend Route Form
Stage 29 → Route Map
Stage 30 → Map Camera
Stage 31 → Route Cards
Stage 32 → Recommendation Section
Stage 33 → Route Analysis Component
Stage 34 → Risk Breakdown
Stage 35 → UI States
Stage 36 → Deterministic Explanation
Stage 37 → AI Boundary
Stage 38 → ExplanationContext
Stage 39 → /api/explain-route
Stage 40 → Strands TypeScript Integration
Stage 41 → Ollama
Stage 42 → Strands Agent Configuration
Stage 43 → AI System Prompt
Stage 44 → Structured AI Output
Stage 45 → AI UI
Stage 46 → AI Failure Test
Stage 47 → Final Frontend Composition
Stage 48 → Responsive Behavior
Stage 49 → Complete Analyze Integration
```

**Do not remove or renumber these stages.**

If an older discussion refers to "42 stages", treat that as an older count. The attached/frozen implementation plan is the current implementation sequence.

---

# 2. PROJECT SUMMARY

## 2.1 Product

**MonsoonRoute is a rain-aware route decision system that compares available routes using forecast rain, route geometry, source-backed waterlogging evidence, and travel-time trade-offs, then recommends the better practical route.**

Core flow:

```text
Origin
+
Destination
+
Travel Mode
+
Departure Time
        ↓
Candidate Routes
        ↓
Rain Analysis
+
Waterlogging Analysis
        ↓
Environmental Risk
        ↓
Time Penalty
        ↓
Decision Score
        ↓
Recommendation
        ↓
Evidence
        ↓
Optional AI Explanation
```

The most important architectural rule is:

> **The deterministic engine makes the decision. The AI explains the decision.**

---

# 3. WHAT MONSOONROUTE IS NOT

Do not accidentally turn the MVP into any of these:

```text
❌ weather dashboard
❌ flood-probability model
❌ Google Maps replacement
❌ traffic predictor
❌ AI route planner
❌ nationwide climate platform
❌ crowdsourcing/social platform
❌ emergency-response platform
❌ multi-agent system
❌ route-history product
❌ notification platform
❌ account/authentication product
❌ ML flood prediction system
```

The application is intentionally narrow.

---

# 4. FROZEN ARCHITECTURE

The architecture is:

```text
USER
  ↓
NEXT.JS FRONTEND
  ↓
POST /api/analyze-route
  ↓
NEXT.JS BACKEND
  ├── Google Routes
  ├── Open-Meteo
  └── Local GeoJSON hotspot dataset
  ↓
DETERMINISTIC ENGINE
  ├── Route geometry
  ├── Waterlogging risk
  ├── Rain risk
  ├── Environmental risk
  ├── Time penalty
  ├── Decision score
  ├── Recommendation
  └── Evidence
  ↓
JSON
  ↓
UI
```

Only after the deterministic result exists:

```text
USER CLICKS "EXPLAIN THIS DECISION"
  ↓
POST /api/explain-route
  ↓
ExplanationContext
  ↓
Strands Agent
  ↓
VercelModel
  ↓
ai-sdk-ollama
  ↓
Ollama
  ↓
{ explanation: string }
  ↓
UI
```

There is **no AI call in the route-decision path**.

---

# 5. FROZEN TECHNOLOGY STACK

Use the technologies already selected.

```text
Next.js
React
TypeScript
Tailwind CSS
pnpm

Zod

Google Maps JavaScript API
@vis.gl/react-google-maps

Google Places / Places Autocomplete

Google Routes API

Open-Meteo Forecast API

Turf.js

GeoJSON

@strands-agents/sdk
VercelModel
ai-sdk-ollama
Ollama

Vitest
TestSprite
manual browser verification
```

Do not substitute technologies merely because you personally prefer another library.

Do not introduce:

```text
❌ Express
❌ Rust
❌ database
❌ MongoDB
❌ PostgreSQL
❌ Redis
❌ queues
❌ microservices
❌ background workers
❌ AWS Lambda
❌ AWS database infrastructure
❌ another routing provider
❌ another weather provider
❌ another AI framework
```

AWS participation is through the already-approved **Strands open-source tool path**. Do not add AWS infrastructure just to make the project look more complex.

---

# 5A. APPROVED UI DESIGN REFERENCE

The approved visual reference image is part of the frozen UI specification:

```text
docs/MonsoonRoute Weather App UI Collage.png
```

The coding agent must use this image together with `docs/design-system.md` when implementing the UI. The image is a visual reference, not permission to invent a different layout, color system, spacing system, or component style. If the image and written design-system rules appear to conflict, stop and report the exact conflict instead of deciding silently.

# 6. FROZEN SOURCE-OF-TRUTH DOCUMENTS

Before implementation, read these files completely:

```text
docs/architecture.md
docs/design-system.md
docs/implementation-plan.md
docs/testing.md
```

The raw planning/discussion document is supporting context and contains the reasoning behind many decisions.

Priority for implementation:

```text
docs/architecture.md
        ↓
docs/design-system.md
        ↓
docs/implementation-plan.md
        ↓
docs/testing.md
        ↓
raw planning discussion
```

If a future `docs/demo.md` is added, read it before demo/submission work.

### Important

Do not silently "fix" a frozen document while implementing.

If two frozen documents appear to conflict:

```text
STOP
↓
identify the exact conflict
↓
report it
↓
wait for the architectural decision
```

Do not invent a third interpretation.

---

# 7. NON-NEGOTIABLE AGENT RULES

## 7.1 No architecture decisions during implementation

Do not:

- redesign the architecture;
- add infrastructure;
- add product features;
- replace deterministic calculations with AI;
- move decision-making into the LLM;
- change the route-ranking strategy;
- change risk formulas;
- change the geographic scope;
- invent data;
- invent provider behavior;
- silently change API contracts;
- silently change component responsibilities.

If the implementation plan already tells you how something works, **follow it**.

---

## 7.2 No scope expansion

Do not add:

```text
accounts
authentication
profiles
route history
notifications
saved routes
social features
crowdsourcing
admin dashboard
mobile application
traffic prediction
ML flood prediction
nationwide coverage
IoT
real-time sensor infrastructure
multi-agent AI
chatbot conversations
arbitrary AI questions
```

Even if these seem like "easy improvements".

They are outside the frozen MVP.

---

## 7.3 Deterministic engine is authoritative

The deterministic engine owns:

```text
route candidates
weather analysis
hotspot analysis
geometry
waterlogging risk
rain risk
environmental risk
time penalty
decision score
ranking
recommendation
evidence
```

AI does not own any of these.

If the engine says:

```text
Recommended: Route B
```

the UI must continue to show:

```text
Route B
```

even if the LLM says:

```text
I think Route C is better.
```

The LLM cannot override the deterministic result.

---

# 8. AI AGENT BOUNDARY

The Strands agent is intentionally tiny.

It receives already-computed evidence and turns it into a human-readable explanation.

The agent must have:

```text
1 agent
1 model
1 system prompt
no tools
structured output
```

The agent must NOT have access to:

```text
❌ Google Routes
❌ Open-Meteo
❌ hotspot search
❌ map
❌ web search
❌ route calculation
❌ risk calculation
❌ recommendation engine
❌ arbitrary external tools
```

The agent must not:

```text
recalculate risk
choose another route
modify scores
invent weather
invent hotspots
invent evidence
claim safety
claim certainty not present in the evidence
```

The system prompt must tell it that it is explaining an already-computed decision.

---

# 9. AI CONTEXT BOUNDARY

Do not send the entire world to the model.

Do not send:

```text
raw Google response
raw Open-Meteo response
entire GeoJSON dataset
```

The explanation request uses a small `ExplanationContext` containing the already-computed information necessary to explain the recommendation.

Conceptually:

```text
recommendation
recommended route summary
fastest route summary
relevant evidence
```

The AI explanation is not a second analysis engine.

---

# 10. DATA INTEGRITY RULES

The hotspot dataset must be source-backed.

Never invent:

```text
hotspot names
coordinates
severity
event counts
evidence
authority/source
historical claims
current-status claims
```

The dataset covers the defined Mumbai urban scope:

```text
Mumbai City
Mumbai Suburban
Navi Mumbai
Panvel / connected urban belt
```

Do not expand this to a nationwide dataset.

Use the canonical filename defined by the final planning discussion:

```text
data/mumbai-region-waterlogging-hotspots.geojson
```

If the implementation plan contains an older filename reference, do not silently create two datasets. Use the canonical filename above and report a document inconsistency if the exact conflict prevents implementation.

---

# 11. HOTSPOT GEOMETRY RULES

If a source provides a polygon:

```text
KEEP THE POLYGON
```

Do not replace it with its centroid merely for convenience.

For point hotspots:

```text
point → distance to complete route
```

For polygon hotspots:

```text
route intersects polygon
    ↓
distance = 0
```

otherwise:

```text
minimum route-to-polygon distance
```

The corridor is:

```text
75 meters
```

This is an engineering corridor, not a scientific flood radius.

---

# 12. ONE-HOTSPOT-ONE-EXPOSURE

A hotspot can be near multiple segments of one route.

It must contribute:

```text
once per route
```

using its minimum distance to the complete route.

Do not sum the same hotspot repeatedly because a route passes nearby multiple times.

---

# 13. FROZEN RISK FORMULAS

Do not modify these formulas.

## Waterlogging

```text
severityWeight:
  medium = 0.7
  high   = 1.0
```

```text
recurrenceFactor =
min(
  1,
  log1p(documentedEventCount) / log1p(4)
)
```

```text
proximityFactor =
max(
  0,
  1 - distanceMeters / 75
)
```

```text
rawContribution =
severityWeight
× recurrenceFactor
× proximityFactor
```

```text
waterloggingRisk =
100 × (1 - exp(-sum(rawContribution)))
```

---

## Rain

```text
amountScore =
clamp(totalPrecipitationMm / 15, 0, 1) × 100
```

```text
peakScore =
clamp(peakHourlyPrecipitationMm / 6, 0, 1) × 100
```

```text
probabilityScore =
average precipitation probability
```

```text
Rain Risk =
0.50 × amountScore
+
0.30 × peakScore
+
0.20 × probabilityScore
```

Clamp to:

```text
0–100
```

This is a rain exposure/risk heuristic.

It is **not flood probability**.

---

## Environmental Risk

```text
Environmental Risk =
0.70 × Waterlogging Risk
+
0.30 × Rain Risk
```

---

## Time Penalty

```text
fastestTime =
minimum route duration
```

```text
delayRatio =
(routeTime - fastestTime) / fastestTime
```

```text
timePenalty =
min(100, delayRatio × 100)
```

---

## Decision Score

```text
Decision Score =
0.75 × Environmental Risk
+
0.25 × Time Penalty
```

Lower is better.

Do not reverse this.

---

# 14. CRITICAL-RISK RULE

```text
CRITICAL_ENVIRONMENTAL_RISK = 90
```

If a route has:

```text
environmentalRisk >= 90
```

it is critical.

If at least one non-critical route exists:

```text
normally do not recommend a critical route
```

If every available route is critical:

```text
choose the lowest-risk available route
status = lowest_risk_available
```

Otherwise:

```text
status = safer_option_found
```

Do not invent another threshold.

---

# 15. ROUTE RANKING

Ascending order:

```text
1. decision score
2. environmental risk
3. travel time
4. stable route order
```

Do not use:

```text
Google's default route
```

as the recommendation merely because Google returned it first.

---

# 16. GOOGLE ROUTES RULES

The route provider is server-side.

Use:

```text
GOOGLE_ROUTES_API_KEY
```

Never expose that key to the browser.

The provider must request alternative routes and normalize the response immediately.

Do not assume a fixed number of routes.

Possible result:

```text
0 routes
1 route
2 routes
3 routes
...
```

Zero routes must produce the defined:

```text
422 NO_ROUTE
```

Do not fabricate a route when the provider returns none.

---

# 17. OPEN-METEO RULES

Use:

```text
/v1/forecast
```

Required hourly values:

```text
precipitation
precipitation_probability
weather_code
```

Use:

```text
Asia/Kolkata
```

Weather analysis uses each route's own journey window:

```text
journeyStart = departureTime
journeyEnd =
departureTime + route.durationSeconds
```

Open-Meteo hourly precipitation/probability values describe the preceding hourly interval.

Do not incorrectly treat an hourly value as an instantaneous timestamp.

Only overlapping intervals contribute to the route's journey-window analysis.

---

# 18. FRONTEND RULES

The frontend is one focused experience.

Primary flow:

```text
MonsoonRoute
    ↓
Use my location / enter origin
    ↓
Enter destination
    ↓
Select travel mode
    ↓
Find safer route
    ↓
Map
    ↓
Recommendation
    ↓
Alternative routes
    ↓
Risk analysis
    ↓
Evidence
    ↓
Explain this decision
```

Required components include the responsibilities defined in the implementation plan:

```text
route-form.tsx
route-map.tsx
route-card.tsx
route-analysis.tsx
why-route.tsx
```

The frontend must not independently recalculate:

```text
risk
ranking
recommendation
```

It displays backend-computed results.

---

# 19. MAP RULES

Use:

```text
@vis.gl/react-google-maps
```

Map responsibilities are visualization only.

The map can display:

```text
origin
destination
recommended route
alternative routes
nearest 8–10 hotspots for nearby UI context
route-relevant hotspots after analysis
```

The "nearest 8–10" optimization is only for nearby UI context.

The risk engine must consider **all route-relevant hotspots**, not only the 8–10 nearest records.

---

# 20. USER LOCATION PRIVACY

Browser geolocation is used only for the current application interaction.

Coordinates must not be:

```text
persisted
stored
profiled
tracked
used for unrelated analytics
```

If permission is denied, manual origin entry remains available.

---

# 21. DESIGN SYSTEM RULES

The visual direction is frozen.

The application is:

```text
dark-first
clean
modern
readable
accessible
calm
trustworthy
data-driven
```

Do not make it:

```text
flashy
game-like
neon
gradient-heavy
cluttered
dashboard-heavy
alarmist
```

Use the values from `docs/design-system.md`.

Important design priorities:

```text
Recommendation
    ↓
Risk
    ↓
Evidence
    ↓
Comparison
    ↓
Details
```

Do not make decorative UI more visually prominent than the actual route decision.

No unnecessary gradients.

---

# 22. API BOUNDARIES

## Analyze

```text
POST /api/analyze-route
```

Request:

```ts
{
  origin: { lat, lon },
  destination: { lat, lon },
  travelMode: "DRIVE" | "TWO_WHEELER",
  departureTime: string
}
```

Validate with Zod.

Reject:

```text
invalid coordinates
invalid travel mode
invalid departure time
origin == destination
```

Error contracts:

```text
400 INVALID_REQUEST
422 NO_ROUTE
502 ROUTING_PROVIDER_ERROR
502 WEATHER_PROVIDER_ERROR
500 ANALYSIS_ERROR
```

---

## Explain

```text
POST /api/explain-route
```

Pipeline:

```text
request
  ↓
Zod
  ↓
ExplanationContext
  ↓
Strands
  ↓
VercelModel
  ↓
ai-sdk-ollama
  ↓
Ollama
  ↓
RouteExplanation
```

The explain endpoint must not call:

```text
Google Routes
Open-Meteo
Risk Engine
Recommendation Engine
```

---

# 23. AI FAILURE MUST NOT BREAK THE PRODUCT

This is mandatory.

If Ollama is unavailable:

```text
route analysis
    ↓
still succeeds
    ↓
recommendation
    ↓
evidence
    ↓
Explain this decision
    ↓
AI fails
    ↓
deterministic explanation fallback
```

The user must still be able to understand the recommendation.

AI is optional.

---

# 24. TESTING RULES

Read `docs/testing.md` before writing tests.

Testing has four complementary layers:

```text
CUSTOM UNIT TESTS
    ↓
mathematical/domain correctness

CUSTOM INTEGRATION TESTS
    ↓
API/provider/engine composition

MANUAL BROWSER VERIFICATION
    ↓
real Google/Open-Meteo/Ollama integration

TESTSPRITE
    ↓
black-box UI/API/E2E product validation
```

Do not replace the deterministic test suite with TestSprite.

Do not ask TestSprite to redefine formulas.

Custom tests own:

```text
validation
route normalization
geometry
weather interval handling
rain risk
waterlogging risk
environmental risk
time penalty
decision score
critical gate
ranking
recommendation
evidence
deterministic explanation
API error mapping
AI fallback
```

TestSprite owns:

```text
page loading
route form
destination selection
travel mode
location interaction
Find safer route
map rendering
route visibility
recommendation visibility
evidence visibility
Explain this decision
AI explanation/fallback
user-visible failures
primary user journey regression
```

---

# 25. TEST FIXTURE RULE

Do not make mathematical tests depend on live Google Routes or Open-Meteo.

Use controlled fixtures.

```text
LIVE PROVIDERS
    ↓
manual/TestSprite verification

PROVIDER MOCKS
    ↓
integration tests

PURE FIXTURES
    ↓
unit tests
```

Do not stress paid/external APIs during deterministic tests.

---

# 26. DAY 4 RULE

Day 4 is **not a fourth feature-development day**.

Day 4 is:

```text
test
  ↓
diagnose
  ↓
fix
  ↓
retest
  ↓
regression
  ↓
demo
  ↓
submission
```

Do not use Day 4 for:

```text
new features
architecture changes
major refactors
new providers
new infrastructure
new product ideas
```

Only fix:

```text
bugs
release blockers
test failures
integration failures
critical UX problems
demo blockers
```

---

# 27. PROGRESS TRACKER — OPERATIONAL CURSOR

This is the most important section for continuing work across coding-agent sessions.

## Current implementation cursor

```text
CURRENT STAGE: 50
CURRENT STATUS: COMPLETE
CURRENT DAY: IMPLEMENTATION
BLOCKER: None.

Last completed: Stage 49 — Complete Analyze Integration
Validation: Wired the route form to POST validated inputs to `/api/analyze-route`, retained the deterministic response, rendered the map, recommendation, route cards, risk breakdowns, evidence, and AI explanation in one focused flow; ESLint, TypeScript, and diff checks passed.
Next: None — all 49 implementation stages are complete.
```

### How to use this

When the agent starts:

1. read this file;
2. read the frozen documents;
3. find `CURRENT STAGE`;
4. locate that stage in `docs/implementation-plan.md`;
5. implement only that stage;
6. run its checks;
7. verify acceptance criteria;
8. change that stage to `[x] COMPLETE`;
9. change `CURRENT STAGE` to the next unfinished stage;
10. save this file;
11. report what was completed and what remains.

### Never do this

```text
Stage 1 is difficult
    ↓
skip it
    ↓
jump to Stage 9
```

Do not skip stages because a later stage appears more interesting.

### Blocked stage

If a stage cannot be implemented because a required decision or external prerequisite is genuinely missing:

```text
CURRENT STATUS: BLOCKED
```

Then report:

```text
Stage:
Exact blocker:
Why the frozen documents do not answer it:
What decision/input is required:
```

Do not invent a solution merely to keep progress green.

---

# 28. 49-STAGE PROGRESS LIST

## Stage 1 — Next.js Foundation

- [X] Stage 1 — Next.js Foundation

---

## Stage 2 — Design Tokens

- [X] Stage 2 — Design Tokens

---

## Stage 3 — Google Maps JavaScript Integration

- [X] Stage 3 — Google Maps JavaScript Integration

---

## Stage 4 — Google Place Autocomplete

- [X] Stage 4 — Google Place Autocomplete

---

## Stage 5 — Browser Geolocation

- [X] Stage 5 — Browser Geolocation

---

## Stage 6 — Shared Type Contracts

- [X] Stage 6 — Shared Type Contracts

---

## Stage 7 — Route Contracts

- [X] Stage 7 — Route Contracts

---

## Stage 8 — Zod Request Validation

- [X] Stage 8 — Zod Request Validation

---

## Stage 9 — Google Routes API Provider

- [X] Stage 9 — Google Routes API Provider

---

## Stage 10 — Route Midpoint

  - [X] Stage 10 — Route Midpoint

---

## Stage 11 — Open-Meteo Provider

- [X] Stage 11 — Open-Meteo Provider

---

## Stage 12 — Hotspot Dataset

- [X] Stage 12 — Hotspot Dataset

---

## Stage 13 — Spatial Candidate Filtering

- [X] Stage 13 — Spatial Candidate Filtering

---

## Stage 14 — Point Hotspot Distance

- [X] Stage 14 — Point Hotspot Distance

---

## Stage 15 — Polygon Hotspot Handling

- [X] Stage 15 — Polygon Hotspot Handling

---

## Stage 16 — One Hotspot, One Exposure

- [X] Stage 16 — One Hotspot, One Exposure

---

## Stage 17 — Waterlogging Risk Formula

- [X] Stage 17 — Waterlogging Risk Formula

---

## Stage 18 — Rain Analysis

- [X] Stage 18 — Rain Analysis

---

## Stage 19 — Environmental Risk

- [X] Stage 19 — Environmental Risk

---

## Stage 20 — Time Penalty

- [X] Stage 20 — Time Penalty

---

## Stage 21 — Decision Score

- [X] Stage 21 — Decision Score

---

## Stage 22 — Critical Risk Gate

- [X] Stage 22 — Critical Risk Gate

---

## Stage 23 — Route Ranking

- [X] Stage 23 — Route Ranking

---

## Stage 24 — Recommendation Contract

- [X] Stage 24 — Recommendation Contract

---

## Stage 25 — Evidence Generation

- [X] Stage 25 — Evidence Generation

---

## Stage 26 — Final Internal RouteAnalysis

- [X] Stage 26 — Final Internal RouteAnalysis

---

## Stage 27 — `/api/analyze-route`

- [X] Stage 27 — `/api/analyze-route`

---

## Stage 28 — Frontend Route Form

- [X] Stage 28 — Frontend Route Form

---

## Stage 29 — Route Map

- [X] Stage 29 — Route Map

---

## Stage 30 — Map Camera

- [X] Stage 30 — Map Camera

---

## Stage 31 — Route Cards

- [x] Stage 31 — Route Cards

---

## Stage 32 — Recommendation Section

- [x] Stage 32 — Recommendation Section

---

## Stage 33 — Route Analysis Component

- [x] Stage 33 — Route Analysis Component

---

## Stage 34 — Risk Breakdown

- [x] Stage 34 — Risk Breakdown

---

## Stage 35 — UI States

- [x] Stage 35 — UI States

---

## Stage 36 — Deterministic Explanation

- [x] Stage 36 — Deterministic Explanation

---

## Stage 37 — AI Boundary

- [x] Stage 37 — AI Boundary

---

## Stage 38 — ExplanationContext

- [x] Stage 38 — ExplanationContext

---

## Stage 39 — `/api/explain-route`

- [x] Stage 39 — `/api/explain-route`

---

## Stage 40 — Strands TypeScript Integration

- [x] Stage 40 — Strands TypeScript Integration

---

## Stage 41 — Ollama

- [x] Stage 41 — Ollama

---

## Stage 42 — Strands Agent Configuration

- [x] Stage 42 — Strands Agent Configuration

---

## Stage 43 — AI System Prompt

- [x] Stage 43 — AI System Prompt

---

## Stage 44 — Structured AI Output

- [x] Stage 44 — Structured AI Output

---

## Stage 45 — AI UI

- [x] Stage 45 — AI UI

---

## Stage 46 — AI Failure Test

- [x] Stage 46 — AI Failure Test

---

## Stage 47 — Final Frontend Composition

- [x] Stage 47 — Final Frontend Composition

---

## Stage 48 — Responsive Behavior

- [x] Stage 48 — Responsive Behavior

---

## Stage 49 — Complete Analyze Integration

- [x] Stage 49 — Complete Analyze Integration

---

# 29. STAGE COMPLETION PROTOCOL

A stage is not complete merely because code was written.

For every stage:

```text
READ
 ↓
IMPLEMENT
 ↓
FORMAT
 ↓
TYPECHECK
 ↓
RUN RELEVANT TESTS
 ↓
VERIFY ACCEPTANCE CRITERIA
 ↓
MARK COMPLETE
 ↓
ADVANCE CURSOR
```

At minimum, maintain:

```text
pnpm lint
pnpm typecheck
```

where those scripts exist, plus the stage-specific checks from `docs/implementation-plan.md` and `docs/testing.md`.

Do not weaken tests or assertions to make them pass.

If a test fails:

```text
failure
  ↓
understand cause
  ↓
fix implementation
  ↓
rerun
```

Do not simply delete or weaken the test.

---

# 30. PROGRESS UPDATE FORMAT

At the end of each agent session, report:

```text
MonsoonRoute Progress

Current Stage:
Completed:
Files changed:
Checks run:
Tests passed:
Tests failed:
Blockers:
Next Stage:
```

  Current session progress:

  ```text
  MonsoonRoute Progress

  Current Stage: 3 — Google Maps JavaScript Integration
  Completed: Implementation complete; acceptance blocked by missing browser API key
  Files changed:
    src/components/route-map.tsx
    src/app/page.tsx
    AGENTS.md
  Checks run:
    pnpm lint
    pnpm build
    agent-browser preview verification
  Tests passed: lint and build
  Tests failed: live Google map verification (missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
  Blockers: Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in the project environment
  Next Stage: 3 — Google Maps JavaScript Integration
  ```

  Example:

  ```text
  MonsoonRoute Progress

Current Stage: 10
  Completed: Stage 9 — Google Routes API Provider
Files changed:
  src/lib/validation/route-request.ts
Checks run:
  pnpm lint
  pnpm typecheck
  pnpm test
Tests passed: 18
Tests failed: 0
Blockers: none
Next Stage: 9 — Google Routes API Provider
```

Then update this file so:

```text
CURRENT STAGE: 9
```

and:

```text
[x] Stage 8 — Zod Request Validation
[ ] Stage 9 — Google Routes API Provider
```

---

# 31. DAILY MILESTONES

## Day 1 — Foundation + Providers + Data

Target capability:

```text
Next.js
+
Google Maps
+
Places
+
geolocation
+
shared contracts
+
validation
+
hotspot data
+
Google Routes
+
route normalization
+
route midpoint
+
Open-Meteo
```

Acceptance:

```text
origin
destination
candidate routes
route geometry
route durations
route midpoints
weather snapshots
```

No recommendation is required yet.

---

## Day 2 — Deterministic Engine + Backend + Map

Target capability:

```text
geometry
+
hotspot exposure
+
waterlogging risk
+
rain risk
+
environmental risk
+
time penalty
+
decision score
+
critical gate
+
ranking
+
recommendation
+
evidence
+
/api/analyze-route
+
map
+
route cards
+
risk analysis
```

Acceptance:

```text
user input
→ API
→ Google
→ weather
→ hotspots
→ deterministic engine
→ recommendation
→ UI
```

No AI is required in the decision path.

---

## Day 3 — UI Completion + AI

Target capability:

```text
design system
+
states
+
recommendation UI
+
evidence UI
+
responsive UI
+
deterministic explanation
+
/api/explain-route
+
Strands
+
VercelModel
+
ai-sdk-ollama
+
Ollama
+
tool-less agent
+
structured output
+
AI fallback
```

Acceptance:

```text
complete user journey
```

with AI remaining optional.

---

## Day 4 — Testing + Stabilization + Submission

Target capability:

```text
custom tests
+
integration tests
+
TestSprite
+
manual browser verification
+
provider failure checks
+
AI fallback
+
regression
+
demo
+
README
+
attribution
+
submission
```

No new product functionality.

---

# 32. FINAL DEFINITION OF DONE

The implementation is complete only when this full flow works:

```text
Open MonsoonRoute
        ↓
Allow location OR enter origin
        ↓
Enter destination
        ↓
Select DRIVE or TWO_WHEELER
        ↓
Find safer route
        ↓
Google Routes candidates
        ↓
Route normalization
        ↓
Route midpoint
        ↓
Open-Meteo weather
        ↓
Journey-window rain analysis
        ↓
All route-relevant hotspots
        ↓
Waterlogging risk
        ↓
Environmental risk
        ↓
Time penalty
        ↓
Decision score
        ↓
Recommendation
        ↓
Evidence
        ↓
Map + route cards + risk breakdown
        ↓
Explain this decision
        ↓
ExplanationContext
        ↓
Strands
        ��
Ollama
        ↓
Natural-language explanation
```

And if Ollama fails:

```text
everything above still works
        ���
deterministic explanation fallback
```

---

# 33. ABSOLUTE FINAL RULE

> **Do not make the coding agent think about architecture tomorrow.**

The architecture has already been decided.

The implementation plan has already been decided.

The design system has already been decided.

The testing strategy has already been decided.

The AI boundary has already been decided.

The coding agent's job is:

```text
READ THE PLAN
    ↓
FIND CURRENT STAGE
    ↓
IMPLEMENT IT
    �����
TEST IT
    ↓
MARK IT COMPLETE
    ↓
MOVE TO NEXT STAGE
```

If something is missing:

```text
DO NOT INVENT.
REPORT THE BLOCKER.
```

If something is tempting:

```text
DO NOT EXPAND SCOPE.
```

If AI can solve something:

```text
DO NOT GIVE AI A DECISION-MAKING ROLE
unless the frozen plan explicitly assigns it to explanation.
```

If a generated test disagrees with the frozen architecture:

```text
THE ARCHITECTURE WINS.
```

If the deterministic engine and LLM disagree:

```text
THE DETERMINISTIC ENGINE WINS.
```

**MonsoonRoute is an implementation project now, not an architecture brainstorming project.**
