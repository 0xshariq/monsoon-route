# MonsoonRoute --- Implementation Plan

**Project:** MonsoonRoute\
**Hackathon:** Environmental Hacks 2026 --- Heat & Water\
**Implementation window:** 4 calendar days --- October 8--11, 2026\
**Active implementation:** Days 1--3\
**Day 4:** Reserved exclusively for testing, bug fixes, stabilization,
demo recording, and submission\
**Status:** Implementation-locked planning document\
**Audience:** Coding agent / developer executing the implementation

------------------------------------------------------------------------

# 0. Read This Before Writing Code

This document is intentionally execution-grade.

The purpose is to remove implementation-time architectural decisions
from the coding agent.

The coding agent must **not**:

-   redesign the architecture
-   introduce a database
-   introduce Express
-   introduce Rust
-   introduce microservices
-   introduce Redis
-   introduce queues
-   introduce AWS cloud infrastructure just for the hackathon
-   move route decisions into AI
-   allow AI to calculate risk
-   allow AI to fetch weather
-   allow AI to choose a different route
-   replace the deterministic engine with an LLM
-   invent hotspot data
-   invent severity
-   invent coordinates
-   invent event counts
-   invent evidence
-   change the risk formulas
-   change the UI design system
-   add product features
-   create accounts/authentication
-   create route history
-   create notifications
-   create a nationwide dataset
-   add traffic prediction
-   add ML flood prediction
-   add crowdsourcing
-   add multi-agent behavior

The coding agent's job is:

> **Read the frozen project documents, implement the specified files and
> behavior in the specified order, run the specified checks, and report
> blockers instead of making architectural decisions.**

If an implementation detail is already specified here, the agent must
follow it exactly.

If something is genuinely missing and cannot be implemented from the
existing specifications, **stop and report the missing decision** rather
than inventing one.

------------------------------------------------------------------------

# 1. Source-of-Truth Documents

Implementation must follow these documents in this order:

``` text
architecture.md
       ↓
design-system.md
       ↓
implementation-plan.md
       ↓
testing.md
       ↓
demo.md
```

`architecture.md` defines the system boundary.

`design-system.md` defines the visual language.

`implementation-plan.md` defines the implementation sequence.

`testing.md` defines correctness requirements.

`demo.md` defines the final demonstration path.

The implementation plan does not replace the architecture. It converts
the frozen architecture into executable work.

------------------------------------------------------------------------

# 2. Implementation Schedule

There are four hackathon days.

Only the first three are implementation days.

``` text
DAY 1 — FOUNDATION + PROVIDERS + DATA
--------------------------------------
Next.js foundation
Google Maps / Places
Google Routes
Open-Meteo
Hotspot dataset validation
Normalized contracts
Basic end-to-end provider flow


DAY 2 — DETERMINISTIC ENGINE + BACKEND + MAP
---------------------------------------------
Geometry
Hotspot exposure
Rain analysis
Risk scoring
Recommendation
Evidence
/api/analyze-route
Map rendering
Route cards


DAY 3 — COMPLETE UI + AI EXPLANATION
------------------------------------
Final design system
States
Evidence UI
Recommendation UI
Strands
Ollama
Explain this decision
Deterministic fallback
Final integration


DAY 4 — RESERVED
-----------------
Testing
TestSprite
Bug fixes
Regression
Performance sanity checks
API failure checks
AI fallback
Demo preparation
Recording
README
Submission
```

## Day 4 is not a fourth feature-development day.

Do not plan new functionality for Day 4.

Day 4 exists so that the application can survive problems discovered
after the complete integration.

------------------------------------------------------------------------

# 3. Definition of Done

Before considering the implementation complete, the application must
support this exact flow:

``` text
Open MonsoonRoute
      ↓
Allow location OR enter origin
      ↓
Enter destination
      ↓
Select DRIVE or TWO_WHEELER
      ↓
Click "Find safer route"
      ↓
Browser sends coordinates + travel mode + departure time
      ↓
Next.js validates request
      ↓
Google Routes returns available candidates
      ↓
Routes normalized to internal Route type
      ↓
Route midpoint calculated for each candidate
      ↓
Open-Meteo queried for route midpoints
      ↓
Journey-window rainfall calculated
      ↓
All route-relevant hotspots evaluated
      ↓
Waterlogging risk calculated
      ↓
Environmental risk calculated
      ↓
Time penalty calculated
      ↓
Decision score calculated
      ↓
Recommendation selected
      ↓
Evidence generated
      ↓
JSON returned
      ↓
Map displays routes and relevant hotspots
      ↓
Recommendation is shown
      ↓
Risk breakdown is shown
      ↓
Evidence is shown
      ↓
User clicks "Explain this decision"
      ↓
/api/explain-route
      ↓
Zod validation
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
Explanation shown in UI
```

If Ollama is unavailable:

``` text
Explain this decision
      ↓
AI request fails
      ↓
deterministic explanation fallback
      ↓
application remains usable
```

------------------------------------------------------------------------

# 4. Frozen Technology Stack

Do not substitute technologies.

## Application

``` text
Next.js
React
TypeScript
Tailwind CSS
pnpm
```

## Validation

``` text
Zod
```

## Map

``` text
Google Maps JavaScript API
@vis.gl/react-google-maps
```

## Place input

``` text
Google Places / Places Autocomplete
through @vis.gl/react-google-maps
```

## Routing

``` text
Google Routes API
```

## Weather

``` text
Open-Meteo Forecast API
```

## Geometry

``` text
Turf.js
```

## Local data

``` text
GeoJSON
```

## AI

``` text
@strands-agents/sdk
VercelModel
ai-sdk-ollama
Ollama
```

## Testing

``` text
unit/integration tests
TestSprite
manual browser verification
```

No additional infrastructure is required.

------------------------------------------------------------------------

# 5. Dependencies

Install only the packages required by the frozen architecture.

Conceptually:

``` bash
pnpm add @vis.gl/react-google-maps
pnpm add @turf/turf
pnpm add zod
pnpm add @strands-agents/sdk
pnpm add ai-sdk-ollama
```

Use the current compatible versions available when implementation
begins.

Do not pin obsolete Strands packages from older tutorials.

The current Strands TypeScript documentation uses:

``` text
@strands-agents/sdk
```

and the current official Vercel integration documents:

``` text
@strands-agents/sdk
@strands-agents/sdk/models/vercel
ai-sdk-ollama
```

The current Strands TypeScript quickstart requires Node.js 22+. Strands'
current Vercel documentation also specifies that Next.js route handlers
using Strands should run on the Node.js runtime rather than Edge.

Official documentation:

-   Strands TypeScript Quickstart:
    https://strandsagents.com/docs/user-guide/sdk/quickstart/typescript/
-   Strands Vercel integration:
    https://strandsagents.com/docs/user-guide/sdk/model-providers/vercel/
-   Strands overview: https://strandsagents.com/docs/

------------------------------------------------------------------------

# 6. Required Environment Variables

Create:

``` text
.env.local
```

Required variables:

``` env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GOOGLE_ROUTES_API_KEY=
OLLAMA_MODEL=
```

Optional if the implementation needs it:

``` env
OLLAMA_BASE_URL=http://localhost:11434
```

Default Ollama base URL must be:

``` text
http://localhost:11434
```

Do not create a public environment variable for the server-side Routes
API key.

## Environment boundary

Browser:

``` text
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

Server only:

``` text
GOOGLE_ROUTES_API_KEY
OLLAMA_MODEL
OLLAMA_BASE_URL
```

Next.js exposes environment variables prefixed with `NEXT_PUBLIC_` to
the browser and keeps non-prefixed values server-side.

Official documentation:

https://nextjs.org/docs/app/guides/environment-variables

------------------------------------------------------------------------

# 7. Google Cloud Setup --- Do This Before Implementation

This setup is part of Day 1 preparation.

Use one Google Cloud project for MonsoonRoute.

Enable only the required services/APIs.

## Client-side map services

Enable:

``` text
Maps JavaScript API
Places API / Places API (New), according to the selected autocomplete integration
```

## Server-side route service

Enable:

``` text
Routes API
```

Do not enable unrelated Google services.

------------------------------------------------------------------------

# 8. Google API Key Strategy

Use separate credentials for client and server usage.

## Browser key

Used by:

``` text
@vis.gl/react-google-maps
```

Environment:

``` env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

Restrict it by:

``` text
Application restriction:
  Websites

API restrictions:
  Maps JavaScript API
  Places API / required Places surface
```

For local development, allow the exact localhost origins required by the
project.

## Server key

Used only by:

``` text
/api/analyze-route
```

Environment:

``` env
GOOGLE_ROUTES_API_KEY=
```

Restrict it to:

``` text
Routes API
```

Apply server-side application restrictions where practical.

Never send this key to the browser.

Google explicitly recommends restricting Maps Platform API keys and
keeping server-side web-service keys out of client code.

Official security guidance:

https://developers.google.com/maps/api-security-best-practices

