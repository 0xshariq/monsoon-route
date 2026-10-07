# MonsoonRoute --- Architecture Specification

> **Status:** Frozen for implementation\
> **Project:** Environmental Hacks 2026 --- Heat & Water\
> **Implementation window:** October 8--10, 2026\
> **October 11:** Emergency buffer / submission only

------------------------------------------------------------------------

## 1. Architecture in one sentence

**MonsoonRoute is a rain-aware route decision system that compares
available routes using forecast rain, route geometry, source-backed
waterlogging evidence, and travel-time trade-offs, then recommends the
better practical route.**

The fundamental rule is:

> **The deterministic engine makes the decision. The AI explains the
> decision.**

------------------------------------------------------------------------

# 2. What the application is --- and is not

## What it is

``` text
Origin + Destination + Travel Mode + Departure Time
                         |
                         v
                 Candidate Routes
                         |
              +----------+----------+
              |                     |
              v                     v
        Rain Analysis       Waterlogging Analysis
              |                     |
              +----------+----------+
                         |
                         v
                Environmental Risk
                         |
                         v
                  Time Penalty
                         |
                         v
                  Decision Score
                         |
                         v
                  Recommendation
                         |
                         v
                      Evidence
                         |
                         v
               Optional AI Explanation
```

## What it is not

``` text
NOT a weather dashboard
NOT a flood-probability model
NOT a Google Maps replacement
NOT a traffic predictor
NOT an AI route planner
NOT a nationwide climate platform
NOT a crowdsourcing/social platform
NOT an emergency-response platform
NOT a multi-agent system
```

------------------------------------------------------------------------

# 3. High-level architecture

``` text
                                      USER
                                        |
                         +--------------+--------------+
                         |                             |
                  Browser location              Place input
                         |                             |
                         v                             v
                  Coordinates                  Place resolution
                         |                             |
                         +--------------+--------------+
                                        |
                                        v
                              NEXT.JS FRONTEND
                                        |
                         POST /api/analyze-route
                                        |
                                        v
                              NEXT.JS BACKEND
                                        |
             +--------------------------+--------------------------+
             |                          |                          |
             v                          v                          v
       Google Routes              Open-Meteo                Local GeoJSON
       candidate routes             weather                 hotspot data
             |                          |                          |
             +--------------------------+--------------------------+
                                        |
                                        v
                              DETERMINISTIC ENGINE
                                        |
                    +-------------------+-------------------+
                    |                   |                   |
                    v                   v                   v
               Route geometry    Waterlogging risk      Rain risk
                    |                   |                   |
                    +-------------------+-------------------+
                                        |
                                        v
                              Environmental risk
                                        |
                                        v
                                  Time penalty
                                        |
                                        v
                                  Decision score
                                        |
                                        v
                              Recommendation
                                        |
                                        v
                                    Evidence
                                        |
                                        v
                                  JSON response
                                        |
                                        v
                                NEXT.JS FRONTEND
                                        |
                              User clicks "Explain"
                                        |
                                        v
                              /api/explain-route
                                        |
                                        v
                             ExplanationContext
                                        |
                                        v
                                STRANDS AGENT
                                        |
                                  VercelModel
                                        |
                                  ai-sdk-ollama
                                        |
                                        v
                                     Ollama
                                        |
                                        v
                                  Explanation
                                        |
                                        v
                                       UI
```

------------------------------------------------------------------------

# 4. Two runtime paths

## 4.1 Decision path --- mandatory

``` text
User
  ↓
Find safer route
  ↓
/api/analyze-route
  ↓
Validate
  ↓
Google Routes
  ↓
Normalize routes
  ↓
Open-Meteo
  ↓
Rain analysis
  ↓
Waterlogging analysis
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
UI
```

**No AI is called anywhere in this path.**

## 4.2 Explanation path --- optional

``` text
UI already shows recommendation
  ↓
User clicks "Explain this decision"
  ↓
/api/explain-route
  ↓
Validate ExplanationContext
  ↓
Strands
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

The raw discussion explicitly freezes AI as an optional, user-triggered
explanation layer outside route analysis. fileciteturn93file0L53-L81

------------------------------------------------------------------------

# 5. Complete user flow --- minute by minute

## T+0:00 --- Open application

The user sees:

``` text
MonsoonRoute

Find routes with lower monsoon
waterlogging exposure.

