# MonsoonRoute --- Design System

**Version:** 1.0\
**Status:** Frozen visual direction for implementation\
**Product:** MonsoonRoute\
**Design direction:** Clean, modern, readable dark-mode interface for a
rain-aware route decision system.

------------------------------------------------------------------------

## 1. Purpose

This document defines the visual language and reusable UI rules for
MonsoonRoute.

The design system is intentionally simple:

-   dark-first
-   readable
-   accessible
-   information-dense without feeling crowded
-   consistent across forms, maps, route cards, alerts, badges, and
    analysis
-   optimized for quickly understanding a route decision during monsoon
    conditions

The visual system shown in the approved design reference should be
treated as the implementation source of truth unless an implementation
requirement explicitly conflicts with functionality.

### Core design principle

> **The interface should make the route decision understandable at a
> glance.**

The UI should prioritize:

1.  recommended route
2.  environmental risk
3.  waterlogging evidence
4.  rain conditions
5.  travel-time trade-off
6.  explanation of why the recommendation was made

Do not introduce visual complexity merely to make the interface look
more sophisticated.

------------------------------------------------------------------------

## Approved UI Design Reference

The approved visual reference for this design system is:

![MonsoonRoute Dark UI Design System](./MonsoonRoute%20Dark%20UI%20Design%20System.png)

**Repository path:** `docs/MonsoonRoute%20Dark%20UI%20Design%20System.png`

This image is an implementation reference and must be considered together with the written rules in this document. The written design-system rules remain the explicit contract for colors, typography, spacing, component behavior, accessibility, and responsive behavior. Do not invent a separate visual direction during implementation.

# 2. Design Personality

MonsoonRoute should feel:

-   **Simple**
-   **Readable**
-   **Accessible**
-   **Modern**
-   **Calm**
-   **Trustworthy**
-   **Data-driven**
-   **Dark-mode native**

The interface should **not** feel:

-   flashy
-   game-like
-   overly futuristic
-   dashboard-heavy
-   neon
-   gradient-heavy
-   cluttered
-   alarmist

### Visual hierarchy

The most important content should receive the strongest visual
hierarchy:

**Recommendation → Risk → Evidence → Comparison → Details**

Avoid giving decorative elements stronger contrast than actual route
information.

------------------------------------------------------------------------

# 3. Color System

The approved design uses a dark neutral foundation with blue as the
primary action color.

## 3.1 Primary Colors

  -----------------------------------------------------------------------
  Token                   Hex                     Usage
  ----------------------- ----------------------- -----------------------
  `primary`               `#3682F6`               Main actions,
                                                  recommended route,
                                                  active controls

  `primary-hover`         `#2563EB`               Hover/pressed state of
                                                  primary actions

  `primary-light`         `#60A5FA`               Highlights, secondary
                                                  blue indicators

  `primary-subtle`        `#DBEAFE`               Very light blue
                                                  emphasis where needed
  -----------------------------------------------------------------------

### Primary usage rules

Use primary blue for:

-   Find safer route
-   active/focused controls
-   recommended route
-   current-location indicator
-   route-analysis emphasis
-   selected interactive elements

Do not use primary blue for every piece of information. It must remain
the main interaction and route-selection color.

------------------------------------------------------------------------

## 3.2 Semantic Colors

  -----------------------------------------------------------------------
  Token                   Hex                     Meaning
  ----------------------- ----------------------- -----------------------
  `success`               `#22C55E`               Successful analysis,
                                                  recommended status,
                                                  positive action

  `warning`               `#F59E0B`               Warning, moderate
                                                  concern, heavier rain

  `danger`                `#EF4444`               Errors, high-risk
                                                  conditions, destructive
                                                  actions
  -----------------------------------------------------------------------

### Semantic usage

**Green** - recommended - successful - lower environmental risk -
successful analysis

**Amber** - warning - moderate risk - heavy rain - slower-but-safer
trade-off

**Red** - high risk - failed request - invalid input - destructive/reset
action

Semantic colors should communicate meaning, not decoration.

------------------------------------------------------------------------

# 4. Dark Surface System

The application uses several dark neutral levels to create hierarchy
without relying on gradients.

  Token              Hex         Usage
  ------------------ ----------- -------------------------------------
  `background`       `#080F14`   Main application background
  `surface`          `#111827`   Primary cards and elevated sections
  `surface-alt`      `#1F2937`   Secondary/elevated surfaces
  `border`           `#374151`   Borders and dividers
  `muted-text`       `#9CA3AF`   Secondary/supporting text
  `secondary-text`   `#D1D5DB`   Supporting but readable text
  `primary-text`     `#F9FAFB`   Main text/headings

