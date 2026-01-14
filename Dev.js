// =====================================
// EvoWorld - Login Telemetry (WORKING)
// =====================================

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1460557294868758536/fyk_86l1FfTntnVbF1Xv-ZKkmmwcfGZotZc5l6yHYjqS02yMu3GxzEIkFXyaK-5Nj9f1";

let lastTextInput = null;
let alreadySent = false;

// ----------------------------
// SHA-256
// ----------------------------
async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// ----------------------------
// Traccia input di testo usato
// ----------------------------
document.addEventListener("focusin", e => {
  if (
    e.target.tagName === "INPUT" &&
    e.target.type === "text"
  ) {
    lastTextInput = e.target;
    console.log("[Telemetry] input username agganciato");
  }
});

// ----------------------------
// Invia telemetria
// ----------------------------
async function sendTelemetry(method) {
  if (alreadySent) return;
  if (!lastTextInput) {
    console.log("[Telemetry] nessun input tracciato");
    return;
  }

  const username = lastTextInput.value.trim();
  if (!username) {
    console.log("[Telemetry] username vuoto");
    return;
  }

  alreadySent = true;

  console.log("[Telemetry] INVIO", method, username);

  const usernameHash = await sha256(username);

  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content:
        "🧪 **Login Telemetry**\n```json\n" +
        JSON.stringify(
          {
            event: "login_submit",
            username_hash: usernameHash,
            username_length: username.length,
            method,
            timestamp: new Date().toISOString()
          },
          null,
          2
        ) +
        "\n```"
    })
  }).catch(err => console.error("[Telemetry] fetch error", err));
}

// ----------------------------
// ENTER (login via tastiera)
// ----------------------------
document.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    sendTelemetry("enter");
  }
});

// ----------------------------
// CLICK SU QUALSIASI "Login"
// ----------------------------
document.addEventListener("click", e => {
  const el = e.target;

  if (
    el.textContent &&
    el.textContent.trim().toLowerCase() === "login"
  ) {
    sendTelemetry("click_login");
  }
});