[ Use my location ]
```

There is no fake weather, route, risk score, or AI response.

## T+0:01 --- Location permission

Browser geolocation returns:

``` text
lat/lon
```

These coordinates exist only in application/session state.

They are not:

``` text
stored
persisted
profiled
tracked
used for analytics
```

If permission is denied, manual origin entry remains available.

## T+0:02 --- Nearby hotspot context

The application finds approximately 8--10 nearest waterlogging zones:

``` text
All hotspot data
      ↓
Spatial filtering
      ↓
Distance from user
      ↓
Sort
      ↓
Nearest 8–10
      ↓
Map/UI
```

This is only a UI optimization.

**The risk engine never uses only these 8--10 records.**

## T+0:03 --- Destination

The user enters a place such as:

``` text
Bandra
```

The frontend resolves it to:

``` text
{ lat, lon }
```

The analysis backend receives coordinates, not raw place-name strings.

## T+0:04 --- Travel mode

MVP:

``` text
DRIVE
TWO_WHEELER
```

## T+0:05 --- Find safer route

The browser sends:

``` text
POST /api/analyze-route
```

with:

``` ts
{
  origin: { lat, lon },
  destination: { lat, lon },
  travelMode: "DRIVE" | "TWO_WHEELER",
  departureTime: ISO8601
}
```

No AI call occurs.

## T+0:06 --- Validation

Zod validates:

-   latitude ranges
-   longitude ranges
-   travel mode
-   ISO departure time

The server rejects origin = destination before making provider calls.

## T+0:07 --- Google Routes

One Compute Routes request asks for alternatives.

Conceptually:

``` text
Origin
+
Destination
+
Travel mode
+
Departure time
      ↓
Google Routes
      ↓
1–4 candidate routes
```

The implementation must not assume three or four routes always exist.

Google-specific JSON is immediately normalized into the application's
`Route` type.

## T+0:08 --- Route normalization

Each route becomes:

``` text
Route
├── id
├── label
├── durationSeconds
├── distanceMeters
├── GeoJSON LineString
└── optional viewport
```

Route geometry is first-class because it powers waterlogging analysis.

## T+0:09 --- Weather locations

Each route gets a representative midpoint:

``` text
Route A → midpoint A
Route B → midpoint B
Route C → midpoint C
```

Multiple route locations should be batched into one Open-Meteo request
where practical.

## T+0:10 --- Open-Meteo

Request hourly:

``` text
precipitation
precipitation_probability
weather_code
```

Use Asia/Kolkata time.

## T+0:11 --- Weather interval normalization

Open-Meteo hourly precipitation values describe the preceding hourly
interval.

Therefore the implementation must treat:

``` text
11:00 value
```

as an interval such as:

``` text
10:00–11:00
```

rather than an instantaneous point.

## T+0:12 --- Journey window

Each route has its own journey window:

``` text
journeyStart = departureTime
journeyEnd = departureTime + duration
```

Example:

``` text
Departure 19:00

Route A = 24 min → 19:00–19:24
Route B = 29 min → 19:00–19:29
Route C = 34 min → 19:00–19:34
```

This means a longer route can legitimately have a slightly different
rain exposure.

## T+0:13 --- Rain metrics

For each route:

``` text
total precipitation
peak hourly precipitation
average precipitation probability
peak precipitation probability
```

Only intervals overlapping the journey window are considered.

## T+0:14 --- Rain Risk

Locked formula:

``` text
amountScore =
    clamp(totalPrecipitationMm / 15, 0, 1) × 100

peakScore =
    clamp(peakHourlyPrecipitationMm / 6, 0, 1) × 100

probabilityScore =
    averagePrecipitationProbability

Rain Risk =
    0.50 × amountScore
  + 0.30 × peakScore
  + 0.20 × probabilityScore
```

Clamp final result to 0--100.

This is a **rain exposure/risk heuristic**, not flood probability.

## T+0:15 --- Waterlogging candidate filtering

For every candidate route:

``` text
Unified hotspot dataset
        ↓
Route bounding region + 75m corridor
        ↓
Candidate hotspots
```

This is a cheap prefilter.

## T+0:16 --- Exact geometry

For each candidate:

``` text
Point hotspot
    ↓
minimum distance to route
```

or:

``` text
Polygon hotspot
    ↓
route/polygon distance or intersection
```

If a route intersects a polygon:

``` text
distance = 0m
```

If a polygon exists, keep it as the authoritative geometry.

## T+0:17 --- One hotspot, one contribution

A hotspot may be near multiple route segments.

It still contributes only once:

``` text
Hotspot
  ↓
