# Data-Synth: Streamlined MVP Plan

> **Hackathon Track:** IBM Bob — "Turn Idea into Impact Faster"  
> **Focus:** Efficiency · Agentic Workflows · Developer-to-Stakeholder Alignment  
> **Timeline:** 5 days (realistic hackathon scope)  
> **Strategy:** Demonstrate core value proposition with minimal viable features

---

## 🎯 MVP Core Value Proposition

**Single Sentence:** Upload a CSV, let IBM Bob detect the schema and generate a dashboard, then modify business rules in plain English while Bob documents every decision.

**What We're Proving:**
1. Bob can automate data pipeline creation (schema → transformation → visualization)
2. Non-technical stakeholders can modify business logic without writing code
3. Every decision is automatically documented for audit trails

**What We're NOT Building (Yet):**
- ❌ Multiple input formats (JSON, PDF, text, multi-source)
- ❌ Live What-If simulator with real-time preview
- ❌ Complex conflict detection across multiple rules
- ❌ Full developer approval workflow
- ❌ Rule parameterization templates
- ❌ Advanced watsonx.ai integration

---

## 🏗️ Simplified Architecture

| Layer | Technology | Scope |
|-------|-----------|-------|
| Frontend | React 18 + TypeScript + Vite | Single-page dashboard |
| UI Components | shadcn/ui | Pre-built components only |
| Charts | recharts | Bar chart + data table only |
| Backend | Node.js + Express | Minimal API (3-4 endpoints) |
| Database | SQLite | File-based (no PostgreSQL setup) |
| AI — Core | IBM Bob SDK | Schema detection + code generation |
| AI — Rules | watsonx.ai | Optional (mock responses if needed) |

**Key Simplifications:**
- SQLite instead of PostgreSQL (zero setup, file-based)
- Single chart type (bar chart) instead of auto-selection
- Mock watsonx.ai responses for demo reliability
- No authentication (single-user mode)
- No WebSocket (simple polling or manual refresh)

---

## 📦 Phase Breakdown (5 Days)

### **Phase 0: Foundation Setup** — Day 1 (6 hours)

**Goal:** Get development environment running with all dependencies.

**Tasks:**
1. Initialize Vite + React + TypeScript project
2. Install dependencies:
   - Frontend: `shadcn/ui`, `recharts`, `axios`, `react-router-dom`
   - Backend: `express`, `cors`, `multer`, `sqlite3`, `csv-parser`
   - IBM: `@ibm-cloud/watsonx-ai`, IBM Bob SDK
3. Setup project structure:
   ```
   /frontend
     /src
       /components
       /pages
       /lib
   /backend
     /routes
     /services
     /db
   ```
4. Create SQLite database with schema:
   ```sql
   CREATE TABLE sessions (
     id TEXT PRIMARY KEY,
     created_at DATETIME,
     filename TEXT,
     status TEXT
   );
   
   CREATE TABLE schemas (
     id TEXT PRIMARY KEY,
     session_id TEXT,
     columns JSON,
     confidence_scores JSON,
     FOREIGN KEY(session_id) REFERENCES sessions(id)
   );
   
   CREATE TABLE audit_log (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     session_id TEXT,
     timestamp DATETIME,
     action TEXT,
     details JSON,
     FOREIGN KEY(session_id) REFERENCES sessions(id)
   );
   ```
5. Setup IBM Bob SDK authentication
6. Create basic Express server with CORS
7. Test: Can frontend call backend? Can backend connect to SQLite?

**Deliverables:**
- ✅ Running dev servers (frontend + backend)
- ✅ Database initialized
- ✅ IBM SDK authenticated
- ✅ Basic health check endpoint working

**Bob Usage:** None (manual setup)

---

### **Phase 1: CSV Upload & Schema Detection** — Day 2 (8 hours)

**Goal:** User uploads CSV → Bob detects schema → Display results with confidence scores.

**Tasks:**

**Backend (4 hours):**
1. Create `/api/upload` endpoint using `multer`
2. Parse CSV using `csv-parser`
3. **Bob Integration #1:** Schema Detection
   - Prompt: "Analyze this CSV data and return a JSON schema with column names, inferred data types (string/number/date), semantic meaning (dimension/metric/time), and confidence scores (0-1) for each inference."
   - Input: First 100 rows of CSV
   - Output: `{ columns: [{name, type, semantic, confidence}], assumptions: [string] }`
4. Save schema to SQLite
5. Create `/api/schema/:sessionId` endpoint to retrieve schema

