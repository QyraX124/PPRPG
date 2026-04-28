let enClicks = 0;
let selectedSlotIndex = null;

// --- СОСТОЯНИЕ ИГРЫ ---
// --- БАЗА ПРЕДМЕТОВ (бонусы при экипировке) ---
const itemData = {
    "scarlet_flame": { slot: "ring",    bonusPwr: 5,  bonusDef: 0,  bonusLuck: 5  },
    "broken_pen":    { slot: "amulet",  bonusPwr: 3,  bonusDef: 0,  bonusLuck: 0  },
    "empty_jar":     { slot: "cloak",   bonusPwr: 0,  bonusDef: 2,  bonusLuck: 3  },
    "graphite_piece":{ slot: "head",    bonusPwr: 4,  bonusDef: 0,  bonusLuck: 0  },
    "paper_scrap":   { slot: "body",    bonusPwr: 0,  bonusDef: 5,  bonusLuck: 0  },
    "glass_shard":   { slot: "legs",    bonusPwr: 2,  bonusDef: 2,  bonusLuck: 2  },
};

// Базовые статы без учёта экипировки
const baseStats = { pwr: 12, def: 5, luck: 10 };

let state = {
    lvl: 1, pwr: 12, def: 5, luck: 10, hp: 100, maxHp: 100, energy: 50, inks: 0,
    xp: 0, maxXp: 100, 
    petKey: '', petImg: '',
    trainCount: 0, restCount: 0, themeCount: 0,
    inventory: ["scarlet_flame", null, null, null, null, null, null, null, null, null, null, null],
    equipment: { head: null, body: null, legs: null, ring: null, amulet: null, cloak: null },
    achievements: { 
        first_steps: false, 
        sleep_time: false, 
        theme_master: false, 
        czech: false 
    }
};

// Пересчитать статы с учётом всей экипировки
function recalcStats() {
    // baseStats уже содержит базу + бонусы от уровней
    // просто добавляем поверх бонусы экипировки
    state.pwr  = baseStats.pwr  + getEquipBonus('pwr');
    state.def  = baseStats.def  + getEquipBonus('def');
    state.luck = baseStats.luck + getEquipBonus('luck');
}

function getEquipBonus(stat) {
    let total = 0;
    for (const itemId of Object.values(state.equipment)) {
        if (itemId && itemData[itemId]) {
            if (stat === 'pwr')  total += itemData[itemId].bonusPwr  || 0;
            if (stat === 'def')  total += itemData[itemId].bonusDef  || 0;
            if (stat === 'luck') total += itemData[itemId].bonusLuck || 0;
        }
    }
    return total;
}

// Надеть предмет из инвентаря
function equipItem(invIndex) {
    const itemId = state.inventory[invIndex];
    if (!itemId || !itemData[itemId]) return;

    const slot = itemData[itemId].slot;

    // Сначала убираем новый предмет из инвентаря
    state.inventory[invIndex] = null;

    // Если в слоте уже что-то надето — кладём старое в освободившееся место
    if (state.equipment[slot]) {
        const oldItem = state.equipment[slot];
        // invIndex теперь пуст, кладём туда старый предмет
        state.inventory[invIndex] = oldItem;
    }

    state.equipment[slot] = itemId;
    recalcStats();
    saveGame();
    renderInventory();
    renderEquipment();
    updateUI();
}

// Снять предмет из слота экипировки
function unequipItem(slot) {
    const itemId = state.equipment[slot];
    if (!itemId) return;
    const freeSlot = state.inventory.indexOf(null);
    if (freeSlot === -1) { 
        alert('Нет места в инвентаре!');
        return;
    }
    state.inventory[freeSlot] = itemId;
    state.equipment[slot] = null;
    recalcStats();
    saveGame();
    renderInventory();
    renderEquipment();
    updateUI();
}

