# Software Development Skills: Front-End 2025-26 — Diego Jalal

Coursework and project submission for the LUT Anytime course
*Software Development Skills: Front-End 2025-26*.

Everything here is plain HTML, CSS and JavaScript. There is no build step, no package
manager and no dependencies to install.

## Live sites

| | Link |
|---|---|
| Coursework exercise site | https://fizzytri.github.io/software-development-skills-frontend/Coursework/ |
| Project — StudyLog | https://fizzytri.github.io/software-development-skills-frontend/Project/ |

> Live once GitHub Pages is enabled — see the deployment steps below.

## Repository contents

```
.
├── Coursework/        Exercise site built while following the tutorial series
│   ├── index.html
│   ├── css/style.css
│   ├── js/main.js
│   ├── images/
│   └── README.md      Maps each module tasklist item to the code
├── Project/           StudyLog — my own project
│   ├── index.html
│   ├── css/style.css
│   ├── js/app.js
│   ├── images/
│   └── README.md      Features, structure, design decisions
├── LearningDiary.md   Learning diary (written separately)
├── VIDEO.md           Link to the demo video of the project running
└── README.md          This file
```

## How to run

Both sites are static, so there are three equally valid ways to open them.

**Option 1 — just open the file**

Double-click `Project/index.html` (or `Coursework/index.html`). Everything works
except that some browsers restrict `localStorage` on `file://` URLs, so prefer option 2
if the StudyLog log will not save.

**Option 2 — a local server (recommended)**

```bash
git clone https://github.com/fizzytri/software-development-skills-frontend.git
cd software-development-skills-frontend
python -m http.server 8000
```

Then open <http://localhost:8000/Project/> or <http://localhost:8000/Coursework/>.

**Option 3 — VS Code Live Server**

Install the *Live Server* extension, right-click `index.html`, choose **Open with Live Server**.

Any modern browser works (Chrome, Firefox, Edge, Safari). No login and no configuration.

## Course requirement checklist

| Requirement | Where |
|---|---|
| Page with navigation | Sticky header + off-canvas mobile menu in both sites |
| Responsive styles with CSS | Media queries at 900px and 560px (`Project`), 960/768/480px (`Coursework`) |
| Flexbox | Header bar, stat cards, button rows, chart columns, footer bottom |
| CSS Grid | Intro layout, stat row, log layout, goal cards, about cards, footer |
| Deployed website | GitHub Pages — links above |
| Exercise materials | `Coursework/` |
| Learning diary | `LearningDiary.md` |
| README with run instructions | This file |
| Video link file | `VIDEO.md` |

## Deploying to GitHub Pages

The Part 7 tutorial video covers this; the short version:

1. Create a **public** repository on GitHub.
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "Front-end course: coursework and StudyLog project"
   git branch -M main
   git remote add origin https://github.com/fizzytri/software-development-skills-frontend.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment**. Set *Source* to
   **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. Wait a minute or two, then visit `https://fizzytri.github.io/software-development-skills-frontend/Project/`.
5. The link table at the top of this file already points at those URLs.

All asset paths are relative, so the sites work from a project subpath without any changes.

## Notes on sources

No code was copied verbatim from a tutorial or from Stack Overflow. The structure of the
`Coursework/` site follows the course tutorial series
([Traversy Media — Professional Website From Scratch](https://www.youtube.com/watch?v=HXYZxVbWkjc)),
and the deployment steps follow the course's
[Part 7 video](https://www.youtube.com/watch?v=qGYNbrT9P6Y).
Reference material used while building: MDN Web Docs for CSS Grid, Flexbox,
`localStorage` and the `Intl`/`toLocaleDateString` date formatting API.
