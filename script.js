/* Event times use Toronto's UTC offset on April 24, 2027. */
const EVENT_DATE = new Date('2027-04-24T16:30:00-04:00');
const PERFORMANCE_END = new Date('2027-04-24T19:30:00-04:00');
let currentLang = 'en';
try { currentLang = localStorage.getItem('sia_lang') === 'bn' ? 'bn' : 'en'; } catch (_) {}

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

document.getElementById('langToggle')?.addEventListener('click', () => {
  applyLanguage(currentLang === 'en' ? 'bn' : 'en');
  closeMenu();
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
function closeMenu() {
  navLinks?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
}
navToggle?.addEventListener('click', () => {
  navToggle.setAttribute('aria-expanded', String(navLinks.classList.toggle('open')));
});
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

function eventbriteDestination(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const allowed = ['eventbrite.com', 'eventbrite.ca'];
    const validHost = allowed.some(domain => host === domain || host.endsWith('.' + domain));
    if (url.protocol !== 'https:' || !validHost || url.username || url.password) return null;
    if (!url.pathname.startsWith('/e/')) return null;
    return url.href;
  } catch (_) { return null; }
}

/* Navigation is never treated as a completed registration. */
const registrationUrl = eventbriteDestination(typeof SITE_CONFIG === 'undefined' ? '' : SITE_CONFIG.eventbriteUrl);
if (registrationUrl) {
  document.getElementById('eventbriteLink').href = registrationUrl;
  document.getElementById('registrationReady').hidden = false;
  document.getElementById('registrationPending').hidden = true;
}

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section, .info-card, .event-card').forEach(el => {
    el.classList.add('reveal'); observer.observe(el);
  });
}
applyLanguage(currentLang);
setInterval(renderCountdown, 1000);

/* Native dialog keeps focus inside the expanded photo and supports Escape. */
const photoLightbox = document.getElementById('photoLightbox');
const lightboxImage = document.getElementById('lightboxImage');
let photoTrigger = null;
document.querySelectorAll('.gallery-photo').forEach(link => {
  link.addEventListener('click', event => {
    if (typeof photoLightbox.showModal !== 'function' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    photoTrigger = link;
    const thumbnail = link.querySelector('img');
    lightboxImage.src = link.href;
    lightboxImage.alt = thumbnail.alt;
    photoLightbox.querySelector('button').setAttribute('aria-label', currentLang === 'bn' ? 'ছবি বন্ধ করুন' : 'Close photograph');
    photoLightbox.setAttribute('aria-label', currentLang === 'bn' ? 'বড় করে দেখা ছবি' : 'Expanded photograph');
    photoLightbox.showModal();
    document.body.classList.add('lightbox-open');
  });
});
photoLightbox.querySelector('.lightbox-close').addEventListener('click', () => photoLightbox.close());
photoLightbox.addEventListener('click', event => {
  if (event.target === photoLightbox) photoLightbox.close();
});
photoLightbox.addEventListener('close', () => {
  document.body.classList.remove('lightbox-open');
  lightboxImage.removeAttribute('src');
  photoTrigger?.focus();
});

/* Placeholder links are activated only for supplied, valid social URLs. */
document.querySelectorAll('[data-social]').forEach(link => {
  const kind = link.dataset.social;
  const value = SITE_CONFIG.social?.[kind];
  if (!value) return;
  try {
    const url = new URL(value);
    const domains = { youtube: ['youtube.com', 'youtu.be'], facebook: ['facebook.com'], instagram: ['instagram.com'] };
    if (url.protocol !== 'https:' || url.username || url.password ||
        !domains[kind].some(host => url.hostname === host || url.hostname.endsWith('.' + host))) return;
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.removeAttribute('aria-disabled');
    link.querySelector('span').remove();
  } catch (_) {}
});