**Frontend (4 hours):**
1. Build file upload component (drag-and-drop using shadcn/ui)
2. Display upload progress
3. Show detected schema in table format:
   - Column name
   - Data type
   - Semantic meaning
   - Confidence badge (green >0.8, amber 0.5-0.8, red <0.5)
4. Display "Assumption Cards" — list of inferences Bob made
5. Add "Approve Schema" button

**Deliverables:**
- ✅ CSV upload working
- ✅ Bob detects schema with confidence scores
- ✅ Schema viewer UI
- ✅ Assumption cards displayed

**Bob Usage:**
- **Agent 1 (Schema Detective):** 1 task per upload
- **Estimated Bob calls:** 5-10 during development + testing

---

### **Phase 2: Pipeline Generation & Visualization** — Day 3 (8 hours)

**Goal:** Bob generates transformation pipeline → Renders bar chart → Shows code to developer.

**Tasks:**

**Backend (4 hours):**
1. **Bob Integration #2:** Pipeline Generation
   - Prompt: "Generate JavaScript transformation code that converts this CSV data into recharts bar chart format. The output should be an array of objects with x-axis labels and y-axis values. Include data validation and error handling."
   - Input: Schema from Phase 1 + sample data rows
   - Output: `{ pipeline_code: string, chart_config: {xAxis, yAxis, dataKey} }`
2. Execute pipeline code in sandboxed environment (use `vm2` or `isolated-vm`)
3. Validate output format
4. Create `/api/pipeline/:sessionId` endpoint
5. Create `/api/data/:sessionId` endpoint (returns transformed data)

**Frontend (4 hours):**
1. Build pipeline viewer (code syntax highlighting using `react-syntax-highlighter`)
2. Add "Generate Pipeline" button
3. Display loading state while Bob generates code
4. Show generated pipeline code in collapsible panel
5. Render bar chart using recharts with transformed data
6. Add confidence badge to chart (based on schema confidence)
7. Add "Regenerate" button if user wants different chart

**Deliverables:**
- ✅ Bob generates working transformation code
- ✅ Pipeline executes and transforms data
- ✅ Bar chart renders with real data
- ✅ Developer can view generated code

**Bob Usage:**
- **Agent 2 (Pipeline Generator):** 1 task per schema
- **Estimated Bob calls:** 10-15 during development + testing

---

### **Phase 3: Simple Rule Engine** — Day 4 (8 hours)

**Goal:** Stakeholder types plain English rule → Bob modifies pipeline → Chart updates.

**Tasks:**

**Backend (5 hours):**
1. **Bob Integration #3:** Intent Translation
   - Prompt: "The user wants to modify the data pipeline with this request: '{user_input}'. Current pipeline code: {pipeline_code}. Generate modified pipeline code and explain what changed in plain English."
   - Input: User's plain English request + current pipeline
   - Output: `{ modified_code: string, explanation: string, changes: [string] }`
2. Create `/api/rules/:sessionId` endpoint (POST to add rule)
3. Store rule in audit log
4. Re-execute modified pipeline
5. Return updated data + explanation

**Frontend (3 hours):**
1. Add "Modify Rules" input field (textarea)
2. Add example prompts:
   - "Exclude rows where value is less than 100"
   - "Sort by descending order"
   - "Show only top 10 results"
3. Display Bob's explanation of changes
4. Show before/after comparison (optional: side-by-side charts)
5. Update chart with new data
6. Add rule to audit log viewer (simple list)

**Deliverables:**
- ✅ User can type plain English rules
- ✅ Bob modifies pipeline code
- ✅ Chart updates with new data
- ✅ Changes are explained in plain English
- ✅ Audit log shows all rules applied

**Bob Usage:**
- **Agent 3 (Intent Translator):** 1 task per rule modification
- **Estimated Bob calls:** 10-20 during development + testing

**watsonx.ai (Optional):**
- If time permits, use watsonx.ai to suggest alternative rules
- Otherwise, show 2-3 hardcoded suggestions

---

### **Phase 4: Audit Trail & Documentation** — Day 5 (8 hours)

**Goal:** Complete audit trail, generate session summary, prepare demo and submission.

**Tasks:**

**Backend (2 hours):**
1. **Bob Integration #4:** Session Summary
   - Prompt: "Generate a plain English summary of this data analysis session. Include: original data source, schema detected, transformations applied, rules added, and final insights."
   - Input: Full audit log from session
   - Output: Markdown-formatted summary
2. Create `/api/summary/:sessionId` endpoint
3. Add export functionality (download audit log as JSON)

