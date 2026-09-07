/* =========================================================
   Sia's Arangetram — Interactivity + Language Switching
   ========================================================= */

/* ---------- 1. EVENT DATE ---------- */
const EVENT_DATE = new Date("2027-04-24T16:00:00-04:00"); // Apr 24 2027, 4 PM Toronto

/* ---------- 2. GUEST LIST ----------
   Replace these sample names with your real 250+ guest list.
   Tip: keep them alphabetical, or paste from a spreadsheet.
   Confirmed RSVPs from the form are added on top of this list. */
const GUEST_LIST = [
  "Aarav & Meera Sharma", "Aditya Kapoor", "Ananya Reddy", "Anjali & Rohit Mehta",
  "Arjun Nair", "Bina Patel", "Deepa Krishnan", "Dev & Riya Malhotra",
  "Divya Iyer", "Gaurav Chauhan", "Harish & Latha Rao", "Isha Banerjee",
  "Jay & Pooja Desai", "Kavya Menon", "Kiran & Sunita Joshi", "Lakshmi Subramanian",
  "Manish Agarwal", "Naina Bhatt", "Neel & Priya Verma", "Nikhil Shetty",
  "Ojas & Tara Kulkarni", "Pallavi Ghosh", "Rahul & Sneha Gupta", "Ramesh Pillai",
  "Sanya Chatterjee", "Shreya Dutta", "Sudhir & Anita Rao", "Tanvi Bose",
  "Uday & Radha Nambiar", "Varun Saxena", "Vidya Ramanathan", "Yash & Kavita Trivedi",
  /* ... add the rest of your 250+ guests below ... */
  "Guest Family 33", "Guest Family 34", "Guest Family 35", "Guest Family 36"
];

/* =========================================================
   LANGUAGE SWITCHING
   ========================================================= */
let currentLang = localStorage.getItem("sia_lang") || "en";

function t(key) {
  const entry = (typeof I18N !== "undefined") && I18N[key];
  if (!entry) return "";
  return entry[currentLang] != null ? entry[currentLang] : entry.en;
}

function applyLanguage(lang) {
  currentLang = (lang === "bn") ? "bn" : "en";
  localStorage.setItem("sia_lang", currentLang);

  // <html> attributes for correct fonts / accessibility
  document.documentElement.setAttribute("lang", currentLang);
  document.body.classList.toggle("lang-bn", currentLang === "bn");

  // Translate all text nodes with a data-i18n key
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (I18N[key]) el.innerHTML = t(key);
  });

  // Translate placeholders
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const key = el.getAttribute("data-i18n-ph");
    if (I18N[key]) el.setAttribute("placeholder", stripTags(t(key)));
  });

  // Update the toggle's active state
  document.querySelectorAll(".lang-opt").forEach(o =>
    o.classList.toggle("active", o.getAttribute("data-lang") === currentLang)
  );

  // Re-render dynamic pieces in the new language
  renderCountdown();
  renderGuests(guestSearch ? guestSearch.value : "");
}

function stripTags(html) {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent || d.innerText || "";
}

const langToggle = document.getElementById("langToggle");
langToggle && langToggle.addEventListener("click", () => {
  applyLanguage(currentLang === "en" ? "bn" : "en");
});

/* =========================================================
   COUNTDOWN
   ========================================================= */
function renderCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;
  const now = new Date();
  let diff = Math.max(0, EVENT_DATE - now);

  if (diff <= 0) {
    el.innerHTML = '<div class="cd-box" style="min-width:auto;padding:0.8rem 1.4rem"><span class="cd-num" style="font-size:1.2rem">' + t("cd_arrived") + '</span></div>';
    return;
  }

  const d = Math.floor(diff / 86400000); diff -= d * 86400000;
  const h = Math.floor(diff / 3600000);  diff -= h * 3600000;
  const m = Math.floor(diff / 60000);    diff -= m * 60000;
  const s = Math.floor(diff / 1000);

  const box = (n, l) => `<div class="cd-box"><span class="cd-num">${n}</span><span class="cd-label">${l}</span></div>`;
  el.innerHTML = box(d, t("cd_days")) + box(h, t("cd_hours")) + box(m, t("cd_mins")) + box(s, t("cd_secs"));
}

/* =========================================================
   NAVBAR — mobile toggle + scroll shadow
   ========================================================= */
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
navToggle && navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
});
navLinks && navLinks.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);
window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 20);
});

/* =========================================================
   GUEST LIST rendering + search
   ========================================================= */
function loadRsvpGuests() {
  try { return JSON.parse(localStorage.getItem("sia_rsvp_guests") || "[]"); }
  catch (e) { return []; }
}
function saveRsvpGuest(name) {
  const list = loadRsvpGuests();
  if (name && !list.includes(name)) { list.push(name); localStorage.setItem("sia_rsvp_guests", JSON.stringify(list)); }
}

function renderGuests(filter = "") {
  const grid = document.getElementById("guestGrid");
  const countEl = document.getElementById("guestCount");
  if (!grid) return;

  const rsvpGuests = loadRsvpGuests();
  const all = [
    ...rsvpGuests.map(n => ({ name: n, isNew: true })),
    ...GUEST_LIST.map(n => ({ name: n, isNew: false }))
  ];

  const f = filter.trim().toLowerCase();
  const shown = f ? all.filter(g => g.name.toLowerCase().includes(f)) : all;

  grid.innerHTML = shown.map(g =>
    `<div class="guest-chip${g.isNew ? " new" : ""}">${g.name}</div>`
  ).join("");

  if (countEl) {
    if (f) {
      const key = shown.length === 1 ? "gc_match" : "gc_matches";
      countEl.textContent = t(key).replace("{n}", shown.length);
    } else {
      countEl.textContent = t("gc_guests").replace("{n}", all.length);
    }
  }
}

const guestSearch = document.getElementById("guestSearch");
guestSearch && guestSearch.addEventListener("input", e => renderGuests(e.target.value));

/* =========================================================
   RSVP FORM
   ========================================================= */
const form = document.getElementById("rsvpForm");
const status = document.getElementById("rsvpStatus");

form && form.addEventListener("submit", e => {
  e.preventDefault();
  const name = form.fullName.value.trim();
  const email = form.email.value.trim();
  const attending = form.attending.value;

  if (!name || !email || !attending) {
    status.textContent = t("msg_fill");
    status.className = "rsvp-status err";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    status.textContent = t("msg_email");
    status.className = "rsvp-status err";
    return;
  }

  const firstName = name.split(" ")[0];
  if (attending === "yes") {
    saveRsvpGuest(name);
    renderGuests(guestSearch ? guestSearch.value : "");
    status.textContent = t("msg_yes").replace("{name}", firstName);
  } else {
    status.textContent = t("msg_no").replace("{name}", firstName);
  }
  status.className = "rsvp-status ok";
  form.reset();
  form.guests.value = 1;

  /* --- To collect RSVPs for real, POST to your service here, e.g. Formspree:
  fetch("https://formspree.io/f/YOUR_ID", {
    method: "POST",
    headers: { "Accept": "application/json" },
    body: new FormData(form)
  });
  ----------------------------------------------------------------- */
});

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
const revealEls = document.querySelectorAll(".section, .info-card, .event-card");
revealEls.forEach(el => el.classList.add("reveal"));
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
}, { threshold: 0.08 });
revealEls.forEach(el => io.observe(el));

/* =========================================================
   INIT — apply saved language on load
   ========================================================= */
applyLanguage(currentLang);
setInterval(renderCountdown, 1000);