minimum distance to entire route
  ↓
ONE contribution
```

This prevents artificial risk inflation.

## T+0:18 --- Waterlogging contribution

Locked conceptual model:

``` text
rawContribution =
    severityWeight
  × recurrenceFactor
  × proximityFactor
```

Severity:

``` text
medium = 0.7
high   = 1.0
```

Recurrence:

``` text
recurrenceFactor =
  min(
    1,
    log1p(documentedEventCount)
    /
    log1p(4)
  )
```

Proximity:

``` text
proximityFactor =
  max(0, 1 - distanceMeters / 75)
```

## T+0:19 --- Waterlogging Risk

Sum hotspot contributions:

``` text
totalContribution =
    sum(contributions)
```

Then:

``` text
waterloggingRisk =
    100 × (1 - exp(-totalContribution))
```

The result is 0--100 and saturates toward 100.

It is **not a probability**.

## T+0:20 --- Environmental Risk

``` text
Environmental Risk =
    0.70 × Waterlogging Risk
  + 0.30 × Rain Risk
```

## T+0:21 --- Time penalty

Find fastest candidate:

``` text
fastestTime =
    min(route.durationSeconds)
```

For each route:

``` text
delayRatio =
    (routeTime - fastestTime)
    /
    fastestTime

timePenalty =
    min(100, delayRatio × 100)
```

## T+0:22 --- Decision score

``` text
Decision Score =
    0.75 × Environmental Risk
  + 0.25 × Time Penalty
```

Lower is better.

## T+0:23 --- Recommendation

The engine applies:

``` text
If a non-critical route exists:
    prefer non-critical candidates.

If every candidate is critical:
    choose the lowest-risk available route.
```

Tie-break:

``` text
1. decision score
2. environmental risk
3. travel time
4. stable route order
```

## T+0:24 --- Evidence generation

The engine generates structured evidence such as:

``` text
+4 min vs fastest route
35 points lower environmental risk
52 points lower waterlogging risk
2 high-risk hotspots avoided
lower overall decision score
```

No AI is needed to generate these facts.

## T+0:25 --- Response reaches UI

The UI receives one structured result:

``` text
routes[]
recommendation
evidence
weather metadata
generatedAt
```

The UI displays:

``` text
Recommended Route
Route B
28 min

Environmental risk: 31 / 100
Waterlogging risk: 24 / 100
Rain risk: 48 / 100

+4 min vs fastest
Avoids 2 high-risk waterlogging locations
```

## T+0:26 --- Map visualization

The map displays:

``` text
Origin
Destination
Recommended route
Alternative routes
Route-relevant hotspots
```

The map is explaining the decision spatially.

It is not the decision engine.

## T+0:27 --- User sees deterministic "Why?"

The structured analysis panel explains:

``` text
Why this route?

Travel time
+4 min compared with fastest

Waterlogging
Avoids 2 high-risk locations

Rain
Lower exposure during the journey

Overall
Lower environmental risk
```

## T+0:28 --- User clicks "Explain this decision"

Only now does AI execute.

``` text
UI
 ↓
POST /api/explain-route
```

## T+0:29 --- ExplanationContext validation

The endpoint validates the small context.

It does not retrieve fresh routes or weather.

It does not recalculate anything.

## T+0:30 --- Strands execution

``` text
ExplanationContext
      ↓
Strands Agent
      ↓
VercelModel
      ↓
ai-sdk-ollama
      ↓
Ollama
```

The agent receives only:

``` text
recommendation
recommended route summary
fastest route summary
relevant evidence
```

## T+0:31 --- AI explanation

The model converts the supplied evidence into natural language.

Example:

> Route B is recommended even though it takes about 4 minutes longer
> than the fastest route. Its estimated environmental risk is
> substantially lower because it avoids two known high-risk waterlogging
> locations. Given the expected rain, the analysis therefore favors
> Route B as the better time/risk trade-off.

## T+0:32 --- UI displays explanation

The AI text appears beneath the deterministic result.

The recommendation remains:

``` text
Route B
```

even if the model were to produce an incorrect alternative suggestion.

## T+0:33 --- AI failure test

If Ollama is unavailable:

``` text
Strands fails
     ↓
