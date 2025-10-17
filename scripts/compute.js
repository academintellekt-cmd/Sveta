// Расчёт совместимости и интерпретации

// Знаки зодиака
const zodiacSigns = [
    { name: 'Овен', start: '03-21', end: '04-19', element: 'fire', icon: '♈' },
    { name: 'Телец', start: '04-20', end: '05-20', element: 'earth', icon: '♉' },
    { name: 'Близнецы', start: '05-21', end: '06-20', element: 'air', icon: '♊' },
    { name: 'Рак', start: '06-21', end: '07-22', element: 'water', icon: '♋' },
    { name: 'Лев', start: '07-23', end: '08-22', element: 'fire', icon: '♌' },
    { name: 'Дева', start: '08-23', end: '09-22', element: 'earth', icon: '♍' },
    { name: 'Весы', start: '09-23', end: '10-22', element: 'air', icon: '♎' },
    { name: 'Скорпион', start: '10-23', end: '11-21', element: 'water', icon: '♏' },
    { name: 'Стрелец', start: '11-22', end: '12-21', element: 'fire', icon: '♐' },
    { name: 'Козерог', start: '12-22', end: '01-19', element: 'earth', icon: '♑' },
    { name: 'Водолей', start: '01-20', end: '02-18', element: 'air', icon: '♒' },
    { name: 'Рыбы', start: '02-19', end: '03-20', element: 'water', icon: '♓' }
];

// Элементы
const elements = {
    fire: { name: 'Огонь', compatible: ['fire', 'air'], icon: '🔥' },
    earth: { name: 'Земля', compatible: ['earth', 'water'], icon: '🌍' },
    air: { name: 'Воздух', compatible: ['air', 'fire'], icon: '💨' },
    water: { name: 'Вода', compatible: ['water', 'earth'], icon: '💧' }
};

// Получить знак зодиака по дате
function getZodiacSign(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const checkDate = `${month}-${day}`;
    
    for (const sign of zodiacSigns) {
        // Особая обработка для Козерога (переход через новый год)
        if (sign.name === 'Козерог') {
            if (checkDate >= sign.start || checkDate <= sign.end) {
                return sign;
            }
        } else {
            if (checkDate >= sign.start && checkDate <= sign.end) {
                return sign;
            }
        }
    }
    return zodiacSigns[0]; // Default
}

// Вычислить число жизненного пути (нумерология)
function calculateLifePath(dateString) {
    const date = new Date(dateString);
    const dateStr = date.getFullYear().toString() + 
                    String(date.getMonth() + 1).padStart(2, '0') + 
                    String(date.getDate()).padStart(2, '0');
    
    let sum = 0;
    for (let char of dateStr) {
        sum += parseInt(char);
    }
    
    // Редукция до одной цифры (кроме master numbers 11, 22, 33)
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    
    return sum;
}

// Совместимость чисел жизненного пути
function compareLifePath(lifePath1, lifePath2) {
    const compatibilityMatrix = {
        1: [1, 5, 7],
        2: [2, 4, 6, 8],
        3: [3, 6, 9],
        4: [2, 4, 8],
        5: [1, 5, 7],
        6: [2, 3, 6, 9],
        7: [1, 5, 7],
        8: [2, 4, 6, 8],
        9: [3, 6, 9],
        11: [2, 11, 22],
        22: [4, 11, 22],
        33: [6, 9, 33]
    };
    
    const compatible = compatibilityMatrix[lifePath1] || [];
    if (compatible.includes(lifePath2)) return 85;
    if (lifePath1 === lifePath2) return 75;
    return 50;
}

// Совместимость знаков зодиака
function compareZodiac(sign1, sign2) {
    if (sign1.name === sign2.name) return 70;
    
    const elementCompat = elements[sign1.element].compatible;
    if (elementCompat.includes(sign2.element)) return 85;
    
    // Противоположные знаки (часто хорошая совместимость)
    const opposites = {
        'Овен': 'Весы', 'Телец': 'Скорпион', 'Близнецы': 'Стрелец',
        'Рак': 'Козерог', 'Лев': 'Водолей', 'Дева': 'Рыбы'
    };
    if (opposites[sign1.name] === sign2.name || opposites[sign2.name] === sign1.name) {
        return 75;
    }
    
    return 55;
}

// Совместимость элементов
function compareElements(element1, element2) {
    if (element1 === element2) return 80;
    if (elements[element1].compatible.includes(element2)) return 90;
    return 50;
}

// Дополнительные метрики (возраст, числа и т.д.)
function compareExtras(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    // Разница в возрасте
    const ageDiff = Math.abs(d1.getFullYear() - d2.getFullYear());
    let ageScore = 100 - (ageDiff * 2);
    ageScore = Math.max(50, ageScore);
    
    // Совместимость месяцев
    const monthDiff = Math.abs(d1.getMonth() - d2.getMonth());
    const monthScore = monthDiff < 3 ? 80 : 60;
    
    return (ageScore * 0.6 + monthScore * 0.4);
}

