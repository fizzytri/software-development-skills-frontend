# StudyLog — course project

A single-page learning tracker. Log a study session, tag it with a subject, set weekly
hour goals, and the page works out your totals, your day streak and where the time went.
Everything is stored in the browser with `localStorage`, so there is no account and no server.

This is my project submission for the front-end module. It is deliberately built with plain
HTML, CSS and JavaScript so that every part of it is something I can explain.

## Run it

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/Project/>. Opening `index.html` directly also works in most
browsers, but a couple of them block `localStorage` on `file://` URLs, in which case the log
will not persist between reloads.

Click **Load sample data** on the Log section to fill the dashboard with a week of example
sessions without typing anything.

## Features

- **Dashboard** — hours this week, sessions logged, current day streak, most studied subject
- **Bar chart** — hours per day for the current Monday-to-Sunday week, drawn with CSS heights (no chart library)
- **Session log** — add, delete, filter by subject, sort by newest / oldest / longest
- **Weekly goals** — hour target per subject with a progress bar that turns green when reached
- **Dark mode** — toggled by swapping one `data-theme` attribute; the palette is all custom properties
- **Responsive** — three-column desktop layout collapses to one column, header becomes a slide-down menu
- **Accessible** — skip link, visible focus rings, `aria-expanded` on the menu, `role="progressbar"` on goals, `prefers-reduced-motion` respected

## Structure

```
Project/
├── index.html      Markup: header, intro, dashboard, log, goals, about, footer
├── css/style.css   Tokens, base, components, responsive
├── js/app.js       State, storage, rendering, event handlers
└── images/         Hand-written SVG (logo, favicon, illustration)
```

`js/app.js` follows one loop: state lives in the `entries` and `goals` arrays, every change
writes to `localStorage` and then calls `renderAll()`, which redraws the stats, chart, list
and goals from that state. Nothing reads values back out of the DOM.

## Layout decisions

**CSS Grid** handles the page-level structure — the two-column intro, the four-across stat row,
the form-beside-list split, the auto-filling goal cards and the footer columns.

**Flexbox** handles the one-dimensional pieces inside those areas — the header bar, the button
rows, the chart columns, each entry card, the goal card header and footer.

Colours, spacing and radii are CSS custom properties in `:root`. Dark mode redefines the same
names under `[data-theme="dark"]`, so no component rule needs a dark-specific override.

## Things I would add next

- Export the log as CSV
- Monthly view alongside the weekly one
- Editing an existing entry instead of deleting and re-adding
- Syncing across devices, which needs a back-end and is a different module