deterministic explanation fallback
```

The route recommendation remains fully usable.

------------------------------------------------------------------------

# 6. Geographic/Data Architecture

## Coverage

``` text
Mumbai City
Mumbai Suburban
Navi Mumbai
Panvel / connected urban belt
```

There is **no fixed hotspot count**.

The dataset may contain:

``` text
500
699
1000+
2000+
```

The requirement is source-backed coverage, not a target number.

## Canonical hotspot

``` text
WaterloggingHotspot
├── id
├── name
├── geometry
├── representativeLocation
├── authority
├── historical/current metadata
├── evidence
├── documentedEvents
├── sources
├── provenance
└── operational attributes where available
```

## Source reconciliation

``` text
1. authoritative source/feature ID
2. name + administrative context
3. spatial match
4. ambiguous → do not auto-merge
```

Every canonical hotspot preserves source provenance.

## Offline data preparation

``` text
BMC / NMMC / PMC / verified sources
                ↓
             Extract
                ↓
            Normalize
                ↓
            Reconcile
                ↓
            Deduplicate
                ↓
             Validate
                ↓
          Coverage ledger
                ↓
          Unified GeoJSON
                ↓
          Runtime application
```

The application does not query BMC GIS live during every route request.

------------------------------------------------------------------------

# 7. Two Different Spatial Queries

This is a critical correctness rule.

## User-nearest query

``` text
User location
     ↓
spatial filtering
     ↓
nearest 8–10 hotspots
     ↓
UI/map context
```

## Route-risk query

``` text
Candidate routes
     ↓
route bounding regions
     ↓
entire unified hotspot dataset
     ↓
candidate hotspots
     ↓
exact geometry
     ↓
ALL relevant hotspots
     ↓
risk engine
```

Never do:

``` text
8–10 nearest user hotspots
        ↓
risk calculation
```

because a dangerous hotspot farther along the journey could be missed.

------------------------------------------------------------------------

# 8. Backend Contract

## `/api/analyze-route`

### Request

``` ts
type AnalyzeRouteRequest = {
  origin: {
    lat: number;
    lon: number;
  };

  destination: {
    lat: number;
    lon: number;
  };

  travelMode: "DRIVE" | "TWO_WHEELER";

  departureTime: string;
};
```

### Response

Conceptually:

``` ts
type AnalyzeRouteResponse = {
  request: AnalyzeRouteRequest;

  weather: {
    fetchedAt: string;
  };

  routes: RouteAnalysis[];

  recommendation: Recommendation;

  generatedAt: string;
};
```

`/api/analyze-route` does not call AI.

## `/api/explain-route`

Conceptually:

``` ts
type ExplanationContext = {
  recommendation: Recommendation;

  recommendedRoute: {
    durationMinutes: number;
    environmentalRiskScore: number;
    waterloggingRiskScore: number;
    rainRiskScore: number;
  };

  fastestRoute: {
    durationMinutes: number;
    environmentalRiskScore: number;
    waterloggingRiskScore: number;
    rainRiskScore: number;
  };

  relevantEvidence: AnalysisEvidence[];
};
```

Response:

``` ts
type RouteExplanation = {
  explanation: string;
};
```

------------------------------------------------------------------------

# 9. AI Boundary

## Allowed

``` text
Explain existing recommendation
Summarize supplied evidence
Explain time/risk trade-off
Use clear commuter-friendly wording
```

## Forbidden

``` text
Recalculate route risk
Choose another route
Modify scores
Fetch weather
Search hotspots
Call routing
Use web search
Claim certainty
Invent evidence
Claim safety guarantees
```

The AI has **zero tools**.

The raw discussion explicitly freezes this tool-less model.
fileciteturn97file0L40-L72

------------------------------------------------------------------------

# 10. Strands Integration

Current TypeScript architecture:

``` text
@strands-agents/sdk
        ↓
VercelModel
        ↓
ai-sdk-ollama
        ↓
Ollama
```

The agent is:

``` text
1 agent
1 model
1 system prompt
1 structured output
0 tools
```

The local demo runs:

``` text
Next.js server
+
Strands
+
Ollama
```

The deployed application must not assume it can reach a developer
laptop's `localhost:11434`.

------------------------------------------------------------------------

# 11. Frontend Architecture

One page:

``` text
Route Form
    ↓
Interactive Map
    ↓
Recommendation Card
    ↓
Alternative Route Cards
    ↓
Deterministic Evidence
    ↓
Explain this decision
    ↓
AI Explanation
```

Components:

``` text
route-form.tsx
route-map.tsx
route-card.tsx
route-analysis.tsx
why-route.tsx
```

Responsibilities:

``` text
route-form.tsx
→ collect input / place resolution