// Главная функция расчёта совместимости
function calculateCompatibility(svetaDate, guestDate) {
    // Парсим даты
    const svetaSign = getZodiacSign(svetaDate);
    const guestSign = getZodiacSign(guestDate);
    
    const svetaLifePath = calculateLifePath(svetaDate);
    const guestLifePath = calculateLifePath(guestDate);
    
    // Вычисляем метрики
    const metrics = {
        lifepathMatch: compareLifePath(svetaLifePath, guestLifePath),
        signAffinity: compareZodiac(svetaSign, guestSign),
        elementBalance: compareElements(svetaSign.element, guestSign.element),
        extras: compareExtras(svetaDate, guestDate)
    };
    
    // Веса из конфига
    const weights = {
        lifepath: 0.35,
        sign: 0.30,
        elements: 0.20,
        misc: 0.15
    };
    
    // Интегральный индекс
    const index = Math.round(
        metrics.lifepathMatch * weights.lifepath +
        metrics.signAffinity * weights.sign +
        metrics.elementBalance * weights.elements +
        metrics.extras * weights.misc
    );
    
    // Генерируем трактовки
    const interpretations = generateInterpretations(index, svetaSign, guestSign, svetaLifePath, guestLifePath);
    
    return {
        index,
        metrics,
        svetaSign,
        guestSign,
        svetaLifePath,
        guestLifePath,
        interpretations
    };
}

// Генерация текстов интерпретаций
function generateInterpretations(index, svetaSign, guestSign, svetaLP, guestLP) {
    let strength, risk, advice;
    
    // Сильные стороны
    if (index >= 80) {
        strength = `Космическая гармония! Ваши энергии сплетаются в удивительный танец. ${svetaSign.name} и ${guestSign.name} создают магнетическое притяжение, основанное на глубоком взаимопонимании и общих вибрациях жизненного пути.`;
    } else if (index >= 60) {
        strength = `Прекрасный потенциал для глубокой связи! Несмотря на различия, ваши ${svetaSign.element === guestSign.element ? 'родственные' : 'дополняющие'} элементы создают баланс. Есть что открыть друг в друге.`;
    } else {
        strength = `Связь через контрасты. ${svetaSign.name} и ${guestSign.name} представляют разные миры, что может стать источником взаимного обогащения и роста. Учитесь друг у друга!`;
    }
    
    // Зоны внимания
    if (index >= 80) {
        risk = `Берегитесь слишком сильного слияния - каждому важно сохранять свою индивидуальность. Не растворяйтесь полностью друг в друге, цените личное пространство.`;
    } else if (index >= 60) {
        risk = `Возможны периоды непонимания из-за разных подходов к жизни. Ключ - открытый диалог и готовность слышать друг друга. Не игнорируйте мелкие разногласия.`;
    } else {
        risk = `Значительные различия в энергетике требуют терпения и принятия. Не пытайтесь переделать друг друга. Уважайте индивидуальность и дайте пространство для роста.`;
    }
    
    // Совет
    if (index >= 80) {
        advice = `✨ Продолжайте делиться своими мечтами и поддерживать друг друга. Ваша связь - редкий дар, цените её. Создавайте вместе что-то прекрасное!`;
    } else if (index >= 60) {
        advice = `🌟 Фокусируйтесь на том, что вас объединяет. Проводите больше времени вместе, находя общие интересы. Ваша связь крепнет через совместный опыт.`;
    } else {
        advice = `💫 Примите ваши различия как возможность расширить горизонты. Учитесь друг у друга, будьте терпеливы. Иногда самые неожиданные союзы становятся самыми ценными.`;
    }
    
    return { strength, risk, advice };
}

// Магические факты (рандомные)
const magicFacts = [
    "🌙 Ваши души встречались в прошлых жизнях, и эта встреча - не случайность.",
    "✨ Числа ваших дат рождения складываются в мастер-число, что указывает на особую миссию.",
    "🔮 Планеты в момент ваших рождений создают уникальный космический узор.",
    "⭐ Ваши энергетические поля резонируют на частоте древних знаний.",
    "🌟 Астрологи говорят: такие сочетания встречаются раз в сотню лет.",
    "💫 Ваши ауры создают удивительный цветовой спектр при соприкосновении.",
    "🌠 В нумерологии ваш союз обозначен как 'Путь Просветления'.",
    "🎭 Ваши архетипы дополняют друг друга, как инь и ян.",
    "🦋 Говорят, бабочки машут крыльями сильнее, когда вы рядом.",
    "🌸 Древние мудрецы называли такие связи 'Танцем Судьбы'."
];

function getRandomMagicFact() {
    return magicFacts[Math.floor(Math.random() * magicFacts.length)];
}

