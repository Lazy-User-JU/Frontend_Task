<div align="center">

# ✈️ Vacation Planner — Wall Calendar

### *Plan · Dream · Track*

> A **strikingly beautiful**, full-featured vacation planning application built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Framer Motion. Every interaction is thoughtfully animated; every pixel is intentionally crafted.

---

![Vacation Planner Preview](https://drive.google.com/file/d/1xqMHUav5_4bIjUiT3EmT_UuhARQGois_/view?usp=sharing)

---

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-brightgreen?logo=vercel&logoColor=white)](https://wallframetufplusplusone.vercel.app/)

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?logo=framer&logoColor=white)](https://www.framer.com/motion)

</div>

---

## 🌟 Overview

**Vacation Planner** is a premium, dark-themed vacation management interface built as a single-page application. It renders a stunning wall-calendar with month hero images, smooth Framer Motion animations, and a rich side panel for planning and tracking trips — all persisted to `localStorage` with zero backend required.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📅 **Interactive Wall Calendar** | Click to select date ranges with animated start/end markers and range highlighting |
| 🌄 **Dynamic Month Hero Images** | Each month displays a curated, full-bleed Unsplash photo banner |
| 🎨 **4 Live Themes** | Switch between Aurora 🌌, Rose 🌹, Ocean 🌊, and Forest 🌿 — each with animated ambient blobs |
| ✈️ **Trip Management** | Create, categorize, and delete trips across 8 vacation types |
| 📝 **Notes Per Trip** | Attach persistent notes to each date range selection |
| 🎉 **Holiday Markers** | US holidays are automatically shown on calendar dates |
| 📊 **Stats Dashboard** | Live stats bar showing trips planned, days planned, days selected, and next trip countdown |
| 🌠 **Star Field Background** | Deterministic star field renders behind animated blobs — no hydration mismatch |
| 💾 **LocalStorage Persistence** | All trips and notes survive page refreshes, no database needed |
| 📱 **Responsive Layout** | Adapts gracefully from desktop to tablet viewports |

---

## 🗂️ Frontend System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Next.js App Router                    │  │
│  │   app/layout.tsx  ──►  Google Fonts (Playfair + Inter)   │  │
│  │   app/page.tsx    ──►  <WallCalendar />                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              WallCalendar.tsx  ('use client')            │  │
│  │                                                          │  │
│  │  ┌───────────────┐  ┌────────────────┐  ┌────────────┐  │  │
│  │  │  AuroraBack-  │  │  StatsBar      │  │  ThemePicker│  │  │
│  │  │  ground       │  │  (4 counters)  │  │  (4 themes) │  │  │
│  │  │  (3 blobs +   │  └────────────────┘  └────────────┘  │  │
│  │  │   55 stars)   │                                       │  │
│  │  └───────────────┘  ┌──────────────────────────────────┐ │  │
│  │                     │          Main Layout             │ │  │
│  │  ┌───────────────┐  │  ┌──────────┐  ┌─────────────┐  │ │  │
│  │  │  Left Panel   │  │  │ Calendar │  │ Right Panel │  │ │  │
│  │  │  (My Trips)   │  │  │  Panel   │  │ PLAN TRIP / │  │ │  │
│  │  │               │  │  │          │  │   NOTES     │  │ │  │
│  │  │  • Trip list  │  │  │ • Hero   │  │             │  │ │  │
│  │  │  • VacType    │  │  │   image  │  │ • Date sel. │  │ │  │
│  │  │    badges     │  │  │ • Month/ │  │ • Trip form │  │ │  │
│  │  │  • Delete     │  │  │   year   │  │ • TripTypes │  │ │  │
│  │  │    button     │  │  │   picker │  │   grid      │  │ │  │
│  │  └───────────────┘  │  │ • Grid   │  └─────────────┘  │ │  │
│  │                     │  │ • Day    │                    │ │  │
│  │                     │  │   cells  │                    │ │  │
│  │                     │  └──────────┘                    │ │  │
│  │                     └──────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      State Layer                         │  │
│  │                                                          │  │
│  │   useState ──► theme, currentMonth, currentYear,         │  │
│  │                selStart, selEnd, vacations, notes,       │  │
│  │                rightTab, showVacForm                     │  │
│  │                                                          │  │
│  │   useEffect ──► localStorage read/write (hydration-safe) │  │
│  │   useCallback ──► handleDayClick, addVacation,           │  │
│  │                   deleteVacation, saveNote               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Persistence Layer                      │  │
│  │                                                          │  │
│  │   localStorage['wall_cal_vacations_v3'] ──► Vacation[]   │  │
│  │   localStorage['wall_cal_notes_{start}_{end}'] ──► Note[]│  │
│  └──────────────────────────────────────────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  External Resources                      │  │
│  │                                                          │  │
│  │   Unsplash CDN ──► 12 month hero images (w=900, q=85)    │  │
│  │   Google Fonts ──► Playfair Display + Inter              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

| Component | Responsibility |
|---|---|
| `AuroraBackground` | Renders 3 animated radial-gradient blobs + 55 deterministic stars as a fixed full-screen backdrop |
| `StatsBar` | Displays aggregate counts (trips, days, selection, next trip ETA) derived from state |
| `LeftPanel` | Lists all saved vacations grouped by type; handles deletions |
| `CalendarPanel` | Renders the hero image, month/year navigation, month-tab strip, year selector, and the 7-column date grid |
| `RightPanel` | Dual-tab panel — **Plan Trip** (form + trip type grid) and **Notes** (per-selection notepad) |
| `DayCell` | A single calendar cell; computes its own visual state (today, selected-start/end, in-range, has-vacation, holiday) from props |

### Data Flow

```
User clicks day
      │
      ▼
handleDayClick()
  selStart = null  ──► set selStart = clicked date
  selStart set     ──► set selEnd   = clicked date
                       (auto-swap if end < start)
      │
      ▼
Calendar re-renders
  DayCell receives: selStart, selEnd, vacations
  Computes: isStart, isEnd, inRange, vacs[]
      │
      ▼
RightPanel shows selection summary
User fills form ──► addVacation() ──► localStorage ──► state update
```

### Tech Stack Decisions

| Decision | Rationale |
|---|---|
| **Next.js App Router** | Zero-config SSR shell + client component isolation with `'use client'` |
| **`useState` only (no Redux/Zustand)** | All state lives in one component; prop-drilling is minimal and explicit |
| **Framer Motion** | Declarative animation API with `AnimatePresence` for mount/unmount transitions |
| **Tailwind CSS v4** | Utility-first, no runtime CSS-in-JS overhead, co-located with markup |
| **LocalStorage** | Self-contained; no API keys, no accounts, no backend infrastructure |
| **TypeScript strict types** | `ThemeKey`, `VacType`, `Vacation`, `Note`, `Theme` interfaces prevent runtime shape errors |

---

## 📁 Project Structure

```
takeUforward_frontend/
├── app/
│   ├── components/
│   │   └── WallCalendar.tsx   # Entire application — ~1 000 lines of pure craft
│   ├── globals.css            # Tailwind v4 base styles
│   ├── layout.tsx             # Root layout, font imports, metadata
│   └── page.tsx               # Entry point — renders <WallCalendar />
├── public/
│   └── preview.png            # App screenshot
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Running the Project Locally

### Prerequisites

Make sure you have the following installed:

- **Node.js** `>= 18.17` — [nodejs.org](https://nodejs.org)
- **npm** `>= 9` (comes with Node) or your preferred package manager

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/your-username/takeUforward_frontend.git
cd takeUforward_frontend
```

### Step 2 — Install dependencies

```bash
npm install
```

> Alternatively with other package managers:
> ```bash
> yarn install   # Yarn
> pnpm install   # pnpm
> bun install    # Bun
> ```

### Step 3 — Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app hot-reloads on every save.

---

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server with HMR |
| `npm run build` | Create an optimised production build |
| `npm start` | Serve the production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

### Environment

No `.env` file is required. The application is entirely client-side and uses:
- **Unsplash** public image URLs (no API key needed)
- **Google Fonts** via `<link>` in the layout head
- **localStorage** for all persistence

---

## 🎨 Themes

| Theme | Palette | Mood |
|---|---|---|
| 🌌 **Aurora** | Violet · Indigo · Cyan | Cosmic, deep-space elegance |
| 🌹 **Rose** | Crimson · Rose · Orange | Warm, passionate, romantic |
| 🌊 **Ocean** | Sky · Teal · Navy | Serene, expansive, oceanic |
| 🌿 **Forest** | Emerald · Green · Amber | Natural, grounded, tranquil |

---

## 🗺️ Trip Types

`Beach` · `Mountain` · `City` · `Road Trip` · `Family` · `Work Trip` · `Adventure` · `Cruise`

Each type carries its own colour palette, gradient, and emoji — rendered throughout the trip list, calendar overlays, and the trip-type selector grid.

---

## 🔮 Future Roadmap

- [ ] Cloud sync via Supabase or Firebase
- [ ] Export trips to `.ics` calendar format
- [ ] Multi-user support with auth
- [ ] Mobile-first responsive overhaul
- [ ] AI-powered destination suggestions

---

<div align="center">

Crafted with precision and passion — because great tools deserve great design.

**© 2026 — Vacation Planner**

</div>
