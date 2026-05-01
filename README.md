# Data-Synth MVP

> **IBM Bob Hackathon Project** - Turn Idea into Impact Faster

A streamlined data analysis tool that uses IBM Bob to automate data pipeline creation, enable non-technical stakeholders to modify business logic in plain English, and automatically document every decision.

## 🎯 Project Overview

**Core Value Proposition:** Upload a CSV, let IBM Bob detect the schema and generate a dashboard, then modify business rules in plain English while Bob documents every decision.

**What We're Proving:**
1. Bob can automate data pipeline creation (schema → transformation → visualization)
2. Non-technical stakeholders can modify business logic without writing code
3. Every decision is automatically documented for audit trails

## 🏗️ Architecture

```
Data-Synth/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utility functions
│   └── package.json
│
├── backend/           # Node.js + Express
│   ├── routes/        # API endpoints
│   ├── services/      # Business logic & IBM SDK
│   ├── db/            # SQLite database
│   └── server.js
│
└── README.md
```

## 🚀 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + TypeScript + Vite | Single-page dashboard |
| UI Components | Tailwind CSS | Styling framework |
| Charts | recharts | Data visualization |
| Backend | Node.js + Express | REST API |
| Database | SQLite | File-based storage |
| AI Core | IBM watsonx.ai | Schema detection + code generation |

## 📦 Phase 0: Foundation Setup ✅

**Status:** COMPLETED

### Deliverables Achieved:
- ✅ Vite + React + TypeScript project initialized
- ✅ Frontend dependencies installed (recharts, axios, react-router-dom)
- ✅ Tailwind CSS configured
- ✅ Backend Express server created
- ✅ Backend dependencies installed (express, cors, multer, sqlite3, csv-parser)
- ✅ IBM watsonx.ai SDK installed
- ✅ SQLite database initialized with schema:
  - `sessions` table
  - `schemas` table
  - `audit_log` table
- ✅ IBM SDK service with mock mode support
- ✅ Health check endpoint working
- ✅ Both dev servers running successfully

### Running Servers:
- **Backend:** http://localhost:3001
- **Frontend:** http://localhost:5173
- **Health Check:** http://localhost:3001/api/health

## 🛠️ Setup Instructions

### Prerequisites
- Node.js v18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd IBM_Bob_Data-Synth
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file (optional - will run in mock mode without it)
   cp .env.example .env
   # Edit .env with your IBM credentials
   
   # Start backend server
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   
   # Start frontend dev server
   npm run dev
   ```

4. **Verify Setup**
   - Backend: http://localhost:3001/api/health
   - Frontend: http://localhost:5173

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# IBM watsonx.ai Configuration
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Server Configuration
PORT=3001
NODE_ENV=development
```

**Note:** The application will run in mock mode if IBM credentials are not configured, allowing development and testing without API access.

## 📊 Database Schema

### Sessions Table
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  filename TEXT,
  status TEXT
);
```

### Schemas Table
```sql
CREATE TABLE schemas (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  columns TEXT,
  confidence_scores TEXT,
  FOREIGN KEY(session_id) REFERENCES sessions(id)
);
```

### Audit Log Table
```sql
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  action TEXT,
  details TEXT,
  FOREIGN KEY(session_id) REFERENCES sessions(id)
);
```

## 🎯 Development Roadmap

### Phase 1: CSV Upload & Schema Detection (Day 2)
- [ ] CSV upload endpoint
- [ ] Bob schema detection integration
- [ ] Schema viewer UI
- [ ] Confidence scores display

### Phase 2: Pipeline Generation & Visualization (Day 3)
- [ ] Bob pipeline generation
- [ ] Code execution sandbox
- [ ] Bar chart rendering
- [ ] Code viewer component

### Phase 3: Simple Rule Engine (Day 4)
- [ ] Plain English rule input
- [ ] Bob intent translation
- [ ] Pipeline modification
- [ ] Audit log viewer

### Phase 4: Audit Trail & Documentation (Day 5)
- [ ] Session summary generation
- [ ] Export functionality
- [ ] Demo video
- [ ] Final documentation

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Data-Synth Backend is running",
  "timestamp": "2026-05-01T22:44:52.597Z"
}
```

### Database Verification
The database file is created at `backend/db/data-synth.db` when the server starts.

## 🤝 Contributing

This is a hackathon project. For the MVP phase, we're focusing on core functionality only.

## 📝 License

MIT

## 🏆 Hackathon Information

- **Track:** IBM Bob — "Turn Idea into Impact Faster"
- **Timeline:** 5 days
- **Focus:** Efficiency · Agentic Workflows · Developer-to-Stakeholder Alignment

---

**Phase 0 Completed:** 2026-05-01  
**Next Phase:** CSV Upload & Schema Detection