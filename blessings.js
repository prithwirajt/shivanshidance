(() => {
  const section = document.getElementById('blessings');
  const status = document.getElementById('blessingsStatus');
  const wall = document.getElementById('blessingsWall');
  try {
    const value = SITE_CONFIG.blessingsFormUrl;
    const url = value ? new URL(value) : null;
    if (url && url.protocol === 'https:' && !url.username && !url.password) {
      const link = document.getElementById('blessingsSubmit');
      link.href = url.href;
      link.hidden = false;
      document.getElementById('blessingsPending').hidden = true;
      document.getElementById('blessingsNotice').hidden = false;
    }
  } catch (_) {}
  async function loadBlessings() {
    try {
      const response = await fetch('blessings.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('Unavailable');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid blessings');
      const fragment = document.createDocumentFragment();
      data.slice(0, 100).forEach(entry => {
        if (!entry || typeof entry.name !== 'string' || typeof entry.message !== 'string' || !entry.message.trim()) return;
        const card = document.createElement('blockquote');
        const message = document.createElement('p');
        const author = document.createElement('cite');
        message.textContent = entry.message.slice(0, 1000);
        author.textContent = entry.name.slice(0, 60);
        card.append(message, author);
        fragment.append(card);
      });
      wall.replaceChildren(fragment);
      status.hidden = wall.childElementCount > 0;
    } catch (_) {
      status.dataset.i18n = 'blessings_error';
      status.textContent = t('blessings_error');
    }
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); loadBlessings(); }
    }, { rootMargin: '200px' });
    observer.observe(section);
  } else loadBlessings();
})();
