# MonsoonRoute — Demo Guide

> **Purpose:** Personal demo/rehearsal guide for the Environmental Hacks 2026 submission.
>
> This is not an implementation plan. It tells me **what to show, what to say, what not to show, and how to record the final video**.

---

## 0. Submission Constraints

Environmental Hacks requires a **demo video of up to 3 minutes**, uploaded to YouTube as public or unlisted. The judges score what is submitted; there is **no live demo**, so anything important must be visible in the video.

The demo must visibly show:

1. what MonsoonRoute does;
2. who it is for / the problem it solves;
3. the working route-risk recommendation;
4. why the recommendation was made;
5. where AWS fits.

For MonsoonRoute, AWS is represented by the **open-source Strands Agents SDK** in the explanation layer. The route decision itself remains deterministic.

**Hard limit:** keep the final video comfortably below 3:00. Target approximately **2:30–2:45** so there is margin for platform/player differences.

---

# 1. The One-Sentence Story

> **MonsoonRoute helps a commuter choose the better route during rain by comparing route travel time with rainfall and known waterlogging exposure.**

Do not pitch it as:

- Google Maps replacement;
- flood prediction;
- AI route planner;
- traffic prediction;
- nationwide flood system.

The demo story is:

```text
I need to travel from A to B
          ↓
Candidate routes
          ↓
Rain + route geometry + waterlogging evidence
          ↓
Deterministic risk analysis
          ↓
Route ranking
          ↓
Better trade-off
          ↓
Evidence / Why
          ↓
Optional AI explanation
```

---

# 2. What the Judge Must Understand

By the end of the video, the judge should understand these five things without reading the README:

### 1. The problem

During rain, the fastest route is not necessarily the route with the lower estimated environmental exposure.

### 2. The input

A commuter gives:

- origin;
- destination;
- travel mode.

### 3. The analysis

MonsoonRoute combines:

- candidate routes;
- rainfall/weather;
- known waterlogging hotspots;
- route geometry;
- travel time.

### 4. The decision

The deterministic engine ranks the available routes and recommends the better trade-off.

### 5. The AI/AWS role

Strands is used **after the decision** to explain the already-computed result.

The AI does **not**:

- choose the route;
- calculate risk;
- fetch weather;
- fetch routes;
- invent evidence;
- override the recommendation.

---

# 3. The Core Demo Scenario

## Primary scenario

Use a Mumbai route that reliably produces a meaningful route comparison after final testing.

The planned rehearsal scenario is:

```text
Origin:      Andheri
Destination: Bandra
Mode:        DRIVE
```

This is a **scenario target, not a promise about the final live route numbers**.

Do not hard-code or narrate expected numbers before verifying the actual final build.

The desired result is conceptually:

```text
Fastest route
    ↓
higher estimated environmental risk

Alternative route
    ↓
slightly longer
lower estimated environmental risk

MonsoonRoute
    ↓
recommends the better trade-off
```

If the Andheri → Bandra result does not produce a strong contrast on the final test day, choose another route **inside the supported Mumbai-region scope** that does.

Do not change the algorithm merely to manufacture a better demo.

---

# 4. The Ideal 3-Minute Demo

## 0:00–0:15 — Hook

Show the application immediately.

Suggested narration:

> “During Mumbai rain, the fastest route isn't always the route you want to take. MonsoonRoute compares route time with rainfall and known waterlogging exposure to recommend the better trade-off.”

Keep this short.

Do not spend the opening explaining the entire architecture.

---

## 0:15–0:35 — Enter the trip

Show:

- origin;
- destination;
- travel mode;
- route search.

Example:

```text
From: Andheri
To:   Bandra
Mode: Drive
```

If using browser geolocation, show it only if it works smoothly.

Do not spend demo time explaining browser permissions.

---

## 0:35–1:10 — Show the actual analysis result

Let the application display the candidate routes.

Show:

- routes on the map;
- route durations;
- risk level / score;
- recommended route;
- visual distinction between recommended and alternatives.

The important visual idea is:

```text
FASTEST
   ≠
BEST TRADE-OFF
```

Narration:

> “MonsoonRoute found multiple routes. The fastest route has higher estimated environmental exposure, while an alternative takes a little longer but has lower exposure.”

Use the **actual numbers shown by the final build**.

Never invent or manually state numbers that are not visible in the application.

---

