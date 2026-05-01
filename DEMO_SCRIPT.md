# Data-Synth Demo Script

> **Duration:** 3-5 minutes  
> **Audience:** Hackathon judges and stakeholders  
> **Goal:** Demonstrate the complete workflow from CSV upload to audit trail

## 🎬 Demo Flow

### Introduction (30 seconds)
"Hi! I'm demonstrating Data-Synth, an AI-powered data pipeline platform built with IBM Bob. It solves the alignment tax problem - the time wasted when business stakeholders and developers struggle to communicate about data transformations."

### Part 1: Upload & Schema Detection (60 seconds)

**Action:**
1. Open http://localhost:5173
2. Drag and drop `sample-data.csv` onto the upload area
3. Wait for upload to complete

**Narration:**
"First, I upload a CSV file. IBM Bob's first agent, the Schema Detective, automatically analyzes the data structure. Notice how it detects column types, identifies which are dimensions versus metrics, and provides confidence scores for each inference. The green badges show high confidence, while amber would indicate uncertainty."

**Key Points to Highlight:**
- ✅ Automatic schema detection
- ✅ Confidence scores (0-1 scale)
- ✅ Semantic understanding (dimension vs metric)
- ✅ Assumption cards explaining Bob's reasoning

### Part 2: Pipeline Generation (60 seconds)

**Action:**
1. Click "Approve Schema"
2. Click "Generate Pipeline"
3. Wait for pipeline generation
4. Show the generated code
5. Point to the bar chart

**Narration:**
"Now Bob's second agent, the Pipeline Generator, creates JavaScript transformation code automatically. This code converts our raw CSV into a format perfect for visualization. The pipeline executes in a sandboxed environment for security, and we immediately see our data as an interactive bar chart."

**Key Points to Highlight:**
- ✅ Automatic code generation
- ✅ Sandboxed execution (security)
- ✅ Immediate visualization
- ✅ Developer can inspect the code

### Part 3: Plain English Rules (90 seconds)

**Action:**
1. Scroll to "Modify Business Rules" section
2. Click example: "Exclude rows where value is less than 100"
3. Click "Apply Rule"
4. Show Bob's explanation
5. Point to updated chart
6. Try another rule: "Show only top 5 results"
7. Apply and show changes

**Narration:**
"Here's where it gets powerful. A business stakeholder - someone with zero coding knowledge - can modify the pipeline using plain English. Watch: I'll say 'Exclude rows where value is less than 100.' Bob's third agent, the Intent Translator, understands my request, modifies the code, and explains exactly what changed. The chart updates instantly."

"Let me try another: 'Show only top 5 results.' Again, Bob translates this into code, applies the change, and the visualization updates. No developer needed for these business logic changes."

**Key Points to Highlight:**
- ✅ Plain English interface
- ✅ No coding required
- ✅ Instant feedback
- ✅ Clear explanations of changes
- ✅ Real-time chart updates

### Part 4: Audit Trail & Documentation (60 seconds)

**Action:**
1. Scroll to "Audit Trail" section
2. Click "Expand" to show details
3. Click "Generate Session Summary"
4. Show the AI-generated summary
5. Click "Export Session Data"
6. Show the downloaded JSON file

**Narration:**
"Every single action is automatically logged in our audit trail. This is crucial for compliance and debugging. Bob's fourth agent can generate a comprehensive session summary in plain English - perfect for stakeholder reports."

"And we can export everything - the complete session history, all pipeline versions, every rule applied - as structured JSON. This means full traceability and the ability to reproduce any analysis."

**Key Points to Highlight:**
- ✅ Complete audit trail
- ✅ AI-generated summaries
- ✅ Export functionality
- ✅ Compliance-ready documentation

### Conclusion (30 seconds)

**Narration:**
"So in under 5 minutes, we've gone from raw CSV to interactive dashboard, applied business rules in plain English, and generated complete documentation - all powered by IBM Bob's four-agent system. This is what 'Turn Idea into Impact Faster' looks like in practice."

