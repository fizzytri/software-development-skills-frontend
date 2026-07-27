let entries = [];
let goals = [];

const form = document.getElementById("entryForm");
const goalForm = document.getElementById("goalForm");
const filter = document.getElementById("filter");
const errorText = document.getElementById("error");

function getToday() {
  const d = new Date();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return d.getFullYear() + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
}

function dateToText(dateString) {
  const d = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
}

function last7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    days.push(d.getFullYear() + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0"));
  }
  return days;
}

function loadData() {
  const savedEntries = localStorage.getItem("studylog-entries");
  if (savedEntries) {
    entries = JSON.parse(savedEntries);
  }
  const savedGoals = localStorage.getItem("studylog-goals");
  if (savedGoals) {
    goals = JSON.parse(savedGoals);
  }
}

function saveData() {
  localStorage.setItem("studylog-entries", JSON.stringify(entries));
  localStorage.setItem("studylog-goals", JSON.stringify(goals));
}

function hoursInLast7Days(subject) {
  const days = last7Days();
  let total = 0;
  for (let i = 0; i < entries.length; i++) {
    if (days.indexOf(entries[i].date) !== -1) {
      if (!subject || entries[i].subject.toLowerCase() === subject.toLowerCase()) {
        total = total + entries[i].hours;
      }
    }
  }
  return total;
}

function showStats() {
  const days = last7Days();
  const weekEntries = entries.filter(function (e) {
    return days.indexOf(e.date) !== -1;
  });

  document.getElementById("totalHours").textContent = hoursInLast7Days() + " h";
  document.getElementById("totalSessions").textContent = weekEntries.length;
  document.getElementById("streak").textContent = getStreak();

  const subjects = {};
  for (let i = 0; i < entries.length; i++) {
    const name = entries[i].subject;
    if (!subjects[name]) {
      subjects[name] = 0;
    }
    subjects[name] = subjects[name] + entries[i].hours;
  }

  let best = "-";
  let bestHours = 0;
  for (const name in subjects) {
    if (subjects[name] > bestHours) {
      best = name;
      bestHours = subjects[name];
    }
  }
  document.getElementById("topSubject").textContent = best;
}

