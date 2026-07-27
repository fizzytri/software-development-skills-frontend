# What is left for you to do

Everything in this folder is finished. These six steps are the ones that need your accounts,
your face on camera, or your own words — I can't do them for you.

---

## 1. Write the learning diary

The course lists it as one of three mandatory assignments, and both READMEs already reference
`LearningDiary.md` at the repo root.

Download the template from Moodle: **General Course Information → Learning Diary, Template**
(<https://moodle.lut.fi/course/view.php?id=28978&section=1>), fill it in, and save it as
`LearningDiary.md` (or keep the template's format) in this folder.

You excluded this from what I built — say the word and I'll draft a structure you can fill in.

## 2. Create the GitHub repository and push

```bash
cd path/to/front-end-course
git init
git add .
git commit -m "Front-end module: coursework and StudyLog project"
git branch -M main
git remote add origin https://github.com/fizzytri/software-development-skills-frontend.git
git push -u origin main
```

The repository must be **public** — the TA has to open it without an account.

The course also recommends committing as you go rather than in one dump. If you want the
history to reflect that, commit `Coursework/` first, then `Project/`, then the docs.

## 3. Turn on GitHub Pages

On GitHub: **Settings → Pages → Build and deployment**
→ Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → **Save**.

After a minute or two your sites are at:

- `https://fizzytri.github.io/software-development-skills-frontend/Project/`
- `https://fizzytri.github.io/software-development-skills-frontend/Coursework/`

The link table at the top of `README.md` already points at these URLs.

## 4. Record the demo video

Record the StudyLog project running — OBS Studio is what the course suggests. Sound and
narration are optional. Upload it to YouTube (unlisted is fine) and paste the link into
`VIDEO.md`.

`VIDEO.md` already lists a six-point running order to follow, which should take about two minutes.

## 5. Submit to Moodle

Assignment: **Return link to your git repository**
<https://moodle.lut.fi/mod/assign/view.php?id=1746267> (currently shows *No submissions have been made yet*)

The assignment expects a **file** containing the link, not a text box. Use
`moodle-submission.txt` in this folder — fill in your repo URL, then upload it via
**Add submission**.

## 6. Request grading

Only after step 5. Go to **Course completion**
(<https://moodle.lut.fi/course/view.php?id=28978&section=5>) and pick
**"You want your course works graded"** in the group choice.

Grades go to the study office at the end of each month, and registration can take a week or more
after that.

---

## Before you submit — quick check

- [ ] Repository is public
- [ ] `LearningDiary.md` is in the repo
- [ ] GitHub Pages links work in a private/incognito window
- [ ] `README.md` link table has the real URLs
- [ ] `VIDEO.md` has a working video link
- [ ] `moodle-submission.txt` has your repo URL
- [ ] Assignment shows *Submitted for grading* in Moodle
- [ ] Group choice set to "You want your course works graded"
