# MonsoonRoute — Testing Plan

> **Status:** FROZEN TESTING PLAN  
> **Purpose:** Define exactly how MonsoonRoute will be verified using deterministic custom tests, API/integration tests, browser verification, and TestSprite.
>
> **Implementation rule:** The coding agent must execute this document as written. It must not invent a different testing architecture, replace deterministic tests with AI-generated tests, or weaken assertions merely to make a suite pass.

---

## 0. Testing Philosophy

MonsoonRoute has two fundamentally different classes of correctness:

1. **Computational correctness**
   - Does the deterministic engine calculate the correct risk?
   - Does geometry behave correctly?
   - Does route ranking follow the frozen formulas?
   - Does the recommendation obey the critical-risk gate?
   - Does the API reject invalid input and return the correct error contract?

2. **Product/runtime correctness**
   - Can a real user complete the route-analysis flow?
   - Does the map render?
   - Do destination inputs work?
   - Do routes appear?
   - Does evidence appear?
   - Does “Explain this decision” work?
   - Does the application remain usable when an external provider or Ollama fails?

These must **not** be tested in exactly the same way.

### The rule

```text
CUSTOM DETERMINISTIC TESTS
        ↓
prove mathematical / domain correctness

CUSTOM INTEGRATION TESTS
        ↓
prove modules work together

MANUAL BROWSER CHECKS
        ↓
prove the real external integrations work

TESTSPRITE
        ↓
prove the product works from the user's perspective
```

TestSprite is therefore **complementary**, not a replacement for the custom suite.

The earlier planning explicitly locked this division: deterministic tests protect risk calculations, scoring, recommendation rules, and edge cases, while TestSprite covers UI, API workflows, browser interaction, the complete route-analysis flow, failure states, and regression. fileciteturn114file0L47-L69

---

# 1. Testing Boundaries

## 1.1 What custom tests own

Custom tests are authoritative for:

- Zod request validation
- coordinate validation
- route normalization
- GeoJSON normalization
- route midpoint calculation
- Open-Meteo interval normalization
- partial-hour weighting
- precipitation aggregation
- precipitation probability aggregation
- point hotspot distance
- polygon hotspot intersection/distance
- one-hotspot-one-exposure behavior
- recurrence factor
- proximity factor
- waterlogging risk
- rain risk
- environmental risk
- time penalty
- decision score
- critical-risk gate
- deterministic ranking
- tie-breaking
- recommendation reason
- evidence generation
- deterministic explanation
- API error mapping
- AI fallback behavior

These are not allowed to become “whatever the AI tester thinks looks correct.”

---

## 1.2 What TestSprite owns

TestSprite is responsible for black-box product validation:

- page loads
- route form interaction
- destination selection
- travel-mode selection
- current-location interaction
- Find safer route flow
- map rendering
- route visibility
- recommendation visibility
- evidence visibility
- alternative-route visibility
- Explain this decision flow
- AI explanation visibility
- deterministic fallback visibility
- user-visible error states
- API workflow from the running application
- regression of the primary user journey

Current TestSprite documentation supports frontend tests, backend tests, and end-to-end workflows, and its CLI can run tests against a local frontend through a tunnel. citeturn1search0turn1search1

---

## 1.3 What neither test system should decide

Neither custom tests nor TestSprite should redefine the product.

Do not change the implementation because:

- a generated test assumes a different formula;
- TestSprite expects Google’s default route to be the recommendation;
- an AI-generated test calls a route “safe”;
- a generated test assumes a fixed number of Google routes;
- a test assumes every hotspot must be shown in the UI;
- a test assumes AI is required for route analysis.

The frozen architecture remains authoritative.

---

# 2. Testing Stack

Use the following testing stack.

## 2.1 Custom test runner

Use **Vitest** for deterministic and integration tests.

Testing-only dependencies:

```bash
pnpm add -D vitest @vitest/coverage-v8
```

If the project already contains a compatible test runner, do not replace it unnecessarily. Otherwise, use Vitest.

No Jest migration.

No Cypress.

No custom test framework.

---

## 2.2 Browser/E2E

Do not build a second large custom browser-testing framework.

For the hackathon:

- TestSprite = primary black-box E2E/UI validation
- manual browser smoke test = human verification
- custom Vitest = deterministic/backend correctness

This avoids spending the final day maintaining two overlapping browser suites.

---

## 2.3 TestSprite

Use TestSprite through either:

1. the TestSprite CLI, or
2. the TestSprite MCP integration with the coding agent.

The two paths test the same running product; the choice of interface does not change the test scope.

The current TestSprite CLI supports:

```bash
testsprite setup
testsprite doctor
testsprite project create
testsprite test create
testsprite test run
testsprite test failure get
testsprite test rerun
```

and can test a local frontend through a TestSprite tunnel. citeturn1search0turn1search1

---

# 3. Test Pyramid

MonsoonRoute's test distribution should look like this:

```text
                       ┌───────────────────────┐
                       │     TestSprite        │
                       │ UI / E2E / failures   │
                       └───────────┬───────────┘
                                   │
                         small number of
                         high-value flows
                                   │
                 ┌─────────────────┴─────────────────┐
                 │   API / integration tests         │
                 │ provider mocks + route pipeline   │
                 └─────────────────┬─────────────────┘
                                   │
                   many fast deterministic tests
                                   │
                 ┌─────────────────┴─────────────────┐
                 │          Unit tests               │
                 │ formulas / geometry / weather    │
                 └───────────────────────────────────┘
```

