// ─── PROMPT DATA ───────────────────────────────────────────────────────────────
const PROMPT_DATA = [
  {
    id: 'wbr-commentary',
    category: 'Presentations & Meetings',
    icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8BD400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="12" width="4" height="9"/><rect x="10" y="7" width="4" height="14"/><rect x="17" y="3" width="4" height="18"/></svg>',
    title: 'Commentary for WBR',
    description: 'Generate a structured Weekly Business Review commentary for a market or region, covering KPIs, corridor performance, and demand timing.',
    active: true,
    questions: [
      { key: 'week',      title: 'Which ISO week are you analyzing?',                       hint: 'e.g. 24',                                                          type: 'text',     placeholder: 'e.g. 24',                          optional: false },
      { key: 'market',    title: 'What is the market, region, or business unit?',           hint: 'e.g. India, Germany North, DACH Hub',                              type: 'text',     placeholder: 'e.g. India',                       optional: false },
      { key: 'corridors', title: 'Which corridors or routes should be included?',           hint: 'e.g. IN09, IN10, IN11 or All',                                     type: 'text',     placeholder: 'e.g. IN09, IN10, IN11 or All',     optional: false },
      { key: 'events',    title: 'Any events, holidays, or commercial topics to mention?',  hint: 'e.g. Diwali demand, school holidays, competitor launch',            type: 'textarea', placeholder: 'e.g. Mention Diwali demand spike on IN09', optional: true }
    ],
    template: `PROMPT START

You are Dot, acting as a Revenue Management Analyst for Flix.

### Inputs

* Week = {week}
* Market = {market}
* Corridors = {corridors}
* Events = {events}
* Year = 2026

### Required Analysis

Analyze ISO Week {week} of 2026 versus the previous ISO week.

Filter to:

* {market}
* {corridors}

Use only on_sale rides.

Use:

* DATE(RIDE_DEP_DATETIME_LOCAL) for Revenue, EUR/km, Yield, Load, BKM, and Supply metrics.
* RELATION_DEP_DATETIME_LOCAL for PBD and booking curve analysis.

Validate that the selected week is complete (Monday–Sunday).

If the week is incomplete:

* Clearly state that the week is incomplete.
* Treat WoW movements as preliminary.
* Avoid presenting declines as final conclusions.

### Metrics to Analyze

#### Overall Performance

* Revenue and WoW %
* EUR/km
* Yield
* Load and pp movement where available
* BKM / Supply movement where relevant

#### Demand Timing

* PBD 0
* PBD 1
* PBD 2–7
* PBD 8+
* Booking window shifts versus previous week

#### Daily Performance

* Strongest day
* Weakest day
* Sunday performance if meaningful

#### Corridor Performance

For each corridor:

* Revenue movement
* Yield movement
* Load movement
* Supply movement
* Booking curve changes
* Key drivers

#### Commercial Context

Include pricing actions, business rules, events, holidays, campaigns, or operational impacts only when available and relevant.

If {events} is populated, incorporate those topics naturally into the commentary.

### Interpretation Rules

* If BKM increases while revenue declines, call out supply dilution.
* If revenue declines while load remains broadly flat, call out yield pressure.
* If yield increases while load declines, describe price strength with weaker utilization.
* If both yield and load improve, highlight strong pricing and demand execution.
* If both weaken, highlight broad demand softness.
* If PBD 0 share increases, state that demand became more last-minute.
* If PBD 8+ share increases, state that the booking window lengthened.
* If revenue growth is primarily driven by supply expansion, distinguish volume growth from pricing strength.

### Output Format

# {market} W{week} RM Performance Commentary

## Summary

* 2–3 concise bullets summarizing overall performance versus previous week.
* Highlight the biggest positive and negative corridor movers.
* Mention any relevant event impacts from {events}.

## Corridor Commentary

For each corridor in {corridors}:

### [Corridor Name]

* Revenue movement and KPI shifts.
* Yield and load interpretation.
* Supply impact if relevant.
* Booking curve / PBD changes.
* Strongest or weakest day if meaningful.
* Relevant event or commercial context if applicable.

## Closing Readout

* 1–2 bullets summarizing what changed commercially.
* One RM watchout for the following week.

### Writing Style

* Concise and punchy.
* Executive-friendly.
* Revenue Management focused.
* No tables.
* Use exact figures where available.
* Do not invent causes.
* Do not mention inactive or deactivated business rules.
* Focus on commercial implications rather than metric repetition.

PROMPT END`
  },

  {
    id: 'story-commentary',
    category: 'Presentations & Meetings',
    icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8BD400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    title: 'Weekly Performance Story',
    description: 'Generate a structured weekly performance story for a corridor — covering KPI bridge, line drivers, demand vs pricing read, and steering recommendations with WoW and YoY comparisons.',
    active: true,
    questions: [
      { key: 'corridor',    title: 'Which corridor do you want to analyze?',                          hint: 'e.g. IN09 or Delhi–Mumbai',                                    type: 'text', placeholder: 'e.g. IN09',                          optional: false },
      { key: 'target_week', title: 'Which week are you analyzing? (target week)',                     hint: 'e.g. 2026-06-09 to 2026-06-15 or W24 2026',                   type: 'text', placeholder: 'e.g. 2026-06-09 to 2026-06-15',    optional: false },
      { key: 'prev_week',   title: 'Which week should be used for the previous-week comparison?',     hint: 'e.g. 2026-06-02 to 2026-06-08 or W23 2026',                   type: 'text', placeholder: 'e.g. 2026-06-02 to 2026-06-08',    optional: false },
      { key: 'yoy_week',    title: 'Which week should be used for the year-over-year comparison?',   hint: 'e.g. 2025-06-10 to 2025-06-16 or W24 2025',                   type: 'text', placeholder: 'e.g. 2025-06-10 to 2025-06-16',    optional: false },
      { key: 'kpi',         title: 'Which headline KPI do you want?',                                hint: 'Driven EUR/km or Driven USD/mile',                             type: 'text', placeholder: 'e.g. EUR/km',                        optional: false }
    ],
    template: `Create a weekly performance story for corridor {corridor}.

Inputs:
Target week: {target_week}
Previous-week comparator: {prev_week}
Year-over-year comparator: {yoy_week}
Headline KPI unit: {kpi}

Unless I say otherwise, use driven revenue: net revenue including onboard ancillaries. Calculate EUR/km as driven revenue divided by bus km. For USD/mile, convert revenue from EUR to USD using the applicable daily exchange rate and convert bus km to miles.

Include Searches, CVR, Yield, BKM, bus miles, revenue, tickets/PAX, and load where available. When comparing the headline KPI with the previous week and prior year, always show the corresponding change in operated distance as both BKM and bus miles.

Create a comparison chart for the selected headline KPI across the target, previous-week, and YoY periods. Directly underneath it, create an identical chart for operated distance, using the same period order, colors, layout, and labels. Show bus miles when the headline KPI is USD/mile and BKM when it is EUR/km; include the alternative distance unit in the chart labels or supporting text.

Tell the story in this structure:

Headline: Was performance good or bad based on the selected headline KPI versus the previous week and prior year?

KPI bridge: Explain the headline KPI movement through revenue, operated distance, Yield, Searches, CVR, tickets, and load. Separate revenue growth from changes caused by adding or removing capacity.

Line drivers: Identify which lines contributed most to the corridor-level change. If performance improved, show the strongest positive contributors. If it declined, show the largest drags.

Demand vs pricing read: Interpret Searches and CVR together:
- High Searches + low CVR suggests possible pricing or booking friction.
- Low Searches + stable CVR suggests demand softness.
- High Searches + high CVR may support a Yield increase.
- Low Searches + low CVR suggests avoiding a Yield push until the issue is diagnosed.

Use Searches and CVR as diagnostic signals, not causal proof. Check Load, sell-out risk, capacity, and PBD patterns before concluding that prices should rise or fall.

Calendar and comparison fairness: Check public holidays, school holidays, major events, weekday alignment, and seasonality for all three periods. Explicitly assess whether the YoY comparator is fair for the target week. If it is distorted, explain why and suggest a more comparable prior-year week.

Prior-year read: Compare the selected headline KPI with the YoY period and assess whether the direction looks structural, seasonal, or mainly calendar-driven.

Recommended actions: Give 2–3 practical pricing or capacity-steering actions tied directly to the observed drivers. If recommending a pricing intervention, name the appropriate RMS lever and scope.

Use only rides with ride_status = on_sale and complete weeks. State the exact date ranges, data sources, assumptions, and latest complete business date. Do not treat incomplete data as a decline, and flag unavailable KPIs rather than estimating them.`
  },

  {
    id: 'follow-up-questions',
    category: 'Presentations & Meetings',
    icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8BD400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    title: 'Follow-Up Q&A Prep',
    description: 'Prepare a comprehensive Q&A bank for any presentation — tailored to your audience, scope, and uploaded file to anticipate tough questions before they arise.',
    active: true,
    questions: [
      { key: 'audience_role',    title: 'Who are you presenting to, and what is your role?',                      hint: 'e.g. Presenting to C-level as a Revenue Manager',                             type: 'text',     placeholder: 'e.g. Presenting to C-level as a Revenue Manager',    optional: false },
      { key: 'presentation_goal',title: 'What do you want to achieve with this presentation?',                    hint: 'e.g. Share performance, Explain a variance, Defend a pricing decision, Prepare for Q&A', type: 'text', placeholder: 'e.g. Share Q2 performance and explain revenue gap', optional: false },
      { key: 'scope',            title: 'What is the business scope?',                                            hint: 'e.g. DACH Bus, Italy Bus, IN09, Line 690, Global',                             type: 'text',     placeholder: 'e.g. DACH Bus',                                       optional: false },
      { key: 'main_focus',       title: 'What are the main KPIs or business topics?',                            hint: 'e.g. Revenue, EUR/km, Yield, Load, Pricing, Budget Gap, Competition',          type: 'text',     placeholder: 'e.g. Revenue, EUR/km, Yield, Budget Gap',            optional: false },
      { key: 'special_context',  title: 'Any difficult questions, sensitive topics, or additional context?',     hint: 'e.g. Budget cuts, Pricing decision under scrutiny, Competitor pressure',       type: 'textarea', placeholder: 'e.g. Budget gap driven by supply expansion in Q1',  optional: true },
      { key: 'presentation_file',title: 'What file will you be uploading to DOT AI?',                            hint: 'e.g. Q2 Revenue Review.xlsx, Germany Performance Report.csv',                 type: 'text',     placeholder: 'e.g. Q2 Performance Review.xlsx',                    optional: true }
    ],
    template: `PROMPT START

Create a single-page HTML web app for Flix presentation preparation.

### Inputs

* {audience_role} = Who you are presenting to and your role
(e.g. Presenting to C-level as a Revenue Manager)

* {presentation_goal} = What you want to achieve with the presentation
(e.g. Share performance, Explain a variance, Defend a pricing decision, Ask for a decision, Prepare for Q&A)

* {scope} = Business scope
(e.g. DACH Bus, Italy Bus, Line 690, IN09, Market, Global)

* {main_focus} = Main KPIs or business topics
(e.g. Revenue, EUR/km, Yield, Load, PAX, Budget Gap, Pricing, Competition)

* {special_context} = Any difficult questions, politically sensitive topics, or additional context (optional)

* {presentation_file} = Excel, CSV, Word (.docx), or Text (.txt) file containing the presentation material

### Design

Use Flix branding:

* Primary color: #73D700
* Background: #FFFFFF

The design should feel:
* Clean
* Modern
* Business-ready
* Premium
* Inspired by Instagram (cards, rounded corners, smooth animations, polished UI)

Everything must run in a single standalone HTML file.

Use browser-side JavaScript only.

Do not require a backend.

Use:
* SheetJS (CDN) for Excel and CSV parsing.
* Mammoth.js (CDN) for .docx parsing.

### File Processing

After the user uploads {presentation_file}:

Read the file completely inside the browser.

Extract all readable content.

Automatically detect business topics including (but not limited to):

* Revenue
* EUR/km
* Yield
* Load / Utilization
* PAX / Tickets
* Budget
* Forecast
* Pricing
* Competition
* Operations
* Marketing
* Cancellations
* Seasonality
* Supply
* Capacity
* Demand
* Network
* Corridors
* Lines
* Business performance

### Question Generation

Tailor all questions using:

* {audience_role}
* {presentation_goal}
* {scope}
* {main_focus}
* {special_context}

Generate the following sections:

## 1. Questions detected from the uploaded presentation

Generate questions directly related to the topics, numbers and conclusions found inside the file.

---

## 2. Questions the audience is likely to ask

Generate realistic questions based on the selected audience.

For example:

* C-level should receive strategic questions.
* Revenue Managers should receive KPI questions.
* Commercial Market Leads should receive commercial questions.
* Mixed audiences should receive a combination.

---

## 3. Questions that protect the presenter

Generate questions that help the presenter defend assumptions, explain methodology, clarify limitations and prevent common misunderstandings.

---

## 4. Business questions that almost always come up

Generate common commercial questions covering topics such as:

* YoY comparison
* WoW comparison
* Budget
* Forecast
* Variance explanation
* Pricing
* Demand
* Capacity
* Competition
* Operational changes
* Risks
* Next actions

---

## 5. Questions about important numbers

Automatically detect significant values inside the presentation and create questions around them.

Examples include:

* Large revenue changes
* High or low load
* Yield movement
* Budget gaps
* Demand spikes
* Declines
* Outliers

---

## 6. Additional questions for the presenter

Ask follow-up questions that would improve the generated Q&A.

For example:

* Missing context
* Assumptions
* Upcoming events
* Business rules
* External factors
* Competitor activity

### Question Quality

Questions should:

* Be written in English.
* Be practical.
* Be concise.
* Sound like real stakeholder questions.
* Be tailored to Flix RMCE and commercial teams.
* Focus on commercial implications rather than simply repeating metrics.
* Include business impact.
* Consider complete vs. partial periods.
* Cover KPI drivers.
* Distinguish price vs. demand vs. capacity effects.
* Cover budget gaps.
* Cover seasonality.
* Cover competition.
* Cover operational impacts.
* Ask about risks.
* Ask about next actions.
* Never invent facts that are not supported by the uploaded file.

### Output

Display the generated questions grouped into clearly separated sections.

Provide buttons to:

* Copy all generated questions.
* Download all generated questions as a .txt file.

Everything must remain inside one standalone HTML file.

PROMPT END`
  },

  {
    id: 'performance-tracking',
    category: 'Analysis & Deep Dive',
    icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8BD400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
    title: 'Performance Tracking Model',
    description: 'Build an interactive performance tracker for corridors, lines, or rides — covering EUR/km, Utilisation, Yield, Searches, and Conversion with conditional formatting.',
    active: true,
    questions: [
      { key: 'scope',          title: 'Which region, corridor, line, or rides should be tracked?', hint: 'e.g. Germany North – IN09 – Line 42 – All day rides',                                                       type: 'textarea', placeholder: 'e.g. India, corridor IN09, all departures',                         optional: false },
      { key: 'direction',      title: 'Should it be split by direction or A-to-B pairs?',          hint: 'e.g. Directional (A→B and B→A separately) or A-to-B combined',                                            type: 'text',     placeholder: 'e.g. Directional',                                           optional: false },
      { key: 'time_reference', title: 'Should rides be identified by trip number or departure time?', hint: 'e.g. Trip number or clock departure time (08:00, 14:00…)',                                               type: 'text',     placeholder: 'e.g. Departure time',                                        optional: false },
      { key: 'metrics',        title: 'Which KPIs should be tracked?',                              hint: 'Default: EUR/km, Utilisation, Yield, Searches, Conversion. Add or remove as needed.',                    type: 'text',     placeholder: 'e.g. EUR/km, Utilisation, Yield, Searches, Conversion',    optional: false },
      { key: 'time_period',    title: 'What time period should the model cover?',                   hint: 'e.g. ISO Week 16 to Week 24, or Q2 2026',                                                                  type: 'text',     placeholder: 'e.g. ISO Week 16 to Week 24',                                optional: false },
      { key: 'granularity',    title: 'Should the data be broken down by week or by month?',        hint: 'e.g. Weekly or Monthly',                                                                                   type: 'text',     placeholder: 'e.g. Weekly',                                                optional: false },
      { key: 'thresholds',     title: 'Who should set the KPI thresholds?',                         hint: 'You can define your own, or let DOT calculate them from historical average (excluding peak weeks).',      type: 'textarea', placeholder: 'e.g. Let DOT determine thresholds based on average of past 8 weeks excluding peak', optional: false },
      { key: 'output_format',  title: 'Should the output be an HTML webpage or an Excel sheet?',    hint: 'HTML = interactive in browser. Excel = conditional formatting in .xlsx',                                  type: 'text',     placeholder: 'e.g. HTML webpage',                                          optional: false },
      { key: 'alerts',         title: 'Should the model include a weekly auto-update alert?',       hint: 'e.g. Yes – send updated output every Monday, or No',                                                      type: 'text',     placeholder: 'e.g. Yes, update every Monday',                              optional: true }
    ],
    template: `You are Dot, acting as a Revenue Manager who wants to understand the trends of the past weeks to steer the Lines / Corridors they are looking after.

A performance tracking model will help the RMs understand the trends and take pricing actions.

### Scope

* Region / Corridor / Line / Rides: {scope}
* Direction split: {direction}
* Ride identifier: {time_reference}

### Key Metrics

{metrics}

### Time Period

{time_period}

### Granularity

{granularity}

### Thresholds

{thresholds}

### Output Format

{output_format}

### Alerts

{alerts}

### Instructions

Build the performance tracking model based on the inputs above.

Provide an {output_format} that gets updated every week or whenever the user manually prompts in the same chat.

Apply conditional formatting or visual indicators to highlight metrics that are above or below the defined thresholds.

Ensure the output is clearly labelled with the scope, time period, and metric definitions.`
  },

  {
    id: 'season-calendar',
    category: 'Analysis & Deep Dive',
    icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8BD400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    title: 'Season Calendar & Events',
    description: 'Define travel seasons and map key demand events to steer pricing decisions — output as an interactive HTML calendar with demand tier classifications.',
    active: true,
    questions: [
      { key: 'market',          title: 'Which market or region would you like to analyse?',  hint: 'e.g. Germany North, Mexico Southeast, India',                                                     type: 'text',     placeholder: 'e.g. India',                                                         optional: false },
      { key: 'analysis_period', title: 'What date range should be analysed?',                hint: 'e.g. Q3 2026, Jul–Sep 2026, ISO Week 26–40',                                                      type: 'text',     placeholder: 'e.g. Q3 2026 (Jul–Sep)',                                             optional: false },
      { key: 'considerations',  title: 'Are there any additional considerations?',           hint: 'e.g. IN09 corridor, School holidays, Competitor launch, Major festival, Business priorities',     type: 'textarea', placeholder: 'e.g. Focus on IN09 and IN10; include Diwali and school holidays',   optional: true }
    ],
    template: `PROMPT START

You are Dot, acting as a Revenue Manager who wants to define travel seasons and map key demand events to support pricing decisions for the selected market, lines, or corridors.

Provide an interactive single-page HTML webpage and update it whenever the user provides new information or requests changes.

### Inputs

* {market} = Market, country, region, or business area
(e.g. Mexico Southeast, Germany North)

* {analysis_period} = Date range or season window
(e.g. Q3 2026, Jul–Sep 2026)

* {considerations} = Additional context such as corridors, lines, known events, competitor activity, operational changes, or business priorities (optional)

---

Use the provided inputs throughout the analysis.

Always display the selected:
- Market
- Analysis period
- Additional considerations

at the top of the webpage.

## Module 1 – Season Definition

Classify weeks or date ranges into demand tiers such as:

- High Season
- Mid Season
- Low Season

Base the season classification on available demand signals including, where applicable:

- Utilisation
- Searches
- Yield
- Revenue
- EUR/km
- Bookings
- Historical demand
- Expected demand

Explain the reasoning behind each season classification.

Do not invent demand data. Clearly state assumptions where evidence is unavailable.

---

## Module 2 – Calendar of Events

Create an interactive calendar showing demand-driving events during the selected period.

Include, where available:

- Public holidays
- School holidays
- Festivals
- Sporting events
- Concerts
- Long weekends
- Religious holidays
- Tourism peaks
- Major local events

For each event display:

- Event name
- Date(s)
- Location
- Expected demand impact (High, Medium, Low)
- Affected corridors or lines (where applicable)
- Brief business commentary

Describe events as likely demand influences rather than proven causes unless supporting evidence exists.

---

## HTML Requirements

Create a clean, modern, business-friendly interactive webpage featuring:

- Season overview
- Colour-coded season timeline
- Interactive event calendar
- Demand impact legend
- Responsive layout

Whenever the user updates any input or requests changes, regenerate the webpage accordingly.

Never fabricate missing event or demand information.

Clearly state assumptions, data freshness, and unavailable information where applicable.

PROMPT END`
  },

  {
    id: 'beginners-guide-rm',
    category: 'Training Guide',
    icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8BD400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    title: 'Beginners Guide for RM',
    description: 'A personalized 15-minute onboarding guide for new Revenue Managers — covering key metrics, commercial logic, and how everything connects as a system.',
    active: true,
    questions: [
      { key: 'Input1', title: 'How familiar are you with Revenue Management?',    hint: 'Rate yourself from 1 (complete beginner) to 5 (expert)',                  type: 'text',     placeholder: 'e.g. 2',                         optional: false },
      { key: 'Input2', title: 'How familiar are you with the bus industry?',      hint: 'Rate yourself from 1 (no experience) to 5 (very familiar)',               type: 'text',     placeholder: 'e.g. 1',                         optional: false },
      { key: 'Input3', title: 'What analogy domains help you understand better?', hint: 'e.g. Football, Aviation, Retail, Gaming — multiple allowed',              type: 'text',     placeholder: 'e.g. Football, Aviation',        optional: false },
      { key: 'Input4', title: 'Which RM terms are you already familiar with?',    hint: 'List anything you already know so the guide skips or fast-tracks those',  type: 'textarea', placeholder: 'e.g. Yield, Load Factor, EUR/km', optional: true }
    ],
    template: `You are an expert Revenue Management onboarding trainer for Flix (or a similar mobility company).

Your job is to create a 15-minute beginner-friendly onboarding guide for a new Revenue Manager that explains key business metrics, commercial logic, and how everything connects in practice.

The goal is not just to define terms, but to help the user understand how Revenue Management works as a system.

### User Profile

* Revenue Management familiarity: {Input1}/5
* Bus industry familiarity: {Input2}/5
* Preferred analogy domains: {Input3}
* Already known terms: {Input4}

### Core Instructions

**1. Adapt complexity dynamically**
* 1–2: Assume complete beginner
* 3: Basic understanding, some business familiarity
* 4–5: Focus on insights, relationships, and decision-making

**2. Explanation style per concept**

For each concept:
* Simple explanation (plain English first)
* Revenue Management example (mobility/bus context)
* Formula (only if applicable — keep simple)
* Why it matters in Revenue Management
* At least ONE analogy using {Input3}

If multiple analogy domains are provided, use different domains across concepts. For difficult concepts, use 2 analogies from different domains.

**3. Concepts to explain**

Yield, EUR/km, BusKM, Load Factor (Max Load & Average Load), Relations, Lines and Corridors, A to B, CVR and Searches, PAX and PAX Km, NOI, ROAS, GP1, GP2, Business Region, Travel Region, Bottleneck

**4. Terms already known**

If a term appears in {Input4}:
* Do NOT re-explain in detail
* Provide only a short refresher
* Focus on how it connects to other metrics

**5. How Everything Connects (VERY IMPORTANT)**

After explaining concepts, show how the system works:
* Searches → CVR → PAX → Revenue → Yield → NOI
* Capacity constraints affect Load Factor
* Bottlenecks influence pricing and supply decisions
* Yield and Load Factor trade-off dynamics
* How marketing (ROAS) connects to demand generation
* How network design (Lines, Corridors, A-to-B) influences revenue

Explain it as a single connected system, not isolated definitions.

**6. Allow expansion beyond provided list**

You MUST proactively add additional important beginner-level concepts if relevant, such as:

* Demand forecasting
* Pricing strategy / dynamic pricing
* Capacity management
* Seasonality
* Route profitability
* Conversion funnel metrics
* Supply vs demand balancing

Explain them briefly in the same format.

**7. Practical scenarios**

Include 3–5 real-world scenarios showing:
* A business problem
* Which metrics are used
* How a Revenue Manager would think
* What decision would be taken

### Output Structure

1. Introduction (adjusted by experience level)
2. Core Terms Explained
3. Additional Important Concepts (demand forecasting, dynamic pricing, seasonality, route profitability as relevant)
4. How Everything Connects (system view)
5. Practical Business Scenarios
6. Quick Cheat Sheet: Top 10 concepts, key formulas, one-line summaries

### Output Constraints

* Total reading time: ~15 minutes
* Keep it skimmable with bullet points and short paragraphs
* Avoid jargon unless explained
* Prioritize clarity and intuition over theory

### Final Goal

Help a new Revenue Manager understand:

* What each metric means
* How they influence each other
* How real business decisions are made
* How Revenue Management works as a connected system

NOT just definitions — but mental model building.`
  },

  {
    id: 'guide-for-market',
    category: 'Training Guide',
    icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8BD400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    title: 'Guide for the Market',
    description: 'Build a full corridor onboarding guide covering revenue positioning, network components, capacity bottlenecks, competitor landscape, and demand-changing events.',
    active: true,
    questions: [
      { key: 'corridor',             title: 'Which corridor should be analyzed?',                    hint: 'e.g. IN09 or Delhi–Jaipur',                          type: 'text', placeholder: 'e.g. IN09',                              optional: false },
      { key: 'analysis_period',      title: 'What is the analysis period?',                         hint: 'e.g. 01 Jan 2026 to 31 Mar 2026',                    type: 'text', placeholder: 'e.g. 01 Jan 2026 to 31 Mar 2026',        optional: false },
      { key: 'efficiency_unit',      title: 'Which efficiency unit should be used?',                hint: 'EUR/km or RPM',                                      type: 'text', placeholder: 'e.g. EUR/km',                            optional: false },
      { key: 'recent_line_lookback', title: 'What recent-line lookback period should be used?',     hint: 'e.g. 26 weeks (default) or 52 weeks',               type: 'text', placeholder: 'e.g. 26 weeks',                          optional: true }
    ],
    template: `PROMPT START

You are Dot, acting as a Revenue Management Analyst for Flix.

### Inputs

* {corridor} = Corridor name or code (e.g. IN09 or Delhi–Jaipur)
* {analysis_period} = Start date to end date, inclusive (e.g. 01 Jan 2026 to 31 Mar 2026)
* {efficiency_unit} = EUR/km or RPM
* {recent_line_lookback} = Lookback period for recently introduced lines (Default: Analysis period plus the preceding 26 weeks)

Use driven net revenue, including onboard ancillaries. Exclude platform ancillaries.

If EUR/km is selected, report net revenue in EUR and distance in bus-km.

If RPM is selected, report net revenue in USD and distance in bus miles, using the applicable actual exchange rates.

State the corridor, region, dates, unit, and latest complete data date.

Build the guide in these sections:

1. Corridor overview
- Driven net revenue.
- Total bus-km or bus miles.
- {efficiency_unit} = driven net revenue divided by total bus-km or bus miles.
- "Loads (excl. Blocked)" using the ride-segment KPI and capacity excluding blocked seats.
- Number of rides and passenger tickets for context.
- Do not treat an incomplete current week or month as a decline.

2. Position within the region
- Identify the corridor's region from the network hierarchy.
- Compare this corridor with every other corridor in that region over the same period.
- Show one peer-comparison chart with corridor revenue and bus-km/miles.
- Use separate axes or another readable treatment because the units differ.
- Clearly highlight the selected corridor.
- Include its regional rank and share of regional revenue and distance.

3. Most important network components
Provide three ranked top-10 tables for the same period:
- AtoBs generating the most driven net revenue.
- Lines generating the most driven net revenue.
- Complete interconnection customer journeys generating the most total driven net revenue.

4. Capacity bottlenecks
- Calculate SOR at line level using booking status before departure.
- Exclude PBD = 0.
- Classify a ride as sold out when Loads (excl. Blocked) reaches at least 95% before PBD0.
- Rank lines by SOR.
- Show ride count.
- Show average and P90 Loads (excl. Blocked).
- Flag thin samples.
- Highlight lines with high SOR, meaningful ride volume, and revenue exposure.

5. Competitors
- Identify the main competing brands or carriers.
- Rank competitors using available overlap, departure frequency, and fare data.
- State which metric is available.
- If competitor data only covers part of the requested period, state the available dates.

6. Demand-changing events
- Find unusual movements in searches, tickets, or revenue.
- Cross-check against credible external event sources.
- List major events with location, dates, affected AtoBs or lines, and observed demand change.
- Describe these as associations unless causal evidence exists.

7. Recently introduced lines
- Identify lines first launched within {recent_line_lookback}.
- Show line code, line name, first on-sale departure, ISO introduction week, and active status.
- Distinguish genuinely new lines from seasonal returns.

Finish with 5–7 onboarding takeaways covering:
- What drives the corridor.
- Capacity constraints.
- Most important network components.
- Key monitoring points.
- One recommended recurring monitoring view.

Use consistent corridor, region, date, ride-status, and revenue filters throughout.

Prefer UUIDs for joins and line codes for display.

Verify joins do not duplicate revenue or distance.

State all KPI definitions, assumptions, data freshness, unavailable cuts, and never fabricate missing competitor, event, interconnection, or launch data.

PROMPT END`
  }
];