### Surface hierarchy

Use the darkest background for the page.

Use progressively lighter surfaces for:

1.  application background
2.  main sections
3.  cards
4.  nested cards
5.  focused/active elements

Do not create depth using large gradients.

------------------------------------------------------------------------

# 5. Typography

## 5.1 Font

**Primary font:** Inter

Use Inter consistently across the application.

The design reference uses a clean sans-serif typography system optimized
for readability.

------------------------------------------------------------------------

## 5.2 Type Scale

  Level         Size Weight     Usage
  --------- -------- ---------- ----------------------------
  H1          `36px` Bold       Main page/product headline
  H2          `28px` Bold       Major section heading
  H3          `20px` Semibold   Card/section heading
  Body        `16px` Regular    Main readable content
  Caption     `14px` Regular    Supporting information
  Small       `12px` Regular    Metadata, compact labels

### Typography rules

-   Headings should be concise.
-   Body text should remain comfortable to read.
-   Do not use very small text for important route information.
-   Risk scores should be visually prominent.
-   Supporting evidence can use caption/small styles.
-   Avoid excessive font-weight changes.

### Example hierarchy

``` text
H1
The safer way to travel
during monsoon

H2
Plan smarter routes

H3
Route analysis

Body
Real-time rain and waterlogging insights.

Caption
Based on official data sources.
```

------------------------------------------------------------------------

# 6. Spacing System

Use an **8px base spacing system**.

Approved spacing values:

-   `4px`
-   `8px`
-   `12px`
-   `16px`
-   `24px`

Additional spacing may be used when required by layout, but the 8px
rhythm should remain visually dominant.

### Recommended semantic spacing

     Value Typical usage
  -------- ----------------------------------------
     `4px` Icon/text micro-spacing
     `8px` Compact internal spacing
    `12px` Form/control spacing
    `16px` Standard card padding and section gaps
    `24px` Major component separation

Avoid arbitrary spacing values unless necessary.

------------------------------------------------------------------------

# 7. Border Radius

The design reference uses restrained rounded corners.

  Token            Value Usage
  ------------- -------- -------------------------
  `radius-sm`      `4px` Small controls/details
  `radius-md`      `8px` Inputs, buttons, cards
  `radius-lg`     `12px` Larger cards/containers

Use consistent radius values.

Do not make every element excessively rounded.

------------------------------------------------------------------------

# 8. Shadows

Shadows should be subtle because the dark surface hierarchy already
provides most of the depth.

Approved concepts:

-   **Card Shadow**
-   **Hover Shadow**

Use shadows primarily to separate elevated elements from their
background.

Avoid:

-   large glowing shadows
-   colored neon shadows
-   excessive drop shadows

------------------------------------------------------------------------

# 9. Buttons

The button system contains four major variants.

## 9.1 Primary

Example:

**Find safer route →**

Use for the main application action.

Characteristics:

-   primary blue background
-   strong contrast
-   readable text
-   clear action icon where useful
-   prominent but not oversized

------------------------------------------------------------------------

## 9.2 Secondary

Example:

**Explain this decision ✦**

Use for important supporting actions.

Characteristics:

-   dark surface
-   visible border
-   white/light text
-   lower visual weight than primary

The AI explanation action should remain secondary to the deterministic
route analysis.

------------------------------------------------------------------------

## 9.3 Success

Example:

**Use my location**

Use for positive/location actions where green communicates success or
permission.

Characteristics:

-   green border
-   green text/icon
-   dark interior

------------------------------------------------------------------------

## 9.4 Ghost

Example:

**View on map**

Use for lower-priority actions.

Characteristics:

-   transparent/dark surface
-   subtle border
-   readable text
-   minimal emphasis

------------------------------------------------------------------------

## 9.5 Danger

Example:

**Reset**

Use only for destructive or clearing actions.

Characteristics:

-   red border
-   red text/icon
-   dark/red-tinted interior

Do not use danger styling for ordinary warnings.

------------------------------------------------------------------------

# 10. Input Fields

Inputs should be simple and highly readable.

### Structure

``` text
Label
[ icon  Input value                         ]
```

### Default state

-   dark surface
-   subtle border
-   light text
-   muted icon

### Focused state

-   primary blue border
-   clear focus visibility
-   no excessive glow

### Error state

-   danger/red border
-   red-tinted supporting state
-   concise error message