## 1:10–1:40 — Show the recommendation

Focus the screen on the recommendation.

Show:

- recommended route;
- time difference;
- environmental risk comparison;
- recommendation reason.

Desired communication:

> “The system recommends this route because the additional travel time is small relative to the reduction in estimated waterlogging and rain exposure.”

If the actual result says the fastest route is also the best route, that is acceptable technically, but it is a weaker demo. Prefer a verified scenario where the system demonstrates the core trade-off.

Do **not** manipulate the engine to force a different recommendation.

---

## 1:40–2:05 — Show the evidence

Open/scroll to the evidence section.

Show the relevant facts that caused the recommendation:

- rainfall information;
- waterlogging hotspots;
- route proximity/intersection where applicable;
- travel-time trade-off.

The map should help visually connect:

```text
route
  +
hotspot
  +
rain
  =
decision
```

Narration:

> “The recommendation is not a black-box AI guess. These are the inputs and evidence used by the deterministic decision engine.”

This is one of the most important lines in the demo.

---

# 5. The AWS + AI Moment

## 2:05–2:35 — “Explain this decision”

Click:

**Explain this decision**

This is the AI moment.

Before clicking, briefly establish the boundary:

> “Once the route has already been selected, I can ask the AI to explain that decision.”

Then show the explanation.

The explanation should communicate the same evidence already visible in the UI.

A good explanation should say things such as:

- the recommended route has lower estimated risk;
- the fastest route has greater waterlogging exposure;
- the recommended route costs some additional travel time;
- rainfall is part of the environmental-risk assessment.

It must not claim:

- guaranteed safety;
- exact flood probability;
- facts not present in the supplied evidence;
- that the AI selected the route.

---

## 2:35–2:50 — Explicitly show AWS

Do not assume the judge will infer AWS from the AI interaction.

Show a small, clear visual/overlay or briefly show the relevant architecture/code/configuration:

```text
AWS open-source component:
Strands Agents SDK

Role:
AI explanation layer

Route decision:
Deterministic engine
```

Suggested narration:

> “AWS fits here through the open-source Strands Agents SDK. Strands explains the decision after the deterministic engine has already made it; it does not control the route decision.”

This directly addresses the hackathon requirement.

Do not waste time showing AWS services that are not actually used.

---

## 2:50–2:55 — Close

End with the product outcome:

> “MonsoonRoute turns rain and waterlogging evidence into a route decision a commuter can actually act on.”

Then stop.

Do not add a long outro.

---

# 6. What Should Be Visible During the Demo

## Must show

- [ ] MonsoonRoute UI
- [ ] origin and destination
- [ ] travel mode
- [ ] route generation
- [ ] multiple candidate routes when available
- [ ] map
- [ ] recommendation
- [ ] route-time comparison
- [ ] environmental-risk comparison
- [ ] evidence
- [ ] waterlogging hotspot evidence
- [ ] rainfall evidence
- [ ] “Explain this decision”
- [ ] AI explanation
- [ ] Strands / AWS role
- [ ] deterministic-vs-AI boundary

## Nice if it fits naturally

- [ ] current-location flow
- [ ] route-relevant hotspot visualization
- [ ] risk breakdown
- [ ] concise source/provenance indication

## Do not spend demo time on

- [ ] login/authentication
- [ ] database
- [ ] infrastructure that does not exist
- [ ] code walkthrough
- [ ] unit tests
- [ ] TestSprite dashboard
- [ ] package installation
- [ ] long README walkthrough
- [ ] unrelated UI states
- [ ] future roadmap
- [ ] features not implemented

---

# 7. The AI Recording Question

## Can AI record a product-demo video?

**Yes. In 2026, AI tools can drive a browser and record a product walkthrough.**

For example, some current tools advertise an agent that can open a web app, click/type/scroll through the workflow, and produce a recorded demo; other tools provide AI-assisted editing, captions, zoom, narration, or agent-readable recordings.

However, there is an important distinction:

### AI can record the demo

A computer-use/demo agent can:

```text
open app
   ↓
click through workflow
   ↓
capture screen
   ↓
produce video
```

### But I should NOT make the hackathon demo depend on that

The final submission should be a **controlled recording of a known-good run**.

AI browser agents can still:

- click the wrong element;
- choose the wrong autocomplete result;
- encounter timing issues;
- behave differently after a UI change;
- fail because of map/provider loading;
- produce a less convincing route scenario.