// ─── CATEGORIES ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'Presentations & Meetings', label: 'Presentations & Meetings', title: 'Presentations & Meetings' },
  { key: 'Analysis & Deep Dive',     label: 'Analysis & Deep Dive',     title: 'Analysis & Deep Dive' },
  { key: 'Training Guide',           label: 'Training Guide',           title: 'Training Guide' }
];

// ─── STATE ─────────────────────────────────────────────────────────────────────
let currentPrompt = null;
let currentStep = 0;
let answers = {};
let isOutputStep = false;
let isHistoryView = false;
let activeSidebarIndex = -1;

// ─── HISTORY (localStorage) ────────────────────────────────────────────────────
const HISTORY_KEY = 'fpb-history';

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch(e) { return []; }
}

function saveHistory(entry) {
  const history = loadHistory();
  history.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}

function formatTimeAgo(ts) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'Just now';
  const m = Math.floor(s / 60);
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

// ─── SIDEBAR ───────────────────────────────────────────────────────────────────
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-backdrop').classList.add('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('open');
}

function liveIcon(entry) {
  const prompt = PROMPT_DATA.find(p => p.id === entry.promptId);
  const iconHtml = prompt ? prompt.icon : (entry.icon || '');
  return iconHtml.replace(/width="36"/g, 'width="18"').replace(/height="36"/g, 'height="18"');
}