The bottom layer is the most important for this project because the route decision is deterministic.

---

# 4. Required Test Project Structure

Create this structure:

```text
tests/
├── fixtures/
│   ├── routes.ts
│   ├── weather.ts
│   ├── hotspots.ts
│   └── requests.ts
│
├── unit/
│   ├── coordinates.test.ts
│   ├── route-normalization.test.ts
│   ├── route-midpoint.test.ts
│   ├── weather-intervals.test.ts
│   ├── rain-analysis.test.ts
│   ├── hotspot-distance.test.ts
│   ├── waterlogging-risk.test.ts
│   ├── decision-score.test.ts
│   ├── recommendation.test.ts
│   └── evidence.test.ts
│
├── integration/
│   ├── analyze-route.test.ts
│   └── explain-route.test.ts
│
└── helpers/
    ├── mock-providers.ts
    └── test-assertions.ts

testsprite/
├── plans/
│   ├── primary-flow.json
│   ├── invalid-input.json
│   ├── provider-failure.json
│   └── ai-fallback.json
└── README.md
```

Do not create:

```text
tests/
├── giant-e2e-framework/
├── test-database/
├── mock-google-server/
└── fake-aws-infrastructure/
```

Those are unnecessary for the MVP.

---

# 5. Test Fixtures Are First-Class

Do not make deterministic tests depend on live Google Routes or live Open-Meteo responses.

The test suite must have controlled fixtures.

The fixture strategy is:

```text
real provider
    ↓
used by manual / TestSprite verification

provider mock
    ↓
used by deterministic integration tests

pure fixture data
    ↓
used by unit tests
```

This means a Google outage cannot randomly make the mathematical test suite fail.

---

# 6. Canonical Route Fixtures

Create at least these route fixtures.

## Fixture A — fastest route

```text
route-fast
duration = 1200 seconds
distance = known
geometry = LineString A
```

## Fixture B — slower route

```text
route-slow
duration = 1440 seconds
distance = known
geometry = LineString B
```

## Fixture C — another alternative

```text
route-medium
duration = 1500 seconds
distance = known
geometry = LineString C
```

The actual coordinates should be synthetic and stable.

Do not depend on the current Google route geometry for mathematical tests.

---

# 7. Canonical Hotspot Fixtures

Create controlled hotspots that exercise every geometry rule.

## H1 — high severity, 4 documented events, route intersects

```text
severity = high
documentedEventCount = 4
distance = 0
```

Expected:

```text
severityWeight = 1.0
recurrenceFactor = 1.0
proximityFactor = 1.0
rawContribution = 1.0

waterloggingRisk ≈ 63.21
```

---

## H2 — second high hotspot, same route

Use the same properties as H1.

Two fully exposed high hotspots:

```text
totalContribution = 2
waterloggingRisk =
100 × (1 - exp(-2))
≈ 86.47
```

This is a critical fixture because the scoring function is intentionally nonlinear.

---

## H3 — medium severity at half corridor distance

```text
severity = medium
documentedEventCount = 4
distance = 37.5m
```

Expected:

```text
severityWeight = 0.7
recurrenceFactor = 1.0
proximityFactor = 0.5

rawContribution = 0.35

waterloggingRisk ≈ 29.53
```

---

## H4 — outside the corridor

```text
distance = 75.01m
```

Expected:

```text
proximityFactor = 0
contribution = 0
```

---

## H5 — zero-event hotspot

```text
documentedEventCount = 0
```

Expected:

```text
recurrenceFactor = 0
contribution = 0
```

---

## H6 — polygon intersected by route

The route must pass through the polygon.

Expected:

```text
distance = 0
```

Do not replace the polygon with its centroid.

---

## H7 — polygon near route but not intersected

The route should pass within the 75m corridor without intersecting the polygon.

Expected:

```text
0 < distance < 75m
```

---

# 8. Unit Test Group A — Validation

## A1. Valid coordinates

Test:

```text
lat = 19.0760
lon = 72.8777
```

Expected:

```text
accepted
```

---

## A2. Latitude below -90

Expected:

```text
INVALID_REQUEST
```

---

## A3. Latitude above 90

Expected:

```text
INVALID_REQUEST
```

---

## A4. Longitude below -180

Expected:

```text
INVALID_REQUEST
```

---

## A5. Longitude above 180

Expected:

```text
INVALID_REQUEST
```

---

## A6. Same origin and destination

Expected:

```text
INVALID_REQUEST
```

This should be rejected before external provider calls.

---

## A7. Invalid travel mode

Example:

```json
{
  "travelMode": "WALK"
}
```

Expected:

```text
INVALID_REQUEST
```

---

## A8. Invalid departure time

Expected:

```text
INVALID_REQUEST
```

---

# 9. Unit Test Group B — Route Normalization

Test that a provider response is normalized into the frozen internal route contract.

Verify:

- route ID exists
- label exists
- duration is seconds
- distance is meters
- geometry is GeoJSON LineString
- optional viewport does not break normalization

Do not assert:

```text
route count === 3
```

Google can return fewer alternatives.