For a three-minute judged submission, reliability matters more than automation.

---

# 8. Recommended Recording Strategy

## Preferred

**I personally control the application and record the screen.**

Use a normal local screen recorder.

The recording process:

```text
Prepare stable environment
        ↓
Open final MonsoonRoute build
        ↓
Verify demo route once
        ↓
Start recording
        ↓
Perform rehearsed flow
        ↓
Stop
        ↓
Trim only unnecessary dead time
        ↓
Upload to YouTube
```

This gives maximum control over:

- timing;
- route choice;
- cursor;
- map movement;
- explanation timing;
- AWS visibility.

---

# 9. Where AI Is Actually Useful for the Video

Use AI as a **production assistant**, not as the person responsible for the final run.

AI can help with:

### Script

Generate/refine the narration from this document.

### Voice-over

If my own voice recording is poor, an AI voice can be considered, but a natural personal narration is preferable if it sounds clear.

### Captions

Automatically generate subtitles and then verify technical terms.

### Editing

AI-assisted tools can:

- remove long pauses;
- create captions;
- add zoom/focus;
- clean up the presentation.

### Rehearsal

AI can review the planned script and tell me where the demo is wasting time.

The final video must still accurately represent the real product.

---

# 10. Important Distinction About ChatGPT Record

Do not confuse **AI-assisted recording** with **ChatGPT's Record feature**.

OpenAI's current Record documentation describes Record primarily as a way to capture/transcribe and summarize meetings or voice notes. It is not the same thing as an autonomous product-demo recorder that drives MonsoonRoute and produces the final hackathon screen video.

Therefore:

```text
ChatGPT Record
    ≠
autonomous product-demo video recorder
```

If I want an AI agent to drive the browser and create a demo video, I need a tool designed for that workflow.

---

# 11. If Using an AI Demo Recorder Anyway

If I decide to experiment with an AI demo recorder:

### First run

Let the AI perform the entire flow.

### Second run

Check:

- correct origin;
- correct destination;
- correct route;
- correct recommendation;
- correct evidence;
- AI explanation;
- AWS/Strands visibility;
- no accidental credentials;
- no browser extension overlays;
- no unexpected loading state.

### Third run

Only use the output if it is cleaner and more reliable than a manual recording.

Otherwise:

**record manually.**

Do not spend hackathon Day 4 fighting an AI recording tool.

---

# 12. Recording Setup

Before recording:

```text
Browser
├── final MonsoonRoute build
├── no unnecessary tabs
└── correct zoom level

Screen
├── 1080p or higher if practical
├── application readable
└── no personal/private information visible

Audio
├── quiet room
├── microphone tested
└── narration rehearsed

Application
├── providers working
├── hotspot dataset loaded
├── stable demo route verified
├── recommendation verified
├── evidence verified
├── Strands verified
└── Ollama/fallback behavior verified
```

If recording locally with Ollama, make sure the model is already loaded before starting the take.

Do not reveal API keys or credentials.

---

# 13. Cursor / Interaction Discipline

During the final recording:

- move the cursor deliberately;
- avoid random mouse movement;
- do not repeatedly hover over unrelated elements;
- do not scroll rapidly;
- wait for important results to become readable;
- keep the map centered on the relevant route;
- do not accidentally click a different route while explaining;
- pause briefly after important UI changes.

The goal is:

```text
Judge sees
    ↓
Judge understands
    ↓
Judge remembers
```

not:

```text
Developer clicks everything quickly
    ↓
Judge tries to figure out what happened
```

---

# 14. If the Live Weather Changes

Weather is an external input and can change.

Therefore, before the final recording:

1. choose the demo departure time;
2. run the exact route;
3. inspect the actual weather result;
4. inspect the actual route comparison;
5. verify the recommendation;
6. record only after the scenario is known to work.

Do not claim “heavy rain” unless the application actually shows the relevant rainfall/weather condition.

Do not fabricate a storm for the demo.

If the planned route no longer produces the desired trade-off, select another supported route rather than changing the algorithm.

---

# 15. If the AI Explanation Fails

The application must still work.

The fallback hierarchy is:

```text
Deterministic route analysis
        ↓
Recommendation
        ↓
Evidence
        ↓
AI explanation (optional)
        ↓
If AI fails
        ↓
Deterministic explanation
```