------------------------------------------------------------------------

# 9. Cost Protection

The hackathon goal is zero unnecessary spend.

The coding agent must not create cloud infrastructure.

Before testing:

1.  enable only required Google APIs
2.  restrict both API keys
3.  configure quota limits where available
4.  avoid repeated automated route requests
5.  do not run stress tests against paid provider APIs
6.  use deterministic fixtures for most engine tests
7.  use real Google/Open-Meteo calls only for integration verification
8.  do not continuously poll providers
9.  do not create background jobs
10. do not create AWS infrastructure

Open-Meteo should be used within its applicable free/non-commercial
usage terms.

Open-Meteo documentation:

https://open-meteo.com/en/docs

------------------------------------------------------------------------

# 10. Final Project Structure

Implement the application using this conceptual structure:

``` text
src/
├── app/
│   ├── api/
│   │   ├── analyze-route/
│   │   │   └── route.ts
│   │   └── explain-route/
│   │       └── route.ts
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── route-form.tsx
│   ├── route-map.tsx
│   ├── route-card.tsx
│   ├── route-analysis.tsx
│   └── why-route.tsx
│
├── lib/
│   ├── config.ts
│   ├── validation.ts
│   │
│   ├── providers/
│   │   ├── google-routes.ts
│   │   ├── open-meteo.ts
│   │   └── strands.ts
│   │
│   ├── geo/
│   │   ├── route-geometry.ts
│   │   ├── hotspot-distance.ts
│   │   └── spatial-filter.ts
│   │
│   ├── analysis/
│   │   ├── rain-risk.ts
│   │   ├── waterlogging-risk.ts
│   │   ├── environmental-risk.ts
│   │   ├── time-penalty.ts
│   │   ├── decision-score.ts
│   │   └── recommendation.ts
│   │
│   ├── explanation/
│   │   └── deterministic-explanation.ts
│   │
│   └── utils/
│
├── types/
│   ├── route.ts
│   ├── weather.ts
│   └── hotspot.ts
│
└── data/
    └── mumbai-waterlogging-hotspots.geojson
```

If the exact Next.js project uses a slightly different `src` convention,
preserve the same conceptual boundaries.

Do not create additional architectural layers unless required by
compilation.

------------------------------------------------------------------------

# 11. Stage 1 --- Next.js Foundation

## Goal

Create the smallest working Next.js application that can host both:

``` text
frontend
backend
```

in one repository.

## Required result

The following must work:

``` bash
pnpm dev
```

and:

``` text
http://localhost:3000
```

must render the MonsoonRoute shell.

## Configure

-   TypeScript
-   Tailwind
-   dark theme
-   Inter font
-   base layout
-   page container
-   reusable design tokens

Do not build the complete UI yet.

Create only enough structure for the remaining stages.

------------------------------------------------------------------------

# 12. Stage 2 --- Design Tokens

Implement the values from `design-system.md`.

## Colors

``` text
primary          #3682F6
primary-hover    #2563EB
primary-light    #60A5FA
primary-subtle   #DBEAFE

success          #22C55E
warning          #F59E0B
danger           #EF4444

background       #080F14
surface          #111827
surface-alt      #1F2937
border           #374151
muted-text       #9CA3AF
secondary-text   #D1D5DB
primary-text     #F9FAFB
```

## Typography

``` text
Inter

H1      36 / Bold
H2      28 / Bold
H3      20 / Semibold
Body    16 / Regular
Caption 14 / Regular
Small   12 / Regular
```

## Spacing

``` text
4
8
12
16
24
```

## Radius

``` text
4
8
12
```

Do not invent another color palette.

------------------------------------------------------------------------

# 13. Stage 3 --- Google Maps JavaScript Integration

## Goal

Render a real Google map before route analysis exists.

Use:

``` text
@vis.gl/react-google-maps
```

The library provides:

``` text
APIProvider
Map
AdvancedMarker
Polyline
```

and hooks such as:

``` text
useMap
useMapsLibrary
```

Official documentation:

https://visgl.github.io/react-google-maps/docs

------------------------------------------------------------------------

## 13.1 Create the map provider

Create one top-level:

``` tsx
<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
```

Do not create multiple independent `APIProvider` instances for this
application.

The library documentation recommends a single provider in the component
tree.

------------------------------------------------------------------------

## 13.2 Map configuration

Use:

``` text
mapId = "DEMO_MAP_ID"
```

for the hackathon unless a dedicated Map ID has already been created.

Use dark map presentation consistent with the design system.

Use:

``` text
colorScheme = "DARK"
```

where supported by the installed library version.

Use an initial Mumbai-area center.

The exact initial camera is not a product decision because the map will
later fit to the user's selected route.

------------------------------------------------------------------------

## 13.3 Why AdvancedMarker

Use:

``` text
AdvancedMarker
```

rather than the deprecated legacy marker implementation.

Advanced markers require a Map ID. Google documents `DEMO_MAP_ID` as
suitable for testing.

Official documentation:

https://developers.google.com/maps/documentation/javascript/advanced-markers/start

and:

https://visgl.github.io/react-google-maps/docs/api-reference/components/advanced-marker

------------------------------------------------------------------------

## 13.4 Initial marker

Before analysis exists, the map can show the current location if
permission has been granted.

Do not display fake hotspots.

------------------------------------------------------------------------

# 14. Stage 4 --- Google Place Autocomplete

The user should not manually type latitude/longitude.

The UI collects:

``` text
From
To
```

as human-readable locations.

The browser-facing layer converts selected places into:

``` ts
{
  lat: number;
  lon: number;
}
```

The backend never receives free-form place names.

It receives coordinates.

------------------------------------------------------------------------

## 14.1 Implementation

Use the Places library through:

``` text
useMapsLibrary("places")
```

Create autocomplete controls for:

``` text
origin
destination
```

Use the selected place's geometry/location.

Request only the fields required for the application:

``` text
geometry
name
formatted_address
```

Do not request unnecessary Place fields.

The current Google React example documents this integration pattern.

Official example:

https://developers.google.com/maps/documentation/javascript/examples/rgm-autocomplete

------------------------------------------------------------------------

## 14.2 Selection behavior

When the user selects a place:

``` text
Autocomplete selection
        ↓
place geometry
        ↓
Coordinates { lat, lon }
        ↓
store in React state
```

Do not call `/api/analyze-route` immediately.

Only submit when the user clicks:

``` text
Find safer route
```

------------------------------------------------------------------------

# 15. Stage 5 --- Browser Geolocation

The:

``` text
Use my location
```

button uses the browser Geolocation API.

Flow:

``` text
navigator.geolocation
        ↓
coordinates
        ↓
React state
```

The coordinates are not persisted.

They may be used for:

1.  default origin
2.  nearby hotspot display

They must not be stored in a database.

------------------------------------------------------------------------

# 16. Stage 6 --- Shared Type Contracts

Create shared internal types before implementing providers.

The purpose is to prevent Google/Open-Meteo response formats from
leaking through the application.

------------------------------------------------------------------------

## 16.1 Coordinates

``` ts
export type Coordinates = {
  lat: number;
  lon: number;
};
```

Application coordinates use:

``` text
lat
lon
```

------------------------------------------------------------------------

## 16.2 GeoJSON

GeoJSON uses:

``` text
[longitude, latitude]
```

not:

``` text
[latitude, longitude]
```

Use:

``` ts
export type GeoJSONLineString = {
  type: "LineString";
  coordinates: [number, number][];
};
```

This distinction must be preserved everywhere.

------------------------------------------------------------------------

# 17. Stage 7 --- Route Contracts

Implement:

``` ts
export type TravelMode = "DRIVE" | "TWO_WHEELER";
```

Request:

``` ts
export type RouteRequest = {
  origin: Coordinates;
  destination: Coordinates;
  travelMode: TravelMode;
  departureTime: string;
};
```

Route:

``` ts
export type Route = {
  id: string;
  label: "default" | "alternative";
  durationSeconds: number;
  distanceMeters: number;
  geometry: GeoJSONLineString;
};
```

Do not expose Google's raw route object to the frontend.

------------------------------------------------------------------------

# 18. Stage 8 --- Zod Request Validation

Create Zod schemas before writing the route handler.

The `/api/analyze-route` request must validate:

``` text
origin.lat
origin.lon
destination.lat
destination.lon
travelMode
departureTime
```

Rules:

``` text
lat ∈ [-90, 90]
lon ∈ [-180, 180]

travelMode:
  DRIVE
  TWO_WHEELER

departureTime:
  valid ISO timestamp
```

Reject:

``` text
origin === destination
```

before calling Google.

Example error:

``` json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Origin and destination must be different."
  }
}
```

The backend must validate independently even though the frontend already
validates.

Never trust browser validation.

------------------------------------------------------------------------

# 19. Stage 9 --- Google Routes API Provider

Create:

``` text
src/lib/providers/google-routes.ts
```

The provider is server-side only.

It must use:

``` env
GOOGLE_ROUTES_API_KEY
```

------------------------------------------------------------------------

# 20. Google Routes Request --- Exact Contract

Call:

``` text
POST
https://routes.googleapis.com/directions/v2:computeRoutes
```

Headers:

``` text
Content-Type: application/json
X-Goog-Api-Key: server key
X-Goog-FieldMask:
  routes.routeLabels,
  routes.duration,
  routes.distanceMeters,
  routes.polyline
```

Request body:

``` json
{
  "origin": {
    "location": {
      "latLng": {
        "latitude": 0,
        "longitude": 0
      }
    }
  },
  "destination": {
    "location": {
      "latLng": {
        "latitude": 0,
        "longitude": 0
      }
    }
  },
  "travelMode": "DRIVE",
  "computeAlternativeRoutes": true,
  "polylineQuality": "HIGH_QUALITY",
  "polylineEncoding": "GEO_JSON_LINESTRING"
}
```

Do not add waypoints.

Do not add unrelated route fields.

Do not use `*` as the field mask.

Google requires a response field mask and documents the performance
benefits of requesting only the required fields.

Official documentation:

https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes

https://developers.google.com/maps/documentation/routes/choose_fields

------------------------------------------------------------------------

# 21. Google Alternative Routes

The request must set:

``` json
"computeAlternativeRoutes": true
```

Google may return:

``` text
default route
+
zero or more alternatives
```

Do not assume exactly three alternatives.

Do not assume a fixed route count.

Do not assume an alternative route always exists.

Google documents that the Routes API can return up to three alternatives
in addition to the default route, but sometimes only the default route
is available.

Official documentation:

https://developers.google.com/maps/documentation/routes/alternative-routes

------------------------------------------------------------------------

# 22. Google Polyline Normalization

Because:

``` text
polylineEncoding = GEO_JSON_LINESTRING
```

the backend should receive GeoJSON geometry directly.

Normalize immediately into:

``` ts
{
  type: "LineString",
  coordinates: [...]
}
```

Do not write an encoded-polyline decoder.

Do not preserve Google's raw response as the application contract.

Google documents `GEO_JSON_LINESTRING` as a supported polyline encoding.

------------------------------------------------------------------------

# 23. Route ID Generation

Generate stable internal route IDs from response order.

Example:

``` text
route-0
route-1
route-2
```

The first returned route is:

``` text
default
```

and other routes are:

``` text
alternative
```

Do not use Google's route label string as the sole application ID.

------------------------------------------------------------------------

# 24. Stage 10 --- Route Midpoint

Each normalized route needs one representative weather coordinate.

Use the geometric midpoint of the route:

``` text
route geometry
      ↓
route length
      ↓
half route length
      ↓
point at half distance
```

With Turf:

``` text
lineString
lineDistance
along
```

Use the midpoint of the actual route geometry, not the midpoint between
origin and destination.

This is important because two alternative routes can travel through
different parts of Mumbai.

Turf's `along` helper returns a point at a specified distance along a
LineString.

Official documentation:

https://turfjs.org/docs/api/along

------------------------------------------------------------------------

# 25. Stage 11 --- Open-Meteo Provider

Create:

``` text
src/lib/providers/open-meteo.ts
```

No API key is required for the applicable free/non-commercial Forecast
API usage.

Use:

``` text
/v1/forecast
```

Required hourly variables:

``` text
precipitation
precipitation_probability
weather_code
```

Use:

``` text
timezone=Asia/Kolkata
```

Open-Meteo supports multiple latitude/longitude coordinates in one
request.

Therefore:

``` text
Route A midpoint
Route B midpoint
Route C midpoint
        ↓
one Open-Meteo request
```

where practical.

Official documentation:

https://open-meteo.com/en/docs

------------------------------------------------------------------------

# 26. Open-Meteo Request Shape

Conceptually:

``` text
GET /v1/forecast

latitude=<latA,latB,latC>
longitude=<lonA,lonB,lonC>

hourly=precipitation,precipitation_probability,weather_code

timezone=Asia/Kolkata
```

Request only the weather variables required by the model.

Do not request:

``` text
temperature
wind
humidity
pressure
UV
etc.
```

unless a future requirement explicitly adds them.

------------------------------------------------------------------------

# 27. Open-Meteo Multiple-Coordinate Response

When multiple coordinates are requested, Open-Meteo returns multiple
location structures.

The provider must normalize them into:

``` ts
WeatherSnapshot[]
```

Each snapshot is associated with the route ID that produced the
midpoint.

Do not depend on array order after normalization.

Explicitly map:

``` text
routeId → weather snapshot
```

------------------------------------------------------------------------

# 28. Open-Meteo Time Interval Rule

This is mandatory.

Open-Meteo hourly:

``` text
11:00 precipitation
```

represents precipitation during:

``` text
10:00–11:00
```

not an instantaneous 11:00 value.

Therefore the implementation must treat each hourly value as an
interval.

For every forecast point:

``` text
intervalStart = timestamp - 1 hour
intervalEnd   = timestamp
```

Journey:

``` text
journeyStart = departureTime
journeyEnd   = departureTime + route.durationSeconds
```

An hourly interval contributes only when it overlaps:

``` text
[journeyStart, journeyEnd]
```

------------------------------------------------------------------------

# 29. Partial Hour Weighting

If an hourly interval only partially overlaps the journey:

``` text
10:00–11:00
```

and the journey uses:

``` text
10:20–10:58
```

calculate the overlap fraction.

``` text
overlapDuration / 1 hour
```

Weighted precipitation:

``` text
precipitation × overlapFraction
```

Example:

``` text
hourly precipitation = 6 mm
overlap = 30 minutes

weighted contribution =
6 × 0.5
=
3 mm
```

This rule is frozen.

Do not simply sum every hour whose timestamp falls after departure.

------------------------------------------------------------------------

# 30. Probability Handling

Use the precipitation probability values associated with the overlapping
forecast intervals.

For the locked MVP model:

``` text
probabilityScore =
averagePrecipitationProbability
```

The implementation should average the probability values for the
journey-window forecast points used in the calculation.

Do not convert probability into flood probability.

Do not multiply waterlogging risk by precipitation probability.

Rain and waterlogging remain separate deterministic inputs.

------------------------------------------------------------------------

# 31. Weather Failure Behavior

If Open-Meteo fails:

``` text
502 WEATHER_PROVIDER_ERROR
```

Do not silently convert provider failure into:

``` text
rainRisk = 0
```

Do not recommend a route using fabricated weather.

Return an honest error response.

------------------------------------------------------------------------

# 32. Stage 12 --- Hotspot Dataset

Create:

``` text
src/data/mumbai-waterlogging-hotspots.geojson
```

The dataset must be source-backed.

The coding agent must **not invent hotspot records**.

The dataset covers:

``` text
Mumbai City
Mumbai Suburban
Navi Mumbai
Panvel / connected urban belt
```

It is not restricted to a fixed number.

Do not target exactly 699 records.

The final count is whatever the verified source-backed dataset supports.

------------------------------------------------------------------------

# 33. Hotspot Canonical Record

Every canonical hotspot should represent:

``` text
stable ID
name
geometry
representative location
authority/source
historical/current status
evidence
documented events
source references
provenance
```

Geometry can be:

``` text
Point
Polygon
MultiPolygon
```

when source evidence supports it.

Do not reduce a source polygon to a point merely for convenience.

The representative location is separate from the actual geometry.

------------------------------------------------------------------------

# 34. Source Provenance

The dataset must distinguish source quality.

Supported provenance concepts:

``` text
EXACT
DERIVED
APPROXIMATE
```

Examples:

``` text
BMC GIS geometry
        ↓
EXACT

Official source + authoritative map/address
        ↓
DERIVED

Historical map reconstructed location
        ↓
APPROXIMATE
```

Do not make approximate geometry appear equivalent to exact GIS
geometry.

------------------------------------------------------------------------

# 35. Historical and Current Evidence

Do not delete historical evidence merely because a newer list does not
contain the same location.

A hotspot may contain:

``` text
historical evidence
current evidence
recent confirmation
mitigation/remedial status
```

This allows the application to explain:

``` text
historically documented
```

without claiming:

``` text
currently flooded
```

unless a current source actually supports that claim.

------------------------------------------------------------------------

# 36. Hotspot Data Validation

Before the risk engine uses the dataset, validate:

``` text
unique stable IDs
valid GeoJSON
valid coordinates
valid geometry types
valid severity
non-negative event counts
valid source references
```

Do not accept:

``` text
NaN coordinates
invalid longitude
invalid latitude
missing IDs
invented severity
negative event counts
```

A malformed dataset should fail during development/validation rather
than silently corrupt route analysis.

------------------------------------------------------------------------

# 37. Hotspot Severity

The frozen supported severity values are:

``` ts
type WaterloggingSeverity =
  | "medium"
  | "high";
```

Weights:

``` ts
const SEVERITY_WEIGHT = {
  medium: 0.7,
  high: 1.0,
} as const;
```

Do not create:

``` text
low
extreme
critical
```

severity levels unless the architecture is intentionally changed later.

------------------------------------------------------------------------

# 38. Stage 13 --- Spatial Candidate Filtering

Do not compare every complex geometry blindly if a spatial prefilter can
reduce the work.

The process is:

``` text
all hotspots
      ↓
route bounding/spatial candidate filter
      ↓
candidate hotspots
      ↓
exact geometry distance/intersection
      ↓
route-relevant hotspots
```

The candidate filter is an optimization.

It must never change correctness.

If the spatial filter would exclude a hotspot that could be within 75m
of the route, the filter is wrong.

------------------------------------------------------------------------

# 39. Two Different Hotspot Queries

This distinction is mandatory.

## UI query

When the user grants location:

``` text
all hotspots
      ↓
spatial filtering
      ↓
distance from user
      ↓
sort
      ↓
8–10 nearest
```

These are displayed as:

``` text
Nearby waterlogging zones
```

## Decision query

When the user searches a route:

``` text
candidate routes
      ↓
route geometry
      ↓
all relevant hotspots
      ↓
exact distance/intersection
      ↓
risk
```

The decision engine must use:

> **ALL hotspots relevant to the candidate route.**

It must not use only the nearest 8--10 UI markers.

This prevents a correctness bug where a route passes a relevant hotspot
that is not among the user's nearest locations.

------------------------------------------------------------------------

# 40. Stage 14 --- Point Hotspot Distance

For point hotspots:

``` text
point
  ↓
distance to complete route LineString
```

Use Turf's:

``` text
pointToLineDistance
```

with:

``` text
units = "meters"
```

Do not calculate distance from only the route midpoint.

Do not calculate distance from individual route segments and count the
same hotspot repeatedly.

Each hotspot produces one route-level minimum distance.

Official documentation:

https://turfjs.org/docs/api/pointToLineDistance

------------------------------------------------------------------------

# 41. Stage 15 --- Polygon Hotspot Handling

For polygons:

1.  preserve the polygon geometry

2.  test route/polygon intersection

3.  if route intersects polygon:

    ``` text
    distance = 0
    ```

4.  otherwise calculate minimum route-to-polygon-boundary distance

5.  compare that distance with:

    ``` text
    75 meters
    ```

Use Turf helpers for:

``` text
booleanIntersects
lineIntersect
lineSegment
pointToLineDistance
pointToPolygonDistance
```

where appropriate.

Official Turf documentation:

https://turfjs.org/docs/api/booleanIntersects

https://turfjs.org/docs/api/lineIntersect

https://turfjs.org/docs/api/lineSegment

https://turfjs.org/docs/api/pointToPolygonDistance

### Important implementation rule

Do not replace a polygon with its centroid and pretend the centroid is
the polygon.

If a polygon implementation needs a helper for route-to-boundary
distance, create that helper in:

``` text
src/lib/geo/hotspot-distance.ts
```

and test it separately.

------------------------------------------------------------------------

# 42. Stage 16 --- One Hotspot, One Exposure

A route can pass the same hotspot several times or contain several route
segments close to it.

That hotspot must contribute:

``` text
once per route
```

using:

``` text
minimum distance from hotspot geometry to the complete route
```

Do not sum:

``` text
segment 1 contribution
+
segment 2 contribution
+
segment 3 contribution
```

for the same hotspot.

------------------------------------------------------------------------

# 43. Stage 17 --- Waterlogging Risk Formula

Constants:

``` ts
const HOTSPOT_CORRIDOR_METERS = 75;
const RECURRENCE_REFERENCE_EVENTS = 4;
```

Proximity:

``` text
proximityFactor =
max(
  0,
  1 - distanceMeters / 75
)
```

Recurrence:

``` text
recurrenceFactor =
min(
  1,
  log1p(documentedEventCount) /
  log1p(4)
)
```

Raw contribution:

``` text
rawContribution =
severityWeight
×
recurrenceFactor
×
proximityFactor
```

Sum contributions across unique exposed hotspots:

``` text
totalContribution =
sum(rawContribution)
```

Final waterlogging score:

``` text
waterloggingRisk =
100 × (1 - exp(-totalContribution))
```

This gives a bounded score:

``` text
0–100
```

------------------------------------------------------------------------

# 44. No Hotspots Case

If no hotspot is within:

``` text
75m
```

then:

``` text
waterloggingRisk = 0
```

Evidence must say:

> No known waterlogging hotspots from the MonsoonRoute dataset were
> found within 75 m of this route.

Never say:

> This route will not flood.

Never say:

> This route is safe.

------------------------------------------------------------------------

# 45. Stage 18 --- Rain Analysis

For every candidate route:

``` text
route midpoint
      ↓
Open-Meteo
      ↓
journey window
      ↓
overlapping hourly intervals
      ↓
weighted precipitation
      ↓
rain metrics
```

Compute:

``` text
totalPrecipitationMm
peakHourlyPrecipitationMm
averagePrecipitationProbability
peakPrecipitationProbability
```

------------------------------------------------------------------------

# 46. Rain Risk Formula

Amount:

``` text
amountScore =
clamp(totalPrecipitationMm / 15, 0, 1) × 100
```

Peak:

``` text
peakScore =
clamp(peakHourlyPrecipitationMm / 6, 0, 1) × 100
```

Probability:

``` text
probabilityScore =
averagePrecipitationProbability
```

Final:

``` text
Rain Risk =
0.50 × amountScore
+
0.30 × peakScore
+
0.20 × probabilityScore
```

Clamp:

``` text
0–100
```

This is:

> a rain exposure/risk heuristic

It is **not**:

> flood probability.

------------------------------------------------------------------------

# 47. Stage 19 --- Environmental Risk

Frozen formula:

``` text
Environmental Risk =
0.70 × Waterlogging Risk
+
0.30 × Rain Risk
```

Why waterlogging has the larger weight:

``` text
waterlogging evidence
+
route geometry
```

is the route-specific differentiator of MonsoonRoute.

Rain is an environmental input shared by the broader area.

------------------------------------------------------------------------

# 48. Stage 20 --- Time Penalty

Find:

``` text
fastestTime =
minimum(route.durationSeconds)
```

For every route:

``` text
delayRatio =
(routeTime - fastestTime) / fastestTime
```

Then:

``` text
timePenalty =
min(100, delayRatio × 100)
```

Fastest route:

``` text
timePenalty = 0
```

Do not create a nonlinear travel-time model.

------------------------------------------------------------------------

# 49. Stage 21 --- Decision Score

Frozen formula:

``` text
Decision Score =
0.75 × Environmental Risk
+
0.25 × Time Penalty
```

Lower is better.

This means environmental conditions dominate the decision, but travel
time still matters.

Do not reverse the score.

Do not maximize it.

------------------------------------------------------------------------

# 50. Stage 22 --- Critical Risk Gate

Constant:

``` ts
const CRITICAL_ENVIRONMENTAL_RISK = 90;
```

A route with:

``` text
environmentalRisk >= 90
```

is:

``` text
CRITICAL
```

If at least one non-critical candidate exists:

``` text
do not normally recommend a critical route
```

If every route is critical:

``` text
choose the lowest-risk available route
```

Do not say:

``` text
no safe route
```

because the system does not prove absolute safety.

Use:

``` text
lowest_risk_available
```

instead.

------------------------------------------------------------------------

# 51. Stage 23 --- Route Ranking

Normal ranking:

``` text
decisionScore
environmentalRisk
travelTime
stable route order
```

Ascending.

Exact tie-break order:

``` text
1. lower decision score
2. lower environmental risk
3. lower travel time
4. stable route order
```

No additional optimizer.

------------------------------------------------------------------------

# 52. Stage 24 --- Recommendation Contract

Use:

``` ts
type RecommendationStatus =
  | "safer_option_found"
  | "lowest_risk_available";
```

Recommendation:

``` ts
type Recommendation = {
  recommendedRouteId: string;
  status: RecommendationStatus;
  reason: RecommendationReason;
};
```

Reason:

``` ts
type RecommendationReason = {
  timeDifferenceMinutes: number;
  environmentalRiskDifference: number;
  waterloggingRiskDifference: number;
  avoidedHighRiskHotspots: number;
  decisionScoreDifference: number;
};
```

------------------------------------------------------------------------

# 53. Stage 25 --- Evidence Generation

Evidence must be generated by the deterministic engine.

Example:

``` text
Recommended Route B
+4 min vs fastest
2 high-risk hotspots avoided
lower waterlogging risk
heavy rain expected
lower environmental risk
```

Evidence types:

``` text
waterlogging
rain
travel-time
```

Evidence is created before AI.

This allows the user to understand the recommendation even when AI is
disabled.

------------------------------------------------------------------------

# 54. Stage 26 --- Final Internal RouteAnalysis

The main internal object is:

``` ts
type RouteAnalysis = {
  route: Route;
  waterlogging: WaterloggingAnalysis;
  rain: RainAnalysis;
  environmentalRiskScore: number;
  timePenalty: number;
  decisionScore: number;
  evidence: AnalysisEvidence[];
};
```

The frontend receives this normalized structure.

It must never receive raw Google/Open-Meteo structures.

------------------------------------------------------------------------

# 55. Stage 27 --- `/api/analyze-route`

Create:

``` text
src/app/api/analyze-route/route.ts
```

Use:

``` ts
export const runtime = "nodejs";
```

Next.js Route Handlers support Node.js runtime configuration, and
Strands also requires Node.js 22+ for its current TypeScript
integration.

Official Next.js Route Handler documentation:

https://nextjs.org/docs/app/getting-started/route-handlers

------------------------------------------------------------------------

# 56. Analyze Endpoint --- Exact Pipeline

``` text
POST /api/analyze-route
        ↓
parse JSON
        ↓
Zod validation
        ↓
origin != destination
        ↓
Google Routes
        ↓
normalize route candidates
        ↓
calculate route midpoint(s)
        ↓
Open-Meteo
        ↓
for each route:
    rain analysis
    hotspot candidate filtering
    exact hotspot distance/intersection
    waterlogging analysis
    environmental risk
    time penalty
    decision score
        ↓
critical gate
        ↓
recommendation
        ↓
evidence
        ↓
JSON response
```

Do not call Strands here.

Do not call Ollama here.

------------------------------------------------------------------------

# 57. Analyze Endpoint Error Contract

Use exactly:

``` text
400 INVALID_REQUEST
422 NO_ROUTE
502 ROUTING_PROVIDER_ERROR
502 WEATHER_PROVIDER_ERROR
500 ANALYSIS_ERROR
```

Example:

``` json
{
  "error": {
    "code": "NO_ROUTE",
    "message": "No route could be found between the selected locations."
  }
}
```

Never return raw provider error bodies to the browser if they contain
unnecessary internal details.

Log useful development information server-side.

------------------------------------------------------------------------

# 58. No Route Handling

If Google returns:

``` text
routes = []
```

return:

``` text
422
NO_ROUTE
```

Do not create a fake route.

Do not fall back to a straight line.

Do not calculate risk without an actual candidate route.

------------------------------------------------------------------------

# 59. Stage 28 --- Frontend Route Form

Create:

``` text
components/route-form.tsx
```

Responsibilities:

``` text
collect origin
collect destination
collect travel mode
collect/use departure time
resolve selected places
submit request
display validation
display loading
```

It must not calculate:

``` text
rain risk
waterlogging risk
environmental risk
decision score
recommendation
```

------------------------------------------------------------------------

# 60. Route Form Fields

Required:

``` text
From
To
Travel mode
```

Travel modes:

``` text
Driving
Two-wheeler
```

Primary button:

``` text
Find safer route →
```

Loading label:

``` text
Analyzing routes...
```

Do not show internal provider stages such as:

``` text
Fetching Google Routes...
Fetching Open-Meteo...
Calculating hotspot exposure...
```

Those are implementation details.

------------------------------------------------------------------------

# 61. Stage 29 --- Route Map

Create:

``` text
components/route-map.tsx
```

Props are derived from already-computed data.

Conceptually:

``` ts
type RouteMapProps = {
  origin: Coordinates;
  destination: Coordinates;
  routes: RouteAnalysis[];
  recommendedRouteId: string;
  hotspots: WaterloggingHotspot[];
};
```

The map renders:

``` text
origin
destination
recommended route
alternative routes
route-relevant hotspots
```

It does not calculate anything.

------------------------------------------------------------------------

# 62. Route Polyline Rendering

Convert GeoJSON:

``` text
[lon, lat]
```

to Google Maps:

``` text
{ lat, lng }
```

for display only.

Example transformation:

``` ts
geometry.coordinates.map(([lon, lat]) => ({
  lat,
  lng: lon,
}))
```

Do not mutate the stored GeoJSON geometry.

------------------------------------------------------------------------

# 63. Route Styling

Recommended route:

``` text
solid blue
strong visual weight
```

Alternative:

``` text
dashed gray
lower visual weight
```

Other routes:

``` text
distinct but subdued
```

The map must make the recommended route immediately identifiable.

Use the design-system colors.

------------------------------------------------------------------------

# 64. Hotspot Markers

Display only:

``` text
route-relevant hotspots
```

after route analysis.

Do not display every hotspot in the dataset.

A marker may show:

``` text
name
severity
```

in an InfoWindow or compact popup.

Do not dump source articles onto the map.

Evidence belongs in the analysis panel.

------------------------------------------------------------------------

# 65. Stage 30 --- Map Camera

After analysis:

``` text
origin
+
destination
+
all displayed route geometries
```

should determine the map bounds.

Fit the map so the complete route comparison is visible.

Do not zoom to the nearest hotspot instead of the route.

------------------------------------------------------------------------

# 66. Stage 31 --- Route Cards

Create:

``` text
components/route-card.tsx
```

Each candidate gets one compact card.

Show:

``` text
route label
duration
environmental risk
waterlogging risk
rain risk
risk status
recommended badge if applicable
time difference from fastest
```

Example:

``` text
Route B
28 min

Environmental risk
31 / 100

Waterlogging
24 / 100

Rain
48 / 100

+4 min vs fastest

RECOMMENDED
```

------------------------------------------------------------------------

# 67. Stage 32 --- Recommendation Section

The recommended route receives a larger visual section.

Show:

``` text
Recommended route
Route B
28 min

+4 min vs fastest

Lower environmental risk
2 high-risk hotspots avoided
```

Then:

``` text
[ Explain this decision ✦ ]
```

The AI button must not be visually stronger than:

``` text
Find safer route
```

------------------------------------------------------------------------

# 68. Stage 33 --- Route Analysis Component

Create:

``` text
components/route-analysis.tsx
```

It renders deterministic information:

``` text
Environmental Risk
Waterlogging Risk
Rain Risk
Time Penalty
Evidence
```

It does not recalculate the numbers.

------------------------------------------------------------------------

# 69. Stage 34 --- Risk Breakdown

Use simple progress indicators.

Example:

``` text
Environmental Risk
42 / 100

Waterlogging Risk
55 / 100

Rain Risk
35 / 100

Time Penalty
10 / 100
```

Always show numeric values.

Never communicate risk using color alone.

------------------------------------------------------------------------

# 70. Stage 35 --- UI States

Implement all required states:

``` text
idle
loading
success
request error
AI loading
AI success
AI fallback
AI error
```

Also:

``` text
empty
invalid input
no route
map error
provider error
```

The application must never remain visually ambiguous.

------------------------------------------------------------------------

# 71. Stage 36 --- Deterministic Explanation

Create:

``` text
src/lib/explanation/deterministic-explanation.ts
```

This generates a short explanation directly from deterministic results.

Example:

> Route B is recommended even though it is 4 minutes slower than the
> fastest route. It has substantially lower waterlogging exposure and a
> lower environmental-risk score.

This is not AI.

It is the guaranteed fallback.

------------------------------------------------------------------------

# 72. Stage 37 --- AI Boundary

Only after the complete deterministic system works should AI be
implemented.

The flow is:

``` text
deterministic recommendation
        ↓
user clicks "Explain this decision"
        ↓
POST /api/explain-route
        ↓
Strands
```

AI does not participate in:

``` text
route generation
weather fetching
hotspot analysis
risk scoring
route ranking
recommendation
```

------------------------------------------------------------------------

# 73. Stage 38 --- ExplanationContext

Do not send the entire analysis.

Do not send:

``` text
raw Google response
raw Open-Meteo response
entire hotspot dataset
```

Send only:

``` text
recommendation
recommended route summary
fastest route summary
relevant evidence
```

Conceptually:

``` ts
type ExplanationContext = {
  recommendation: Recommendation;

  recommendedRoute: {
    durationMinutes: number;
    environmentalRiskScore: number;
    waterloggingRiskScore: number;
    rainRiskScore: number;
    evidence: AnalysisEvidence[];
  };

  fastestRoute: {
    durationMinutes: number;
    environmentalRiskScore: number;
    waterloggingRiskScore: number;
    rainRiskScore: number;
  };
};
```

------------------------------------------------------------------------

# 74. Stage 39 --- `/api/explain-route`

Create:

``` text
src/app/api/explain-route/route.ts
```

Use:

``` ts
export const runtime = "nodejs";
```

Pipeline:

``` text
POST /api/explain-route
        ↓
parse JSON
        ↓
Zod validation
        ↓
ExplanationContext
        ↓
Strands Agent
        ↓
Ollama
        ↓
RouteExplanation
        ↓
JSON
```

This endpoint must not call:

``` text
Google Routes
Open-Meteo
hotspot dataset
decision engine
```

------------------------------------------------------------------------

# 75. Stage 40 --- Strands TypeScript Integration

