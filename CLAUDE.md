# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

HTML application with no build step, no dependencies, no server required. Open `index.html` directly in a browser to run it.

## Running & Testing

```bash
# Open in default browser (Windows)
start index.html
```

There are no tests, no linter, and no package manager.

## Folder Structure

```
RMCE Week- AI Project/
├── index.html          ← entry point, links css/ and js/
├── CLAUDE.md
├── css/
│   └── styles.css      ← all styles and CSS variables
├── js/
│   └── app.js          ← all prompt data, state, and logic
├── docs/
│   └── ideas.md        ← design notes / backlog
└── source/
    └── Prompts.xlsx    ← original data reference (not used at runtime)
```

## Architecture

**`css/styles.css`**
All styling. CSS custom properties (`:root`) define the colour palette and shadows. Sections are labelled with `/* ── NAME ── */` comments.

**`js/app.js`** — three logical sections:

**1. `PROMPT_DATA` array**
Each prompt is one object with: `id`, `category`, `icon`, `title`, `description`, `active`, `questions[]`, and `template`. The `template` uses `{key}` placeholders that match the `key` fields in `questions[]`. This is the only place to add or modify prompts.

**2. Rendering (`renderApp`, `renderCard`, `renderSlider`)**
- `renderApp()` loops `CATEGORIES`, filters `PROMPT_DATA` by category, and builds the three-column grid.
- `renderSlider()` reads from `localStorage` (`fpb-history`) and renders the sidebar recent-prompts list.
- Both are called once at init and re-called after a prompt is generated.
- `liveIcon(entry)` always resolves the icon from live `PROMPT_DATA` by `promptId` — never trusts the stored icon in localStorage.

**3. Modal wizard (`openModal` → `renderStep` → `renderOutput`)**
- One question per step. `advance()` validates required fields, stores answers in the `answers` object, then increments `currentStep`.
- On final step, `buildPrompt()` replaces all `{key}` tokens in the template string with `answers[key]` (or a fallback if optional and empty).
- `renderOutput()` saves the result to `localStorage` history before rendering.
- `isHistoryView` flag prevents the wizard flow from running when a history card is clicked.

**Sidebar**
- Hidden by default, slides in from the left via `openSidebar()` / `closeSidebar()`.
- Shows logo, New Prompt button, recent prompts list, and profile footer.
- `activeSidebarIndex` tracks the currently open history item and highlights it.

## Adding a Prompt

Add one object to `PROMPT_DATA` in `js/app.js`. Assign `category` to one of the three existing keys: `'Presentations & Meetings'`, `'Analysis & Deep Dive'`, or `'Training Guide'`. Set `active: false` to show it as "Coming Soon".

Icons use inline SVG strings with `width="36" height="36"` and `stroke="#8BD400"`. The `liveIcon()` function scales them down for the sidebar automatically.

## Key Constraints

- No external dependencies — keep it that way. Everything must work offline from a local file.
- The `template` string is a JS template literal. Escape any backticks inside it.
- `localStorage` key `fpb-history` stores up to 20 recent prompts. Schema: `{ promptId, title, icon, category, generatedAt (ms timestamp), preview (120-char string), generatedText }`.
- DOT AI link target: `https://eu.getdot.ai` — used in both the nav button and the output action button.