**Frontend (2 hours):**
1. Build audit trail viewer:
   - Timeline view of all actions
   - Expandable details for each entry
   - Timestamps
   - User-friendly descriptions
2. Add "Generate Summary" button
3. Display Bob's session summary
4. Add "Export Session" button (downloads JSON)

**Documentation (4 hours):**
1. Write comprehensive README.md:
   - Project overview
   - Setup instructions (step-by-step)
   - How to run demo
   - Architecture diagram (use Mermaid)
   - IBM Bob usage breakdown
   - Screenshots
2. Create demo script:
   - Sample CSV file
   - Pre-tested rules that work
   - Expected outputs
3. Record demo video (3-5 minutes)
4. Write submission documents:
   - Problem & Solution Statement (500 words)
   - IBM Bob Usage Report (export from Bob SDK)
   - watsonx.ai Integration (if used)
5. Clean up code:
   - Remove console.logs
   - Add comments
   - Format code
   - Update .gitignore

**Deliverables:**
- ✅ Complete audit trail viewer
- ✅ Session summary generation
- ✅ Export functionality
- ✅ README with setup instructions
- ✅ Demo video
- ✅ All submission documents
- ✅ Clean, documented codebase

**Bob Usage:**
- **Agent 4 (Documentation Writer):** 1 task per session
- **Estimated Bob calls:** 5-10 during development + testing

---

## 📊 Total Bob Usage Estimate

| Phase | Bob Tasks | Estimated Calls | Purpose |
|-------|-----------|----------------|---------|
| Phase 0 | 0 | 0 | Manual setup |
| Phase 1 | Schema Detection | 5-10 | Development + testing |
| Phase 2 | Pipeline Generation | 10-15 | Development + testing |
| Phase 3 | Intent Translation | 10-20 | Development + testing |
| Phase 4 | Documentation | 5-10 | Summaries + docs |
| **Total** | **4 Agent Types** | **30-55 calls** | **Full MVP** |

**BobCoin Optimization:**
- Use sample data during development (not full datasets)
- Cache Bob responses for identical inputs
- Test with small CSVs (100-1000 rows, not millions)
- Mock Bob responses for UI development
- Only call Bob when necessary (not on every file save)

---

## 🎨 UI Components (Minimal Set)

Using shadcn/ui components only (no custom CSS):

1. **Upload Page:**
   - File upload (drag-and-drop)
   - Progress indicator
   - Button (primary)

2. **Schema Viewer:**
   - Table
   - Badge (confidence scores)
   - Card (assumption cards)
   - Button (approve)