Use the current TypeScript integration:

``` ts
import { Agent } from "@strands-agents/sdk";
import { VercelModel } from "@strands-agents/sdk/models/vercel";
import { ollama } from "ai-sdk-ollama";
```

Conceptual model:

``` text
Agent
  ↓
VercelModel
  ↓
ai-sdk-ollama
  ↓
Ollama
```

Do not use an old archived Strands TypeScript package.

The current official documentation explicitly documents the
VercelModel + `ai-sdk-ollama` path for Ollama in TypeScript.

Official documentation:

https://strandsagents.com/docs/user-guide/sdk/model-providers/vercel/

------------------------------------------------------------------------

# 76. Stage 41 --- Ollama

Ollama must be running locally for the full AI path.

Conceptually:

``` text
Next.js server
      ↓
Strands
      ↓
VercelModel
      ↓
ai-sdk-ollama
      ↓
http://localhost:11434
      ↓
Ollama model
```

The deployed Next.js server must not be assumed to reach the developer
laptop's localhost.

Therefore the hackathon's AI demo should use:

``` text
local Next.js
+
local Ollama
```

This is intentionally a local demonstration path.

------------------------------------------------------------------------

# 77. Stage 42 --- Strands Agent Configuration

Use:

``` text
one agent
one model
one system prompt
no tools
structured output
```

The agent has no access to:

``` text
Google
Open-Meteo
hotspots
maps
web
route calculation
```

It receives only the explanation context.

------------------------------------------------------------------------

# 78. Stage 43 --- AI System Prompt

The system prompt must enforce:

``` text
You explain an already-computed MonsoonRoute recommendation.

Use only the supplied analysis context.

Do not recalculate route risk.

Do not choose another route.

Do not modify scores.

Do not invent weather.

Do not invent hotspots.

Do not invent evidence.

Do not claim a route is guaranteed safe.

Explain:
- why the recommended route was selected
- how it compares with the fastest route
- rainfall conditions
- waterlogging evidence
- travel-time trade-off

If the evidence is insufficient, say so.
```

The prompt is a safety boundary, not a route-planning prompt.

------------------------------------------------------------------------

# 79. Stage 44 --- Structured AI Output

The AI output must be:

``` ts
type RouteExplanation = {
  explanation: string;
};
```

Expected JSON:

``` json
{
  "explanation": "Route B is recommended because..."
}
```

Do not accept arbitrary multi-field agent output.

Do not let the model return:

``` text
recommendedRouteId
riskScore
newRoute
weatherData
```

The AI output is explanation text only.

------------------------------------------------------------------------

# 80. Stage 45 --- AI UI

Create:

``` text
components/why-route.tsx
```

Initial state:

``` text
[ Explain this decision ✦ ]
```

Loading:

``` text
Explaining this decision...
```

Success:

``` text
Why this route

<explanation>
```

Fallback:

``` text
Why this route

<deterministic explanation>

AI explanation is currently unavailable.
```

Do not build a general chatbot.

Do not add:

``` text
chat history
new question
agent tools
multi-agent UI
```

------------------------------------------------------------------------

# 81. Stage 46 --- AI Failure Test

Intentionally stop Ollama.

Then:

``` text
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
AI unavailable
        ↓
deterministic fallback
```

This is a mandatory acceptance test.

------------------------------------------------------------------------

# 82. Stage 47 --- Final Frontend Composition

The page must remain one focused experience.

Recommended order:

``` text
MonsoonRoute header
        ↓
Route form
        ↓
Map
        ↓
Recommended route
        ↓
Alternative routes
        ↓
Risk analysis
        ↓
Evidence
        ↓
Explain this decision
```

Do not create:

``` text
/dashboard
/routes
/history
/settings
/admin
```

for the MVP.

------------------------------------------------------------------------

# 83. Stage 48 --- Responsive Behavior

Desktop:

``` text
form + map + analysis
```

Smaller screens:

``` text
form
↓
map
↓
recommendation
↓
routes
↓
risk
↓
evidence
↓
AI explanation
```

Do not preserve desktop columns at the cost of readability.

Follow `design-system.md`.

------------------------------------------------------------------------

# 84. Stage 49 --- Complete Analyze Integration

At this point the application should support:

``` text
place selection
+
browser geolocation
+
travel mode
+
Google Routes
+
Open-Meteo
+
hotspot dataset
+
risk engine
+
recommendation
+
map
+
route cards
+
evidence
```

Before implementing AI, stop and verify this entire deterministic path.

------------------------------------------------------------------------

# 85. Deterministic Freeze Point

At the end of Day 2:

> **The route decision system is frozen.**

From this point onward:

-   do not change formulas
-   do not change route ranking
-   do not change hotspot semantics
-   do not change provider contracts
-   do not change recommendation logic

Day 3 is integration and presentation.

------------------------------------------------------------------------

# 86. Day 1 Detailed Execution Order

## Day 1 --- Foundation + Providers + Data

### Task 1

Initialize/verify Next.js project.

### Task 2

Install dependencies.

### Task 3

Create environment variables.

### Task 4

Configure Google Cloud APIs and keys.

### Task 5

Implement `APIProvider`.

### Task 6

Implement base map.

### Task 7

Implement Places autocomplete.

### Task 8

Implement browser geolocation.

### Task 9

Create shared route/weather/hotspot types.

### Task 10

Create Zod validation schemas.

### Task 11

Create and validate the canonical GeoJSON dataset.

### Task 12

Implement Google Routes provider.

### Task 13

Normalize route responses.

### Task 14

Implement route midpoint.

### Task 15

Implement Open-Meteo provider.

### Task 16

Implement journey-window interval handling.

### Day 1 acceptance test

A controlled test request should produce:

``` text
origin
destination
candidate routes
route geometries
route durations
route midpoints
weather snapshots
```

No recommendation is required yet.

------------------------------------------------------------------------

# 87. Day 2 Detailed Execution Order

## Day 2 --- Deterministic Engine + Backend + Map

### Task 1

Implement spatial candidate filtering.

### Task 2

Implement point hotspot distance.

### Task 3

Implement polygon intersection/distance.

### Task 4

Implement one-hotspot-one-exposure deduplication.

### Task 5

Implement recurrence factor.

### Task 6

Implement waterlogging risk.

### Task 7

Implement rain risk.

### Task 8

Implement environmental risk.

### Task 9

Implement time penalty.

### Task 10

Implement decision score.

### Task 11

Implement critical gate.

### Task 12

Implement ranking and tie-breaks.

### Task 13

Implement recommendation reason.

### Task 14

Implement deterministic evidence.

### Task 15

Implement `/api/analyze-route`.

### Task 16

Implement map route rendering.

### Task 17

Implement route cards.

### Task 18

Implement risk analysis panel.

### Day 2 acceptance test

A browser request must complete:

``` text
user input
→ API
→ Google
→ weather
→ hotspots
→ engine
→ recommendation
→ UI
```

without AI.

------------------------------------------------------------------------

# 88. Day 3 Detailed Execution Order

## Day 3 --- UI Completion + AI

### Task 1

Finish design-system implementation.

### Task 2

Finish loading/empty/error states.

### Task 3

Finish recommendation section.

### Task 4

Finish evidence presentation.

### Task 5

Finish map marker styling.

### Task 6

Finish responsive layout.

### Task 7

Implement deterministic explanation.

### Task 8

Implement `/api/explain-route`.

### Task 9

Install/configure Strands.

### Task 10

Connect `VercelModel`.

### Task 11

Connect `ai-sdk-ollama`.

### Task 12

Implement one tool-less agent.

### Task 13

Implement structured explanation output.

### Task 14

Implement AI fallback.

### Task 15

Run the complete user journey.

### Task 16

Stop feature development.

------------------------------------------------------------------------

# 89. Day 4 --- Reserved Testing and Bug Fixes

Day 4 must not become:

``` text
"Let's add one more feature."
```

It is:

``` text
test
→ diagnose
→ fix
→ retest
```

Only bugs and release blockers should be addressed.

Priority:

``` text
P0
route analysis broken

P0
recommendation incorrect

P0
map broken

P0
provider failure crashes app

P0
AI breaks deterministic analysis

P1
UI state broken

P1
responsive issue

P1
visual inconsistency

P2
minor polish
```

If a feature is not necessary for the core demo, do not add it.

------------------------------------------------------------------------

# 90. TestSprite Integration

TestSprite is for application-level validation.

It should validate:

``` text
UI
API
E2E workflow
error paths
regression
```

It must not replace deterministic mathematical tests.

Use:

``` text
deterministic unit tests
        +
TestSprite E2E/API/UI tests
        +
manual demo verification
```

TestSprite currently supports autonomous UI/API/E2E testing and MCP
integration with coding agents.

Official documentation:

https://www.testsprite.com/use-cases/en/ai-e2e-testing-tool

------------------------------------------------------------------------

# 91. TestSprite Main User Journey

The primary automated journey should be:

``` text
Open MonsoonRoute
      ↓
Allow location OR enter origin
      ↓
Enter destination
      ↓
Select travel mode
      ↓
Click Find safer route
      ↓
Routes appear
      ↓
Recommended route appears
      ↓
Risk/evidence appears
      ↓
Click Explain this decision
      ↓
Explanation appears
```

------------------------------------------------------------------------

# 92. TestSprite Negative Journeys

Validate:

``` text
origin = destination
invalid coordinates
invalid request
no route
Google Routes failure
Open-Meteo failure
map failure
Ollama unavailable
AI response invalid
```

Expected behavior must match the error contract.

------------------------------------------------------------------------

# 93. Deterministic Unit Test Matrix

At minimum:

``` text
waterlogging:
  no hotspots
  medium hotspot
  high hotspot
  hotspot exactly at route
  hotspot at 75m
  hotspot beyond 75m
  repeated event count
  zero event count
  polygon intersection
  polygon near route
  same hotspot near multiple route segments

rain:
  no rain
  light rain
  heavy rain
  partial hour
  full hour
  multiple hours
  high probability
  low probability

decision:
  fastest is safest
  slower but safer
  critical route excluded when safer route exists
  all routes critical
  decision-score tie
  environmental-risk tie
  time tie
  stable-order tie

providers:
  no route
  routing failure
  weather failure

AI:
  Ollama available
  Ollama unavailable
  invalid structured output
```

------------------------------------------------------------------------

# 94. Important Numerical Test Cases

Test exact boundaries.

## Hotspot corridor

``` text
distance = 0
distance = 37.5m
distance = 75m
distance = 75.1m
```

Expected proximity:

``` text
0m      → 1
37.5m   → 0.5
75m     → 0
75.1m   → 0
```

## Critical threshold

``` text
89.99 → non-critical
90.00 → critical
90.01 → critical
```

## Rain normalization

``` text
15mm → amountScore 100
6mm peak → peakScore 100
```

------------------------------------------------------------------------

# 95. Provider Mocking Strategy

Do not call Google repeatedly for unit tests.

Create fixtures for:

``` text
Google route response
Open-Meteo response
```

Use real providers only for:

``` text
integration verification
final demo
small smoke tests
```

The decision engine must be testable without network access.

------------------------------------------------------------------------

# 96. Data Fixture Strategy

Keep small deterministic fixtures for:

``` text
one point hotspot
one high-risk hotspot
one medium-risk hotspot
one polygon hotspot
no hotspot
multiple hotspots
same hotspot near repeated route segments
```

The full Mumbai dataset is for integration/demo.

Unit tests should not process the entire dataset unnecessarily.

------------------------------------------------------------------------

# 97. Network Failure Rules

Never convert:

``` text
provider unavailable
```

into:

``` text
risk = 0
```

Never fabricate:

``` text
weather
route
hotspot
```

Provider failures must remain visible.

------------------------------------------------------------------------

# 98. Performance Rules

The MVP dataset is local.

Do not introduce a database for spatial search.

Use:

``` text
all hotspot records
      ↓
cheap spatial candidate filter
      ↓
exact geometry checks
```

For the UI:

``` text
8–10 nearest hotspots
```

For route analysis:

``` text
all relevant hotspots
```

Map markers may have a display cap if required for readability, but the
cap must never affect the engine.

------------------------------------------------------------------------

# 99. No Runtime Data Persistence

Do not store:

``` text
user location
route history
search history
AI conversations
```

The application is intentionally stateless for the MVP.

The local GeoJSON file is static application data, not a user database.

------------------------------------------------------------------------

# 100. API Contract Separation

Google:

``` text
Google response
     ↓
google-routes provider
     ↓
internal Route
```

Open-Meteo:

``` text
Open-Meteo response
     ↓
open-meteo provider
     ↓
WeatherSnapshot
```

Hotspot GeoJSON:

``` text
GeoJSON
     ↓
validated hotspot model
     ↓
WaterloggingHotspot
```

Then:

``` text
internal models
     ↓
deterministic engine
```

The frontend sees only internal contracts.

------------------------------------------------------------------------

# 101. TypeScript/Geospatial Safety Rules

Always distinguish:

``` text
Coordinates
{ lat, lon }
```

from:

``` text
GeoJSON
[lon, lat]
```

Never silently swap:

``` text
lat
lon
```

Use helper functions for conversion.

For example:

``` text
coordinatesToGeoJSONPosition()
geoJSONPositionToCoordinates()
geoJSONToGooglePath()
```

These conversions should be centralized.

------------------------------------------------------------------------

# 102. No Business Logic in Components

React components must not contain:

``` text
risk formulas
hotspot calculations
recommendation logic
provider requests
```

Components should:

``` text
receive data
render data
emit user actions
```

Backend/lib code owns the decision.

------------------------------------------------------------------------

# 103. No Provider Logic in the Decision Engine

The decision engine must not know:

``` text
Google JSON
Open-Meteo JSON
HTTP headers
API keys
```

The provider adapters normalize those details first.

The engine receives:

``` text
Route
WeatherSnapshot
WaterloggingHotspot
```

and nothing provider-specific.

------------------------------------------------------------------------

# 104. No AI Logic in the Decision Engine

The deterministic engine must not import:

``` text
Strands
Ollama
Vercel AI
```

The dependency direction must remain:

``` text
providers
   ↓
deterministic analysis
   ↓
recommendation
   ↓
evidence
   ↓
optional explanation
```

Never:

``` text
provider
   ↓
AI
   ↓
decision
```

------------------------------------------------------------------------

# 105. AI Dependency Direction

AI depends on:

``` text
ExplanationContext
```

not the other way around.

Correct:

``` text
DecisionResult
      ↓
ExplanationContext
      ↓
Strands
```

Incorrect:

``` text
Strands
      ↓
DecisionResult
```

------------------------------------------------------------------------

# 106. Exact AI Boundary Table

  Question                         Answer
  -------------------------------- ---------------------------
  Does AI choose the route?        No
  Does AI calculate risk?          No
  Does AI fetch weather?           No
  Does AI inspect hotspots?        No
  Does AI access Google?           No
  Does AI have tools?              No
  Does AI access a database?       No
  Does AI modify recommendation?   No
  Does AI invent evidence?         No
  When does AI run?                User clicks Explain
  Agent count                      One
  Model                            Local Ollama
  TS adapter                       VercelModel
  Ollama provider                  ai-sdk-ollama
  Output                           `{ explanation: string }`
  Failure behavior                 deterministic fallback

------------------------------------------------------------------------

# 107. Exact Backend Boundary Table

  Responsibility             Location
  -------------------------- ----------------
  Place selection            Browser
  Geolocation                Browser
  Map rendering              Browser
  Route request              Next.js server
  Weather request            Next.js server
  Hotspot analysis           Next.js server
  Risk calculation           Next.js server
  Recommendation             Next.js server
  Evidence                   Next.js server
  AI explanation             Next.js server
  Persistent database        None
  Redis                      None
  Express                    None
  Rust                       None
  AWS cloud infrastructure   None

------------------------------------------------------------------------

# 108. Exact Frontend Boundary

The frontend can:

``` text
collect input
resolve places
request analysis
display results
display map
display hotspots
display evidence
request explanation
display explanation
```

The frontend cannot:

``` text
recalculate risk
re-rank routes
change recommendation
change hotspot severity
change formulas
```

------------------------------------------------------------------------

# 109. Exact Backend Boundary

The backend can:

``` text
validate input
call providers
normalize provider data
load hotspot data
calculate geometry
calculate risk
rank routes
generate recommendation
generate evidence
call Strands for explanation
```

The backend cannot:

``` text
delegate route decisions to AI
```

------------------------------------------------------------------------

# 110. Exact Data Boundary

The dataset must be:

``` text
local
static
versioned
source-backed
provenance-aware
```

Do not fetch BMC/NMMC/PMC data live on every user request.

Source preparation happens offline.

Runtime uses:

``` text
mumbai-waterlogging-hotspots.geojson
```

------------------------------------------------------------------------

# 111. Source Preparation Workflow

Before committing the dataset:

``` text
source discovery
      ↓
source verification
      ↓
extract candidate records
      ↓
reconcile duplicates
      ↓
assign stable IDs
      ↓
preserve geometry
      ↓
record provenance
      ↓
record authority
      ↓
record evidence/events
      ↓
validate GeoJSON
      ↓
commit dataset
```

The coding agent should not independently decide that two ambiguous
locations are the same.

Ambiguous merges must remain unresolved until manually decided.

------------------------------------------------------------------------

# 112. Source Reconciliation Rule

Preferred matching order:

``` text
1. authoritative source ID
2. name + administrative context
3. spatial match
```

If two records are ambiguous:

``` text
DO NOT AUTO-MERGE
```

Preserve them separately until resolved.

------------------------------------------------------------------------

# 113. Dataset Accuracy Labels

Every derived geometry should make its precision visible internally.