function renderSlider() {
  const history = loadHistory();
  const list = document.getElementById('sidebar-list');
  if (!history.length) {
    list.innerHTML = '<div class="sidebar-empty">No prompts yet</div>';
    return;
  }
  list.innerHTML = history.map((entry, i) => `
    <button class="sidebar-item${activeSidebarIndex === i ? ' active' : ''}" onclick="viewHistory(${i})" title="${escHtml(entry.title)}">
      <div class="sidebar-item-icon">${liveIcon(entry)}</div>
      <div class="sidebar-item-body">
        <div class="sidebar-item-title">${escHtml(entry.title)}</div>
        <div class="sidebar-item-meta">${formatTimeAgo(entry.generatedAt)}</div>
      </div>
    </button>`).join('');
}

function viewHistory(index) {
  const history = loadHistory();
  const entry = history[index];
  if (!entry) return;

  activeSidebarIndex = index;
  renderSlider();
  closeSidebar();

  isHistoryView = true;
  currentPrompt = PROMPT_DATA.find(p => p.id === entry.promptId) || { title: entry.title, questions: [] };
  document.getElementById('modal-title').textContent = entry.title;
  document.getElementById('progress-dots').innerHTML = '';

  document.getElementById('modal-body').innerHTML = `
    <div class="step visible">
      <div class="output-label">Generated Prompt &mdash; ${formatTimeAgo(entry.generatedAt)}</div>
      <div class="output-area" id="output-text">${escHtml(entry.generatedText)}</div>
      <div class="output-actions">
        <button class="btn-copy" onclick="copyHistoryPrompt()">Copy Prompt</button>
        <button class="btn-download" onclick="downloadPrompt()">Download .md</button>
        <a class="btn-dotai" href="https://eu.getdot.ai" target="_blank" rel="noopener">Open in DOT AI ↗</a>
      </div>
    </div>`;

  document.getElementById('btn-prev').style.display = 'none';
  document.getElementById('btn-next').style.display = 'none';
  document.getElementById('overlay').classList.add('open');
}