3. **Dashboard:**
   - Bar chart (recharts)
   - Code block (syntax highlighted)
   - Textarea (rule input)
   - Alert (Bob's explanations)

4. **Audit Trail:**
   - Timeline/List
   - Accordion (expandable entries)
   - Button (export)

**Total Components:** ~10 (all from shadcn/ui library)

---

## 🚫 Features Explicitly Cut (For MVP)

These are **intentionally excluded** to meet timeline and save BobCoins:

### Input Formats
- ❌ JSON parsing
- ❌ PDF extraction
- ❌ Plain text/log parsing
- ❌ Multi-source merging
- **Reason:** CSV covers 80% of use cases; others add 3-4 days of work

### Visualization
- ❌ Auto-chart selection (pie, line, scatter)
- ❌ Multiple charts per dashboard
- ❌ Interactive chart features (zoom, filter)
- **Reason:** Single bar chart proves concept; variety adds 2 days

### Agreement Engine
- ❌ Live What-If simulator with real-time preview
- ❌ Complex conflict detection across multiple rules
- ❌ Rule parameterization templates
- ❌ Concurrent stakeholder editing
- **Reason:** Simple rule modification proves value; advanced features add 3-4 days

### Developer Workflow
- ❌ Full approval/rejection workflow
- ❌ Code diff viewer with merge conflicts
- ❌ Rollback to previous versions
- **Reason:** Read-only code view sufficient for demo; workflow adds 2 days

### watsonx.ai Integration
- ❌ Real-time rule suggestions
- ❌ Advanced conflict articulation
- ❌ Hypothesis generation
- **Reason:** Can be mocked for demo; full integration adds 2-3 days

### Infrastructure
- ❌ PostgreSQL (using SQLite instead)
- ❌ Authentication/authorization
- ❌ Multi-user sessions
- ❌ WebSocket real-time updates
- ❌ Cloud deployment
- **Reason:** Local demo sufficient; production features add 3-4 days

**Total Time Saved:** 15-20 days → Reduced to 5 days

---

## 🎯 Success Criteria (MVP)

**Must Have (Demo Blockers):**
- ✅ Upload CSV file
- ✅ Bob detects schema with confidence scores
- ✅ Bob generates working pipeline code
- ✅ Bar chart renders with real data
- ✅ User can modify rules in plain English
- ✅ Bob updates pipeline based on rules
- ✅ Audit log shows all decisions
- ✅ Session summary generated

**Nice to Have (If Time Permits):**
- ⭐ watsonx.ai rule suggestions
- ⭐ Second chart type (data table)
- ⭐ Export to PDF
- ⭐ Better error handling

**Not Required (Future Work):**
- Multiple input formats
- Live What-If simulator
- Developer approval workflow
- Cloud deployment

---

## 🏆 Rubric Alignment (Streamlined)

| Criteria | MVP Evidence | Score Target |
|----------|-------------|--------------|
| **Completeness** | CSV → Schema → Pipeline → Chart → Rules → Audit | 4/5 |
| **Creativity** | Bob as 4-agent system; solves alignment problem | 4/5 |
| **Design** | shadcn/ui + Confidence Scores + Assumption Cards | 4/5 |
| **Effectiveness** | Data prep: 4hr → 10min; Alignment: 2 days → 1 session | 5/5 |

**Target Total:** 17/20 (85%) — Strong submission without overcommitting

---

## 🔧 Technical Decisions (Simplified)

### Why SQLite over PostgreSQL?
- Zero setup time (file-based)
- Perfect for single-user demo
- Easy to include in repo
- Can migrate to PostgreSQL later

### Why Single Chart Type?
- Proves core concept
- Reduces Bob complexity
- Faster development
- Can add more chart types post-hackathon

### Why Mock watsonx.ai?
- Reduces API dependencies
- Ensures demo reliability
- Saves BobCoins during testing
- Can swap in real API for final demo

### Why No Authentication?
- Not core to value proposition
- Adds 1-2 days of work
- Single-user demo sufficient
- Can add later for production

---

## 📝 Submission Checklist

**Code:**
- [ ] GitHub repo with clear structure
- [ ] README with setup instructions
- [ ] All dependencies in package.json
- [ ] .env.example with required keys
- [ ] Sample CSV file included
- [ ] Code comments for complex logic

**Documentation:**
- [ ] Problem & Solution Statement (500 words)
- [ ] IBM Bob Usage Report (exported from SDK)
- [ ] Architecture diagram (Mermaid)
- [ ] Screenshots of key features
- [ ] Demo video (3-5 minutes)

**Testing:**
- [ ] Test on fresh machine
- [ ] Verify all Bob integrations work
- [ ] Test with different CSV files
- [ ] Verify audit log completeness
- [ ] Check error handling

**Demo Prep:**
- [ ] Prepare demo script
- [ ] Test demo flow 3 times
- [ ] Have backup data ready
- [ ] Practice presentation

---

## 🚀 Post-Hackathon Roadmap

**Phase 2 (Future):**
- Add JSON input support
- Multiple chart types
- Live What-If simulator
- Developer approval workflow

**Phase 3 (Future):**
- PDF/text input parsing
- Multi-source data merging
- Advanced conflict detection
- Rule parameterization templates

**Phase 4 (Future):**
- PostgreSQL migration
- Authentication & multi-user
- Cloud deployment
- Real-time collaboration

---

## 💡 Key Insights

**What Makes This Achievable:**
1. **Focused scope** — One input format, one chart type, simple rules
2. **Proven tech stack** — React + Express + SQLite (no exotic dependencies)
3. **Bob does heavy lifting** — Schema detection, code generation, documentation
4. **Pre-built UI** — shadcn/ui eliminates CSS work
5. **Realistic timeline** — 5 days with buffer, not 2-3 days of crunch

**What Makes This Impressive:**
1. **Solves real problem** — Alignment tax is universal pain point
2. **Novel approach** — Decision alignment tool, not just data cleaner
3. **IBM tech showcase** — 4-agent Bob system + watsonx.ai
4. **Production-ready thinking** — Audit trail, confidence scores, explainability
5. **Scalable foundation** — Easy to add features post-hackathon

---

**Next Steps:**
1. Review this plan with team
2. Confirm IBM Bob SDK access and capabilities
3. Setup development environment (Day 1)
4. Begin Phase 1 implementation

**Questions to Resolve Before Starting:**
- Do we have IBM Bob SDK credentials?
- Do we have watsonx.ai API access?
- What sample CSV files should we use for testing?
- Who is responsible for each phase?