// Отрисовать слоты экипировки
function renderEquipment() {
    const slots = ['head','body','legs','ring','amulet','cloak'];
    const slotIds = {
        head: 'txt-slot-head', body: 'txt-slot-body', legs: 'txt-slot-legs',
        ring: 'txt-slot-ring', amulet: 'txt-slot-amulet', cloak: 'txt-slot-cloak'
    };
    const t = translations[currentLang];
    const slotNames = {
        head: t.slotHead, body: t.slotBody, legs: t.slotLegs,
        ring: t.slotRing, amulet: t.slotAmulet, cloak: t.slotCloak
    };

    slots.forEach(slot => {
        const el = document.getElementById(slotIds[slot]);
        if (!el) return;
        const equippedId = state.equipment[slot];
        if (equippedId && t.items[equippedId]) {
            el.innerText = t.items[equippedId];
            el.style.borderColor = '#f1c40f';
            el.style.background = 'rgba(241,196,15,0.15)';
            el.style.color = 'var(--text-color)';
            el.title = t.slotHead && slotNames[slot] ? slotNames[slot] : slot;
            el.onclick = () => unequipItem(slot);
        } else {
            el.innerText = slotNames[slot];
            el.style.borderColor = '';
            el.style.background = '';
            el.onclick = null;
        }
    });

    // --- ПАНЕЛЬ БОНУСОВ СПРАВА ---
    let panel = document.getElementById('equip-bonus-panel');
    if (!panel) {
        // Создаём панель один раз и вставляем в inv-container
        panel = document.createElement('div');
        panel.id = 'equip-bonus-panel';
        panel.className = 'inv-section equip-bonus-panel';
        const container = document.querySelector('.inv-container');
        if (container) container.appendChild(panel);
    }

    const totalPwr  = getEquipBonus('pwr');
    const totalDef  = getEquipBonus('def');
    const totalLuck = getEquipBonus('luck');
    const lang = currentLang;

    const lines = [];
    if (totalPwr)  lines.push(`<div class="bonus-line bonus-pwr">⚔️ ${t.pwr}: <span>+${totalPwr}</span></div>`);
    if (totalDef)  lines.push(`<div class="bonus-line bonus-def">🛡️ ${t.def}: <span>+${totalDef}</span></div>`);
    if (totalLuck) lines.push(`<div class="bonus-line bonus-luck">🍀 ${t.luck}: <span>+${totalLuck}</span></div>`);

    const title = lang === 'ru' ? 'Бонусы' : (lang === 'cz' ? 'Bonusy' : 'Bonuses');
    const empty = lang === 'ru' ? 'Нет экипировки' : (lang === 'cz' ? 'Bez vybavení' : 'No equipment');

    panel.innerHTML = `
        <p class="handwritten small" style="margin-bottom:10px">✨ ${title}</p>
        ${lines.length ? lines.join('') : `<div class="bonus-empty">${empty}</div>`}
        <hr style="border-color:var(--ink-color);opacity:0.3;margin:10px 0">
        <div class="bonus-line" style="opacity:0.7">⚔️ ${t.pwr}: <span>${state.pwr}</span></div>
        <div class="bonus-line" style="opacity:0.7">🛡️ ${t.def}: <span>${state.def}</span></div>
        <div class="bonus-line" style="opacity:0.7">🍀 ${t.luck}: <span>${state.luck}%</span></div>
    `;
}

function loadGame() {
    const saved = localStorage.getItem('pprpg_save');
    if (saved) {
        state = { ...state, ...JSON.parse(saved) };
        if (!state.equipment) {
            state.equipment = { head: null, body: null, legs: null, ring: null, amulet: null, cloak: null };
        }

        // --- ДОБАВЬ ЭТОТ БЛОК НИЖЕ ---
        // Проверяем, если выбран дракон, но картинка всё еще старая
        if (state.petKey === 'pet_dragon' && state.petImg === 'assets/dragon.png') {
            state.petImg = 'baby_dragon.png'; // Укажи здесь точное имя своего файла
            saveGame(); // Сразу сохраняем новый путь
        }
        if (state.petKey === 'pet_cat' && state.petImg === 'assets/cat.png') {
            state.petImg = 'cat_archer.png'; // Твое имя файла
            saveGame();
        }
        if (state.petKey === 'pet_unicorn' && state.petImg === 'assets/unicorn.png') {
            state.petImg = 'unicorn_medic.png'; // Имя твоего файла
            saveGame();
        }
    }
}
function saveGame() {
    localStorage.setItem('pprpg_save', JSON.stringify(state));
}

loadGame();

window.onload = () => {
    // 1. Сразу применяем тему и язык (но за экраном загрузки)
    if (localStorage.getItem('pprpg_theme') === 'dark') document.body.classList.add('dark-mode');
    applyLanguage();
    showCzechButton();

    // 2. Запускаем имитацию загрузки
    fakeLoading();
};

