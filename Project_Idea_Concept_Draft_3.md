# Project Memory: DataBridge

> **Hackathon Track:** IBM Bob — "Turn Idea into Impact Faster"
> **Focus:** Efficiency · Agentic Workflows · Developer-to-Stakeholder Alignment

---

## 1. Executive Summary

**Problem:**
Teams bleed velocity at two compounding bottlenecks — data janitoring and stakeholder alignment. A developer spends hours cleaning messy inputs (CSVs, JSON exports, PDF reports, email threads), then watches days disappear in back-and-forth over what the data actually means and what business rules to apply. Neither side has a shared source of truth, and decisions live in email chains that nobody re-reads.

**Solution:**
DataBridge is a **decision alignment tool disguised as a data dashboard.** Bring any messy input — CSV, JSON, PDF, or plain-text export. IBM Bob normalizes it, surfaces every assumption it makes, generates a validated transformation pipeline, and deploys a live dashboard. Stakeholders interact in plain English ("exclude weekends," "sum by region"). Bob translates their intent into code, flags conflicts, and auto-documents every agreed decision. Developers review diffs, not email. No stale docs. No alignment tax.

**IBM Technologies Used:**
- **IBM Bob SDK** — 4-agent pipeline: schema detection → code generation → intent translation → audit documentation
- **watsonx.ai** — rule parameterization and alternative business logic suggestion inside the Agreement Engine

---

## 2. What DataBridge Solves (The Core Insight)

The problem is not just "data cleaning is slow." The real problem is a **translation gap** between technical teams who build pipelines and non-technical stakeholders who define business logic. Each misalignment generates a feedback loop:

- Dev makes an assumption → stakeholder doesn't notice → wrong chart ships
- Stakeholder says "that's wrong" → dev asks for clarification → 2-day email thread
- Dev updates → stakeholder wants another change → repeat

DataBridge collapses this loop into a single session. Stakeholders see assumptions, flag them, propose changes in plain English, and watch the pipeline update in real time. Every decision is timestamped, documented, and replayable.

---

## 3. Input Sources (Not Just CSV)

DataBridge accepts any of the following as a starting point. Bob normalizes all of them into a unified schema before the pipeline runs:

| Input Type | Example | Bob's Role |
|---|---|---|
| CSV / TSV | Sales export from CRM | Detect schema, infer column intent |
| JSON | Salesforce API response, nested structures | Flatten hierarchy, map to schema |
| PDF | Finance quarterly report | Extract tables and key figures |
| Plain text / logs | Slack export, email thread | Identify structure, extract data points |
| Multi-source | Revenue CSV + Headcount JSON | Merge, surface key conflicts |

For all input types, Bob surfaces every inference it makes as a visible **Assumption Card** — so stakeholders know exactly what was decided automatically.

---

## 4. IBM Bob — 4-Agent Pipeline

Bob operates in four distinct roles across the DataBridge workflow:

**Agent 1 — Schema Detective**
Reads any input, infers data types, maps column semantics (numeric → metric, categorical → dimension, date → time axis), and returns a typed schema with confidence scores. Every inference is written to an Assumption Card visible to the stakeholder.

**Agent 2 — Pipeline Generator & Validator**
Writes a transformation pipeline calibrated to DataBridge's recharts component library and existing UI components. Validates the pipeline against a sample of the data and flags any rows that do not conform to the inferred schema.

**Agent 3 — Intent Translator**
Parses plain English stakeholder requests ("exclude test accounts," "sum by region, ignore Q4") and converts them into pipeline logic modifications. Generates a human-readable diff ("Changed: filter now excludes rows where account_type = 'test'") alongside the code diff for developer review.

**Agent 4 — Documentation & Audit Writer**
Appends every stakeholder decision to a timestamped audit trail. Generates a plain English summary of all changes made in a session — what changed, why, who requested it, and what the developer approved. Also generates the final "Export as Story" narrative for the submission deliverable.

---

## 5. watsonx.ai — Agreement Engine Extension

The Agreement Engine is the layer where stakeholders interact with business logic. watsonx.ai extends it beyond simple intent parsing:

**Rule Parameterization:**
Instead of describing rules ad-hoc each time, stakeholders define reusable rule templates:
*"Exclude [TIME_PERIOD] where [CONDITION] applies."*