``` text
EXACT
DERIVED
APPROXIMATE
```

Never convert:

``` text
APPROXIMATE
```

into:

``` text
EXACT
```

just because the application needs coordinates.

------------------------------------------------------------------------

# 114. Evidence Language Rules

Use:

``` text
lower estimated risk
lower waterlogging exposure
better trade-off
recommended based on available evidence
```

Avoid:

``` text
safe
100% safe
flood-free
guaranteed
no flooding
```

The application is a decision-support system.

It is not an emergency guarantee.

------------------------------------------------------------------------

# 115. Important Product Distinction

Google provides:

``` text
feasible candidate routes
```

MonsoonRoute provides:

``` text
route comparison under rain + waterlogging evidence + travel-time trade-off
```

Therefore:

``` text
Google's default route
≠
MonsoonRoute's recommendation
```

The default Google route is simply one candidate.

------------------------------------------------------------------------

# 116. Implementation Checkpoints

## Checkpoint A --- End of Day 1

Must have:

``` text
[ ] Next.js runs
[ ] Google map renders
[ ] Place autocomplete works
[ ] Geolocation works
[ ] Shared types exist
[ ] Zod validation exists
[ ] Hotspot GeoJSON validates
[ ] Google Routes returns normalized routes
[ ] Route geometry is GeoJSON
[ ] Route midpoint works
[ ] Open-Meteo returns normalized weather
[ ] Journey-window interval handling works
```

If any P0 item is missing, do not start AI.

------------------------------------------------------------------------

## Checkpoint B --- End of Day 2

Must have:

``` text
[ ] Point hotspot distance
[ ] Polygon handling
[ ] Hotspot deduplication
[ ] Waterlogging risk
[ ] Rain risk
[ ] Environmental risk
[ ] Time penalty
[ ] Decision score
[ ] Critical gate
[ ] Recommendation
[ ] Evidence
[ ] /api/analyze-route
[ ] Map routes
[ ] Route cards
[ ] Risk panel
```

The entire deterministic application must work without AI.

------------------------------------------------------------------------

## Checkpoint C --- End of Day 3

Must have:

``` text
[ ] Complete design system
[ ] All UI states
[ ] Responsive UI
[ ] Deterministic explanation
[ ] /api/explain-route
[ ] Strands
[ ] VercelModel
[ ] ai-sdk-ollama
[ ] Ollama
[ ] Structured output
[ ] AI fallback
[ ] Full user journey
```

Then feature development stops.

------------------------------------------------------------------------

# 117. What the Coding Agent Must Do If Blocked

If a task cannot be implemented exactly because an external decision is
missing:

``` text
STOP
```

Report:

``` text
1. exact file
2. exact missing decision
3. why implementation cannot safely continue
4. which existing specification is affected
```

Do not:

``` text
guess
rewrite architecture
add a library
add infrastructure
change formulas
```

Example:

> `route-map.tsx` cannot use AdvancedMarker because no Map ID strategy
> is specified.

This is a valid blocker.

The correct resolution is to use the already specified:

``` text
DEMO_MAP_ID
```

rather than inventing another architecture.

------------------------------------------------------------------------

# 118. What the Coding Agent Must Do When an External API Changes

Do not silently switch providers.

If a current API documentation difference appears:

``` text
compare current official docs
        ↓
identify whether current plan is still supported
        ↓
if compatible:
    implement current documented equivalent
if incompatible:
    stop and report
```

Do not switch from:

``` text
Google Routes
```

to another routing provider.

Do not switch from:

``` text
Open-Meteo
```

to another weather provider.

Do not switch from:

``` text
Strands
```

to another agent framework.

The architectural choice is frozen.

------------------------------------------------------------------------

# 119. Current Official Documentation Reference Set

The coding agent should consult these official references when syntax
must be verified.

## Google Routes API

Compute Routes:

https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes

Alternative routes:

https://developers.google.com/maps/documentation/routes/alternative-routes

Field masks:

https://developers.google.com/maps/documentation/routes/choose_fields

Polyline encoding:

https://developers.google.com/maps/documentation/routes/traffic_on_polylines

## Google Maps JavaScript API

React integration:

https://visgl.github.io/react-google-maps/docs

APIProvider:

https://visgl.github.io/react-google-maps/docs/api-reference/components/api-provider

Map:

https://visgl.github.io/react-google-maps/docs/api-reference/components/map

AdvancedMarker:

https://visgl.github.io/react-google-maps/docs/api-reference/components/advanced-marker

Places autocomplete example:

https://developers.google.com/maps/documentation/javascript/examples/rgm-autocomplete

Advanced markers:

https://developers.google.com/maps/documentation/javascript/advanced-markers/start

API security:

https://developers.google.com/maps/api-security-best-practices

## Open-Meteo

Forecast API:

https://open-meteo.com/en/docs

## Turf

Point-to-line distance:

https://turfjs.org/docs/api/pointToLineDistance

Line intersection:

https://turfjs.org/docs/api/lineIntersect

Line segments:

https://turfjs.org/docs/api/lineSegment

Point-to-polygon distance:

https://turfjs.org/docs/api/pointToPolygonDistance

Along:

https://turfjs.org/docs/api/along

## Next.js

Route Handlers:

https://nextjs.org/docs/app/getting-started/route-handlers

Environment variables:

https://nextjs.org/docs/app/guides/environment-variables

## Strands

TypeScript quickstart:

https://strandsagents.com/docs/user-guide/sdk/quickstart/typescript/

Vercel model integration:

https://strandsagents.com/docs/user-guide/sdk/model-providers/vercel/

## TestSprite

E2E testing:

https://www.testsprite.com/use-cases/en/ai-e2e-testing-tool

------------------------------------------------------------------------

# 120. Final Implementation Order

The coding agent must effectively execute this sequence:

``` text
01. Next.js foundation
02. Design tokens
03. Google Maps provider
04. Google Places autocomplete
05. Browser geolocation
06. Shared types
07. Zod validation
08. Hotspot GeoJSON validation
09. Google Routes provider
10. Route normalization
11. Route midpoint
12. Open-Meteo provider
13. Journey-window weather handling
14. Spatial candidate filtering
15. Point hotspot distance
16. Polygon hotspot distance/intersection
17. Hotspot deduplication
18. Waterlogging risk
19. Rain risk
20. Environmental risk
21. Time penalty
22. Decision score
23. Critical gate
24. Recommendation
25. Evidence
26. /api/analyze-route
27. Map route rendering
28. Route cards
29. Recommendation section
30. Risk analysis
31. UI states
32. Deterministic explanation
33. /api/explain-route
34. Strands
35. VercelModel
36. ai-sdk-ollama
37. Ollama
38. Structured explanation
39. AI fallback
40. Responsive polish
41. Full integration
42. Freeze features
43. Day 4 testing and bug fixing
```

Do not reorder the architecture-critical stages.

------------------------------------------------------------------------

# 121. Final Four-Day Timeline

``` text
┌─────────────────────────────────────────────────────────────┐
│ DAY 1 — FOUNDATION                                          │
│                                                             │
│ Next.js → Google Map → Places → Geo → Types → Routes       │
│ → Midpoints → Open-Meteo → Dataset                         │
│                                                             │
│ OUTPUT: providers + normalized data                         │
└─────────────────────────────────────────────────────────────┘

                           ↓

┌─────────────────────────────────────────────────────────────┐
│ DAY 2 — DECISION ENGINE                                     │
│                                                             │
│ Geometry → Hotspots → Rain → Risk → Score → Recommendation │
│ → Evidence → Analyze API → Map → Route cards               │
│                                                             │
│ OUTPUT: complete deterministic MonsoonRoute                 │
└─────────────────────────────────────────────────────────────┘

                           ↓

┌─────────────────────────────────────────────────────────────┐
│ DAY 3 — PRODUCT COMPLETION                                  │
│                                                             │
│ Design → States → Evidence → Explain → Strands → Ollama    │
│ → Structured output → Fallback → Full integration           │
│                                                             │
│ OUTPUT: complete hackathon product                          │
└─────────────────────────────────────────────────────────────┘

                           ↓

┌─────────────────────────────────────────────────────────────┐
│ DAY 4 — RESERVED                                             │
│                                                             │
│ TestSprite → unit tests → E2E → failure paths → bug fixes  │
│ → regression → demo → README → recording → submission      │
│                                                             │
│ OUTPUT: stable submission                                    │
└─────────────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 122. Final Rule

The implementation phase should feel almost mechanical.

The coding agent should be able to read:

``` text
architecture.md
design-system.md
implementation-plan.md
```

and then execute:

``` text
create file
→ implement specified contract
→ run check
→ continue
```

without having to invent:

``` text
architecture
provider strategy
risk model
UI system
AI boundary
testing strategy
```

That is the purpose of this document.

> **Planning is where decisions are made. Implementation is where those
> decisions are executed.**

For MonsoonRoute, the implementation agent is not the architect.

The architecture is already frozen.
