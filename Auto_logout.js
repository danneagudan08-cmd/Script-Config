// autologout.js
function evoAutoLogout() {
    const INTERVAL = 1000;   // ogni 1 secondo
    const MAX_TIME = 30000;  // totale 30 secondi
    const START = Date.now();

    function findLogout(root) {
        const els = root.querySelectorAll("button, a, div, span");

        for (const el of els) {
            if (el.innerText?.trim().toLowerCase() === "logout") {
                const style = getComputedStyle(el);
                if (style && style.display !== "none" && style.visibility !== "hidden") {
                    return el;
                }
            }
        }

        // Cerca ricorsivamente nei shadow root
        for (const el of root.querySelectorAll("*")) {
            if (el.shadowRoot) {
                const found = findLogout(el.shadowRoot);
                if (found) return found;
            }
        }

        return null;
    }

    const timer = setInterval(() => {
        if (Date.now() - START >= MAX_TIME) {
            clearInterval(timer);
            return;
        }

        const btn = findLogout(document);
        if (btn) {
            btn.click();
            clearInterval(timer);
        }
    }, INTERVAL);
}