function fakeLoading() {
    const fill = document.getElementById('loader-fill');
    const status = document.getElementById('loader-status');
    const loader = document.getElementById('screen-loader');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20; // Случайная скорость загрузки
        if (progress > 100) progress = 100;
        
        fill.style.width = `${progress}%`;
        
        // Меняем текст статуса
        if (progress > 20) status.innerText = currentLang === 'ru' ? "Подготовка кистей..." : "Preparing brushes...";
        if (progress > 50) status.innerText = currentLang === 'ru' ? "Рисование мира..." : "Drawing the world...";
        if (progress > 80) status.innerText = currentLang === 'ru' ? "Пробуждение Алого пламени..." : "Awakening the Scarlet Flame...";

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                // Скрываем загрузку и решаем, какой экран показать
                loader.classList.add('loader-hidden');
                
                if (state.petKey) {
                    document.getElementById('screen-selection').classList.add('hidden');
                    document.getElementById('screen-main').classList.remove('hidden');
                } else {
                    document.getElementById('screen-selection').classList.remove('hidden');
                }
                updateUI();
            }, 500);
        }
    }, 300);
}

function applyLanguage() {
    const t = translations[currentLang];
    
    // Заголовки и кнопки действий
    document.getElementById('txt-main-title').innerText = t.mainTitle;
    document.getElementById('txt-actions').innerText = t.actions;
    document.getElementById('btn-train').innerText = t.train;
    document.getElementById('btn-rest').innerText = t.rest;
    
    // ВОТ ЭТИ ДВЕ СТРОЧКИ:
    document.getElementById('btn-dungeon').innerText = t.dungeon;
    document.getElementById('btn-achievements').innerText = t.achBtn;

    // Панель героя и рюкзак
    document.getElementById('txt-hero').innerText = t.hero;
    document.getElementById('btn-inv').innerText = t.inv;
    document.getElementById('btn-theme').innerText = t.theme;
    
    // Заголовки модальных окон
    document.getElementById('txt-ach-title').innerText = t.achTitle;
    document.getElementById('txt-inv-title').innerText = t.invTitle;
    
    // Статы
    document.getElementById('txt-energy-label').innerText = t.energyLabel;
    document.getElementById('txt-lvl').innerText = t.lvl;
    document.getElementById('txt-xp').innerText = t.xp;
    document.getElementById('txt-pwr').innerText = t.pwr;
    document.getElementById('txt-def').innerText = t.def;
    document.getElementById('txt-luck').innerText = t.luck;
    document.getElementById('txt-inks').innerText = t.inks;

    document.getElementById('txt-inv-equip').innerText = t.invEquip;
    document.getElementById('txt-inv-items').innerText = t.invItems;

    document.getElementById('txt-slot-head').innerText = t.slotHead;
    document.getElementById('txt-slot-body').innerText = t.slotBody;
    document.getElementById('txt-slot-legs').innerText = t.slotLegs;
    document.getElementById('txt-slot-ring').innerText = t.slotRing;
    document.getElementById('txt-slot-amulet').innerText = t.slotAmulet;
    document.getElementById('txt-slot-cloak').innerText = t.slotCloak;

    document.getElementById('txt-dungeon-back').innerText = (currentLang === 'ru') ? "Назад" : (currentLang === 'cz' ? "Zpět" : "Back");

    updateUI();
}

function updateUI() {
    const t = translations[currentLang];
    const petImgEl = document.getElementById('pet-img');
    if (state.petKey) document.getElementById('pet-name').innerText = t[state.petKey];

    if (state.petKey === 'pet_dragon') {
            petImgEl.style.setProperty('--glow-color', 'rgba(231, 76, 60, 0.6)'); // Красный
        } else if (state.petKey === 'pet_cat') {
            petImgEl.style.setProperty('--glow-color', 'rgba(46, 204, 113, 0.6)'); // Зеленый
        } else if (state.petKey === 'pet_unicorn') {
            petImgEl.style.setProperty('--glow-color', 'rgba(155, 89, 182, 0.6)'); // Фиолетовый/Розовый
        }
    
    document.getElementById('pet-img').src = state.petImg;
    document.getElementById('hp').innerText = state.hp;
    document.getElementById('max-hp').innerText = state.maxHp;
    document.getElementById('energy').innerText = state.energy;
    document.getElementById('lvl').innerText = state.lvl;
    document.getElementById('xp').innerText = state.xp;
    document.getElementById('max-xp').innerText = state.maxXp;
    document.getElementById('pwr').innerText = state.pwr;
    document.getElementById('def').innerText = state.def;
    document.getElementById('luck').innerText = state.luck;
    document.getElementById('inks').innerText = state.inks;
}

