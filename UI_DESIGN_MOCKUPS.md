# Data-Synth UI Design Mockups & Wireframes

> **Visual Design Specifications**  
> **Date:** May 2, 2026  
> **Version:** 1.0

---

## 🎨 Design System Visual Guide

### Color Palette Visualization

#### Primary Colors (Blue)
```
┌─────────────────────────────────────────────────────────┐
│ 50  │ 100 │ 200 │ 300 │ 400 │ 500 │ 600 │ 700 │ 800 │ 900│
│#eff6ff│#dbeafe│#bfdbfe│#93c5fd│#60a5fa│#3b82f6│#2563eb│#1d4ed8│#1e40af│#1e3a8a│
└─────────────────────────────────────────────────────────┘
```

#### Semantic Colors
```
Success (Green):  #22c55e ✓
Warning (Amber):  #f59e0b ⚠
Error (Red):      #ef4444 ✗
Info (Blue):      #3b82f6 ℹ
```

---

## 📐 Layout Structure

### Desktop Layout (1280px+)
```
┌────────────────────────────────────────────────────────────┐
│  Header (72px)                                    [Theme] │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Logo + Title                    [Upload New File]    │ │
│  └──────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────┤
│  Phase Indicator (80px)                                    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ① Upload  ──→  ② Pipeline  ──→  ③ Rules  ──→  ④ Audit│ │
│  └──────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────┤
│  Main Content Area (flexible)                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │  [Component Content Here]                             │ │
│  │                                                        │ │
│  │                                                        │ │
│  └──────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────┤
│  Footer (64px)                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ © 2026 Data-Synth          Phase X of 4    [Help]   │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)
```
┌──────────────────────┐
│  Header (64px)       │
│  ┌────────────────┐  │
│  │ ☰  Data-Synth  │  │
│  └────────────────┘  │
├──────────────────────┤
│  Phase Pills         │
│  ┌────────────────┐  │
│  │ ① ② ③ ④        │  │
│  └────────────────┘  │
├──────────────────────┤
│  Content (scroll)    │
│  ┌────────────────┐  │
│  │                │  │
│  │  [Component]   │  │
│  │                │  │
│  └────────────────┘  │
├──────────────────────┤
│  Bottom Nav (56px)   │
│  ┌────────────────┐  │
│  │ 📤 📊 ✨ 📋    │  │
│  └────────────────┘  │
└──────────────────────┘
```

---

## 🎯 Component Mockups

### 1. Enhanced FileUpload Component

#### Default State
```
┌────────────────────────────────────────────────────┐
│                                                    │
│              ┌─────────────────┐                   │
│              │                 │                   │
│              │    📁 Upload    │                   │
│              │                 │                   │
│              └─────────────────┘                   │
│                                                    │
│         Drop your CSV file here                    │
│         or click to browse                         │
│                                                    │
│         Maximum file size: 10MB                    │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ 📊 Sample Data    📈 Sales Data    📉 Test   │ │
│  └──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

#### Drag Over State (Animated)
```
┌────────────────────────────────────────────────────┐
│  ╔══════════════════════════════════════════════╗  │
│  ║                                              ║  │
│  ║         ┌─────────────────┐                  ║  │
│  ║         │                 │                  ║  │
│  ║         │  📁 Drop Here   │  ← Pulsing       ║  │
│  ║         │                 │                  ║  │
│  ║         └─────────────────┘                  ║  │
│  ║                                              ║  │
│  ║      Release to upload your file            ║  │
│  ║                                              ║  │
│  ╚══════════════════════════════════════════════╝  │
└────────────────────────────────────────────────────┘
```

#### Uploading State
```
┌────────────────────────────────────────────────────┐
│                                                    │
│              Uploading sales-data.csv              │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │████████████████████░░░░░░░░░░░░░░░░░░░░░░░░│ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│         65% • 2.3 MB of 3.5 MB • 1.2 MB/s         │
│                                                    │
│              [Cancel Upload]                       │
└────────────────────────────────────────────────────┘
```

