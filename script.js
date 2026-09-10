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
      const response = await fetch('i18n-bn.json?v=meet-20260910');
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
if (preferredLang === 'bn') requestLanguage('bn');
setInterval(renderCountdown, 1000);

/* Lightbox: buttons, arrow keys and one-finger horizontal swipes. */
const photoLightbox = document.getElementById('photoLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const photoCount = document.getElementById('photoCount');
let photoTrigger = null;
let photoIndex = 0;
let activePhotos = [];
function showPhoto(index) {
  if (!activePhotos.length) return;
  photoIndex = (index + activePhotos.length) % activePhotos.length;
  const link = activePhotos[photoIndex];
  lightboxImage.src = link.href;
  lightboxImage.alt = link.querySelector('img').alt;
  photoCount.textContent = (photoIndex + 1) + ' / ' + activePhotos.length;
  photoLightbox.querySelector('.lightbox-close').setAttribute('aria-label', currentLang === 'bn' ? 'ছবি বন্ধ করুন' : 'Close photograph');
  document.getElementById('photoPrev').setAttribute('aria-label', currentLang === 'bn' ? 'আগের ছবি' : 'Previous photograph');
  document.getElementById('photoNext').setAttribute('aria-label', currentLang === 'bn' ? 'পরের ছবি' : 'Next photograph');
  document.getElementById('photoPrev').disabled = activePhotos.length < 2;
  document.getElementById('photoNext').disabled = activePhotos.length < 2;
}
document.querySelectorAll('.gallery-photo').forEach(link => {
  link.addEventListener('click', event => {
    if (typeof photoLightbox.showModal !== 'function' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    photoTrigger = link;
    activePhotos = [...document.querySelectorAll('.gallery-photo')].filter(item => !item.closest('[hidden]'));
    photoLightbox.setAttribute('aria-label', currentLang === 'bn' ? 'বড় করে দেখা ছবি' : 'Expanded photograph');
    showPhoto(activePhotos.indexOf(link));
    photoLightbox.showModal();
    document.body.classList.add('lightbox-open');
  });
});
document.getElementById('photoPrev').addEventListener('click', () => showPhoto(photoIndex - 1));
document.getElementById('photoNext').addEventListener('click', () => showPhoto(photoIndex + 1));
photoLightbox.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
let swipeStart = null;
photoLightbox.addEventListener('touchstart', event => {
  swipeStart = event.touches.length === 1 && event.target === lightboxImage
    ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
}, { passive: true });
photoLightbox.addEventListener('touchend', event => {
  if (!swipeStart || event.changedTouches.length !== 1 || event.touches.length) { swipeStart = null; return; }
  const dx = event.changedTouches[0].clientX - swipeStart.x;
  const dy = event.changedTouches[0].clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(photoIndex + (dx < 0 ? 1 : -1));
}, { passive: true });
photoLightbox.addEventListener('touchcancel', () => { swipeStart = null; }, { passive: true });
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

/* Gallery panels remain readable without JavaScript. */
const galleryTabs = [...document.querySelectorAll('.gallery-tabs [role="tab"]')];
function selectGalleryTab(tab, moveFocus = false) {
  galleryTabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (moveFocus) tab.focus();
}
galleryTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectGalleryTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % galleryTabs.length;
    if (event.key === 'ArrowLeft') next = (index + galleryTabs.length - 1) % galleryTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = galleryTabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectGalleryTab(galleryTabs[next], true); }
  });
});
if (galleryTabs.length) {
  document.querySelector('.gallery-tabs').hidden = false;
  selectGalleryTab(galleryTabs[0]);
}