// --- ФУНКЦИЯ ПЕРЕЗАРЯДКИ ---
function startCooldown(btn) {
    const originalText = btn.innerText;
    btn.disabled = true;
    let timeLeft = 3;

    const timer = setInterval(() => {
        btn.innerText = `⏳ ${timeLeft}s`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timer);
            btn.disabled = false;
            btn.innerText = originalText;
        }
    }, 1000);
}

// --- ЛОГИКА ИГРЫ ---
function initPet(key, img) {
    state.petKey = key; state.petImg = img;
    saveGame();
    document.getElementById('screen-selection').classList.add('hidden');
    document.getElementById('screen-main').classList.remove('hidden');
    applyLanguage();
}

function train() {
    if (state.energy >= 10) {
        state.energy -= 10;
        state.xp += 40;
        state.trainCount++;
        
        if (state.trainCount >= 2 && !state.achievements.first_steps) {
            state.achievements.first_steps = true;
            showAchievementToast(translations[currentLang].achs.first_steps.title);
        }

        // 1. Запоминаем текущий уровень ДО тренировки
        const oldLvl = state.lvl; 

        // 2. Добавляем опыт (цифру можно свою)
        state.xp += 5; 

        // 3. Логика повышения уровня
        while (state.xp >= state.maxXp) {
            state.xp -= state.maxXp;
            state.lvl++;
            state.maxXp = Math.floor(state.maxXp * 1.2);
            state.maxHp += 10;
            state.hp = state.maxHp;
            baseStats.pwr += 2;
            baseStats.def += 3;
            recalcStats();
        }

        // 4. ПРОВЕРКА: Если новый уровень больше старого — показываем плашку
        if (state.lvl > oldLvl) {
            showLevelUpToast(state.lvl);
        }

        // Левелап обрабатывается выше в while-цикле
        
        saveGame(); 
        updateUI();
        startCooldown(event.target); // Запуск таймера
        
        if (!document.getElementById('achievements-modal').classList.contains('hidden')) renderAchievements();
    } else {
        alert(currentLang === 'ru' ? "Мало энергии!" : "Low energy!");
    }
}

function rest() {
    state.energy = 50;
    state.hp = state.maxHp;
    state.restCount++;
    if (state.restCount >= 1 && !state.achievements.sleep_time) {
        state.achievements.sleep_time = true;
        showAchievementToast(translations[currentLang].achs.sleep_time.title);
    }
    
    saveGame(); 
    updateUI();
    startCooldown(event.target); // Запуск таймера
    
    if (!document.getElementById('achievements-modal').classList.contains('hidden')) renderAchievements();
}

// Открытие/Закрытие инвентаря
function toggleInventory() {
    const modal = document.getElementById('inventory-modal');
    modal.classList.toggle('hidden');
    
    if (!modal.classList.contains('hidden')) {
        selectedSlotIndex = null;
        renderInventory();
        renderEquipment();
    }
}

// Отрисовка слотов
function renderInventory() {
    // В твоём HTML id может быть 'inv-slots' или 'inv-grid', проверь его!
    const grid = document.getElementById('inv-slots'); 
    grid.innerHTML = '';
    
    const itemLexicon = translations[currentLang].items;

    state.inventory.forEach((item, index) => {
        const slot = document.createElement('div');
        // В твоём CSS это класс 'slot', добавим поддержку выбора
        slot.className = 'slot'; 
        
        if (selectedSlotIndex === index) {
            slot.classList.add('selected-slot'); // Тот самый желтый неон
        }

        if (item) {
            const label = itemLexicon[item] || item;
            const canEquip = itemData[item];
            // Если выбран этот слот и предмет экипируемый — подсказка
            if (selectedSlotIndex === index && canEquip) {
                slot.innerText = label + '\n👆 надеть';
                slot.style.fontSize = '0.6rem';
            } else {
                slot.innerText = label;
                slot.style.fontSize = '';
            }
        } else {
            slot.classList.add('empty');
            slot.innerText = itemLexicon["none"];
        }

        slot.onclick = () => handleSlotClick(index);
        grid.appendChild(slot);
    });

    // В конце функции renderInventory()
const trash = document.getElementById('trash-bin');
if (trash) {
    // Если слот выбран И он не пустой
    if (selectedSlotIndex !== null && state.inventory[selectedSlotIndex] !== null) {
        trash.classList.add('trash-active');
    } else {
        trash.classList.remove('trash-active');
    }
}

}

