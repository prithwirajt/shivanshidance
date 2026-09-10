/* Event times use Toronto's UTC offset on April 24, 2027. */
const EVENT_DATE = new Date('2027-04-24T16:30:00-04:00');
const PERFORMANCE_END = new Date('2027-04-24T19:30:00-04:00');
let currentLang = 'en';
let preferredLang = 'en';
try { preferredLang = localStorage.getItem('sia_lang') === 'bn' ? 'bn' : 'en'; } catch (_) {}

function t(key) {
  const entry = I18N[key];
  return entry ? (entry[currentLang] ?? entry.en) : '';
}

function applyLanguage(lang) {
  currentLang = lang === 'bn' ? 'bn' : 'en';
  try { localStorage.setItem('sia_lang', currentLang); } catch (_) {}
  document.documentElement.lang = currentLang;
  document.body.classList.toggle('lang-bn', currentLang === 'bn');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (I18N[el.dataset.i18n]) el.innerHTML = t(el.dataset.i18n);
  });
  document.querySelectorAll('.lang-opt').forEach(el => {
    el.classList.toggle('active', el.dataset.lang === currentLang);
  });
  renderCountdown();
}

let bengaliReady = false;
async function requestLanguage(lang) {
  const toggle = document.getElementById('langToggle');
  const status = document.getElementById('languageStatus');
  closeMenu();
  if (lang === 'bn' && !bengaliReady) {
    toggle.disabled = true;
    toggle.setAttribute('aria-busy', 'true');
    status.textContent = 'Loading Bengali…';
    try {
      const response = await fetch('i18n-bn.json?v=musician-page-20260910');
      if (!response.ok) throw new Error('Language unavailable');
      const entries = await response.json();
      Object.entries(entries).forEach(([key, value]) => {
        if (I18N[key] && typeof value === 'string') I18N[key].bn = value;
      });
      const fonts = document.createElement('link');
      fonts.rel = 'stylesheet';
      fonts.href = 'https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400;500;600;700&family=Hind+Siliguri:wght@300;400;500;600&display=swap';
      document.head.appendChild(fonts);
      bengaliReady = true;
    } catch (_) {
      status.textContent = 'Bengali could not load. Check your connection and try again.';
      return;
    } finally {
      toggle.disabled = false;
      toggle.removeAttribute('aria-busy');
    }
  }
  applyLanguage(lang);
  status.textContent = lang === 'bn' ? 'বাংলা ভাষা চালু হয়েছে।' : 'English selected.';
}
document.getElementById('langToggle')?.addEventListener('click', () => {
  requestLanguage(currentLang === 'en' ? 'bn' : 'en');
});

function renderCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  const now = new Date();
  let remaining = EVENT_DATE - now;
  if (remaining <= 0) {
    el.textContent = t(now >= PERFORMANCE_END ? 'cd_finished' : 'cd_arrived');
    return;
  }
  const days = Math.floor(remaining / 86400000); remaining %= 86400000;
  const hours = Math.floor(remaining / 3600000); remaining %= 3600000;
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const box = (n, key) => `<div class="cd-box"><span class="cd-num">${n}</span><span class="cd-label">${t(key)}</span></div>`;
  el.innerHTML = box(days, 'cd_days') + box(hours, 'cd_hours') + box(minutes, 'cd_mins') + box(seconds, 'cd_secs');
}

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const mobileNav = window.matchMedia('(max-width: 900px)');
function closeMenu(returnFocus = true) {
  const wasOpen = navLinks?.classList.contains('open');
  navLinks?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
  if (wasOpen && returnFocus && mobileNav.matches) navToggle.focus();
}
navToggle?.addEventListener('click', () => {
  if (navLinks.classList.contains('open')) { closeMenu(); return; }
  navLinks.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  navLinks.querySelector('a[href], button')?.focus();
});
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  closeMenu(false);
  const target = document.getElementById(link.hash.slice(1));
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}));
document.addEventListener('keydown', event => {
  if (!mobileNav.matches || !navLinks.classList.contains('open')) return;
  if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
  if (event.key === 'Tab') {
    const items = [...navLinks.querySelectorAll('a[href], button:not([disabled])')];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); navToggle.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); navToggle.focus(); }
    else if (document.activeElement === navToggle) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
  }
});
document.addEventListener('click', event => {
  if (navLinks.classList.contains('open') && !event.target.closest('#navbar')) closeMenu(navLinks.contains(document.activeElement));
});
mobileNav.addEventListener('change', () => {
  const focusedInPanel = navLinks.contains(document.activeElement);
  closeMenu(false);
  if (mobileNav.matches && focusedInPanel) navToggle.focus();
  if (!mobileNav.matches && document.activeElement === navToggle) navLinks.querySelector('a[href]')?.focus();
});
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


applyLanguage(currentLang);
if (preferredLang === 'bn') requestLanguage('bn');
