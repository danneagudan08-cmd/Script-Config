// =====================================
// EvoWorld - Login Telemetry (Client)
// =====================================

(() => {
  const WEBHOOK_URL =
    "https://discord.com/api/webhooks/1460557294868758536/fyk_86l1FfTntnVbF1Xv-ZKkmmwcfGZotZc5l6yHYjqS02yMu3GxzEIkFXyaK-5Nj9f1";

  // 🔧 CAMBIA QUESTI SELETTORI SE SERVE
  const USERNAME_SELECTOR = "#username";
  const LOGIN_BUTTON_SELECTOR = "#login";

  const usernameInput = document.querySelector(USERNAME_SELECTOR);
  const loginButton = document.querySelector(LOGIN_BUTTON_SELECTOR);

  if (!usernameInput) {
    console.warn("Login telemetry: campo username non trovato");
    return;
  }

  // ==========================
  // HASH SHA-256 (irreversibile)
  // ==========================
  async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // ==========================
  // INVIO TELEMETRIA
  // ==========================
  async function sendTelemetry(method) {
    const username = usernameInput.value.trim();
    if (!username) return;

    const usernameHash = await sha256(username);

    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:
          "🧪 **Login Telemetry**\n" +
          "```json\n" +
          JSON.stringify(
            {
              event: "login_submit",
              username_hash: usernameHash,
              username_length: username.length,
              method: method, // "enter" | "button"
              page: location.pathname,
              timestamp: new Date().toISOString()
            },
            null,
            2
          ) +
          "\n```"
      })
    }).catch(() => {});
  }

  // ==========================
  // EVENTI
  // ==========================

  // ENTER nel campo username
  usernameInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      sendTelemetry("enter");
    }
  });

  // Click bottone login
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      sendTelemetry("button");
    });
  }
})();
