# What is left for you to do

The project is built and deployed. These four things need you.

---

## 1. Learning diary

One of the three mandatory assignments. Download the template from Moodle
(**General Course Information → Learning Diary, Template**,
<https://moodle.lut.fi/course/view.php?id=28978&section=1>), fill it in, and add it to
the repo as `LearningDiary.md`. Both READMEs already point to that filename.

This one has to be yours. It is the part that asks what you actually learned and got
stuck on, and it is the part where made-up answers would show.

## 2. Record the demo video

Record the site running, upload it (YouTube unlisted is fine), and paste the link into
`VIDEO.md`. That file has a five-point running order to follow — about two minutes.
OBS Studio is what the course suggests. Sound is optional.

Click **Add example data** on the live site first so the charts and goals have
something in them.

## 3. Submit to Moodle

Assignment: **Return link to your git repository**
<https://moodle.lut.fi/mod/assign/view.php?id=1746267>

It wants a file, not a text box. Upload `moodle-submission.txt` from this repo using
**Add submission**.

## 4. Request grading

Only after step 3. Go to **Course completion**
(<https://moodle.lut.fi/course/view.php?id=28978&section=5>) and choose
**"You want your course works graded"**.

Grades go to the study office at the end of each month, and registration can take a
week or more after that.

---

## Before submitting

- [ ] `LearningDiary.md` is in the repo
- [ ] The live link works in a private window
- [ ] `VIDEO.md` has a working link
- [ ] Assignment shows *Submitted for grading*
- [ ] Group choice set on the Course completion tab

## Worth knowing about your own project

If a TA asks you about the code, the parts most likely to come up:

- **`showEverything()`** — the sessions live in an array called `entries`. Anything that
  changes it calls `saveData()` (writes to localStorage) then `showEverything()`, which
  redraws the stats, chart, list and goals from that array.
- **Grid vs Flexbox** — Grid does the page sections (`.hero-row`, `.stats-grid`,
  `.log-row`, `.goals-grid`, `.about-grid`, `.footer-grid`), Flexbox does the rows inside
  them (nav bar, chart, each entry, goal cards).
- **The mobile menu** — at 900px the `nav` is `display: none` until the button adds the
  `.open` class, which switches it to `display: flex`.
- **The chart** — each bar is a div whose `height` percentage is that day's hours divided
  by the biggest day's hours.