#### Success State (with animation)
```
┌────────────────────────────────────────────────────┐
│                                                    │
│              ┌─────────────────┐                   │
│              │                 │                   │
│              │    ✓ Success    │  ← Bounce in      │
│              │                 │                   │
│              └─────────────────┘                   │
│                                                    │
│         sales-data.csv uploaded successfully       │
│         5,234 rows • 8 columns detected            │
│                                                    │
│              [View Schema →]                       │
└────────────────────────────────────────────────────┘
```

---

### 2. Enhanced SchemaViewer Component

```
┌──────────────────────────────────────────────────────────────┐
│  Schema Detected                          [Approve Schema]   │
│  File: sales-data.csv • 5,234 rows                           │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 🔍 Search columns...                    [Filter ▼]     │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│  Column Name    │ Type      │ Semantic  │ Confidence        │
│  ───────────────┼───────────┼───────────┼──────────────────│
│  id             │ integer   │ dimension │ ████████░ 92%    │
│  product_name   │ string    │ dimension │ ████████░ 95%    │
│  price          │ float     │ metric    │ ███████░░ 88%    │
│  date           │ datetime  │ time      │ █████████ 98%    │
│  category       │ string    │ dimension │ ████████░ 91%    │
│  quantity       │ integer   │ metric    │ ████████░ 94%    │
│  revenue        │ float     │ metric    │ ████████░ 96%    │
│  region         │ string    │ dimension │ ███████░░ 87%    │
├──────────────────────────────────────────────────────────────┤
│  💡 Bob's Assumptions                                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 1. Date column represents transaction timestamps       │  │
│  │ 2. Revenue is calculated as price × quantity           │  │
│  │ 3. Category has 5 distinct values                      │  │
│  │ 4. Region indicates geographical sales area            │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│  📊 Statistics                                               │
│  ┌──────────┬──────────┬──────────┐                         │
│  │ Columns  │ Avg Conf │ Rows     │                         │
│  │    8     │   93%    │  5,234   │                         │
│  └──────────┴──────────┴──────────┘                         │
└──────────────────────────────────────────────────────────────┘
```

---

### 3. Enhanced Dashboard Component

```
┌──────────────────────────────────────────────────────────────┐
│  Data Visualization                    [Chart Type ▼] [⚙️]   │
│  Interactive bar chart of transformed data                   │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Chart Types: [Bar] Line Pie Scatter Area Heatmap      │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────┬──────────┬──────────┐                         │
│  │ Items    │ Avg Value│ Max Value│                         │
│  │   10     │  245.3   │  420.0   │                         │
│  └──────────┴──────────┴──────────┘                         │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │  500│                                    ▄             │  │
│  │  400│                          ▄         █             │  │
│  │  300│              ▄           █    ▄    █             │  │
│  │  200│    ▄         █    ▄      █    █    █             │  │
│  │  100│    █    ▄    █    █      █    █    █    ▄        │  │
│  │    0└────┴────┴────┴────┴──────┴────┴────┴────┴────    │  │
│  │      A    B    C    D    E     F    G    H    I        │  │
│  │                                                        │  │
│  │  [Zoom] [Pan] [Reset] [Export PNG] [Fullscreen]      │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│  📊 Data Preview (Top 5)                    [View All →]    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Label        │ Value                                   │  │
│  │──────────────┼─────────────────────────────────────────│  │
│  │ Product A    │ 150.00                                  │  │
│  │ Product B    │ 230.00                                  │  │
│  │ Product C    │ 180.00                                  │  │
│  │ Product D    │  95.00                                  │  │
│  │ Product E    │ 310.00                                  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

### 4. Enhanced PipelineViewer Component

```
┌──────────────────────────────────────────────────────────────┐
│  Transformation Pipeline              [🔄 Regenerate] [💾]   │
│  Generated code to transform your data                       │
├──────────────────────────────────────────────────────────────┤
│  ⚙️ Chart Configuration                                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ X-Axis: label  │  Y-Axis: value  │  Data Key: value   │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│  ▶ View Generated Code (42 lines)        [Copy] [Download]  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  1  function transformData(data) {                     │  │
│  │  2    return data                                      │  │
│  │  3      .filter(row => row.value > 0)                 │  │
│  │  4      .map(row => ({                                │  │
│  │  5        label: row.name,                            │  │
│  │  6        value: parseFloat(row.value)                │  │
│  │  7      }))                                            │  │
│  │  8      .sort((a, b) => b.value - a.value)            │  │
│  │  9      .slice(0, 10);                                │  │
│  │ 10  }                                                  │  │
│  │                                                        │  │
│  │  [Show More ▼]                                        │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│  💡 Developer Note                                           │
│  This code is executed in a sandboxed environment for       │
│  security. Review before deploying to production.           │
└──────────────────────────────────────────────────────────────┘
```

---

### 5. Enhanced RuleModifier Component

```
┌──────────────────────────────────────────────────────────────┐
│  Modify Rules                                                │
│  Describe changes in plain English and Bob will update      │
├──────────────────────────────────────────────────────────────┤
│  💡 Example Rules:                                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [Exclude < 100] [Top 10] [Sort Asc] [Filter > 200]    │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│  Your Rule:                                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Show only products with revenue greater than $500      │  │
│  │                                                        │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  [✨ Apply Rule]                                             │
├──────────────────────────────────────────────────────────────┤
│  ✅ Bob's Explanation:                                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ I've filtered the dataset to show only products with  │  │
│  │ revenue exceeding $500. This reduced the dataset from │  │
│  │ 10 items to 4 items.                                  │  │
│  │                                                        │  │
│  │ Changes Applied:                                       │  │
│  │ • Added filter: revenue > 500                         │  │
│  │ • Updated chart to show 4 items                       │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

