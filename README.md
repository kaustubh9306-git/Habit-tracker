# Tally – Habit Tracker

A personal habit-tracking dashboard. React + Vite + Tailwind CSS + React Router + React Hook Form + Recharts. State is Context + `useReducer`, persisted to localStorage (works fully offline).

## Run it

    npm install
    npm run dev       # http://localhost:5173
    npm test          # unit tests for streaks, rates, dates, reducer, import validation
    npm run build

## Structure

    src/app          App, routes, store (reducer + provider), demo seed data
    src/components   ui/ (Modal, Toast, ProgressRing, ...) and layout/ (sidebar + mobile nav)
    src/features     habits, completions, dashboard, history, statistics, settings
    src/hooks        useLocalStorage (the only storage adapter), useTheme
    src/lib          date.js – all calendar-date handling

## Design notes

- Dates are `YYYY-MM-DD` strings, built from local parts; nothing goes through UTC parsing.
- Streaks and completion rates only count scheduled days, so a Mon/Wed/Fri habit isn't broken by Tuesday.
- Derived values (streaks, percentages) are never stored; they're computed from habits + completion records.
- To move to an API later, replace `loadJSON`/`saveJSON` in `src/hooks/useLocalStorage.js` and the persistence effect in `src/app/store.jsx`.
- Demo data is inserted only when localStorage has no data. Clear all data in Settings to start empty.