Do assert:

```text
0 routes → NO_ROUTE
1+ routes → normalize successfully
```

---

# 10. Unit Test Group C — Route Midpoint

The midpoint must be calculated from the route geometry.

Tests:

### C1. Straight line

Expected midpoint is geometrically centered.

### C2. Bent route

The midpoint must follow route distance, not the straight line between origin and destination.

### C3. Different routes with same endpoints

Routes with different geometries must be allowed to produce different weather coordinates.

This protects the product's route-specific weather model.

---

# 11. Unit Test Group D — Open-Meteo Interval Logic

This group is extremely important.

Open-Meteo hourly precipitation values represent preceding-hour intervals.

For example:

```text
timestamp 11:00
interval 10:00–11:00
```

The implementation must not treat 11:00 as an instantaneous observation.

---

## D1. Full-hour overlap

Journey:

```text
10:00 → 11:00
```

Weather:

```text
10:00–11:00 = 6mm
```

Expected weighted precipitation:

```text
6mm
```

---

## D2. Half-hour overlap

Journey:

```text
10:20 → 10:50
```

Weather:

```text
10:00–11:00 = 6mm
```

Overlap:

```text
30 minutes
```

Expected:

```text
6 × 0.5 = 3mm
```

---

## D3. Two partial intervals

Journey:

```text
10:30 → 11:30
```

Weather:

```text
10:00–11:00 = 6mm
11:00–12:00 = 4mm
```

Expected:

```text
6 × 0.5 + 4 × 0.5
= 5mm
```

---

## D4. No overlap

Journey:

```text
12:00 → 13:00
```

Weather interval:

```text
10:00 → 11:00
```

Expected:

```text
0 contribution
```

---

## D5. Probability aggregation

For overlapping forecast points:

```text
probabilities = [40, 60, 80]
```

Expected average:

```text
60
```

Do not convert this into flood probability.

---

# 12. Unit Test Group E — Rain Risk

Frozen formula:

```text
amountScore =
clamp(totalPrecipitationMm / 15, 0, 1) × 100

peakScore =
clamp(peakHourlyPrecipitationMm / 6, 0, 1) × 100

probabilityScore =
averagePrecipitationProbability

rainRisk =
0.50 × amountScore
+
0.30 × peakScore
+
0.20 × probabilityScore
```

---

## E1. Zero rain

```text
total = 0
peak = 0
probability = 0
```

Expected:

```text
rainRisk = 0
```

---

## E2. Midpoint fixture

```text
total = 7.5mm
peak = 3mm
probability = 50
```

Expected:

```text
amountScore = 50
peakScore = 50
probabilityScore = 50

rainRisk = 50
```

This is an excellent anchor fixture.

---

## E3. Maximum/clamped rain

```text
total = 100mm
peak = 100mm
probability = 100
```

Expected:

```text
rainRisk = 100
```

The score must never exceed 100.

---

# 13. Unit Test Group F — Point Hotspot Geometry

Use Turf-backed helpers.

## F1. Point exactly on route

Expected:

```text
distance ≈ 0m
```

Use a tolerance for floating-point geometry.

---

## F2. Point inside corridor

Example:

```text
distance = 50m
```

Expected:

```text
0 < distance < 75
```

---

## F3. Point exactly at corridor boundary

```text
distance = 75m
```

Expected behavior must be explicitly consistent with the implementation's corridor comparison.

Recommended locked behavior:

```text
distance <= 75m → eligible
distance > 75m  → excluded
```

---

## F4. Point outside corridor

```text
distance = 100m
```

Expected:

```text
excluded
```

---

## F5. Same hotspot near multiple route segments

The hotspot must return one route-level minimum distance.

It must not produce multiple contributions.

---

# 14. Unit Test Group G — Polygon Hotspot Geometry

## G1. Route intersects polygon

Expected:

```text
distance = 0
exposed = true
```

---

## G2. Route near polygon

Expected:

```text
minimum distance calculated
```

---

## G3. Route far from polygon

Expected:

```text
excluded
```

---

## G4. Polygon preservation

Verify that the internal hotspot representation still contains polygon geometry.

Do not silently convert:

```text
Polygon
```

into:

```text
Point centroid
```

---

# 15. Unit Test Group H — One Hotspot, One Exposure

This test prevents one of the most dangerous scoring bugs.

Construct:

```text
Route
  ├── segment 1 near hotspot H1
  ├── segment 2 near hotspot H1
  └── segment 3 near hotspot H1
```

Expected:

```text
H1 contributes once
```

Not:

```text
H1 contributes 3 times
```

The implementation must use the minimum distance from the hotspot geometry to the complete route.

---

# 16. Unit Test Group I — Waterlogging Risk

Frozen formula:

```text
proximity =
max(0, 1 - distance / 75)

recurrence =
min(
  1,
  log1p(eventCount) / log1p(4)
)

raw =
severityWeight × recurrence × proximity

waterloggingRisk =
100 × (1 - exp(-sum(raw)))
```

---

## I1. No hotspots

Expected:

```text
waterloggingRisk = 0
```

---

## I2. One fully exposed high hotspot

Expected:

```text
≈ 63.21
```

---

## I3. Two fully exposed high hotspots

Expected:

```text
≈ 86.47
```

---

## I4. Medium hotspot at 37.5m with 4 events