function copyHistoryPrompt() {
  const text = document.getElementById('output-text').textContent;
  navigator.clipboard.writeText(text).then(() => showToast('Prompt copied successfully'));
}

// ─── RENDER APP ────────────────────────────────────────────────────────────────
function renderApp() {
  const columns = CATEGORIES.map(cat => {
    const cards = PROMPT_DATA.filter(p => p.category === cat.key);
    if (!cards.length) return '';
    return `
      <section class="category-section">
        <div class="category-header">
          <div class="category-title">${cat.title}</div>
        </div>
        <div class="cards-grid">${cards.map(renderCard).join('')}</div>
      </section>`;
  }).join('');
  document.getElementById('app').innerHTML = `<div class="categories-wrapper">${columns}</div>`;
}

function renderCard(p) {
  const btn = p.active
    ? `<button class="btn-build" onclick="openModal('${p.id}')">Build Prompt &rarr;</button>`
    : `<button class="btn-disabled" disabled>Coming Soon</button>`;
  return `
    <div class="card ${p.active ? 'active' : 'disabled'}">
      <div class="card-icon">${p.icon}</div>
      <div class="card-title">${p.title}</div>
      <div class="card-desc">${p.description}</div>
      ${btn}
    </div>`;
}

// ─── MODAL ─────────────────────────────────────────────────────────────────────
function openModal(id) {
  currentPrompt = PROMPT_DATA.find(p => p.id === id);
  currentStep = 0;
  answers = {};
  isOutputStep = false;
  isHistoryView = false;
  document.getElementById('modal-title').textContent = currentPrompt.title;
  document.getElementById('btn-next').style.display = '';
  renderDots();
  renderStep();
  document.getElementById('overlay').classList.add('open');
  focusCurrentInput();
}