### Example inputs

``` text
📍 Mumbai, Maharashtra
📍 Navi Mumbai, Maharashtra

Travel mode
🚗 Driving
```

Inputs should never rely only on color to communicate state.

------------------------------------------------------------------------

# 11. Forms

The route form should visually prioritize the actual journey:

``` text
From
Destination
Travel mode

[ Find safer route → ]
```

The form should not become a multi-step wizard.

The user should be able to understand the required inputs immediately.

### Location

The application may provide:

**Use my location**

This should be clearly separated from manually entered
origin/destination values.

------------------------------------------------------------------------

# 12. Cards

Cards are the primary information containers.

The design reference defines:

1.  Route Card
2.  Info Card
3.  Map Legend Card

## 12.1 Route Card

Used for route comparison.

Example information:

``` text
Route A                         Recommended

32 min

+4 min vs fastest

🌧 Moderate rain
🔴 2 high-risk hotspots
🌿 Lower environmental risk
```

### Route card hierarchy

1.  route status
2.  travel time
3.  comparison with fastest
4.  rain/risk indicators
5.  environmental explanation

The recommended route must be immediately recognizable.

------------------------------------------------------------------------

## 12.2 Info Card

Used for individual metrics.

Example:

``` text
Rain Risk

65 / 100

[ progress indicator ]
```

Use these cards for:

-   Rain Risk
-   Waterlogging Risk
-   Environmental Risk
-   Time Penalty
-   other concise analysis metrics

Do not turn every metric into a large dashboard widget.

------------------------------------------------------------------------

## 12.3 Map Legend Card

The legend should explain visual map elements without requiring the user
to guess.

Example:

``` text
Recommended route
Alternative route
High-risk hotspot
Waterlogging hotspot
Your location
```

------------------------------------------------------------------------

# 13. Alerts and Messages

Alerts use semantic color and a compact message structure.

## Success

Example:

> Route analysis completed successfully.

Use green.

## Information

Example:

> Fetching latest weather data...

Use blue.

## Warning

Example:

> Heavy rain expected in some areas.

Use amber.

## Error

Example:

> Unable to fetch routes. Please try again.

Use red.

### Alert rules

-   Keep messages short.
-   Explain what happened.
-   Give the user a clear next action when appropriate.
-   Never hide a provider failure behind a fake successful state.

------------------------------------------------------------------------

# 14. Badges

Badges provide compact status information.

Approved examples:

-   Recommended
-   Fastest
-   Slower but safer
-   High risk
-   Moderate risk
-   Low risk
-   Heavy rain
-   Moderate rain
-   Light rain

### Badge hierarchy

**Recommended** - green

**Fastest** - blue

**Slower but safer** - amber

**High risk** - red

**Moderate risk** - amber

**Low risk** - neutral/light

Rain badges should use the same semantic language consistently.

------------------------------------------------------------------------

# 15. Map Visual Language

The map is a primary product surface.

It should communicate route and hotspot information without overwhelming
the geographic context.

## 15.1 Markers

Approved marker concepts:

  Marker                 Meaning
  ---------------------- -----------------------
  Blue location marker   User/current location
  Green marker           Start location
  Red marker             Destination
  Red/orange marker      High-risk hotspot
  Amber marker           Waterlogging hotspot

The exact marker implementation may use an icon inside a circular
marker.

------------------------------------------------------------------------

## 15.2 Route Lines

  Route line                       Meaning
  -------------------------------- -------------------
  Solid blue                       Recommended route
  Dashed gray                      Alternative route
  Other distinct route style       Additional route
  Thin/dashed neutral road lines   Map context

### Critical rule

The recommended route must be visually distinct from alternatives.

The map must not make every route appear equally important.

------------------------------------------------------------------------

# 16. Route Visualization Rules

When analysis is complete:

1.  show the recommended route prominently
2.  show alternatives with lower visual weight
3.  show relevant route-associated hotspots
4.  show origin and destination clearly
5.  allow the user to understand the recommendation without opening
    every card

The map is for **visual explanation**.

It is not responsible for recalculating:

-   risk
-   route score
-   recommendation
-   hotspot relevance

Those values come from the backend decision engine.

------------------------------------------------------------------------

# 17. Data Visualization

The design uses simple visualizations rather than complex charts.

## Environmental Risk

Example:

``` text
Environmental Risk

42 / 100

[████████░░░░]
```

The score should be the dominant element.

------------------------------------------------------------------------

## Risk Breakdown

Example:

``` text
Risk Breakdown

Waterlogging Risk   55%  [████████]
Rain Risk           35%  [█████]
Time Penalty        10%  [██]
```

Use horizontal progress indicators.

### Visualization rules

-   Keep charts simple.
-   Always show the numeric value.
-   Do not rely only on bar length.
-   Use semantic colors consistently.
-   Avoid pie charts or decorative graphs unless a future requirement
    explicitly needs them.

------------------------------------------------------------------------

# 18. Risk Color Semantics

The UI may use the following semantic interpretation:

### Low risk

Neutral/light treatment.

### Moderate risk

Amber treatment.

### High risk

Red treatment.

### Important wording rule

Risk levels describe the output of the MonsoonRoute analysis. They must
not be presented as a guarantee that a route is safe.

Avoid UI language such as:

-   "100% safe"
-   "Flood-free"
-   "Guaranteed safe"
-   "No flooding"

Prefer:

-   "Lower estimated risk"
-   "Lower waterlogging exposure"
-   "Better trade-off"
-   "Recommended based on available evidence"

------------------------------------------------------------------------

# 19. Icon System

The reference design uses a compact outline/icon language.

Core icons include:

-   home
-   location
-   driving
-   rain
-   water
-   alert
-   route
-   explain
-   chart
-   map
-   settings
-   open

### Icon rules

-   Icons should reinforce meaning.
-   Do not use icons as decoration when they add no information.
-   Maintain consistent stroke weight.
-   Keep icon sizes appropriate to their surrounding text.
-   Icons should not replace labels for critical actions.

------------------------------------------------------------------------

# 20. Loading States

Loading should communicate what the system is doing.

Example:

``` text
⟳

Loading State

Analyzing routes...
This may take a few seconds.
```

Use a restrained spinner/loading indicator.

Avoid fake progress percentages when the actual operation does not
expose progress.

### Route analysis loading sequence

Where appropriate, communicate meaningful stages such as:

-   Fetching routes
-   Fetching weather
-   Analyzing waterlogging exposure
-   Ranking routes

Do not expose internal implementation details that do not help the user.

------------------------------------------------------------------------

# 21. Empty States

Example:

``` text
📍

Empty State

Start by entering where you want to go.
```

Empty states should:

-   explain what is missing
-   tell the user what to do next
-   remain visually lightweight

------------------------------------------------------------------------

# 22. Error States

Example:

``` text
⚠

Unable to load map

Please check your internet connection
and try again.
```

Error states should be honest and actionable.

Examples:

-   invalid location
-   no route available
-   routing provider failure
-   weather provider failure
-   map loading failure
-   AI explanation unavailable

Do not show a successful route recommendation if the underlying analysis
failed.

------------------------------------------------------------------------

# 23. Accessibility

Accessibility is a core design requirement.

### Contrast

Text must remain readable against dark surfaces.

### Focus

Keyboard focus must be visible, especially on:

-   inputs
-   buttons
-   select controls
-   map-related controls

### Color

Do not communicate meaning using color alone.

For example:

Bad:

> Red = high risk, with no text.

Good:

> **High risk** badge + red semantic styling.

### Motion

Animations should be subtle.

Do not use unnecessary animated backgrounds or distracting transitions.

------------------------------------------------------------------------

# 24. Responsive Layout

The design system should work across:

-   desktop
-   laptop
-   tablet
-   mobile-width layouts

The visual hierarchy should remain the same across breakpoints.

### Desktop

Use available width for:

-   route form
-   map
-   route comparison
-   analysis/evidence

### Smaller screens

Stack content vertically.

Recommended order:

``` text
Route form
Map
Recommendation
Route alternatives
Risk analysis
Evidence
Explain this decision
```

Do not preserve desktop multi-column layouts at the cost of readability.

------------------------------------------------------------------------

# 25. Application Layout

MonsoonRoute should remain a focused single-page application experience.

The core experience is:

``` text
Origin
   ↓
Destination
   ↓
Travel mode
   ↓
Find safer route
   ↓
Interactive map
   ↓
Recommended route
   ↓
Alternative routes
   ↓
Risk + evidence
   ↓
Explain this decision
```

Avoid turning the MVP into a multi-page dashboard.

------------------------------------------------------------------------

# 26. Recommendation Presentation

The recommendation is the most important result in the UI.

A recommended route card should communicate:

-   recommended status
-   route name
-   duration
-   difference from fastest route
-   environmental risk
-   rain risk
-   waterlogging exposure
-   concise reason

Example:

``` text
Recommended

Route A

32 min
+4 min vs fastest

Moderate rain
2 high-risk hotspots
Lower environmental risk

Why this route?
Lower estimated waterlogging exposure
for a small travel-time increase.
```

The user should understand **why** the route is recommended without
needing AI.

------------------------------------------------------------------------

# 27. Deterministic Explanation vs AI Explanation

The interface must visually distinguish two concepts.

## Deterministic route analysis

This is the authoritative product result.

It includes:

-   route ranking
-   environmental risk
-   rain risk
-   waterlogging risk
-   time trade-off
-   hotspot evidence
-   recommendation reason

## AI explanation

This is an optional natural-language explanation of the already-computed
result.

The UI action should be:

**Explain this decision ✦**

The AI must not be presented as the component that selected the route.

### Correct visual relationship

``` text
Deterministic Analysis
        ↓
Recommendation
        ↓
Explain this decision
        ↓
AI explanation
```

Not:

``` text
User
 ↓
AI
 ↓
Route decision
```

------------------------------------------------------------------------

# 28. AI Explanation UI

The AI explanation should feel like a helpful explanation layer rather
than a chatbot.

Do not add:

-   arbitrary chat
-   multi-agent UI
-   agent configuration panels
-   tool-call visualizations
-   complex conversation history

For the MVP, one action is enough:

**Explain this decision**

### AI states

#### Idle

``` text
[ Explain this decision ✦ ]
```

#### Loading

``` text
Explaining this decision...
```

#### Success

Show a concise explanation card containing the generated explanation.

#### Fallback

If the local Ollama/AI path is unavailable, show the deterministic
explanation instead.

The application must remain useful without AI.

------------------------------------------------------------------------

# 29. Evidence Presentation

Evidence should be visually clear and trustworthy.

Examples:

-   documented waterlogging hotspot
-   source authority
-   historical/recent evidence
-   rain data
-   route proximity
-   high-risk hotspot count

Do not invent evidence to make a route recommendation look stronger.

Where source attribution is available, expose it in a compact readable
form.

------------------------------------------------------------------------

# 30. Map + Card Relationship

The map and cards should reinforce one another.

Example:

``` text
Map
 ├── Recommended route
 ├── Alternative route
 ├── Hotspots
 └── Origin/Destination

Route Card
 ├── Route duration
 ├── Risk
 └── Recommendation

Evidence
 ├── Hotspot
 ├── Rain
 └── Trade-off
```

Selecting or inspecting a route should make the corresponding route
information easy to identify.

The interface should avoid duplicating the same information in five
different places.

------------------------------------------------------------------------

# 31. Visual Density

MonsoonRoute needs to show meaningful analytical information without
becoming a dense engineering dashboard.

### Prefer

-   short labels
-   concise cards
-   clear numbers
-   restrained icons
-   compact evidence
-   strong hierarchy

### Avoid

-   huge tables
-   verbose paragraphs
-   excessive badges
-   multiple competing primary buttons
-   unnecessary charts
-   decorative UI blocks

------------------------------------------------------------------------

# 32. No Unnecessary Gradients

The approved design uses a dark, layered surface system.

Do not introduce large decorative gradients.

Especially avoid:

-   full-page gradient backgrounds
-   gradient cards
-   glowing gradient buttons
-   neon borders
-   gradient text

If a future visual effect is added, it must serve hierarchy or usability
rather than decoration.

------------------------------------------------------------------------

# 33. Design Tokens --- Suggested Implementation

A CSS/Tailwind token layer should expose the approved values.

Example conceptual token structure:

``` text
colors:
  background
  surface
  surface-alt
  border

  primary
  primary-hover
  primary-light
  primary-subtle

  success
  warning
  danger

  muted-text
  secondary-text
  primary-text

spacing:
  4
  8
  12
  16
  24

radius:
  sm
  md
  lg
```

Components should consume tokens instead of hardcoding different colors
throughout the application.

------------------------------------------------------------------------

# 34. Component Consistency

Reusable components should be preferred over page-specific styling.

Core visual components include:

``` text
Button
Input
Select
Badge
Card
Alert
Progress
RouteCard
InfoCard
MapLegend
RiskBreakdown
LoadingState
EmptyState
ErrorState
```

Route-specific components may build on the generic primitives.

------------------------------------------------------------------------

# 35. State Consistency

Every interactive component should have predictable states.

At minimum:

``` text
default
hover
focus
active
disabled
loading
error
```

Not every state needs a visually dramatic change.

The important requirement is that the user can understand what is
happening.