// Логика клика по предмету в инвентаре
function handleSlotClick(index) {
    const clickedItem = state.inventory[index];

    // Если предмет можно экипировать — показываем меню
    if (clickedItem && itemData[clickedItem]) {
        if (selectedSlotIndex === index) {
            // Второй клик — надеть
            equipItem(index);
            selectedSlotIndex = null;
        } else {
            selectedSlotIndex = index;
        }
    } else if (clickedItem) {
        // Предмет без слота — просто выбираем для перемещения
        if (selectedSlotIndex === null) {
            selectedSlotIndex = index;
        } else {
            const temp = state.inventory[selectedSlotIndex];
            state.inventory[selectedSlotIndex] = state.inventory[index];
            state.inventory[index] = temp;
            selectedSlotIndex = null;
            saveGame();
        }
    } else {
        // Пустой слот — переместить выбранный предмет сюда
        if (selectedSlotIndex !== null) {
            const temp = state.inventory[selectedSlotIndex];
            state.inventory[selectedSlotIndex] = state.inventory[index];
            state.inventory[index] = temp;
            selectedSlotIndex = null;
            saveGame();
        }
    }

    renderInventory();
}

// --- ДОСТИЖЕНИЯ ---
function toggleAchievements() {
    const modal = document.getElementById('achievements-modal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) renderAchievements();
}

function renderAchievements() {
    const list = document.getElementById('achievements-list');
    list.innerHTML = '';
    const tAchs = translations[currentLang].achs;

    const data = [
        { id: 'first_steps', cur: state.trainCount, goal: 2 },
        { id: 'sleep_time', cur: state.restCount, goal: 1 },
        { id: 'theme_master', cur: state.themeCount, goal: 5 },
        { id: 'czech', cur: state.achievements.czech ? 1 : 0, goal: 1 }
    ];

    data.forEach(item => {
        const isDone = state.achievements[item.id] || item.cur >= item.goal;
        const card = document.createElement('div');
        card.className = `achievement-card ${isDone ? 'completed' : 'locked'}`;
        
        const displayCur = Math.min(item.cur, item.goal);
        const percent = (displayCur / item.goal) * 100;

        card.innerHTML = `
            <b>${tAchs[item.id].title}</b>
            <p style="font-size: 0.9rem; margin: 5px 0;">${tAchs[item.id].desc}</p>
            <div style="font-size: 0.8rem;">${displayCur} / ${item.goal}</div>
            <div class="ach-progress-bar"><div class="ach-progress-fill" style="width: ${percent}%"></div></div>
        `;
        list.appendChild(card);
    });
}

function showAchievementToast(title) {
    const container = document.getElementById('achievement-container');
    if (!container) return; // На всякий случай проверяем, есть ли контейнер
    
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `🏆 ${title}`;
    
    container.appendChild(toast);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500); // Ждем конца анимации
    }, 3000);
}

// --- СЕРВИСНЫЕ ФУНКЦИИ ---
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    state.themeCount++;
    if (state.themeCount >= 5 && !state.achievements.theme_master) {
        state.achievements.theme_master = true;
        showAchievementToast(translations[currentLang].achs.theme_master.title);
    }
    localStorage.setItem('pprpg_theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    saveGame();
}

function showCzechButton() {
    if (state.achievements.czech && !document.getElementById('btn-lang-cz')) {
        const container = document.querySelector('.lang-switcher');
        const btn = document.createElement('button');
        btn.id = 'btn-lang-cz';
        btn.className = 'sketch-btn mini';
        btn.innerText = 'CZ';
        btn.onclick = () => changeLanguage('cz');
        container.appendChild(btn);
    }
}

