function evoAutoLogout() {
    const INTERVAL = 1000;
    const MAX_TIME = 30000;
    const START = Date.now();

    function findLogout(root) {
        const els = root.querySelectorAll("button, a, div, span");

        for (const el of els) {
            if (el.innerText?.trim().toLowerCase() === "logout") {
                return el;
            }
        }

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

        const logoutBtn = findLogout(document);
        if (logoutBtn) {
            logoutBtn.click();
            clearInterval(timer);
        }
    }, INTERVAL);
}