### 6. Enhanced AuditLog Component

```
┌──────────────────────────────────────────────────────────────┐
│  Audit Trail                          [▶ Expand] [🔍 Search] │
│  Complete history of all actions and decisions               │
├──────────────────────────────────────────────────────────────┤
│  [📋 Generate Summary] [💾 Export Session]                   │
├──────────────────────────────────────────────────────────────┤
│  Timeline View:                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │  ●───────────────────────────────────────────────────  │  │
│  │  │ 🆕 Session Created                                 │  │
│  │  │ May 2, 2026 2:15 PM                                │  │
│  │  │                                                    │  │
│  │  ●───────────────────────────────────────────────────  │  │
│  │  │ 📤 File Uploaded                                   │  │
│  │  │ May 2, 2026 2:16 PM                                │  │
│  │  │ File: sales-data.csv                               │  │
│  │  │                                                    │  │
│  │  ●───────────────────────────────────────────────────  │  │
│  │  │ 🔍 Schema Detected                                 │  │
│  │  │ May 2, 2026 2:16 PM                                │  │
│  │  │ Columns Detected: 8                                │  │
│  │  │                                                    │  │
│  │  ●───────────────────────────────────────────────────  │  │
│  │  │ ⚙️ Pipeline Generated                              │  │
│  │  │ May 2, 2026 2:17 PM                                │  │
│  │  │ Rows Transformed: 10                               │  │
│  │  │                                                    │  │
│  │  ●───────────────────────────────────────────────────  │  │
│  │  │ ✨ Rule Applied                                    │  │
│  │  │ May 2, 2026 2:18 PM                                │  │
│  │  │ Rule: "Filter values greater than 200"            │  │
│  │  │ Changes: Added filter condition                   │  │
│  │  │                                                    │  │
│  │  [Load More ▼]                                        │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 🌙 Dark Mode Comparison

### Light Mode Header
```
┌────────────────────────────────────────────────────────────┐
│  🔵 Data-Synth                          [Upload New File]  │
│  Powered by IBM Bob                                        │
└────────────────────────────────────────────────────────────┘
Background: #ffffff
Text: #111827
Border: #e5e7eb
```

### Dark Mode Header
```
┌────────────────────────────────────────────────────────────┐
│  🔵 Data-Synth                          [Upload New File]  │
│  Powered by IBM Bob                                        │
└────────────────────────────────────────────────────────────┘
Background: #0f172a
Text: #f1f5f9
Border: #334155
```

---

## 📱 Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Stacked components
- Bottom navigation
- Simplified charts
- Touch-optimized controls

### Tablet (640px - 1024px)
- Two column layout
- Side navigation
- Optimized charts
- Touch + mouse support

### Desktop (> 1024px)
- Multi-column layout
- Full navigation
- Advanced charts
- Keyboard shortcuts

---

## ✨ Animation Examples

### Button Hover
```
Default:     [Button]
Hover:       [Button] ← Scale 1.02, Shadow increase
Active:      [Button] ← Scale 0.98
```

### Card Hover
```
Default:     ┌─────────┐
             │ Content │
             └─────────┘