watsonx.ai's foundation models take these templates and generate alternative variations the team may not have considered — e.g., "Exclude weekends" → "Also exclude regional public holidays? Weight by business days?" — surfaced as suggestions, not automatic changes.

**Conflict Detection:**
When two stakeholder requests produce contradictory pipeline logic, watsonx.ai flags the conflict and articulates it in plain English: *"Rule A excludes Q4. Rule B sums all quarters. These cannot both apply."* Bob then proposes resolution options for the developer to select.

**Why it earns the Creativity point:**
DataBridge does not just automate code — it automates **decision discovery**. The IBM stack is coherent: Bob handles intent and execution; watsonx handles hypothesis generation and conflict articulation.

---

## 6. Architecture

| Layer | Technology | Role |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Dashboard UI |
| UI Components | shadcn/ui | Enterprise-grade components, zero custom CSS |
| Charts | recharts | Fed by Bob-generated pipelines |
| Backend | Node.js + Express | API layer, pipeline orchestration |
| Database | PostgreSQL | Audit trail, session state, pipeline storage |
| AI — Core | IBM Bob SDK | All 4 agents (schema, pipeline, intent, docs) |
| AI — Agreement Engine | watsonx.ai | Rule parameterization, conflict detection |

---

## 7. Key UI Elements

**Confidence Score Badge** — Every column and every inference carries a confidence score. Low-confidence assumptions are highlighted in amber.

**Assumption Card** — A surfaced, visible card for every automatic decision Bob made. Stakeholder can approve, modify, or reject each one.

**What-If Simulator** — Stakeholder types a plain English rule change. Dashboard re-renders live with the proposed change before it is committed.

**Conflict Detector Panel** — Surfaces contradictory rules in plain English. Offers resolution options. Developer selects and approves.

**Decision Replay** — Full timestamped log of every assumption, request, conflict, and approval. Replayable session-by-session.

**Dev Review Pane** — Code diff view for every Bob-generated change. Developer approves or rejects before it is committed to the pipeline.

---

## 8. Rubric Alignment

| Judging Criteria | DataBridge Evidence |
|---|---|
| **Completeness (5)** | Full pipeline: multi-format input → schema detection → pipeline generation → live dashboard → stakeholder intent → conflict detection → dev review → audit log → export as story |
| **Creativity (5)** | Bob as 4-agent system + watsonx.ai for rule parameterization; solves the *people* problem, not just the *technical* one; multi-input normalization |
| **Design (5)** | shadcn/ui + Confidence Scores + Assumption Cards + What-If + Conflict Panel = stakeholder-ready, zero training required |
| **Effectiveness (5)** | Data prep: 4hr → 10min. Stakeholder alignment: 2 days → 1 session. Documentation: 1hr → 0min (auto-generated). Scales to any team with messy multi-source data. |

---

## 9. Build Phases

### Phase 1 — Input & Normalization Layer

**Goal:** Accept any input format and produce a normalized, typed schema.

Tasks:
- File upload component (CSV, JSON, PDF, plain text)
- Bob Agent 1: schema detection per input type, return typed schema as JSON
- Confidence Score calculation per column/field
- Assumption Card generation — one card per inference Bob makes
- Multi-source conflict surfacing: "Column 'customer_id' in CSV vs 'account_uuid' in JSON — which is authoritative?"

Bob interactions:
- `detect_schema(input)` → returns `{ columns, types, confidence_scores, assumptions[] }`
- `flag_conflicts(sources[])` → returns `{ conflicts[], resolution_options[] }`

Deliverables: Upload UI, schema viewer, Assumption Card component, conflict surface

---

### Phase 2 — Pipeline Generation & Validation

**Goal:** Generate a working, validated transformation pipeline from the normalized schema.

Tasks:
- Bob Agent 2: write transformation pipeline code targeting recharts data format
- Validate pipeline against sample rows — surface non-conforming rows
- Pipeline preview: show raw → transformed data side by side
- Developer can inspect generated code before it runs

Bob interactions:
- `generate_pipeline(schema, component_library)` → returns `{ pipeline_code, validation_report }`
- `validate_pipeline(pipeline, sample_data)` → returns `{ pass, failed_rows[], warnings[] }`