For the demo:

### Preferred

Show the Strands/Ollama explanation successfully.

### Acceptable backup

Show the deterministic explanation and explicitly state:

> “The AI explanation is optional; the route decision and evidence remain fully deterministic.”

Never let an AI outage destroy the entire demo.

---

# 16. The Exact Demo Script

Use this as the rehearsal script, not necessarily as a word-for-word final voice-over.

### Opening

> “During Mumbai rain, the fastest route isn't always the route you want to take. MonsoonRoute compares route time with rainfall and known waterlogging exposure to recommend the better trade-off.”

### Input

> “I'll travel from Andheri to Bandra.”

### Result

> “The system generates the available routes and evaluates each one against the same environmental and travel-time criteria.”

### Recommendation

> “Here, the recommended route is slightly longer, but it has lower estimated environmental exposure.”

### Evidence

> “The important part is that we can see why: rainfall contributes to the environmental risk, and the route has different exposure to known waterlogging hotspots.”

### AI boundary

> “The decision was already made by the deterministic engine. Now I can ask the AI to explain that decision.”

### AWS

> “AWS fits through the open-source Strands Agents SDK, which is used only for this explanation layer. It does not choose or change the route.”

### Closing

> “MonsoonRoute turns environmental evidence into a route decision a commuter can act on.”

Keep the natural spoken version shorter if the video approaches three minutes.

---

# 17. The Demo Must Never Claim These Things

Never say:

- “This route is guaranteed safe.”
- “This predicts flooding.”
- “The AI chose the safest route.”
- “The AI checked Google Maps.”
- “The AI calculated the risk.”
- “This is a flood probability.”
- “These hotspots will definitely flood.”
- “The route is objectively safe.”
- “The model knows which road will flood.”

Use:

- “lower estimated environmental risk”;
- “lower estimated waterlogging exposure”;
- “better trade-off”;
- “recommended based on the analyzed evidence”;
- “historically documented waterlogging evidence”;
- “rain exposure/risk heuristic.”

---

# 18. What Makes the Demo Strong

The strongest moment is not the AI paragraph.

It is:

```text
FASTEST ROUTE
      ↓
higher environmental exposure
      ↓
ALTERNATIVE ROUTE
      ↓
small time penalty
      ↓
lower estimated exposure
      ↓
MONSOONROUTE RECOMMENDS IT
      ↓
EVIDENCE EXPLAINS WHY
```

Then AI adds a concise natural-language explanation.

The product's value is the **decision**, not the chatbot.

---

# 19. Final Pre-Recording Checklist

## Application

- [ ] Production build works.
- [ ] Final UI is stable.
- [ ] Map loads.
- [ ] Origin input works.
- [ ] Destination input works.
- [ ] Travel mode works.
- [ ] Route generation works.
- [ ] Weather works.
- [ ] Hotspots load.
- [ ] Recommendation appears.
- [ ] Evidence appears.
- [ ] Explain this decision works.

## Decision integrity

- [ ] Recommendation is produced by deterministic engine.
- [ ] AI cannot change recommendation.
- [ ] AI cannot recalculate risk.
- [ ] AI cannot invent evidence.
- [ ] AI cannot claim guaranteed safety.
- [ ] Deterministic fallback works.

## AWS

- [ ] Strands is actually used.
- [ ] The video visibly shows where Strands fits.
- [ ] The narration explains its limited role.
- [ ] No unused AWS service is claimed.

## Recording

- [ ] Stable route verified immediately before recording.
- [ ] Weather result verified.
- [ ] No API keys visible.
- [ ] No personal information visible.
- [ ] Audio tested.
- [ ] Cursor controlled.
- [ ] No unnecessary tabs/windows.
- [ ] Final video is under 3 minutes.
- [ ] YouTube visibility is public or unlisted.
- [ ] YouTube link works in a signed-out browser.

---

# 20. Final Rule

> **Do not try to make the demo impressive by showing everything. Make it impossible for the judge to misunderstand the one thing MonsoonRoute does well.**

```text
RAIN
 ↓
ROUTES
 ↓
WATERLOGGING EXPOSURE
 ↓
DETERMINISTIC DECISION
 ↓
RECOMMENDATION
 ↓
EVIDENCE
 ↓
OPTIONAL AI EXPLANATION
```

That is the demo.
