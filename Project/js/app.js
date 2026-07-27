const STORAGE_ENTRIES = "studylog.entries";
const STORAGE_GOALS = "studylog.goals";
const STORAGE_THEME = "studylog.theme";
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

let entries = load(STORAGE_ENTRIES, []);
let goals = load(STORAGE_GOALS, []);

const form = document.getElementById("entryForm");
const subjectInput = document.getElementById("subject");
const dateInput = document.getElementById("date");
const hoursInput = document.getElementById("hours");
const notesInput = document.getElementById("notes");
const formError = document.getElementById("formError");
const entriesList = document.getElementById("entries");
const emptyState = document.getElementById("emptyState");
const totalLine = document.getElementById("totalLine");
const clearBtn = document.getElementById("clearBtn");
const demoBtn = document.getElementById("demoBtn");
const filterSubject = document.getElementById("filterSubject");
const sortBy = document.getElementById("sortBy");
const chart = document.getElementById("chart");
const goalForm = document.getElementById("goalForm");
const goalSubject = document.getElementById("goalSubject");
const goalHours = document.getElementById("goalHours");
const goalList = document.getElementById("goalList");
const goalEmpty = document.getElementById("goalEmpty");
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
const themeToggle = document.getElementById("themeToggle");

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn("Could not read " + key, err);
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("Could not save " + key, err);
  }
}

function toISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

function weekDates() {
  const monday = startOfWeek(new Date());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toISO(d);
  });
}

function formatHours(value) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? rounded + "h" : rounded.toFixed(2).replace(/0$/, "") + "h";
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function showError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

function hideError() {
  formError.hidden = true;
}

function entriesThisWeek() {
  const week = weekDates();
  return entries.filter((e) => week.includes(e.date));
}