**Final Points:**
- ✅ 4-agent Bob system working together
- ✅ Reduces alignment tax from days to minutes
- ✅ Empowers non-technical stakeholders
- ✅ Maintains developer oversight
- ✅ Automatic documentation

## 📋 Pre-Demo Checklist

### Before Starting
- [ ] Backend server running (http://localhost:3001)
- [ ] Frontend server running (http://localhost:5173)
- [ ] Database initialized (check for data-synth.db)
- [ ] Sample CSV file ready (`backend/uploads/sample-data.csv`)
- [ ] Browser window open to frontend
- [ ] Screen recording software ready (if recording)

### Test Run
- [ ] Upload works smoothly
- [ ] Schema detection completes
- [ ] Pipeline generates successfully
- [ ] Chart renders correctly
- [ ] Rules apply without errors
- [ ] Summary generates
- [ ] Export downloads file

### Backup Plan
- [ ] Have screenshots ready if live demo fails
- [ ] Know how to restart servers quickly
- [ ] Have pre-recorded video as fallback

## 🎯 Key Messages

### Problem Statement
"The alignment tax - time wasted when business stakeholders and developers struggle to communicate about data transformations - costs organizations weeks of productivity."

### Solution
"Data-Synth uses IBM Bob's agentic AI to bridge this gap, letting stakeholders modify pipelines in plain English while maintaining full audit trails."

### Impact
"What used to take 2 days of back-and-forth now takes 2 minutes. And every decision is documented automatically."

## 🗣️ Talking Points

### Why IBM Bob?
- Multi-agent system perfect for complex workflows
- Each agent specializes in one task
- Agents work together seamlessly
- Built for enterprise reliability

### Technical Highlights
- Sandboxed code execution for security
- SQLite for zero-setup persistence
- React + TypeScript for type safety
- Mock mode for development without API keys

### Business Value
- Reduces time-to-insight
- Empowers non-technical users
- Maintains compliance
- Scales to complex scenarios

## 📊 Sample Data

The `sample-data.csv` contains:
- 10 rows of product data
- Columns: id, name, value, date, category
- Mix of dimensions and metrics
- Perfect for demonstrating filtering and sorting

## 🎥 Recording Tips

### Camera Setup
- Clean background
- Good lighting
- Stable camera position
- Test audio levels

### Screen Recording
- Use 1920x1080 resolution
- Record at 30fps minimum
- Include cursor highlights
- Zoom in on important details

### Editing
- Add title card with project name
- Include captions for key points
- Add background music (optional)
- Keep under 5 minutes total

## 🚨 Troubleshooting

### If Upload Fails
- Check backend server is running
- Verify CORS is enabled
- Check file size limits
- Try a different CSV file

### If Pipeline Doesn't Generate
- Check database connection
- Verify schema was saved
- Look at backend console logs
- Restart backend server

### If Chart Doesn't Render
- Check browser console for errors
- Verify data format is correct
- Refresh the page
- Clear browser cache

## ✅ Post-Demo

### Questions to Anticipate
1. **"Does it work with real IBM Bob?"**
   - Yes! Currently in mock mode for demo reliability, but designed for real IBM Bob SDK integration.

2. **"What about other file formats?"**
   - MVP focuses on CSV. JSON, Excel, and PDF are in the roadmap.

3. **"How does it handle conflicts?"**
   - Current version applies rules sequentially. Advanced conflict detection is Phase 2.

4. **"Is it production-ready?"**
   - This is an MVP demonstrating core concepts. Production would add auth, PostgreSQL, and cloud deployment.

5. **"How much does it cost?"**
   - Depends on IBM Bob usage. Mock mode is free for development.

---

**Demo Script Version:** 1.0  
**Last Updated:** May 2, 2026  
**Made with Bob** 🤖