Deliverables: Pipeline code viewer, validation report panel, raw/transformed preview

---

### Phase 3 — Dashboard & Visualization

**Goal:** Render a live, recharts-based dashboard from the validated pipeline output.

Tasks:
- Bob Agent 2 (continued): generate recharts component definitions from schema
- Dashboard layout: charts auto-selected by data type (time series, bar, pie, table)
- Confidence Score badges on each chart — amber if Bob made a low-confidence inference
- Dashboard refreshes live when pipeline changes are committed

Bob interactions:
- `generate_chart_components(schema, recharts_library)` → returns React component definitions

Deliverables: Live dashboard, chart confidence badges, layout engine

---

### Phase 4 — Stakeholder Agreement Engine

**Goal:** Let non-technical stakeholders modify business logic in plain English without developer involvement.

Tasks:
- Plain English input field ("exclude weekends," "sum by region, ignore Q4")
- Bob Agent 3: parse intent → generate pipeline modification → write human-readable diff
- What-If Simulator: apply proposed change to dashboard live before committing
- watsonx.ai: take stakeholder intent, generate alternative rule suggestions
- Conflict Detector: compare new rule against existing rules, flag contradictions in plain English
- Offer conflict resolution options; developer selects

Bob interactions:
- `parse_intent(plain_english_request, current_pipeline)` → returns `{ pipeline_diff, human_readable_diff }`
- `detect_conflicts(rule_a, rule_b)` → returns `{ conflict_description, resolution_options[] }`

watsonx.ai interactions:
- `suggest_rule_variants(intent, context)` → returns `{ suggestions[], rationale }`

Deliverables: What-If Simulator, Conflict Detector panel, rule suggestion cards

---

### Phase 5 — Developer Review & Audit Trail

**Goal:** Give developers visibility and control over every AI-generated change; auto-document all decisions.

Tasks:
- Dev Review Pane: side-by-side code diff for every Bob-generated pipeline update
- Developer approves or rejects each change; rejections return to stakeholder with reason
- Bob Agent 4: on approval, append timestamped entry to audit trail
- Audit trail schema: `{ timestamp, session_id, stakeholder_request, pipeline_diff, approved_by, notes }`
- Decision Replay: browse full history of assumptions, requests, conflicts, approvals
- "Export as Story": Bob generates a plain English narrative of all decisions made in the session

Bob interactions:
- `write_audit_entry(decision)` → appends to project memory log
- `generate_session_narrative(audit_trail)` → returns plain English summary

Deliverables: Dev Review Pane, Audit Trail viewer, Decision Replay, Export as Story

---

### Phase 6 — Documentation & Submission Deliverables

**Goal:** Produce all written hackathon submission materials; ensure repo is clean and complete.

Tasks:
- README.md: project overview, setup instructions, architecture diagram, how to run
- Bob Report: export of all IBM Bob tasks/sessions used across all phases
- Problem & Solution Statement (500 words): lead with alignment tax, not just data prep; include target users, interaction model, differentiators
- IBM Bob Usage Statement: granular per-agent breakdown — what Bob was prompted with, what it returned, where the output went
- watsonx.ai Statement: Rule Parameterization and Conflict Detection specifics — prompts, outputs, integration with Agreement Engine
- GitHub repo: organized by phase, all generated code included, Bob report exported and committed

Deliverables: All written statements, clean repository, Bob export report

---

## 10. Coin Budget (Solo, 40 coins)

| Phase | Allocation | Breakdown |
|---|---|---|
| Phase 1 — Input & Normalization | 8 coins | Schema detection (3), Assumption Cards (2), Multi-source conflict (3) |
| Phase 2 — Pipeline Generation | 6 coins | Pipeline gen (3), Validation agent (2), Preview component (1) |
| Phase 3 — Dashboard | 6 coins | Chart generation (3), Confidence badges (2), Layout engine (1) |
| Phase 4 — Agreement Engine | 10 coins | Intent parser (3), What-If (2), Conflict Detector (2), watsonx integration (3) |
| Phase 5 — Dev Review & Audit | 6 coins | Dev pane (2), Audit trail (2), Export as Story (2) |
| Phase 6 — Documentation | 4 coins | README (1), Written statements (2), Repo cleanup (1) |
| **Total** | **40 coins** | |