function closeModal() {
  document.getElementById('overlay').classList.remove('open');
  currentPrompt = null;
  isOutputStep = false;
  isHistoryView = false;
  activeSidebarIndex = -1;
  renderSlider();
}

function renderDots() {
  const total = currentPrompt.questions.length;
  document.getElementById('progress-dots').innerHTML = Array.from({ length: total }, (_, i) => {
    let cls = 'dot';
    if (i < currentStep) cls += ' done';
    else if (i === currentStep) cls += ' active';
    return `<div class="${cls}"></div>`;
  }).join('');
}

function renderStep() {
  if (isOutputStep) { renderOutput(); return; }
  const q = currentPrompt.questions[currentStep];
  const total = currentPrompt.questions.length;
  const savedVal = answers[q.key] || '';

  const inputHtml = q.type === 'textarea'
    ? `<textarea id="step-input" placeholder="${q.placeholder}" ${q.optional ? '' : 'required'}>${savedVal}</textarea>`
    : `<input type="text" id="step-input" placeholder="${q.placeholder}" value="${savedVal}" ${q.optional ? '' : 'required'}>`;

  document.getElementById('modal-body').innerHTML = `
    <div class="step visible">
      <div class="step-label">Question ${currentStep + 1} of ${total}</div>
      <div class="step-question">${q.title}${q.optional ? '<span class="optional-tag">Optional</span>' : ''}</div>
      <div class="step-hint">${q.hint}</div>
      ${inputHtml}
      <div class="error-msg" id="err-msg">This field is required.</div>
    </div>`;

  document.getElementById('btn-prev').style.display = currentStep > 0 ? 'block' : 'none';
  document.getElementById('btn-next').style.display = '';
  document.getElementById('btn-next').textContent = currentStep === total - 1 ? 'Generate Prompt ✦' : 'Next →';

  renderDots();
  focusCurrentInput();
}

