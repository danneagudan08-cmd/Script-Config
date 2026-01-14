// =====================================
// EvoWorld - Login Telemetry (ROBUST)
// =====================================

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1460557294868758536/fyk_86l1FfTntnVbF1Xv-ZKkmmwcfGZotZc5l6yHYjqS02yMu3GxzEIkFXyaK-5Nj9f1";

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
// INVIO TELEMETRIA
// ----------------------------
async function sendTelemetry(username, method) {
  if (!username) return;

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
  }).catch(() => {});
}

// ----------------------------
// TROVA INPUT USERNAME
// ----------------------------
function getUsernameInput() {
  return [...document.querySelectorAll("input")]
    .find(i =>
      i.placeholder &&
      i.placeholder.toLowerCase().includes("username")
    );
}

// ----------------------------
// ENTER NEL CAMPO USERNAME
// ----------------------------
document.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;

  const input = getUsernameInput();
  if (!input) return;

  sendTelemetry(input.value.trim(), "enter");
});

// ----------------------------
// CLICK SU BOTTONE LOGIN
// ----------------------------
document.addEventListener("click", e => {
  const el = e.target;

  if (
    el.tagName === "BUTTON" &&
    el.textContent.trim().toLowerCase() === "login"
  ) {
    const input = getUsernameInput();
    if (!input) return;

    sendTelemetry(input.value.trim(), "button");
  }
});
