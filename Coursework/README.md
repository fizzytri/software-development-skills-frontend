# Coursework — "Codebase" exercise site

This is the exercise site built while working through the tutorial series linked in the
Front-end module ([Professional Website From Scratch | HTML & CSS For Beginners](https://www.youtube.com/watch?v=HXYZxVbWkjc)
and the [deployment video](https://www.youtube.com/watch?v=qGYNbrT9P6Y)).

It is a single-page responsive marketing site with a sticky header, a mobile menu,
a CSS Grid card layout, an interactive FAQ accordion and a multi-column footer.

## How to run

No build step and no dependencies. Either:

- open `index.html` directly in a browser, or
- from this folder run `python -m http.server 8000` and visit <http://localhost:8000>

VS Code users: right-click `index.html` → **Open with Live Server**.

## Files

| Path | What it holds |
|---|---|
| `index.html` | All markup — header, hero, learn, features, shop, FAQ, footer |
| `css/style.css` | Variables, reset, utility classes, components, media queries |
| `js/main.js` | Mobile menu toggle and FAQ accordion |
| `images/*.svg` | Hand-written SVG illustrations (no binary assets) |

## Module tasklist → where it lives in the code

**1. Introduction and Base HTML (0:00)**
Environment set up (VS Code + Live Server + Git). Semantic document skeleton in `index.html`:
`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, plus
`<meta name="viewport" content="width=device-width, initial-scale=1.0">` — without that tag
the media queries later on do nothing on a real phone.

**2. Links and Core CSS (19:20)**
Homepage markup finished and `css/style.css` created: the `:root` custom-property block
(`--primary`, `--space-*`, `--radius`, `--shadow`), a small reset, base typography.
Native CSS nesting is used throughout — e.g. the `a { &:hover { … } }` block — instead of
repeating selectors.

**3. Buttons & Utility Classes (31:00)**
The hamburger icon is drawn purely in CSS: one `.hamburger-inner` span, with its `::before`
and `::after` pseudo-elements as the other two bars. The `.is-active` class rotates them into
an X. Utility classes (`.container`, `.flex`, `.grid`, `.gap-sm`, `.text-center`, `.btn`,
`.btn-primary`, `.btn-outline`, `.btn-sm`, `.btn-block`) let the HTML compose layouts without
writing new CSS for every block.

**4. CSS Grid & Cards (56:00)**
`.card` component plus `.grid-2` / `.grid-3` / `.grid-4` wrappers. Because the grid columns are
declared once as utilities, the features section and the pricing section reuse the exact same
layout code. `place-items: center` on `.card-icon` is a one-line centring trick.

**5. FAQ elements (1:12:20)**
Accordion built from `<button class="accordion-header">` elements. The body animates with
`max-height` — CSS cannot transition to `height: auto`, so `js/main.js` reads `scrollHeight`
and sets the pixel value. Only one panel stays open at a time. `aria-expanded` is kept in sync
so screen readers report the state. The four-column footer uses the same `.grid-4` utility.

**6. Mobile Menu & Responsiveness (1:47:05)**
Three breakpoints: 960px (4 cols → 2), 768px (everything → 1 col, off-canvas menu appears),
480px (tighter spacing, full-width buttons). The menu slides in with `transform: translateX()`
rather than animating `left`, which is much cheaper for the browser to paint. Body scroll is
locked while the menu is open, and `order: -1` moves the hero image above the text on mobile.

**7. Website Deployment (Part 7)**
Deployed with GitHub Pages — see the deployment steps in the root `README.md`.
Because every path in this folder is relative (`css/style.css`, not `/css/style.css`), the site
works from a project subpath like `username.github.io/repo/Coursework/` without changes.
