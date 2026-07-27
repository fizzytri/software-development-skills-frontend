# StudyLog

A small web page for writing down study sessions. You add the subject, the date and
how many hours you did, and the page counts your totals for the last 7 days.

Live: https://fizzytri.github.io/software-development-skills-frontend/Project/

## Running it

Open `index.html` in a browser, or use Live Server in VS Code.

There is a button called "Add example data" in the log section which fills the page
with a few sessions, so you can see what it looks like without typing everything in.

## What it does

- Add a session with a subject, date, hours and notes
- Delete a session, or delete all of them
- Filter the list by subject
- Totals for the last 7 days: hours, number of sessions, day streak and most studied subject
- A bar chart of hours per day for the last 7 days
- Weekly goals per subject with a progress bar

## Files

```
index.html      all the HTML
css/style.css   all the CSS
js/app.js       all the JavaScript
images/         one SVG drawing
```

## How it works

Sessions are kept in an array called `entries`. When something changes, `saveData()`
puts the array into localStorage and `showEverything()` redraws the page. The lists
are built by making a string of HTML and putting it into the page with `innerHTML`.

The layout uses CSS Grid for the big sections (hero, stats, log, goals, about, footer)
and Flexbox for the smaller rows like the nav bar, the chart and each entry.

## Things I would still like to add

- Editing a session instead of deleting it and typing it again
- A monthly view, not only the last 7 days
- Saving the data somewhere so it works on more than one computer
