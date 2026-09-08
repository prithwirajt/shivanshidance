(() => {
  let pendingPrompt = null;
  let installedThisVisit = false;
  const standalone = window.matchMedia('(display-mode: standalone)');
  const button = document.getElementById('installApp');
  const status = document.getElementById('installStatus');
  const isInstalled = () => installedThisVisit || standalone.matches || navigator.standalone === true;
  function message(key) {
    status.dataset.i18n = key;
    status.textContent = t(key);
    status.hidden = false;
  }
  function refresh() {
    const installed = isInstalled();
    button.hidden = installed || !pendingPrompt;
    document.getElementById('installSteps').hidden = installed;
    document.getElementById('installNote').hidden = installed;
    if (installed) message('install_done');
    else if (status.dataset.i18n === 'install_done') status.hidden = true;
  }
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    pendingPrompt = event;
    refresh();
  });
  window.addEventListener('appinstalled', () => {
    installedThisVisit = true;
    pendingPrompt = null;
    refresh();
  });
  standalone.addEventListener('change', refresh);
  button.addEventListener('click', async () => {
    if (!pendingPrompt || isInstalled()) return;
    const prompt = pendingPrompt;
    pendingPrompt = null;
    button.hidden = true;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'dismissed') message('install_dismissed');
      // Only appinstalled or standalone mode confirms installation.
    } catch (_) {
      message('install_retry');
    }
  });
  refresh();
  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Browser menu instructions remain available if registration fails.
    });
  }
})();