// --- DRAG & DROP ---
let activeModal = null;
let offset = { x: 0, y: 0 };
document.addEventListener('mousedown', e => {
    const header = e.target.closest('.draggable-window .window-header');
    if (header) {
        activeModal = header.parentElement;
        const rect = activeModal.getBoundingClientRect();
        offset.x = e.clientX - rect.left;
        offset.y = e.clientY - rect.top;
    }
});
document.addEventListener('mousemove', e => {
    if (activeModal) {
        activeModal.style.position = 'fixed';
        activeModal.style.left = (e.clientX - offset.x) + 'px';
        activeModal.style.top = (e.clientY - offset.y) + 'px';
        activeModal.style.transform = 'none';
    }
});
document.addEventListener('mouseup', () => activeModal = null);

// Если функция отрисовки данжей существует, запускаем её при смене языка
if (typeof renderDungeons === 'function') {
    renderDungeons();
}

function showLevelUpToast(level) {
    // Удаляем старое уведомление, если оно еще висит
    const oldToast = document.querySelector('.level-up-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'level-up-toast';
    
    // Текст в зависимости от языка
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    const levelText = lang === 'ru' ? "уровень" : (lang === 'cz' ? "úroveň" : "level");
    
    toast.innerHTML = `<span class="star">⭐</span> ${level} ${levelText} <span class="star">⭐</span>`;
    
    document.body.appendChild(toast);
    
    // Плавное появление
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Удаление через 3 секунды
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function addXp(amount) {
    const oldLvl = state.lvl;
    state.xp += amount;
    
    while (state.xp >= state.maxXp) {
        state.xp -= state.maxXp;
        state.lvl++;
        
        state.maxXp = Math.floor(state.maxXp * 1.3);
        baseStats.pwr += 2;
        baseStats.def += 3;
        recalcStats();
        state.maxHp += 10;
        state.hp = state.maxHp;
    }

    if (state.lvl > oldLvl) {
        showLevelUpToast(state.lvl);
    }
    
    updateUI(); // Эта функция обязательна, она перерисовывает цифры
    saveGame();
}

// 1. Добавляем статы новым предметам (добавь в свой объект itemData)
itemData["def_amulet"] = { slot: "amulet", bonusPwr: 0, bonusDef: 8, bonusLuck: 0 };
itemData["plastic_sword"] = { slot: "ring", bonusPwr: 10, bonusDef: 0, bonusLuck: 0 }; // Меч пока что кольцо

// 2. База рецептов
const recipes = [
    {
        result: "def_amulet",
        requirements: { "glass_shard": 2, "graphite_piece": 1 }
    },
    {
        result: "ink_jar",
        requirements: { "broken_pen": 2, "empty_jar": 1 }
    },
    {
        result: "plastic_sword",
        requirements: { "broken_pen": 1, "graphite_piece": 1 }
    }
];

// 3. Логика интерфейса крафта
function openCraft() {
    const modal = document.getElementById('craft-modal');
    const list = document.getElementById('craft-list');
    list.innerHTML = '';
    modal.classList.remove('hidden');

    const t = translations[currentLang];

    recipes.forEach(recipe => {
        // Проверяем, хватает ли ресурсов
        const canCraft = Object.entries(recipe.requirements).every(([item, count]) => {
            const currentCount = state.inventory.filter(i => i === item).length;
            return currentCount >= count;
        });

        const btn = document.createElement('div');
        // Используем стили ачивок для красивой обводки
        btn.className = `achievement-card ${canCraft ? 'completed' : 'locked'}`; 
        
        let reqText = Object.entries(recipe.requirements)
            .map(([item, count]) => {
                const currentCount = state.inventory.filter(i => i === item).length;
                const itemName = t.items[item] || item;
                // Красим текст красным, если не хватает
                const color = currentCount >= count ? 'inherit' : '#e74c3c'; 
                return `<span style="color: ${color}">- ${itemName} (${currentCount}/${count})</span>`;
            }).join('<br>');

        const resultName = t.items[recipe.result] || recipe.result;

        btn.innerHTML = `
            <b style="font-size: 1.2rem;">${resultName}</b>
            <p style="font-size: 0.9rem; margin: 5px 0;">${t.reqs}<br>${reqText}</p>
            <button class="sketch-btn mini mt-10" ${canCraft ? '' : 'disabled'} 
                onclick="craftItem('${recipe.result}')">${t.craftBtn}</button>
        `;
        list.appendChild(btn);
    });
}

function craftItem(resultKey) {
    // Проверка места в инвентаре ДО крафта (если это не расходник)
    if (resultKey !== 'ink_jar' && state.inventory.indexOf(null) === -1) {
        alert(currentLang === 'ru' ? "Нет места в инвентаре!" : "Inventory is full!");
        return;
    }

    const recipe = recipes.find(r => r.result === resultKey);
    
    // Удаляем ингредиенты
    Object.entries(recipe.requirements).forEach(([item, count]) => {
        for(let i = 0; i < count; i++) {
            const index = state.inventory.indexOf(item);
            if (index > -1) state.inventory[index] = null; // Освобождаем слот
        }
    });

    // Выдаем награду
    if (resultKey === 'ink_jar') {
        state.inks += 50;
        showAchievementToast(currentLang === 'ru' ? "Банка чернил использована! +50 🖋️" : "Ink Jar used! +50 🖋️");
    } else {
        const emptyIndex = state.inventory.indexOf(null);
        state.inventory[emptyIndex] = resultKey;
        showAchievementToast(translations[currentLang].items[resultKey] + " создано!");
    }
    
    saveGame();
    updateUI();
    openCraft(); // Перерисовываем список, чтобы обновить циферки ресурсов
    
    // Если открыт инвентарь - тоже обновим
    if (!document.getElementById('inventory-modal').classList.contains('hidden')) {
        renderInventory();
    }
}

function closeCraft() {
    document.getElementById('craft-modal').classList.add('hidden');
}

// --- ЛОГИКА УДАЛЕНИЯ ПРЕДМЕТОВ ---
function throwItemToTrash() {
    if (selectedSlotIndex === null) return;
    const item = state.inventory[selectedSlotIndex];
    if (!item) return;

    const lang = currentLang;
    const itemName = translations[lang].items[item] || item;

    // Удаляем старое модальное если есть
    const old = document.getElementById('trash-confirm-modal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'trash-confirm-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); z-index: 99999;
        display: flex; align-items: center; justify-content: center;
    `;

    const titleText = lang === 'ru' ? 'Выбросить предмет?' : (lang === 'cz' ? 'Zahodit předmět?' : 'Discard item?');
    const itemLabel = lang === 'ru' ? 'Предмет' : (lang === 'cz' ? 'Předmět' : 'Item');
    const yesText = lang === 'ru' ? '🗑️ Выбросить' : (lang === 'cz' ? '🗑️ Zahodit' : '🗑️ Discard');
    const noText = lang === 'ru' ? 'Отмена' : (lang === 'cz' ? 'Zrušit' : 'Cancel');

    modal.innerHTML = `
        <div style="
            background: var(--panel-bg);
            border: 4px solid var(--ink-color);
            box-shadow: 8px 8px 0 var(--ink-color);
            padding: 30px;
            min-width: 280px;
            text-align: center;
            font-family: 'Courier New', monospace;
            backdrop-filter: blur(5px);
        ">
            <div style="font-size: 2.5rem; margin-bottom: 10px;">🗑️</div>
            <div style="font-size: 1.2rem; font-weight: 900; color: var(--text-color); margin-bottom: 8px;">${titleText}</div>
            <div style="font-size: 0.9rem; opacity: 0.7; margin-bottom: 20px; border: 1px dashed var(--ink-color); padding: 8px;">
                ${itemLabel}: <strong>${itemName}</strong>
            </div>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="trash-yes-btn" style="
                    background: rgba(231,76,60,0.15);
                    border: 3px solid #e74c3c;
                    color: #e74c3c;
                    padding: 10px 20px;
                    font-family: inherit; font-weight: 900; font-size: 1rem;
                    cursor: pointer; box-shadow: 3px 3px 0 #e74c3c;
                ">${yesText}</button>
                <button id="trash-no-btn" style="
                    background: transparent;
                    border: 3px solid var(--ink-color);
                    color: var(--text-color);
                    padding: 10px 20px;
                    font-family: inherit; font-weight: 900; font-size: 1rem;
                    cursor: pointer; box-shadow: 3px 3px 0 var(--ink-color);
                ">${noText}</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('trash-yes-btn').onclick = () => {
        state.inventory[selectedSlotIndex] = null;
        selectedSlotIndex = null;
        saveGame();
        renderInventory();
        modal.remove();
    };

    document.getElementById('trash-no-btn').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}