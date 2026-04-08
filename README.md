# 🧠 Bron Dashboard — Cyber OS Productivity Hub

A hyper-minimal productivity OS built with pure Vanilla JavaScript.

## 🚀 Features

* Orbital HUD Interface (no sidebar/nav)
* Pomodoro Engine
* Task Manager
* Habit Tracker (14-day matrix)
* Notes System
* Synthesized Ambient Audio (no external files)

## ⚙️ Tech

* Vanilla JS (ES6 Modules)
* CSS3 (3D transforms, grid, math)
* Web Audio API# 🎓 Bron Dashboard — Student OS

A student-focused productivity system designed to simplify studying, track progress, and build consistent habits.

This is a specialized branch of **Bron Dashboard**, reimagined for real-world student use.

---

## 🚀 Overview

Student OS transforms productivity into a structured and distraction-free experience by combining essential tools into a single dashboard.

Instead of scattered apps, everything a student needs is available in one place:

* Study sessions
* Assignments tracking
* Habit building
* Notes and quick references

---

## ✨ Features

### 🧠 Study Timer

* Focused 25-minute sessions (Pomodoro-style)
* One-click start for instant productivity
* Designed as the primary action element

### 📚 Assignments Tracker

* Track pending tasks
* Simple and minimal task management
* Clear visibility of workload

### 🔥 Streaks (Habit System)

* Monitor daily habits
* Track consistency and build discipline
* Motivational streak indicators

### 📝 Notes

* Quick reference system
* Lightweight and distraction-free

### 🌿 Focus Reset (Calm Mode)

* Short breathing/reset utility
* Helps reduce stress during study sessions

---

## 🎯 Design Philosophy

* **Minimal friction** — everything accessible in 1–2 clicks
* **Clarity over complexity** — no unnecessary features
* **Focus-first UI** — designed to guide users toward action
* **Student-centric language** — intuitive and relatable

---

## 🏗️ Tech Stack

* Vanilla JavaScript (ES6 Modules)
* CSS3 (Grid, Transforms, Custom UI)
* Web APIs (LocalStorage, Audio)
* No frameworks, no dependencies

---

## ⚡ How to Run

Because this project uses ES6 modules, run it with a local server:

```bash
npx serve .
```

Open:
http://localhost:3000

---

## 🌿 Branch Info

This is the **student-os** branch.

* `main` → Experimental Cyber OS (original concept)
* `student-os` → Practical student-focused version

---

## 🔮 Future Scope

* Daily goals & progress tracking
* Timetable integration
* Cloud sync (multi-device support)
* Teacher dashboard (assignment distribution)
* Analytics for study patterns
* Command-based navigation system

---

## 🧠 Vision

To evolve into a **“Student Productivity Operating System”** that helps learners stay focused, organized, and consistent.

---

## ⚠️ Status

🚧 Work in Progress — actively being improved and refined.

---

## 🤝 Contribution

Open to feedback and ideas to improve usability and impact.

---

## ⚡ Tagline

**Not just a dashboard — a system for focused students.**

* LocalStorage (state)

## 🧪 Run Locally

```bash
npx serve .
```

Open: http://localhost:3000

## 🧠 Concept

This project explores spatial UI instead of traditional dashboards.

---

⚡ Built as an experiment in system-driven productivity.
=======
# Bron Dashboard: Cyber-OS Productivity Hub

A hyper-minimal, zero-dependency productivity command center built with pure Vanilla JavaScript and CSS3. 
This application ditches conventional web-app rectangles and sidebars in favor of an **Orbital Spatial HUD**, 3D parallax rendering, and synthesized auditory feedback.

## 🏗️ Architecture & Philosophy
This project proves what is possible without frameworks (React/Vue/Tailwind). By relying entirely on ES6 Modules, raw DOM manipulation, and CSS grids/math, the app is blisteringly fast and deeply integrated.

- **Zero-Nav Spatial Routing**: There is no persistent `sidebar` or `navbar`. The app routes contextually. You begin at the "Hub" and click an orbital widget to dive into a specific isolated view. Pressing `ESC` triggers a global event listener to dissolve the view and return you to the Hub.
- **Orbital HUD Typography**: Instead of a standard CSS Grid, the Master Dashboard calculates exact Polar coordinates based on the number of active utility modules, injecting them into a perfect CSS absolute-positioned orbit via trigonometric `Math.sin`/`Math.cos` transformations.
- **State Management**: Zero database overhead. The entire application's state (Habit streaks, Task completion, Notes, custom Audio URLs) relies on a custom `Storage` wrapper built over `window.localStorage`. State is serialized as JSON strings.

## 🎛️ The 6 Productivity Modules

### 1. The Core (Pomodoro Engine)
An SVG-animated ring that tracks focus logic. It handles standard 25-minute sprints and 5-minute cooldown phases strictly mapping `setInterval` deltas.

### 2. Task Uplink
A brutalist task manager that persists arrays of text strings and booleans. Includes seamless contextual routing (e.g. clicking `+` on the Hub instantly navigates to Tasks and focuses the absolute input element).

### 3. Habit Tracker Matrix
A 14-day rolling matrix that calculates continuity. It builds dynamic CSS grids based on UNIX timestamps to verify if a user has checked off a specific habit on any isolated sequential day.

### 4. Memory Buffer (Notes)
A digital scratchpad utilizing a Masonry-style layout. Uses dynamic internal search algorithms to filter subsets of raw text data on the fly. 

### 5. Auditory Matrix (Synthesized & Headless Context)
- **Synthetic Engine**: Uses the raw Web `AudioContext` API to mathematically generate frequencies (Brown Noise, Pink Noise) and apply Biquad Filters and LFOs to create atmospheric soundscapes (Wind, Rain, Ocean) with zero external MP3 payload!
- **Headless Audio Injection**: Allows dynamic bypass of Spotify/YouTube by injecting a headless API iFrame via regex-matched video IDs for infinite custom lofi streaming.
- **Acoustic UI Feedback**: Emits synthetic sine and square wave "blips" generated mathematically strictly on DOM interaction (Hover/Click events).

### 6. System Regulator (Box Breathing)
A tactical stress-relief utility enforcing a strict 4s-4s-4s-4s breathing loop utilizing cleanly nested `setTimeout` recursion maps to manipulate CSS `transform: scale()` vectors.

## 💻 Developer Setup
Because this app utilizes strict ES6 `import`/`export` logic, it will trigger CORS policy errors if launched directly via `file://`.

1. Clone or download.
2. Spin up a local server in the directory.
   ```bash
   npx serve .
   ```
3. Boot exactly into `http://localhost:3000`.

## 🎨 UI/UX Features of Note
- **Cyber Glitch / Terminal Typing**: A recursive JS charAt sequencer that manually outputs boot logs while simultaneously firing physical audio pings.
- **Absolute 3D Parallax**: Maps physical `clientX`/`clientY` offsets against bounding box centers to trigger `rotateX` and `rotateY` manipulations inside `perspective: 1200px` contexts.
- **Contextual Hover Orbits**: Renders absolute DOM modals on demand tracking bounding box hover events.
