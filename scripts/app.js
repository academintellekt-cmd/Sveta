// Главный файл приложения

// Состояние приложения
const state = {
    svetaDate: null,
    guests: [],
    currentGuestIndex: 0,
    results: []
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    checkIfConfigured();
});

// Загрузка из localStorage
function loadState() {
    const saved = localStorage.getItem('compatibilityState');
    if (saved) {
        const loaded = JSON.parse(saved);
        state.svetaDate = loaded.svetaDate;
        state.guests = loaded.guests || [];
        renderGuestsList();
    }
}

// Сохранение в localStorage
function saveState() {
    localStorage.setItem('compatibilityState', JSON.stringify({
        svetaDate: state.svetaDate,
        guests: state.guests
    }));
}

// Проверка настройки
function checkIfConfigured() {
    // Всегда устанавливаем дату Светы
    state.svetaDate = '1994-10-30';
    saveState();
    
    if (state.guests && state.guests.length > 0) {
        showScreen('guestsScreen');
    } else {
        showScreen('setupScreen');
    }
}

// Переключение экранов
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Сохранение настроек
function saveSettings() {
    // Дата Светы зафиксирована: 30.10.1994
    state.svetaDate = '1994-10-30';
    saveState();
    showScreen('guestsScreen');
}

// Добавить гостя
function addGuest() {
    const nameInput = document.getElementById('guestName');
    const dateInput = document.getElementById('guestBirthDate');
    
    const name = nameInput.value.trim();
    const birthDate = dateInput.value;
    
    if (!name || !birthDate) {
        alert('Заполни все поля');
        return;
    }
    
    const guest = {
        id: Date.now(),
        name,
        birthDate,
        icon: getRandomIcon()
    };
    
    state.guests.push(guest);
    saveState();
    renderGuestsList();
    
    // Очистка формы
    nameInput.value = '';
    dateInput.value = '';
    nameInput.focus();
}

// Удалить гостя
function removeGuest(id) {
    state.guests = state.guests.filter(g => g.id !== id);
    saveState();
    renderGuestsList();
}