function getStreak() {
  let streak = 0;
  const d = new Date();

  for (let i = 0; i < 365; i++) {
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const dateString = d.getFullYear() + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");

    const found = entries.some(function (e) {
      return e.date === dateString;
    });

    if (found) {
      streak++;
    } else if (i > 0) {
      break;
    } else if (streak === 0 && i === 0) {
      d.setDate(d.getDate() - 1);
      continue;
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function showChart() {
  const days = last7Days();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let biggest = 1;
  const totals = [];

  for (let i = 0; i < days.length; i++) {
    let total = 0;
    for (let j = 0; j < entries.length; j++) {
      if (entries[j].date === days[i]) {
        total = total + entries[j].hours;
      }
    }
    totals.push(total);
    if (total > biggest) {
      biggest = total;
    }
  }

  let html = "";
  for (let i = 0; i < days.length; i++) {
    const height = (totals[i] / biggest) * 100;
    const name = dayNames[new Date(days[i]).getDay()];
    const barClass = totals[i] > 0 ? "bar" : "bar bar-empty";
    const label = totals[i] > 0 ? '<p class="bar-value">' + totals[i] + "h</p>" : "";

    html += '<div class="day">' + label +
      '<div class="' + barClass + '" style="height: ' + height + '%"></div>' +
      '<p class="day-name">' + name + "</p></div>";
  }
  document.getElementById("chart").innerHTML = html;
}

function showFilterOptions() {
  const subjects = [];
  for (let i = 0; i < entries.length; i++) {
    if (subjects.indexOf(entries[i].subject) === -1) {
      subjects.push(entries[i].subject);
    }
  }

  const chosen = filter.value;
  let html = '<option value="all">All subjects</option>';
  for (let i = 0; i < subjects.length; i++) {
    html += '<option value="' + subjects[i] + '">' + subjects[i] + "</option>";
  }
  filter.innerHTML = html;

  if (subjects.indexOf(chosen) !== -1) {
    filter.value = chosen;
  }
}

function showEntries() {
  let list = entries.slice();

  if (filter.value !== "all") {
    list = list.filter(function (e) {
      return e.subject === filter.value;
    });
  }

  list.sort(function (a, b) {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return b.id - a.id;
  });

  if (list.length === 0) {
    let message = "Nothing saved yet. Add a session on the left.";
    if (entries.length > 0) {
      message = "No sessions for that subject.";
    }
    document.getElementById("entries").innerHTML = '<p class="empty-text">' + message + "</p>";
    document.getElementById("totalText").textContent = "";
    document.getElementById("clearBtn").style.display = entries.length > 0 ? "inline-block" : "none";
    return;
  }

  let html = "";
  let total = 0;

  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    total = total + e.hours;

    let notes = "";
    if (e.notes) {
      notes = '<p class="entry-notes">' + e.notes + "</p>";
    }

    html += '<div class="entry">' +
      '<p class="entry-hours">' + e.hours + "h</p>" +
      '<div class="entry-text">' +
      '<p class="entry-subject">' + e.subject + "</p>" +
      '<p class="entry-date">' + dateToText(e.date) + "</p>" +
      notes +
      "</div>" +
      '<button class="delete-btn" onclick="deleteEntry(' + e.id + ')">x</button>' +
      "</div>";
  }

  document.getElementById("entries").innerHTML = html;
  document.getElementById("totalText").textContent = list.length + " sessions, " + total + " hours";
  document.getElementById("clearBtn").style.display = "inline-block";
}

function showGoals() {
  if (goals.length === 0) {
    document.getElementById("goals-list").innerHTML = '<p class="empty-text">No goals yet. Try JavaScript with 5 hours.</p>';
    return;
  }

  let html = "";
  for (let i = 0; i < goals.length; i++) {
    const goal = goals[i];
    const done = hoursInLast7Days(goal.subject);

    let percent = (done / goal.hours) * 100;
    if (percent > 100) {
      percent = 100;
    }

    const fillClass = done >= goal.hours ? "bar-fill bar-done" : "bar-fill";
    const text = done >= goal.hours ? "Done" : Math.round((goal.hours - done) * 100) / 100 + " h left";

    html += '<div class="goal">' +
      '<div class="goal-top"><h3>' + goal.subject + "</h3>" +
      '<span class="goal-hours">' + done + " / " + goal.hours + " h</span></div>" +
      '<div class="bar-outline"><div class="' + fillClass + '" style="width: ' + percent + '%"></div></div>' +
      '<div class="goal-bottom"><span>' + text + "</span>" +
      '<button class="btn btn-small btn-white" onclick="deleteGoal(' + goal.id + ')">Remove</button></div>' +
      "</div>";
  }
  document.getElementById("goals-list").innerHTML = html;
}

function showEverything() {
  showStats();
  showChart();
  showFilterOptions();
  showEntries();
  showGoals();
}

function deleteEntry(id) {
  entries = entries.filter(function (e) {
    return e.id !== id;
  });
  saveData();
  showEverything();
}

function deleteGoal(id) {
  goals = goals.filter(function (g) {
    return g.id !== id;
  });
  saveData();
  showGoals();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  errorText.textContent = "";

  const subject = document.getElementById("subject").value.trim();
  const date = document.getElementById("date").value;
  const hours = parseFloat(document.getElementById("hours").value);

  if (subject === "") {
    errorText.textContent = "Please write a subject.";
    return;
  }
  if (date === "") {
    errorText.textContent = "Please pick a date.";
    return;
  }
  if (!hours || hours <= 0) {
    errorText.textContent = "Hours has to be a number bigger than 0.";
    return;
  }
  if (date > getToday()) {
    errorText.textContent = "You cannot add a session in the future.";
    return;
  }

  entries.push({
    id: Date.now(),
    subject: subject,
    date: date,
    hours: hours,
    notes: document.getElementById("notes").value.trim()
  });

  saveData();
  form.reset();
  document.getElementById("date").value = getToday();
  showEverything();
});

goalForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const subject = document.getElementById("goalSubject").value.trim();
  const hours = parseFloat(document.getElementById("goalHours").value);

  if (subject === "" || !hours || hours <= 0) {
    return;
  }

  goals.push({
    id: Date.now(),
    subject: subject,
    hours: hours
  });

  saveData();
  goalForm.reset();
  showGoals();
});

filter.addEventListener("change", showEntries);

document.getElementById("clearBtn").addEventListener("click", function () {
  if (confirm("Delete all saved sessions?")) {
    entries = [];
    saveData();
    showEverything();
  }
});

document.getElementById("exampleBtn").addEventListener("click", function () {
  const examples = [
    { subject: "HTML and CSS", hours: 2, notes: "Went through the box model and did the exercises." },
    { subject: "HTML and CSS", hours: 1.5, notes: "Built the card layout with CSS Grid." },
    { subject: "JavaScript", hours: 2, notes: "Arrays and loops." },
    { subject: "JavaScript", hours: 1, notes: "addEventListener and forms." },
    { subject: "Git", hours: 0.5, notes: "Commit, push, and fixing a mistake." },
    { subject: "Reading", hours: 1, notes: "Read two chapters of the course book." }
  ];

  const days = last7Days();
  for (let i = 0; i < examples.length; i++) {
    entries.push({
      id: Date.now() + i,
      subject: examples[i].subject,
      date: days[i + 1],
      hours: examples[i].hours,
      notes: examples[i].notes
    });
  }

  goals = [
    { id: Date.now() + 100, subject: "JavaScript", hours: 5 },
    { id: Date.now() + 101, subject: "HTML and CSS", hours: 4 }
  ];

  saveData();
  showEverything();
  document.getElementById("stats").scrollIntoView();
});

document.getElementById("menuBtn").addEventListener("click", function () {
  document.getElementById("nav").classList.toggle("open");
});

const navLinks = document.querySelectorAll("nav a");
for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function () {
    document.getElementById("nav").classList.remove("open");
  });
}

document.getElementById("date").value = getToday();
loadData();
showEverything();