Expected:

```text
≈ 29.53
```

---

## I5. Zero-event hotspot

Expected:

```text
0 contribution
```

---

## I6. Outside corridor

Expected:

```text
0 contribution
```

---

## I7. Score bounds

For arbitrary fixture combinations:

```text
0 <= waterloggingRisk <= 100
```

---

# 17. Unit Test Group J — Environmental Risk

Frozen formula:

```text
environmentalRisk =
0.70 × waterloggingRisk
+
0.30 × rainRisk
```

Fixture:

```text
waterloggingRisk = 70
rainRisk = 40
```

Expected:

```text
environmentalRisk = 61
```

Verify clamping if the implementation performs final clamping.

---

# 18. Unit Test Group K — Time Penalty

Frozen formula:

```text
fastestTime = minimum(route durations)

delayRatio =
(routeTime - fastestTime) / fastestTime

timePenalty =
min(100, delayRatio × 100)
```

---

## K1. Fastest route

```text
fastest = 1200s
route = 1200s
```

Expected:

```text
timePenalty = 0
```

---

## K2. 20% slower

```text
fastest = 1000s
route = 1200s
```

Expected:

```text
timePenalty = 20
```

---

## K3. Extreme delay

Use a very large duration.

Expected:

```text
timePenalty = 100
```

---

# 19. Unit Test Group L — Decision Score

Frozen formula:

```text
decisionScore =
0.75 × environmentalRisk
+
0.25 × timePenalty
```

Fixture:

```text
environmentalRisk = 61
timePenalty = 10
```

Expected:

```text
decisionScore = 48.25
```

Lower is better.

Add an explicit assertion proving that a lower score ranks ahead of a higher score.

---

# 20. Unit Test Group M — Critical Risk Gate

Constant:

```text
CRITICAL_ENVIRONMENTAL_RISK = 90
```

## M1. Non-critical routes exist

If:

```text
Route A = 95 environmental risk
Route B = 70 environmental risk
```

Route A must not be recommended merely because another score component makes it attractive.

The critical gate applies before normal recommendation selection.

---

## M2. All routes critical

If every candidate route has:

```text
environmentalRisk >= 90
```

the system chooses the lowest-risk available route.

Expected status:

```text
lowest_risk_available
```

Never:

```text
safe
```

Never:

```text
no flood risk
```

---

# 21. Unit Test Group N — Ranking and Tie-Breaking

Frozen ordering:

```text
1. lower decision score
2. lower environmental risk
3. lower travel time
4. stable route order
```

Create tests for each tie level.

### N1. Decision score differs

Lower decision score wins.

### N2. Decision score tied

Lower environmental risk wins.

### N3. Both tied

Lower travel time wins.

### N4. All tied

Original stable route order wins.

No hidden fifth criterion.

---

# 22. Unit Test Group O — Recommendation Reason

Verify that the generated reason contains the locked fields:

```text
timeDifferenceMinutes
environmentalRiskDifference
waterloggingRiskDifference
avoidedHighRiskHotspots
decisionScoreDifference
```

Test the special case:

```text
fastest route = recommended route
```

The UI/explanation should not claim that the route is slower.

---

# 23. Unit Test Group P — Evidence Generation

Evidence must be derived from computed results.

Test:

- rain evidence exists when meaningful rain exists;
- hotspot evidence identifies exposed hotspots;
- high-risk hotspot count is correct;
- route comparison is consistent with recommendation;
- no-hotspot evidence is honest;
- no evidence claims absolute safety.

Forbidden strings/claims in generated decision evidence:

```text
"guaranteed safe"
"will not flood"
"zero chance of flooding"
"completely safe"
```

---

# 24. Integration Test Architecture

The integration suite should exercise the complete deterministic backend pipeline without calling real external providers.

```text
mock Google Routes
        ↓
route normalization
        ↓
mock Open-Meteo
        ↓
weather normalization
        ↓
hotspot dataset
        ↓
geometry
        ↓
risk engine
        ↓
ranking
        ↓
recommendation
        ↓
evidence
        ↓
API response
```

This is where we verify that individually correct functions are also wired together correctly.

---

# 25. Integration Test — `/api/analyze-route`

Use a known request:

```json
{
  "origin": {
    "lat": 19.076,
    "lon": 72.8777
  },
  "destination": {
    "lat": 19.0596,
    "lon": 72.8295
  },
  "travelMode": "DRIVE",
  "departureTime": "2026-10-08T18:00:00+05:30"
}
```

The exact coordinates are only test fixtures; the test does not need live Google data.

Mock:

```text
Google Routes
Open-Meteo
```

Use known hotspot fixtures.

Assert:

- HTTP success
- routes exist
- recommendation exists
- risk analysis exists
- evidence exists
- recommended route ID exists among returned routes
- no internal provider response leaks into the API
- route count is not assumed to be three

---

# 26. Integration Error Tests

## E1. Invalid request

Expected:

```text
400
code = INVALID_REQUEST
```

---

## E2. Origin equals destination

Expected:

```text
400
code = INVALID_REQUEST
```

And providers should not be called.

---

## E3. Google returns zero routes

Expected:

```text
422
code = NO_ROUTE
```

---

## E4. Google provider throws

Expected:

```text
502
code = ROUTING_PROVIDER_ERROR
```