function focusCurrentInput() {
  setTimeout(() => { const el = document.getElementById('step-input'); if (el) el.focus(); }, 80);
}

function advance() {
  if (isOutputStep || isHistoryView) return;
  const q = currentPrompt.questions[currentStep];
  const input = document.getElementById('step-input');
  const val = input ? input.value.trim() : '';
  const errMsg = document.getElementById('err-msg');

  if (!q.optional && !val) {
    errMsg.classList.add('show');
    input.style.borderColor = '#e53e3e';
    return;
  }
  answers[q.key] = val;

  if (currentStep < currentPrompt.questions.length - 1) {
    currentStep++;
    renderStep();
  } else {
    isOutputStep = true;
    renderOutput();
  }
}

function goBack() {
  if (isHistoryView) return;
  if (isOutputStep) {
    isOutputStep = false;
    currentStep = currentPrompt.questions.length - 1;
    renderStep();
    return;
  }
  if (currentStep > 0) { currentStep--; renderStep(); }
}

function buildPrompt() {
  let tpl = currentPrompt.template;
  currentPrompt.questions.forEach(q => {
    const val = answers[q.key] || `No specific ${q.title.toLowerCase()} mentioned.`;
    tpl = tpl.split(`{${q.key}}`).join(val);
  });
  return tpl;
}