Hover:       ┌─────────┐ ← Lift up 4px
             │ Content │    Shadow increase
             └─────────┘
```

### Loading Spinner
```
Frame 1:  ◐
Frame 2:  ◓
Frame 3:  ◑
Frame 4:  ◒
(Continuous rotation)
```

### Success Checkmark
```
Frame 1:  ○
Frame 2:  ◔
Frame 3:  ◑
Frame 4:  ◕
Frame 5:  ● → ✓ (Bounce in)
```

---

## 🎯 Interactive States

### Button States
```
Default:    [Button]
Hover:      [Button] ← Lighter background
Focus:      [Button] ← Blue ring
Active:     [Button] ← Darker background
Disabled:   [Button] ← Gray, no interaction
Loading:    [⏳ Loading...] ← Spinner
```

### Input States
```
Default:    [____________]
Focus:      [____________] ← Blue border
Error:      [____________] ← Red border + message
Success:    [____________] ← Green border + checkmark
Disabled:   [____________] ← Gray background
```

---

## 🎨 Icon System

### Action Icons
```
📤 Upload    📥 Download   💾 Save      🔄 Refresh
✏️ Edit      🗑️ Delete     ➕ Add       ✓ Confirm
✗ Cancel     ⚙️ Settings   🔍 Search    📊 Chart
📋 List      📈 Analytics  🎨 Theme     ❓ Help
```

### Status Icons
```
✓ Success    ⚠ Warning     ✗ Error     ℹ Info
⏳ Loading    ⏸ Paused      ▶ Play      ⏹ Stop
```

---

## 📐 Spacing Examples

### Component Spacing
```
┌────────────────────────────────────┐
│  ↕ 24px padding                    │
│  ┌──────────────────────────────┐  │
│  │ ↔ 16px                       │  │
│  │                              │  │
│  │  Content                     │  │
│  │                              │  │
│  │  ↕ 12px gap between items    │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│  ↕ 24px padding                    │
└────────────────────────────────────┘
```

---

## 🎓 Onboarding Tour Mockup

### Step 1: Welcome
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│              Welcome to Data-Synth! 👋                     │
│                                                            │
│  Transform your CSV data into insights with AI-powered    │
│  pipelines. Let's take a quick tour!                      │
│                                                            │
│              [Skip Tour]  [Start Tour →]                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Step 2: Upload Highlight
```
┌────────────────────────────────────────────────────────────┐
│  ╔══════════════════════════════════════════════════════╗  │
│  ║                                                      ║  │
│  ║  📤 Upload Your CSV File                             ║  │
│  ║                                                      ║  │
│  ║  Drag and drop or click to browse                   ║  │
│  ║                                                      ║  │
│  ╚══════════════════════════════════════════════════════╝  │
│                                                            │
│  💡 Start by uploading a CSV file                          │
│  Bob will automatically detect the schema                  │
│                                                            │
│  [← Back]  [Next →]  [Skip]                                │
└────────────────────────────────────────────────────────────┘
```

---

## 🔧 Component Library Preview

### Button Variants
```
Primary:    [Primary Button]
Secondary:  [Secondary Button]
Outline:    [Outline Button]
Ghost:      [Ghost Button]
Link:       [Link Button]
Danger:     [Danger Button]
```

### Card Variants
```
Default:    ┌─────────────┐
            │   Content   │
            └─────────────┘

Elevated:   ┌─────────────┐ ← Shadow
            │   Content   │
            └─────────────┘

Bordered:   ┏━━━━━━━━━━━━━┓ ← Thick border
            ┃   Content   ┃
            ┗━━━━━━━━━━━━━┛
```

### Badge Variants
```
Default:    [Badge]
Success:    [Success]
Warning:    [Warning]
Error:      [Error]
Info:       [Info]
```

---

*Made with Bob - Designing for Excellence* 🎨