---

## E5. Open-Meteo provider throws

Expected:

```text
502
code = WEATHER_PROVIDER_ERROR
```

Do not silently use zero rain.

---

## E6. Unexpected analysis error

Expected:

```text
500
code = ANALYSIS_ERROR
```

Do not expose stack traces to the browser.

---

# 27. Integration Test — `/api/explain-route`

The explain endpoint is separate from route analysis.

Provide a valid `ExplanationContext`.

Assert:

- Zod validation occurs;
- malformed context is rejected;
- the route recommendation is not recalculated;
- the endpoint does not call Google Routes;
- the endpoint does not call Open-Meteo;
- the endpoint does not access the hotspot dataset;
- the endpoint does not create a new route;
- successful output matches:

```json
{
  "explanation": "..."
}
```

---

# 28. AI Boundary Test

This is a mandatory architectural test.

The AI layer receives:

```text
recommendation
recommended route summary
fastest route summary
relevant evidence
```

It must not receive tools for:

```text
Google Routes
Open-Meteo
hotspot search
route geometry
risk calculation
route ranking
```

The locked architecture explicitly says AI cannot recalculate risk, fetch weather, invent evidence, or override the deterministic recommendation; AI failure must fall back deterministically. fileciteturn114file0L10-L19

---

# 29. AI Fallback Test

This must be tested both automatically and manually.

Stop Ollama.

Then:

```text
Find safer route
      ↓
analysis succeeds
      ↓
recommendation appears
      ↓
evidence appears
      ↓
Explain this decision
      ↓
Ollama unavailable
      ↓
fallback explanation appears
```

The route recommendation must remain unchanged.

The page must not become unusable.

The user must not see a fabricated AI explanation presented as successful model output.

The implementation plan already marks this as a mandatory acceptance test. 

---

# 30. Provider Mocking Rules

Mock at the provider boundary.

Good:

```text
routeProvider.getRoutes()
    ↓
mock implementation
```

Good:

```text
weatherProvider.getForecast()
    ↓
mock implementation
```

Bad:

```text
mock random internal risk functions
```

We want to test the real deterministic engine.

Do not mock:

- proximity calculation
- recurrence calculation
- risk formula
- ranking
- recommendation logic

Those are the things we actually need to prove.

---

# 31. Live Provider Verification

Custom deterministic tests do not prove that Google and Open-Meteo are configured correctly.

Perform one controlled live verification after the providers are implemented.

## Google

Verify:

- API key works;
- Routes API is enabled;
- Maps JavaScript API loads;
- Places works;
- route alternatives can be returned;
- GeoJSON route geometry is present.

Google recommends restricting API keys to only the required APIs/applications, so the live test should use the restricted keys configured for the project. citeturn0search0turn0search11

## Open-Meteo

Verify:

- request succeeds;
- Asia/Kolkata timezone is used;
- required hourly fields are present;
- multiple coordinates normalize correctly.

---

# 32. Manual Browser Smoke Test

Before TestSprite, manually run the real application once.

Use this exact checklist:

```text
[ ] App opens
[ ] Map loads
[ ] Location permission can be granted
[ ] Current location appears
[ ] Destination can be selected
[ ] Travel mode can be changed
[ ] Find safer route works
[ ] Routes appear
[ ] Recommended route is visually distinct
[ ] Alternative routes appear
[ ] Relevant hotspots appear
[ ] Risk analysis appears
[ ] Evidence appears
[ ] Explain this decision button appears
[ ] AI explanation works if Ollama is available
[ ] AI fallback works if Ollama is unavailable
[ ] Refresh does not create broken state
```

This is not a substitute for TestSprite. It is a preflight that prevents wasting TestSprite runs on an obviously broken local environment.

---

# 33. TestSprite — Purpose

TestSprite should answer:

> **“Can a real user actually use the application successfully?”**

It should not answer:

> **“Did the risk formula produce exactly 63.21?”**

That second question belongs to Vitest.

This separation is especially important because TestSprite's AI-generated tests can otherwise produce a superficially green result against a weak assertion. TestSprite itself recommends reviewing whether a generated check is specific enough to fail when the product is actually broken. citeturn1search2

---

# 34. TestSprite Setup

Perform setup only after the application has a working local flow.

Current CLI prerequisites support Node.js 20.19+, 22.13+, or 24+, so the project's Node 22+ environment is compatible. citeturn1search0turn1search1

Install:

```bash
pnpm add -g @testsprite/testsprite-cli
```

Or use:

```bash
npx @testsprite/testsprite-cli
```

Verify:

```bash
testsprite --version
```

Then:

```bash
testsprite setup
```

Run:

```bash
testsprite doctor
```

Do not start large test runs until `doctor` reports a usable environment.

---

# 35. TestSprite Local Application Strategy

The hackathon application may initially run locally.

Start:

```bash
pnpm dev
```

The application should be reachable at:

```text
http://localhost:3000
```

Create a TestSprite frontend project for the local application.

Conceptually:

```bash
testsprite project create \
  --type frontend \
  --name "MonsoonRoute" \
  --local 3000
```

TestSprite's current CLI supports local frontend testing through a tunnel. citeturn1search0turn1search1

If the exact CLI syntax changes in the current TestSprite release, use:

```bash
testsprite --help
testsprite project create --help
```

Do not redesign the testing strategy because of a CLI syntax change.

---

# 36. TestSprite Test 1 — Primary User Journey

This is the highest-priority TestSprite test.

### Name

```text
Primary route-risk journey
```

### Steps

```text
1. Open MonsoonRoute.
2. Allow location permission if requested.
3. Enter or select a destination.
4. Select DRIVE.
5. Click "Find safer route".
6. Wait for route analysis.
7. Verify at least one route is displayed.
8. Verify a recommendation is displayed.
9. Verify risk information is displayed.
10. Verify evidence is displayed.
11. Click "Explain this decision".
12. Verify an explanation or deterministic fallback is displayed.
```

### Important assertions

Do not use:

```text
"page looks correct"
```

Use specific observable assertions such as:

```text
The recommendation section is visible.
A route card contains a duration.
A risk status is visible.
Evidence is visible.
The Explain this decision action is available after successful analysis.
An explanation/fallback message becomes visible after clicking it.
```

---

# 37. TestSprite Test 2 — Alternative Route Comparison

### Name

```text
Route alternatives and recommendation
```

Steps:

```text
1. Complete a route analysis.
2. Verify multiple route results when the provider supplies alternatives.
3. Verify route cards expose duration.
4. Verify risk information is shown for available routes.
5. Verify exactly one route is marked recommended.
6. Verify the recommended route ID corresponds to one displayed route.
```

Do not assert:

```text
exactly 3 routes
```

Google may return fewer alternatives.

---

# 38. TestSprite Test 3 — Invalid Input

### Name

```text
Invalid route request
```

Cases:

```text
origin equals destination
missing destination
invalid travel mode
invalid coordinates
```

Expected:

```text
clear validation/error state
no successful route recommendation
```

Do not require a particular browser wording if the exact visual text is not frozen. Require the observable error state.

---

# 39. TestSprite Test 4 — Provider Failure

This test should be performed if the app has a practical way to simulate provider failure.

Prefer a development/test-only failure mechanism rather than deliberately breaking production credentials.

Cases:

```text
Google Routes unavailable
Open-Meteo unavailable
```

Expected:

```text
user-visible error
no fake recommendation
no fabricated weather
```

If a provider-failure toggle is not already present in the architecture, do not add a production feature merely for TestSprite.

Instead, use mocked integration tests for these failure paths.

---

# 40. TestSprite Test 5 — AI Failure

### Name

```text
AI explanation fallback
```

Precondition:

```text
Ollama unavailable
```

Flow:

```text
1. Open app.
2. Complete route analysis.
3. Verify recommendation exists.
4. Click Explain this decision.
5. Verify the route recommendation remains visible.
6. Verify a deterministic fallback explanation appears.
7. Verify the UI does not claim that an LLM generated the fallback.
```

This test proves the optional AI layer is actually optional.

---

# 41. TestSprite Test 6 — Travel Mode

Run:

```text
DRIVE
TWO_WHEELER
```

For each:

```text
select mode
analyze route
verify successful route result
verify recommendation
```

Do not assume the same route geometry for both modes.

---

# 42. TestSprite Test 7 — Refresh / Recovery

After a successful analysis:

```text
refresh page
```

Verify:

- application loads;
- no unrecoverable error appears;
- the user can start a new analysis.

Do not require route history persistence because the MVP intentionally has no route-history feature.

---

# 43. TestSprite Test Generation Rule

If TestSprite generates additional tests automatically:

**review them before accepting them as part of the durable suite.**

A test is acceptable only if:

1. it checks a real MonsoonRoute requirement;
2. the assertion can actually fail when the feature is broken;
3. it does not encode a false product assumption;
4. it does not require unnecessary new features;
5. it does not contradict the frozen formulas;
6. it does not turn an implementation detail into a product requirement.

TestSprite's current documentation explicitly supports creating tests from plain-language plans and retrieving failure bundles containing the attempted behavior and observed failure. citeturn1search1

---

# 44. TestSprite Failure Workflow

When a TestSprite run fails:

```text
TESTSPRITE FAILURE
       ↓
classify failure
       ↓
┌──────────────┬─────────────────┬──────────────────┐
│ product bug  │ test bug        │ environment bug  │
└──────┬───────┴────────┬────────┴─────────┬────────┘
       ↓                ↓                  ↓
fix product       fix assertion      fix environment
       ↓                ↓                  ↓
rerun             rerun              rerun
```

Do not immediately modify application code.

First determine whether the failure is:

- actual application defect;
- incorrect generated test;
- stale selector;
- unavailable provider;
- missing environment variable;
- Google quota/key problem;
- Ollama unavailable;
- network/tunnel problem.

TestSprite's current failure workflow supports retrieving a self-consistent failure bundle and rerunning the same test after the fix. citeturn1search0turn1search1

---

# 45. Never “Fix” Tests to Hide Product Bugs

Bad:

```text
Test fails
    ↓
make assertion weaker
    ↓
green
```

Good:

```text
Test fails
    ↓
understand failure
    ↓
determine product/test/environment cause
    ↓
fix correct layer
    ↓
rerun
```

Examples of unacceptable weakening:

```text
"recommendation exists"
```

instead of:

```text
"recommendation ID belongs to returned routes"
```

or:

```text
"some text is visible"
```

instead of:

```text
"the deterministic explanation/fallback section is visible"
```

---

# 46. Static Verification

The final day must include:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Use the project's actual script names if they differ, but do not skip equivalent checks.

The final build must succeed without:

- TypeScript errors
- unresolved imports
- invalid environment assumptions
- server/client boundary errors
- route-handler runtime errors

---

# 47. Test Coverage Expectations

Coverage is a signal, not the objective.

Prioritize coverage of:

```text
decision engine       HIGH
geometry              HIGH
weather interval      HIGH
validation            HIGH
recommendation        HIGH
API error handling    HIGH
AI boundary           MEDIUM/HIGH
UI                     TestSprite
```

Do not waste the final day chasing an arbitrary percentage.

A 100% covered wrong formula is still wrong.

---

# 48. Exact Acceptance Matrix

| Area | Custom Tests | Manual | TestSprite |
|---|---:|---:|---:|
| Coordinate validation | ✓ | | |
| Same origin/destination | ✓ | | ✓ |
| Route normalization | ✓ | | |
| Route midpoint | ✓ | | |
| Weather interval math | ✓ | | |
| Rain risk | ✓ | | |
| Point hotspot geometry | ✓ | | |
| Polygon hotspot geometry | ✓ | | |
| One hotspot / one exposure | ✓ | | |
| Waterlogging risk | ✓ | | |
| Environmental risk | ✓ | | |
| Time penalty | ✓ | | |
| Decision score | ✓ | | |
| Critical gate | ✓ | | |
| Tie-breaks | ✓ | | |
| Recommendation reason | ✓ | | |
| Evidence generation | ✓ | ✓ | ✓ |
| Google Maps loading | | ✓ | ✓ |
| Places input | | ✓ | ✓ |
| Google Routes live call | | ✓ | ✓ |
| Open-Meteo live call | | ✓ | ✓ |
| `/api/analyze-route` | ✓ | ✓ | ✓ |
| `/api/explain-route` | ✓ | ✓ | ✓ |
| AI explanation | | ✓ | ✓ |
| AI fallback | ✓ | ✓ | ✓ |
| Responsive UI | | ✓ | ✓ |
| Complete user journey | | ✓ | ✓ |

---

# 49. Day 4 Testing Schedule

Day 4 is **not** a feature-development day.

The frozen implementation plan explicitly reserves Day 4 for testing, TestSprite, bug fixes, regression, performance sanity checks, API failure checks, AI fallback, demo preparation, recording, README, and submission. fileciteturn114file0L360-L401

Use the day in this order.

## Phase 1 — Static and unit verification

```text
lint
typecheck
unit tests
build
```

Fix P0/P1 failures first.

---

## Phase 2 — Integration verification

Run:

```text
/api/analyze-route success
/api/analyze-route invalid input
/api/analyze-route no route
/api/analyze-route routing failure
/api/analyze-route weather failure
/api/explain-route success
/api/explain-route invalid context
```

---

## Phase 3 — Live provider smoke test

Verify:

```text
Google Maps
Google Places
Google Routes
Open-Meteo
```

Do not repeatedly call live providers while debugging pure formula logic.

---

## Phase 4 — Manual browser smoke test

Complete the entire primary flow manually.

---

## Phase 5 — TestSprite

Run:

```text
primary flow
alternative comparison
invalid input
AI fallback
travel mode
recovery
```

Then rerun failures after fixes.

---

## Phase 6 — Regression

Run the entire custom suite again.

```text
lint
typecheck
test
build
```

Then run the primary TestSprite flow one final time.

---

## Phase 7 — Demo verification

Use the intended demo scenario:

```text
Andheri
   ↓
Bandra
```

The expected story is:

```text
rain
 ↓
multiple routes
 ↓
waterlogging evidence
 ↓
risk calculation
 ↓
recommendation
 ↓
why
 ↓
optional AI explanation
```

The raw planning discussion locked this exact conceptual demo flow: the application should show environmental data leading to analysis, decision, and action. fileciteturn114file2L271-L356

---

# 50. Bug Priority

During Day 4 classify every issue.

## P0 — submission blocker

Examples:

- app does not start;
- route analysis cannot complete;
- recommendation is missing;
- map does not load;
- API always fails;
- wrong route is selected because of a formula/logic bug;
- AI failure crashes route analysis.

Fix immediately.

---

## P1 — major defect

Examples:

- evidence is incorrect;
- hotspot geometry is wrong;
- alternative routes are displayed incorrectly;
- travel mode breaks;
- provider error is mishandled;
- critical gate is wrong.

Fix before demo.

---

## P2 — visual/usability defect

Examples:

- spacing issue;
- minor responsive issue;
- icon mismatch;
- non-critical copy problem.

Fix if time remains.

---

## P3 — nonessential polish

Examples:

- animation;
- decorative effect;
- extra visual feature.

Do not risk the submission for P3.

---

# 51. Performance Sanity Checks

This is not a performance-engineering project.

Only verify:

- route analysis completes within a reasonable demo time;
- UI does not freeze;
- map remains interactive;
- hotspot rendering does not make the page unusable;
- unnecessary repeated provider calls are not occurring;
- the same hotspot is not processed repeatedly for every route segment.

Do not add:

```text
Redis
queues
workers
microservices
database
complex caching layer
```

just to improve a hackathon demo.

---

# 52. External API Cost/Safety Checks

Before final submission:

### Google

Verify:

- keys are restricted;
- only required APIs are enabled;
- no unrestricted server key is exposed to the browser.

Google explicitly recommends restricting API keys to the APIs and applications they need. citeturn0search11

### Open-Meteo

Verify:

- requests contain only required variables;
- no accidental polling loop exists;
- no repeated requests are triggered by unnecessary React renders.

### Ollama

Verify:

- no external paid model is accidentally configured;
- local Ollama remains optional;
- disabling Ollama does not break the decision path.

---

# 53. Final Regression Checklist

Before submission, every box below must be checked.

## Application

```text
[ ] app starts
[ ] production build succeeds
[ ] map loads
[ ] form works
[ ] destination selection works
[ ] travel mode works
```

## Decision engine

```text
[ ] route normalization
[ ] weather intervals
[ ] rain risk
[ ] point hotspots
[ ] polygon hotspots
[ ] one-hotspot-one-exposure
[ ] waterlogging risk
[ ] environmental risk
[ ] time penalty
[ ] decision score
[ ] critical gate
[ ] tie-break
[ ] recommendation
[ ] evidence
```

## API

```text
[ ] analyze success
[ ] invalid request
[ ] same origin/destination
[ ] no route
[ ] routing failure
[ ] weather failure
[ ] analysis failure
[ ] explain success
[ ] explain validation
```

## AI

```text
[ ] Explain this decision works
[ ] AI cannot alter recommendation
[ ] AI cannot fetch weather
[ ] AI cannot fetch routes
[ ] AI cannot invent evidence
[ ] Ollama failure handled
[ ] deterministic fallback works
```

## TestSprite

```text
[ ] setup complete
[ ] doctor passes
[ ] local tunnel works
[ ] primary journey passes
[ ] alternatives test passes
[ ] invalid input test passes
[ ] AI fallback test passes
[ ] travel mode test passes
[ ] recovery test passes
[ ] final regression run passes
```

## Demo

```text
[ ] stable demo origin
[ ] stable demo destination
[ ] recommendation visible
[ ] evidence visible
[ ] Explain this decision visible
[ ] fallback verified
[ ] no accidental loading/error state
```

---

# 54. What Counts as “Tested”

MonsoonRoute is considered tested only when all four layers have passed:

```text
Layer 1
CUSTOM UNIT TESTS
        ↓
deterministic math correct

Layer 2
CUSTOM INTEGRATION TESTS
        ↓
backend pipeline correct

Layer 3
MANUAL LIVE VERIFICATION
        ↓
real providers + browser work

Layer 4
TESTSPRITE
        ↓
real user journey works
```

A green TestSprite run alone is **not sufficient**.

A green unit suite alone is **not sufficient**.

The combination is what gives confidence.

---

# 55. Golden Testing Principle

The most important test in this project is not:

> “Does the page look good?”

It is:

> **“Given known route, weather, and hotspot inputs, does MonsoonRoute deterministically select the route that the frozen decision model says it should select?”**

Everything else protects the path around that decision.

The product exists because Google supplies feasible routes, while MonsoonRoute evaluates them using rain, known waterlogging exposure, and travel-time trade-offs. fileciteturn113file0L16-L37

Therefore:

```text
Google
  ↓
candidate routes

Open-Meteo
  ↓
rain evidence

Hotspot dataset
  ↓
waterlogging evidence

Deterministic engine
  ↓
recommendation

Test suite
  ↓
prove recommendation is correct

TestSprite
  ↓
prove user can actually reach and understand it
```

---

# 56. Final Rule for the Coding Agent

When implementing tests, the coding agent must follow this order:

```text
1. Read architecture.md
2. Read implementation-plan.md
3. Read testing.md
4. Implement the specified test
5. Run it
6. Inspect the failure
7. Fix the application only if the failure proves an application defect
8. Rerun
9. Continue to the next specified test
```

The agent must **not**:

```text
❌ invent new product behavior
❌ change the risk formula
❌ weaken assertions to get green
❌ replace deterministic tests with TestSprite
❌ make TestSprite authoritative over the frozen architecture
❌ add a database for tests
❌ add a fake production endpoint solely to satisfy a generated test
❌ turn AI into the decision engine
❌ add unnecessary browser-testing infrastructure
❌ spend Day 4 building new features
```

If a test exposes a genuine conflict between the implementation and the frozen architecture:

```text
STOP
↓
report the exact conflict
↓
do not silently redesign the system
```

---

# 57. Final Testing Definition of Done

The testing phase is complete when:

```text
CUSTOM TESTS
      ↓
all critical deterministic tests pass
      ↓
INTEGRATION TESTS
      ↓
all required API paths pass
      ↓
LIVE PROVIDERS
      ↓
Google + Open-Meteo + Maps verified
      ↓
MANUAL BROWSER
      ↓
primary journey passes
      ↓
TESTSPRITE
      ↓
primary E2E + failure/fallback cases pass
      ↓
REGRESSION
      ↓
lint + typecheck + test + build pass
      ↓
DEMO
      ↓
stable end-to-end run
```

At that point, stop changing functionality.

**Testing is finished. Freeze the application and move to demo/submission.**
