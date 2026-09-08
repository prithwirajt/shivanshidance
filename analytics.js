/* No analytics requests occur until a real public site token is configured. */
(() => {
  const token = SITE_CONFIG.analyticsToken;
  const notice = document.getElementById('analyticsNotice');
  if (typeof token !== 'string' || !/^[a-f0-9]{32}$/i.test(token)) return;
  const optedOut = navigator.globalPrivacyControl === true ||
    ['1', 'yes'].includes(navigator.doNotTrack) ||
    ['1', 'yes'].includes(window.doNotTrack);
  function say(key) {
    notice.dataset.i18n = key;
    notice.textContent = t(key);
  }
  if (optedOut) { say('analytics_optout'); return; }
  function loadAnalytics() {
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.setAttribute('data-cf-beacon', JSON.stringify({ token }));
    script.addEventListener('load', () => say('analytics_on'));
    script.addEventListener('error', () => say('analytics_off'));
    document.head.appendChild(script);
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(loadAnalytics, { timeout: 3000 });
  else window.setTimeout(loadAnalytics, 1500);
})();