route-map.tsx
→ render map/routes/hotspots

route-card.tsx
→ render candidate route

route-analysis.tsx
→ deterministic evidence/explanation

why-route.tsx
→ optional AI explanation
```

The frontend never recreates backend calculations.

------------------------------------------------------------------------

# 12. Error Handling

``` text
400 INVALID_REQUEST
422 NO_ROUTE
502 ROUTING_PROVIDER_ERROR
502 WEATHER_PROVIDER_ERROR
500 ANALYSIS_ERROR
```

### Weather failure

Never silently treat missing weather as zero rain.

``` text
Weather unavailable
      ↓
analysis cannot be completed reliably
```

### AI failure

``` text
AI unavailable
      ↓
deterministic explanation
```

The core product remains usable.

------------------------------------------------------------------------

# 13. Cost Protection

Google APIs are the main externally billed component.

Use:

``` text
Browser key
→ Maps JavaScript API

Server key
→ Routes API
```

Use application restrictions and API restrictions.

Use conservative development quotas.

One user analysis should use one Compute Routes request with
alternatives rather than separate requests for each route.

A billing budget alert is not treated as a hard spending cap.

------------------------------------------------------------------------

# 14. Testing Architecture

## Deterministic tests

Protect:

``` text
normal route
slower but safer route
fastest is safest
all routes critical
tie-break
no hotspots
point hotspot
polygon hotspot
one-hotspot-one-contribution
weather failure
```

## TestSprite

TestSprite validates the product externally:

``` text
UI
API
E2E
browser flow
failure states
regression
```

Main flow:

``` text
Open app
 ↓
Allow location
 ↓
Choose destination
 ↓
Choose travel mode
 ↓
Find safer route
 ↓
Routes appear
 ↓
Recommendation appears
 ↓
Evidence appears
 ↓
Explain this decision
 ↓
AI explanation appears
```

Negative cases:

``` text
same origin/destination
invalid input
no route
routing provider failure
weather failure
AI unavailable
```

TestSprite does not replace deterministic mathematical tests.

------------------------------------------------------------------------

# 15. Project Structure

``` text
monsoon-route/
│
├── app/
│   ├── page.tsx
│   └── api/
│       ├── analyze-route/
│       │   └── route.ts
│       └── explain-route/
│           └── route.ts
│
├── components/
│   ├── route-form.tsx
│   ├── route-map.tsx
│   ├── route-card.tsx
│   ├── route-analysis.tsx
│   └── why-route.tsx
│
├── lib/
│   ├── routing.ts
│   ├── weather.ts
│   ├── hotspots.ts
│   ├── geo.ts
│   ├── risk-engine.ts
│   ├── recommendation.ts
│   └── agent.ts
│
├── data/
│   └── mumbai-region-waterlogging-hotspots.geojson
│
└── types/
    └── route.ts
```

------------------------------------------------------------------------

# 16. Three-Day Execution Plan

## October 8 --- Foundation

``` text
Project setup
 ↓
Google Maps/API setup
 ↓
API restrictions + quotas
 ↓
Location/place input
 ↓
Hotspot GeoJSON
 ↓
Google Routes
 ↓
Open-Meteo
 ↓
basic route + weather pipeline
```

Checkpoint:

``` text
Origin + destination
       ↓
Google routes
       ↓
candidate routes
       ↓
weather
       ↓
hotspot data
```

If this fails, do not move to AI.

## October 9 --- Decision Engine

``` text
Geometry
 ↓
Point/polygon support
 ↓
Waterlogging risk
 ↓
Rain risk
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
/api/analyze-route
 ↓
minimal UI
```

Checkpoint:

``` text
Browser
 ↓
Find safer route
 ↓
Backend
 ↓
Recommendation
 ↓
UI
```

At this point the project already works without AI.

## October 10 --- Finish + Test

``` text
Final UI
 ↓
Map
 ↓
Recommendation
 ↓
Route comparison
 ↓
Evidence
 ↓
Nearby 8–10 hotspots
 ↓
Route-relevant hotspots
 ↓
Explain this decision
 ↓
Strands
 ↓
Ollama
 ↓
Fallback
 ↓
Deterministic tests
 ↓
TestSprite
 ↓
Demo route verification
 ↓
README
 ↓
Attribution
 ↓