function calcStreak() {
  const logged = new Set(entries.map((e) => e.date));
  if (logged.size === 0) return 0;

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!logged.has(toISO(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!logged.has(toISO(cursor))) return 0;
  }

  let streak = 0;
  while (logged.has(toISO(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function topSubject() {
  if (entries.length === 0) return null;
  const totals = {};
  entries.forEach((e) => {
    totals[e.subject] = (totals[e.subject] || 0) + e.hours;
  });
  return Object.keys(totals).sort((a, b) => totals[b] - totals[a])[0];
}

function renderStats() {
  const week = entriesThisWeek();
  const weekHours = week.reduce((sum, e) => sum + e.hours, 0);
  const best = topSubject();

  document.getElementById("statWeek").textContent = formatHours(weekHours);
  document.getElementById("statSessions").textContent = String(entries.length);
  document.getElementById("statStreak").textContent = String(calcStreak());
  document.getElementById("statTop").textContent = best || "—";
}

function renderChart() {
  const week = weekDates();
  const today = toISO(new Date());
  const totals = week.map((iso) =>
    entries.filter((e) => e.date === iso).reduce((sum, e) => sum + e.hours, 0)
  );
  const max = Math.max(...totals, 1);

  chart.innerHTML = "";
  week.forEach((iso, i) => {
    const value = totals[i];
    const li = document.createElement("li");
    if (iso === today) li.classList.add("today");

    const bar = document.createElement("div");
    bar.className = "bar" + (value > 0 ? " has-value" : "");
    bar.style.height = Math.max((value / max) * 100, 3) + "%";
    bar.title = DAY_NAMES[i] + ": " + formatHours(value);

    if (value > 0) {
      const label = document.createElement("span");
      label.textContent = formatHours(value);
      bar.appendChild(label);
    }

    const day = document.createElement("span");
    day.className = "day";
    day.textContent = DAY_NAMES[i];

    li.append(bar, day);
    chart.appendChild(li);
  });
}

function renderFilterOptions() {
  const current = filterSubject.value;
  const subjects = [...new Set(entries.map((e) => e.subject))].sort();
  filterSubject.innerHTML = '<option value="all">All subjects</option>';
  subjects.forEach((s) => {
    const option = document.createElement("option");
    option.value = s;
    option.textContent = s;
    filterSubject.appendChild(option);
  });
  filterSubject.value = subjects.includes(current) ? current : "all";
}

function visibleEntries() {
  let list = [...entries];
  if (filterSubject.value !== "all") {
    list = list.filter((e) => e.subject === filterSubject.value);
  }
  if (sortBy.value === "longest") {
    list.sort((a, b) => b.hours - a.hours);
  } else if (sortBy.value === "oldest") {
    list.sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);
  } else {
    list.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  }
  return list;
}

function renderEntries() {
  const list = visibleEntries();
  entriesList.innerHTML = "";

  emptyState.hidden = entries.length > 0;
  clearBtn.hidden = entries.length === 0;

  if (entries.length > 0 && list.length === 0) {
    emptyState.hidden = false;
    emptyState.textContent = "No sessions match that filter.";
  } else if (entries.length > 0) {
    emptyState.textContent = "";
  }

  list.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "entry";

    const hours = document.createElement("span");
    hours.className = "entry-hours";
    hours.textContent = formatHours(entry.hours);

    const body = document.createElement("div");
    const subject = document.createElement("p");
    subject.className = "entry-subject";
    subject.textContent = entry.subject;

    const meta = document.createElement("p");
    meta.className = "entry-meta";
    meta.textContent = formatDate(entry.date);

    body.append(subject, meta);

    if (entry.notes) {
      const notes = document.createElement("p");
      notes.className = "entry-notes";
      notes.textContent = entry.notes;
      body.appendChild(notes);
    }

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "entry-delete";
    remove.setAttribute("aria-label", "Delete session: " + entry.subject);
    remove.textContent = "×";
    remove.addEventListener("click", () => deleteEntry(entry.id));

    li.append(hours, body, remove);
    entriesList.appendChild(li);
  });

  const total = list.reduce((sum, e) => sum + e.hours, 0);
  totalLine.textContent = entries.length
    ? list.length + " session" + (list.length === 1 ? "" : "s") + " shown · " + formatHours(total) + " total"
    : "";
}

function renderGoals() {
  const week = entriesThisWeek();
  goalList.innerHTML = "";
  goalEmpty.hidden = goals.length > 0;

  goals.forEach((goal) => {
    const done = week
      .filter((e) => e.subject.toLowerCase() === goal.subject.toLowerCase())
      .reduce((sum, e) => sum + e.hours, 0);
    const percent = Math.min((done / goal.hours) * 100, 100);
    const complete = done >= goal.hours;

    const li = document.createElement("li");
    li.className = "goal";

    const top = document.createElement("div");
    top.className = "goal-top";

    const title = document.createElement("h3");
    title.textContent = goal.subject;

    const figures = document.createElement("span");
    figures.className = "goal-figures";
    figures.textContent = formatHours(done) + " / " + formatHours(goal.hours);

    top.append(title, figures);

    const track = document.createElement("div");
    track.className = "track";
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-valuenow", String(Math.round(percent)));
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.setAttribute("aria-label", goal.subject + " weekly progress");

    const fill = document.createElement("div");
    fill.className = "track-fill" + (complete ? " done" : "");
    fill.style.width = percent + "%";
    track.appendChild(fill);

    const foot = document.createElement("div");
    foot.className = "goal-foot";

    const status = document.createElement("span");
    status.textContent = complete
      ? "Goal reached this week"
      : formatHours(goal.hours - done) + " to go";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn btn-danger btn-sm";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => deleteGoal(goal.id));

    foot.append(status, remove);
    li.append(top, track, foot);
    goalList.appendChild(li);
  });
}

function renderAll() {
  renderStats();
  renderChart();
  renderFilterOptions();
  renderEntries();
  renderGoals();
}

function addEntry(event) {
  event.preventDefault();
  hideError();

  const subject = subjectInput.value.trim();
  const date = dateInput.value;
  const hours = parseFloat(hoursInput.value);

  if (!subject) return showError("Give the session a subject.");
  if (!date) return showError("Pick a date.");
  if (!hours || hours <= 0) return showError("Hours must be a number above zero.");
  if (hours > 24) return showError("That is more than a day. Try a smaller number.");
  if (date > toISO(new Date())) return showError("You cannot log a session in the future.");

  entries.push({
    id: Date.now(),
    subject,
    date,
    hours,
    notes: notesInput.value.trim()
  });

  save(STORAGE_ENTRIES, entries);
  form.reset();
  dateInput.value = toISO(new Date());
  subjectInput.focus();
  renderAll();
}

function deleteEntry(id) {
  entries = entries.filter((e) => e.id !== id);
  save(STORAGE_ENTRIES, entries);
  renderAll();
}

function addGoal(event) {
  event.preventDefault();
  const subject = goalSubject.value.trim();
  const hours = parseFloat(goalHours.value);
  if (!subject || !hours || hours <= 0) return;

  const existing = goals.find((g) => g.subject.toLowerCase() === subject.toLowerCase());
  if (existing) {
    existing.hours = hours;
  } else {
    goals.push({ id: Date.now(), subject, hours });
  }

  save(STORAGE_GOALS, goals);
  goalForm.reset();
  renderGoals();
}

function deleteGoal(id) {
  goals = goals.filter((g) => g.id !== id);
  save(STORAGE_GOALS, goals);
  renderGoals();
}

function loadSample() {
  if (entries.length && !confirm("This replaces your current log with sample data. Continue?")) return;

  const today = new Date();
  const monday = startOfWeek(today);
  const daysElapsed = Math.round((new Date(toISO(today)) - new Date(toISO(monday))) / 86400000);
  const sample = [
    { offset: 0, subject: "HTML & CSS", hours: 2, notes: "Semantic markup and the box model." },
    { offset: 1, subject: "HTML & CSS", hours: 1.5, notes: "Rebuilt the card grid with CSS Grid." },
    { offset: 1, subject: "Git", hours: 0.75, notes: "Branching, merging, fixing a bad commit message." },
    { offset: 2, subject: "JavaScript", hours: 2.5, notes: "Array methods: map, filter, reduce." },
    { offset: 3, subject: "JavaScript", hours: 1.25, notes: "DOM events and why addEventListener beats onclick." },
    { offset: 4, subject: "Reading", hours: 1, notes: "Foundation HTML5 with CSS3, chapters 4 and 5." }
  ];

  entries = sample.map((s, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + (s.offset % (daysElapsed + 1)));
    return { id: Date.now() + i, subject: s.subject, date: toISO(d), hours: s.hours, notes: s.notes };
  });

  goals = [
    { id: Date.now() + 100, subject: "JavaScript", hours: 5 },
    { id: Date.now() + 101, subject: "HTML & CSS", hours: 4 }
  ];

  save(STORAGE_ENTRIES, entries);
  save(STORAGE_GOALS, goals);
  renderAll();
  document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
}

function clearAll() {
  if (!confirm("Delete every logged session? This cannot be undone.")) return;
  entries = [];
  save(STORAGE_ENTRIES, entries);
  renderAll();
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "Light" : "Dark";
  save(STORAGE_THEME, theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
}

function toggleNav() {
  const open = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

function closeNav() {
  siteNav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
}

form.addEventListener("submit", addEntry);
goalForm.addEventListener("submit", addGoal);
demoBtn.addEventListener("click", loadSample);
clearBtn.addEventListener("click", clearAll);
filterSubject.addEventListener("change", renderEntries);
sortBy.addEventListener("change", renderEntries);
themeToggle.addEventListener("click", toggleTheme);
navToggle.addEventListener("click", toggleNav);

document.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", closeNav));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNav();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeNav();
});

applyTheme(load(STORAGE_THEME, "light"));
dateInput.value = toISO(new Date());
dateInput.max = toISO(new Date());
renderAll();