function renderOutput() {
  const generated = buildPrompt();

  saveHistory({
    promptId:      currentPrompt.id,
    title:         currentPrompt.title,
    icon:          currentPrompt.icon,
    category:      currentPrompt.category,
    generatedAt:   Date.now(),
    preview:       generated.replace(/\n+/g, ' ').trim().slice(0, 120),
    generatedText: generated
  });
  renderSlider();

  document.getElementById('modal-body').innerHTML = `
    <div class="step visible">
      <div class="output-label">Your Generated Prompt</div>
      <div class="output-area" id="output-text">${escHtml(generated)}</div>
      <div class="output-actions">
        <button class="btn-copy" onclick="copyPrompt()">Copy Prompt</button>
        <button class="btn-download" onclick="downloadPrompt()">Download .md</button>
        <a class="btn-dotai" href="https://eu.getdot.ai" target="_blank" rel="noopener">Open in DOT AI ↗</a>
      </div>
    </div>`;

  document.getElementById('progress-dots').innerHTML =
    Array.from({ length: currentPrompt.questions.length }, () => '<div class="dot done"></div>').join('');

  document.getElementById('btn-prev').style.display = 'block';
  document.getElementById('btn-next').style.display = 'none';
}

function copyPrompt() {
  const text = document.getElementById('output-text').textContent;
  navigator.clipboard.writeText(text).then(() => showToast('Prompt copied successfully'));
}

function downloadPrompt() {
  const text = document.getElementById('output-text').textContent;
  const title = (currentPrompt ? currentPrompt.title : 'prompt').replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const blob = new Blob([text], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = title + '.md';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Prompt downloaded');
}

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── TOAST ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

// ─── EVENTS ────────────────────────────────────────────────────────────────────
document.getElementById('btn-next').addEventListener('click', advance);
document.getElementById('btn-prev').addEventListener('click', goBack);
document.getElementById('btn-cancel').addEventListener('click', closeModal);
document.getElementById('modal-close').addEventListener('click', closeModal);

document.getElementById('overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('overlay')) closeModal();
});

document.addEventListener('keydown', e => {
  if (!document.getElementById('overlay').classList.contains('open')) return;
  if (e.key === 'Escape') { closeModal(); return; }
  if (e.key === 'Enter' && !isOutputStep && !isHistoryView) {
    const input = document.getElementById('step-input');
    if (input && input.tagName === 'TEXTAREA' && !e.ctrlKey) return;
    advance();
  }
});

// ─── INIT ──────────────────────────────────────────────────────────────────────
renderApp();
renderSlider();