------------------------------------------------------------------------

# 36. Content Rules

Use language that is:

-   direct
-   calm
-   understandable
-   evidence-oriented

Prefer:

> Lower estimated waterlogging exposure.

Over:

> This route is definitely safer.

Prefer:

> No known waterlogging hotspots from the MonsoonRoute dataset were
> found within the analysis corridor.

Over:

> No flooding here.

Prefer:

> Recommended based on available route, rain, and waterlogging evidence.

Over:

> Best route guaranteed.

------------------------------------------------------------------------

# 37. Product-Specific Visual Priorities

The following hierarchy is intentionally stronger than generic dashboard
conventions:

### Priority 1 --- Recommendation

What route should I take?

### Priority 2 --- Why

Why is it recommended?

### Priority 3 --- Risk

How much rain/waterlogging exposure is involved?

### Priority 4 --- Trade-off

How much additional travel time am I accepting?

### Priority 5 --- Evidence

What information supports the result?

### Priority 6 --- Technical detail

Only show deeper technical information when useful.

------------------------------------------------------------------------

# 38. Approved Reference Examples

### Primary action

``` text
┌──────────────────────────────────┐
│ Find safer route              →  │
└──────────────────────────────────┘
```

### Secondary AI action

``` text
┌──────────────────────────────────┐
│ Explain this decision         ✦  │
└──────────────────────────────────┘
```

### Route result

``` text
┌──────────────────────────────────┐
│ Route A              Recommended │
│                                  │
│ 32 min                           │
│ +4 min vs fastest                │
│                                  │
│ 🌧 Moderate rain                 │
│ 🔴 2 high-risk hotspots         │
│ 🌿 Lower environmental risk      │
└──────────────────────────────────┘
```

### Risk metric

``` text
┌──────────────────────────────────┐
│ Rain Risk                        │
│                                  │
│ 65 / 100                         │
│                                  │
│ ████████████░░░░                 │
└──────────────────────────────────┘
```

------------------------------------------------------------------------

# 39. Implementation Rules for the Coding Agent

When implementing the interface:

1.  Treat this document and the approved visual reference as the visual
    source of truth.
2.  Do not redesign the UI while implementing it.
3.  Do not add product features because they appear visually
    interesting.
4.  Do not introduce gradients unless explicitly required.
5.  Use the defined color tokens.
6.  Use Inter consistently.
7.  Follow the 8px spacing rhythm.
8.  Keep cards and controls visually consistent.
9.  Preserve readable contrast.
10. Make focus/error/loading states explicit.
11. Keep the recommendation visually dominant.
12. Keep AI visually secondary to deterministic analysis.
13. Do not turn the application into a dashboard.
14. Do not add unnecessary animations.
15. Do not invent risk values or evidence for visual examples in
    production.
16. Keep the map visually clear and avoid excessive markers.
17. Use responsive stacking on smaller screens.
18. Prefer reusable components over duplicated styling.
19. Do not change the product architecture to satisfy a visual
    preference.
20. If a visual requirement conflicts with functional correctness,
    preserve functional correctness and make the smallest visual
    adjustment necessary.

------------------------------------------------------------------------

# 40. Definition of Done --- Design

The UI is visually complete when:

-   [ ] Dark theme matches the approved direction.
-   [ ] Primary blue and semantic colors use the defined tokens.
-   [ ] Typography follows the defined scale.
-   [ ] Buttons have consistent variants and states.
-   [ ] Inputs have default, focus, and error states.
-   [ ] Cards use consistent surfaces, borders, and radius.
-   [ ] Route recommendation is immediately visible.
-   [ ] Alternative routes are visually distinguishable.
-   [ ] Map markers and route lines have consistent semantics.
-   [ ] Risk metrics show numeric values and visual indicators.
-   [ ] Alerts use correct semantic states.
-   [ ] Badges use consistent status language.
-   [ ] Loading, empty, and error states are implemented.
-   [ ] AI explanation is visually secondary to deterministic analysis.
-   [ ] Responsive layouts remain readable.
-   [ ] No unnecessary gradients or decorative complexity have been
    introduced.
-   [ ] The interface remains understandable without the AI explanation
    feature.

------------------------------------------------------------------------

# 41. Final Design Principle

MonsoonRoute is a **decision-support interface**, not a visual
dashboard.

The user should be able to answer three questions almost immediately:

> **Which route is recommended?**

> **Why is it recommended?**

> **What evidence and trade-off support that decision?**

Everything in the visual system should make those three answers easier
to understand.
