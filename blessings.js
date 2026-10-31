(() => {
  const section = document.getElementById('blessings');
  const wall = document.getElementById('blessingsWall');
  const wallStatus = document.getElementById('blessingsStatus');
  const form = document.getElementById('blessingForm');
  if (!section || !wall || !form) return;
  const name = document.getElementById('blessingName');
  const message = document.getElementById('blessingMessage');
  const consent = document.getElementById('blessingConsent');
  const counter = document.getElementById('blessingCount');
  const submit = document.getElementById('blessingSend');
  const status = document.getElementById('blessingFormStatus');
  const retry = document.getElementById('blessingRetry');
  const endpoint = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.blessingsApiOrigin : '';
  const expected = 'https://sia-blessings.toastybug.chatgpt.site';
  if (endpoint !== expected) return;
  let challenge = '', busy = false, saved = false;
  const words = value => value.trim() ? value.trim().split(/\s+/u).length : 0;
  function say(key) { status.dataset.i18n = key; status.textContent = t(key); }
  function countWords() {
    const count = words(message.value);
    counter.textContent = `${count} / 200`;
    counter.classList.toggle('over-limit', count > 200);
    message.setCustomValidity(count > 200 ? t('blessings_too_long') : '');
    submit.disabled = busy || saved || !challenge || count > 200;
  }
  async function ready() {
    challenge = ''; countWords(); retry.hidden = true;
    try {
      const r = await fetch(endpoint + '/api/challenge', {cache: 'no-store'});
      const b = await r.json();
      if (!r.ok || typeof b.challenge !== 'string') throw new Error('Unavailable');
      challenge = b.challenge; countWords();
    } catch (_) { say('blessings_connect_error'); retry.hidden = false; }
  }
  retry.addEventListener('click', ready);
  message.addEventListener('input', countWords);
  document.addEventListener('sia-language-change', countWords);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || saved || !challenge) return;
    const count = words(message.value);
    if (!name.value.trim() || !count || count > 200) { say('blessings_validation'); return; }
    busy = true; countWords(); say('blessings_sending');
    try {
      const r = await fetch(endpoint + '/api/blessings', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: name.value, message: message.value, consent: consent.checked,
          challenge, website: document.getElementById('blessingWebsite').value,
          source: new URLSearchParams(location.search).get('from') === 'evite' ? 'evite' : 'website'})
      });
      const b = await r.json();
      if (!r.ok || !b.saved) {
        say(r.status === 429 ? 'blessings_wait' : 'blessings_save_error');
        await ready(); return;
      }
      saved = true;
      say(consent.checked ? 'blessings_saved_public' : 'blessings_saved_private');
      form.querySelector('fieldset').disabled = true;
    } catch (_) { say('blessings_save_error'); }
    finally { busy = false; countWords(); }
  });
  async function loadBlessings() {
    try {
      const response = await fetch(endpoint + '/api/blessings', {cache: 'no-store'});
      if (!response.ok) throw new Error('Unavailable');
      const data = await response.json();
      if (!Array.isArray(data.blessings)) throw new Error('Invalid blessings');
      const fragment = document.createDocumentFragment();
      data.blessings.slice(0, 500).forEach(entry => {
        if (!entry || typeof entry.name !== 'string' || typeof entry.message !== 'string' || !entry.message.trim()) return;
        const card = document.createElement('blockquote');
        const quote = document.createElement('span'); quote.className = 'blessing-quote'; quote.textContent = '“'; quote.setAttribute('aria-hidden', 'true');
        const body = document.createElement('p'); body.textContent = entry.message;
        const author = document.createElement('cite'); author.textContent = '— ' + entry.name;
        card.append(quote, body, author); fragment.append(card);
      });
      wall.replaceChildren(fragment);
      wallStatus.hidden = wall.childElementCount > 0;
      wallStatus.dataset.i18n = 'blessings_empty'; wallStatus.textContent = t('blessings_empty');
    } catch (_) {
      wallStatus.hidden = false; wallStatus.dataset.i18n = 'blessings_error'; wallStatus.textContent = t('blessings_error');
    }
  }
  document.getElementById('blessingsRefresh').addEventListener('click', loadBlessings);
  document.getElementById('blessingCompose').addEventListener('toggle', event => {
    if (event.target.open && !challenge && !saved) ready();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); loadBlessings(); }
    }, {rootMargin: '200px'}); observer.observe(section);
  } else loadBlessings();
})();
