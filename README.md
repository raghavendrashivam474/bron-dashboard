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
* Web Audio API
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