3-minute demo
```

## October 11 --- Buffer only

Only:

``` text
unexpected bugs
build problems
recording problems
submission problems
README corrections
```

No architecture changes.

No new features.

------------------------------------------------------------------------

# 17. Final Demo

Recommended story:

``` text
"I need to travel from Andheri to Bandra
during monsoon conditions."
```

Then:

``` text
Google provides candidate routes
          ↓
MonsoonRoute checks rain
          ↓
MonsoonRoute checks waterlogging evidence
          ↓
Fastest route has higher exposure
          ↓
Alternative is slightly slower
          ↓
Decision Engine recommends alternative
          ↓
Evidence explains why
          ↓
User clicks "Explain this decision"
          ↓
Strands + Ollama explains the existing decision
```

The key line:

> **"The route recommendation is produced deterministically from route
> geometry, rainfall, and waterlogging evidence. Strands is only used
> when the user asks for a natural-language explanation of that
> decision."**

------------------------------------------------------------------------

# 18. Final Architecture Diagram

``` text
                         ┌──────────────────┐
                         │       USER       │
                         └────────┬─────────┘
                                  │
                       location / destination
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    NEXT.JS UI   │
                         └────────┬─────────┘
                                  │
                    POST /api/analyze-route
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  API ORCHESTRATOR│
                         └────────┬─────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             ▼                    ▼                    ▼
       Google Routes         Open-Meteo          Local GeoJSON
             │                    │                    │
             └────────────────────┼────────────────────┘
                                  ▼
                    ┌─────────────────────────┐
                    │   DETERMINISTIC ENGINE  │
                    │                         │
                    │ Geometry                │
                    │ Waterlogging risk       │
                    │ Rain risk               │
                    │ Environmental risk      │
                    │ Time penalty             │
                    │ Decision score           │
                    │ Ranking                 │
                    │ Recommendation           │
                    │ Evidence                │
                    └───────────┬─────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ Recommendation│
                         │ + Evidence   │
                         └──────┬───────┘
                                │
                                ▼
                              UI
                                │
                   User clicks "Explain this decision"
                                │
                                ▼
                       /api/explain-route
                                │
                                ▼
                       ExplanationContext
                                │
                                ▼
                        ┌───────────────┐
                        │ STRANDS AGENT │
                        │   NO TOOLS    │
                        └───────┬───────┘
                                │
                           VercelModel
                                │
                         ai-sdk-ollama
                                │
                                ▼
                              Ollama
                                │
                                ▼
                      { explanation: string }
                                │
                                ▼
                               UI
```

------------------------------------------------------------------------

# 19. Frozen Rules

The following are architectural invariants.

``` text
✅ Next.js frontend + backend
✅ Google Routes API
✅ Open-Meteo
✅ Local unified hotspot dataset
✅ Mumbai + Mumbai Suburban + Navi Mumbai + Panvel/connected urban belt
✅ Point + polygon geometry
✅ 8–10 nearest hotspots only for UI
✅ ALL route-relevant hotspots for risk
✅ Deterministic Decision Engine
✅ Waterlogging risk is deterministic
✅ Rain risk is deterministic
✅ Recommendation is deterministic
✅ Evidence exists before AI
✅ AI is optional
✅ AI is user-triggered
✅ One Strands agent
✅ Zero agent tools
✅ Local Ollama
✅ VercelModel + ai-sdk-ollama path
✅ AI cannot change recommendation
✅ AI cannot recalculate risk
✅ AI cannot invent evidence
✅ Deterministic AI fallback
✅ No database
✅ No microservices
✅ No AWS cloud infrastructure required
✅ Strands is the AWS open-source component
✅ TestSprite is external QA
✅ Google cost restrictions
✅ Open-Meteo attribution
```

Do not add architecture merely because it sounds impressive.

------------------------------------------------------------------------

# 20. Final Principle

MonsoonRoute is fundamentally:

``` text
                 DATA
                  │
                  ▼
          DETERMINISTIC
             ANALYSIS
                  │
                  ▼
           RECOMMENDATION
                  │
                  ▼
               EVIDENCE
                  │
                  ▼
                 USER
                  │
       "Explain this decision"
                  │
                  ▼
              STRANDS
                  │
                  ▼
           NATURAL LANGUAGE
```

The application does **not** ask an AI:

> "Which route should I take?"

It determines the route recommendation from explicit engineering rules
and source-backed evidence first.

Then it asks the AI:

> **"Explain why this already-computed decision was made."**

That separation is the core architecture of MonsoonRoute.

**Do not expand the architecture during the hackathon.**