// Отрисовка списка гостей
function renderGuestsList() {
    const list = document.getElementById('guestsList');
    const count = document.getElementById('guestCount');
    
    count.textContent = state.guests.length;
    
    if (state.guests.length === 0) {
        list.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px;">Пока нет участников</p>';
        return;
    }
    
    list.innerHTML = state.guests.map((guest, index) => `
        <div class="guest-item" onclick="checkGuestCompatibility(${index})" title="Нажми чтобы проверить совместимость">
            <div class="guest-info">
                <div class="guest-avatar">${guest.icon}</div>
                <div class="guest-details">
                    <h4>${guest.name}</h4>
                    <p>${formatDate(guest.birthDate)}</p>
                </div>
            </div>
            <button class="guest-remove" onclick="event.stopPropagation(); removeGuest(${guest.id})">✕</button>
        </div>
    `).join('');
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Рандомная иконка для гостя
function getRandomIcon() {
    const icons = ['⭐', '🌟', '✨', '💫', '🌙', '☀️', '🌈', '🦋', '🌸', '🍀', '🎭', '🎨', '🎪', '🎯', '🎲'];
    return icons[Math.floor(Math.random() * icons.length)];
}

// Проверить совместимость конкретного гостя
function checkGuestCompatibility(index) {
    if (index < 0 || index >= state.guests.length) {
        alert('Гость не найден');
        return;
    }
    
    state.currentGuestIndex = index;
    showCompatibilityForGuest(index);
}

// Начать расчёт совместимости (устарело, теперь кликаем на гостя)
function startCalculations() {
    if (state.guests.length === 0) {
        alert('Добавь хотя бы одного участника');
        return;
    }
    
    state.currentGuestIndex = 0;
    state.results = [];
    showCompatibilityForGuest(0);
}

// Показать совместимость для гостя
function showCompatibilityForGuest(index) {
    if (index >= state.guests.length) {
        // Все гости обработаны
        showScreen('guestsScreen');
        alert('Все участники проверены! 🎉');
        return;
    }
    
    const guest = state.guests[index];
    state.currentGuestIndex = index;
    
    showScreen('resultScreen');
    
    // ВАЖНО: Останавливаем предыдущую анимацию
    stopMandalaAnimation();
    
    // Показываем мандалу и анимацию
    document.getElementById('mandalaContainer').style.display = 'block';
    document.getElementById('resultContainer').style.display = 'none';
    
    // Очищаем магический факт
    document.getElementById('magicFact').style.display = 'none';
    
    // Запускаем новую анимацию
    startMandalaAnimation();
    
    // Рассчитываем совместимость для ТЕКУЩЕГО гостя
    setTimeout(() => {
        // Получаем актуального гостя на момент выполнения
        const currentGuest = state.guests[state.currentGuestIndex];
        if (!currentGuest) {
            console.error('Гость не найден по индексу:', state.currentGuestIndex);
            return;
        }
        
        console.log('Расчёт для:', currentGuest.name, currentGuest.birthDate);
        
        const result = calculateCompatibility(state.svetaDate, currentGuest.birthDate);
        result.guestName = currentGuest.name;
        result.guestIcon = currentGuest.icon;
        
        state.results[state.currentGuestIndex] = result; // Сохраняем по индексу
        displayResult(result);
        
        // Останавливаем анимацию после показа результата
        stopMandalaAnimation();
    }, 3000); // 3 секунды анимации
}

// Отображение результата
function displayResult(result) {
    console.log('Отображаем результат для:', result.guestName, 'Индекс:', result.index);
    
    // Скрываем мандалу
    document.getElementById('mandalaContainer').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'block';
    
    // Устанавливаем значения - ИМЯ ГОСТЯ
    const guestNameElement = document.getElementById('guestName');
    guestNameElement.textContent = result.guestName;
    guestNameElement.style.animation = 'none';
    setTimeout(() => {
        guestNameElement.style.animation = 'fadeInScale 0.6s ease-out';
    }, 10);
    
    document.getElementById('guestIcon').textContent = result.guestIcon;
    
    // Анимируем число с 0 до значения
    animateValue('compatValue', 0, result.index, 1000);
    
    // Анимация кольца
    const ring = document.getElementById('compatRing');
    const circumference = 339.292;
    const offset = circumference - (result.index / 100 * circumference);
    ring.style.strokeDashoffset = offset;
    
    // Устанавливаем тексты
    document.getElementById('strengthText').textContent = result.interpretations.strength;
    document.getElementById('riskText').textContent = result.interpretations.risk;
    document.getElementById('adviceText').textContent = result.interpretations.advice;
    
    // Глифы
    document.getElementById('glyphLifePath').textContent = Math.round(result.metrics.lifepathMatch);
    document.getElementById('glyphZodiac').textContent = Math.round(result.metrics.signAffinity);
    document.getElementById('glyphElements').textContent = Math.round(result.metrics.elementBalance);
    document.getElementById('glyphEnergy').textContent = Math.round(result.metrics.extras);
    
    // Обновляем иконку знака гостя
    document.getElementById('guestIcon').textContent = result.guestSign.icon;
    
    // Скрываем магический факт
    document.getElementById('magicFact').style.display = 'none';
}

// Показать магический факт
function showMagicFact() {
    const factDiv = document.getElementById('magicFact');
    const factText = document.getElementById('magicFactText');
    
    if (factDiv.style.display === 'none') {
        factText.textContent = getRandomMagicFact();
        factDiv.style.display = 'block';
    } else {
        factDiv.style.display = 'none';
    }
}

// Следующий гость
function nextGuest() {
    const nextIndex = state.currentGuestIndex + 1;
    console.log('Переход к следующему гостю. Текущий индекс:', state.currentGuestIndex, 'Следующий:', nextIndex);
    showCompatibilityForGuest(nextIndex);
}

// Вернуться к списку
function backToGuestList() {
    showScreen('guestsScreen');
}

// Экспорт результатов (опционально)
function exportResults() {
    const dataStr = JSON.stringify(state.results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'compatibility_results.json';
    link.click();
}

// Сброс всех данных
function resetAll() {
    if (confirm('Удалить все данные? Это действие нельзя отменить.')) {
        localStorage.removeItem('compatibilityState');
        state.svetaDate = null;
        state.guests = [];
        state.currentGuestIndex = 0;
        state.results = [];
        stopMandalaAnimation();
        showScreen('setupScreen');
    }
}

// Анимация числа от start до end
function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    const range = end - start;
    const increment = range / (duration / 16); // 60 FPS
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

