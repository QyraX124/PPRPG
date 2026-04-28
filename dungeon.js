function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(screenId);
    if (target) target.classList.remove('hidden');
}

function openDungeonSelection() {
    console.log("Вызов выбора данжа...");
    showScreen('screen-dungeon-selection');
    renderDungeons();
    setTimeout(initDungeonScroll, 10);
}

// В начале dungeon.js или внутри логики генерации комнат
const monsters = [
    {
        name: { ru: "Клякса", en: "Ink Blob", cz: "Inkoustová skvrna" },
        hp: 30,
        img: "assets/monster_ink.png" // Путь к твоей новой картинке
    },
    // Можно добавить и босса
    {
        name: { ru: "Чернильный Ужас", en: "Ink Horror", cz: "Inkoustová hrůza" },
        hp: 100,
        img: "assets/boss_ink.png"
    }
];

// В функции, которая отрисовывает врага (например, enterRoom или startBattle)
function setupBattle(isBoss = false) {
    // 1. Выбираем данные монстра
    const monsterName = isBoss ? "Чернильный Ужас" : "Клякса";
    const monsterImg = isBoss ? "assets/boss_ink.png" : "assets/monster_ink.png";
    const monsterHp = isBoss ? 100 : 30;

    currentAdventure.enemyHp = monsterHp;
    currentAdventure.enemyMaxHp = monsterHp;

    // 2. Отрисовка картинки
    const visual = document.getElementById('event-visual');
    if (visual) {
        visual.src = monsterImg; // Устанавливаем путь к картинке
        visual.innerText = "";    // Очищаем старый эмодзи, если он был
    }
    
    // 3. Установка имени
    const nameLabel = document.getElementById('enemy-name-label');
    if (nameLabel) nameLabel.innerText = monsterName;

    // Показываем интерфейс боя
    document.getElementById('enemy-hp-bar').classList.remove('hidden');
    document.getElementById('battle-controls').classList.remove('hidden');
    updateEnemyHpUI();

    // Принудительно включаем кнопки в начале боя
    setBattleButtonsEnabled(true);
    
    // Показываем панель управления боем
    document.getElementById('battle-controls').classList.remove('hidden');
    document.getElementById('adv-controls').classList.add('hidden');

    updateBPUI()
}

const petSkills = {
    'pet_dragon': { name: 'Щит', icon: '🛡️', type: 'def' },
    'pet_unicorn': { name: 'Исцеление', icon: '💖', type: 'heal' },
    'pet_cat': { name: 'Азарт', icon: '🔥', type: 'atk' } // Кот-лучник
};

const dungeons = [
    { 
        id: 'forest', 
        name: { ru: "Тихий Лес", en: "Quiet Forest", cz: "Tichý les" },
        icon: "🌲", recPwr: 10, rooms: 5 
    },
    { 
        id: 'cave', 
        name: { ru: "Чернильная Пещера", en: "Ink Cave", cz: "Inkoustová jeskyně" },
        icon: "🕳️", recPwr: 25, rooms: 8 
    },
    { 
        id: 'temple', 
        name: { ru: "Забытый Храм", en: "Forgotten Temple", cz: "Zapomenutý chrám" },
        icon: "🏛️", recPwr: 50, rooms: 12 
    },
    { 
        id: 'ocean', 
        name: { ru: "Акварельный Океан", en: "Watercolor Ocean", cz: "Akvarelový oceán" },
        icon: "🌊", recPwr: 80, rooms: 15 
    },
    { 
        id: 'archive', 
        name: { ru: "Руины Архива", en: "Archive Ruins", cz: "Ruiny archivu" },
        icon: "📚", recPwr: 120, rooms: 20 
    }
];

function renderDungeons() {
    const list = document.getElementById('dungeon-list');
    const title = document.getElementById('dungeon-selection-title') || document.querySelector('#screen-dungeon-selection h1');
    if (!list) return;
    list.innerHTML = '';

    const ui = {
        ru: { title: "Доступные локации", pwr: "Сила", rms: "Комнат" },
        en: { title: "Available Locations", pwr: "Power", rms: "Rooms" },
        cz: { title: "Dostupné lokace", pwr: "Síla", rms: "Místnosti" }
    };

    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    const t = ui[lang] || ui.ru;

    if (title) title.innerText = t.title;

    list.innerHTML = '';
    dungeons.forEach(dungeon => {
        const dName = dungeon.name[lang] || dungeon.name.en || dungeon.name.ru;
        
        const card = document.createElement('div');
        card.className = 'dungeon-item';
        
        // ВАЖНО: Вот эта строчка заставляет игру реагировать на клик!
        card.onclick = () => startDungeon(dungeon.id);

        card.innerHTML = `
            <div class="dungeon-circle">${dungeon.icon}</div>
            <div class="dungeon-info">
                <h3>${dName}</h3>
                <div class="dungeon-stats">
                    <div class="stat-row"><span>💪 ${t.pwr}:</span><span>${dungeon.recPwr}</span></div>
                    <div class="stat-row"><span>🧩 ${t.rms}:</span><span>${dungeon.rooms}</span></div>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

function initDungeonScroll() {
    const carousel = document.getElementById('dungeon-list');
    if (!carousel) return;

    // Снимаем старые обработчики, если они были, чтобы не множились
    carousel.onwheel = (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            // Крутим горизонтально на величину вертикального скролла
            carousel.scrollLeft += e.deltaY * 1.5; 
        }
    };
}

function startDungeon(dungeonId) {
    state.bp = 5; // Стартовые очки даются только в начале данжа
    // Ищем данные данжа в массиве dungeons (с буквой s!)
    const dData = dungeons.find(d => d.id === dungeonId);
    if (!dData) return;

    const loader = document.getElementById('dungeon-loader');
    const fill = document.getElementById('dungeon-load-fill');
    const status = document.getElementById('dungeon-load-status');
    
    // Показываем лоадер (снимаем класс hidden)
    loader.classList.remove('hidden');
    fill.style.width = '0%';
    
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    document.getElementById('dungeon-load-title').innerText = dData.name[lang] || dData.name.ru;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        fill.style.width = progress + '%';

        // Тексты статуса
        if (progress > 20) status.innerText = translations[lang].loader.drawingMonsters;
        if (progress > 60) status.innerText = translations[lang].loader.settingRooms;

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                // Прячем лоадер обратно
                loader.classList.add('hidden');
                
                // Прячем лоадер обратно
                loader.classList.add('hidden');
                
                // ВМЕСТО ALERT ВСТАВЬ ЭТО:
                initAdventure(dData);
                
            }, 500);
        }
    }, 150);
}

// Состояние текущего похода
let currentAdventure = {
    dungeonId: null,
    totalRooms: 0,
    currentRoom: 0,
    enemyHp: 0,
    enemyMaxHp: 0,
    bp: 5,        // Стартовые очки
    maxBp: 10     // Максимум очков
};

// Новая функция для обновления цифр на экране
function updateBpUI() {
    const bpEl = document.getElementById('bp-value');
    if (bpEl) {
        bpEl.innerText = currentAdventure.bp;
        // Делаем счетчик полупрозрачным, если очков не хватает на навык
        bpEl.parentElement.style.opacity = currentAdventure.bp < 2 ? "0.5" : "1";
    }
}

// 1. Запуск самого приключения
function initAdventure(dData) {
    currentAdventure.dungeonId = dData.id;
    currentAdventure.totalRooms = dData.rooms;
    currentAdventure.currentRoom = 1;
    currentAdventure.bp = 5; // <--- ДОБАВЬ СТАРТОВЫЕ ОЧКИ ЗДЕСЬ
    
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    document.getElementById('adv-dungeon-name').innerText = dData.name[lang] || dData.name.ru;
    
    showScreen('screen-adventure');
    generateRoomEvent(); // Запускаем первую комнату
}

// 2. Отрисовка номера комнаты
function updateRoomUI() {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    const roomTxt = translations[lang].battle.roomCounter;
    document.getElementById('adv-room-counter').innerText = `${roomTxt}: ${currentAdventure.currentRoom} / ${currentAdventure.totalRooms}`;
}

function generateRoomEvent() {
    updateRoomUI();
    updatePlayerHpUI(); // Показываем наше ХП

    const desc = document.getElementById('adv-description');
    const visual = document.getElementById('event-visual');
    const nameLabel = document.getElementById('enemy-name-label'); 
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';

    const basePwr = dungeons.find(d => d.id === currentAdventure.dungeonId).recPwr; 
    currentAdventure.enemyMaxHp = basePwr * currentAdventure.currentRoom; 

    // Выбираем монстра: 30% пиявка, 25% паладин, остальное — клякса
    const roll = Math.random();

    if (roll < 0.3) {
        // --- АКВАРЕЛЬНАЯ ПИЯВКА ---
        currentAdventure.enemyType = 'leech';
        currentAdventure.enemyMaxHp = Math.floor(currentAdventure.enemyMaxHp * 1.2);
        visual.src = "assets/ink_piavka.png";
        if(nameLabel) nameLabel.innerText = translations[lang].battle.leechName;
        desc.innerText = translations[lang].battle.leechDesc;

    } else if (roll < 0.55) {
        // --- ЧЕРНИЛЬНЫЙ ПАЛАДИН ---
        currentAdventure.enemyType = 'paladin';
        currentAdventure.enemyMaxHp = Math.floor(currentAdventure.enemyMaxHp * 1.5); // Паладин живучее
        currentAdventure.paladinShieldActive = true; // Щит активен с первого хода
        visual.src = "assets/ink_paladin.png";
        if(nameLabel) nameLabel.innerText = translations[lang].battle.paladinName;
        desc.innerText = translations[lang].battle.paladinDesc;

    } else {
        // --- КЛЯКСА ---
        currentAdventure.enemyType = 'normal';
        visual.src = "assets/monster_ink.png";
        if(nameLabel) nameLabel.innerText = translations[lang].battle.blobName;
        desc.innerText = translations[lang].battle.blobDesc;
    }

    currentAdventure.enemyHp = currentAdventure.enemyMaxHp;
    updateEnemyHpUI();

    document.getElementById('adv-controls').classList.add('hidden');
    document.getElementById('battle-controls').classList.remove('hidden');
    document.getElementById('enemy-hp-bar').classList.remove('hidden');

    updateBPUI();
}

// 4. Обновление полоски ХП врага
function updateEnemyHpUI() {
    const fill = document.getElementById('enemy-hp-fill');
    const pct = Math.max(0, (currentAdventure.enemyHp / currentAdventure.enemyMaxHp) * 100);
    fill.style.width = `${pct}%`;
}

function playerAttack() {
    let damage = state.pwr;

    // --- ЩИТ ПАЛАДИНА: блокирует 70% урона ---
    if (currentAdventure.enemyType === 'paladin' && currentAdventure.paladinShieldActive) {
        damage = Math.max(1, Math.floor(damage * 0.3));
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
        const desc = document.getElementById('adv-description');
        desc.innerText = translations[lang].battle.shieldAbsorb(damage);
    }

    currentAdventure.enemyHp -= damage;

    // --- Начисляем 1 BP (если не достигнут лимит) ---
    if (currentAdventure.bp < currentAdventure.maxBp) {
        currentAdventure.bp++;
        updateBPUI();
    }
    
    const desc = document.getElementById('adv-description');
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    
    updateEnemyHpUI();

    if (currentAdventure.enemyHp <= 0) {
        finishBattle(); // Враг умер
    } else {
        desc.innerText = translations[lang].battle.dealDamage(damage);
        
        // --- ПЕРЕДАЕМ ХОД ВРАГУ ---
        setBattleButtonsEnabled(false); // Блокируем кнопки
        setTimeout(enemyTurn, 1000); // Враг делает ход через 1 секунду
    }
}
// 6. Переход в следующую комнату
// ВАЖНО: finishBattle() уже делает currentRoom++, поэтому здесь только запускаем следующую комнату
function nextRoom() {
    generateRoomEvent();
}

function initAdventure(dData) {
    currentAdventure.dungeonId = dData.id;
    currentAdventure.totalRooms = dData.rooms;
    currentAdventure.currentRoom = 1;
    
    // 1. Устанавливаем КАРТИНКУ питомца (берем из состояния игры)
    const petImgEl = document.getElementById('pet-visual');
    const petNameLabel = document.getElementById('pet-name-label');
    const t = translations[currentLang];

    if (state.petKey && state.petImg) {
        petImgEl.src = state.petImg; // Устанавливаем путь к файлу (baby_dragon.png и т.д.)
        petNameLabel.innerText = t[state.petKey]; // Имя на нужном языке
    }

    // 2. Устанавливаем НАЗВАНИЕ и ИКОНКУ навыка
    const skillBtn = document.getElementById('btn-skill');
    const skillData = petSkills[state.petKey] || { name: 'Навык', icon: '✨' };
    skillBtn.innerText = `${skillData.icon} ${skillData.name}`;

    // Перевод заголовка данжа
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    document.getElementById('adv-dungeon-name').innerText = dData.name[lang] || dData.name.ru;
    
    showScreen('screen-adventure');
    generateRoomEvent();
}

// Обновляем ХП игрока (визуально)
function updatePlayerHpUI() {
    const fill = document.getElementById('player-hp-fill');
    const pct = (state.hp / state.maxHp) * 100;
    fill.style.width = `${pct}%`;
}

// --- ИСПРАВЛЕННАЯ ЛОГИКА НАВЫКА ---
function useSkill() {
    const desc = document.getElementById('adv-description');
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru'; // Добавили определение языка

    // --- ПРОВЕРКА BP (Теперь нужно 3 очка) ---
    if (currentAdventure.bp < 3) {
        desc.innerText = translations[lang].battle.skillNoBP;
        return; // Выходим из функции, навык не применяется
    }

    // --- ТРАТИМ 3 BP ---
    currentAdventure.bp -= 3;
    
    // Если у Дракона ключ 'pet_dragon'
    if (state.petKey === 'pet_dragon') {
        state.hp = Math.min(state.maxHp, state.hp + 15);
        desc.innerText = translations[lang].battle.skillDragonDesc;
        updatePlayerHpUI();
        
    } else if (state.petKey === 'pet_unicorn') {
        state.hp = Math.min(state.maxHp, state.hp + 30);
        desc.innerText = translations[lang].battle.skillUnicornDesc;
        updatePlayerHpUI();
        
    } else if (state.petKey === 'pet_cat') {
        const crit = Math.floor(state.pwr * 2.5);
        currentAdventure.enemyHp -= crit;
        desc.innerText = translations[lang].battle.skillCatDesc(crit);
        updateEnemyHpUI();
    }

    startCooldown(document.getElementById('btn-skill'));

    if (currentAdventure.enemyHp <= 0) {
        finishBattle();
    } else {
        setBattleButtonsEnabled(false); 
        setTimeout(enemyTurn, 1000); 
    }

    updateBPUI();
}

function finishBattle() {
    const desc = document.getElementById('adv-description');
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    
    desc.innerText = translations[lang].battle.defeated;
    document.getElementById('event-visual').innerText = "💀";

    document.getElementById('battle-controls').classList.add('hidden');
    document.getElementById('enemy-hp-bar').classList.add('hidden');
    
    currentAdventure.currentRoom++;

    // Проверяем, пройден ли данж до конца
    if (currentAdventure.currentRoom > currentAdventure.totalRooms) {
        
        // --- 1. ВЫДАЕМ ЧЕРНИЛА ---
        const baseInks = currentAdventure.totalRooms * 5; 
        const bonusInks = Math.floor(Math.random() * 11);
        const totalInks = baseInks + bonusInks;
        
        state.inks += totalInks; 

        // Заполняем тексты в окне лута
        document.getElementById('txt-loot-title').innerText = translations[lang].battle.lootTitle;
        document.getElementById('loot-title-text').innerText = translations[lang].battle.dungeonCleared;
        document.getElementById('loot-inks-val').innerText = `+${totalInks}`;
        
        const itemBox = document.getElementById('loot-item-box');
        const itemNameEl = document.getElementById('loot-item-name');
        
        // Прячем слот с предметом по умолчанию
        itemBox.classList.add('hidden'); 

        // --- 2. ШАНС НА ПРЕДМЕТ (зависит от данжа) ---
        // forest: 30%, cave: 45%, temple: 60%, ruins: 70%, void: 85%
        const dropChanceByDungeon = {
            forest: 0.30, cave: 0.45, temple: 0.60, ruins: 0.70, void: 0.85
        };
        const baseDropChance = dropChanceByDungeon[currentAdventure.dungeonId] || 0.40;

        // Пул предметов — на сложных данжах редкие предметы выпадают чаще
        const isHardDungeon = ['ruins', 'void'].includes(currentAdventure.dungeonId);
        const lootPool = [
            { id: "empty_jar",       weight: isHardDungeon ? 15 : 30 },
            { id: "graphite_piece",  weight: isHardDungeon ? 15 : 30 },
            { id: "paper_scrap",     weight: isHardDungeon ? 15 : 25 },
            { id: "glass_shard",     weight: isHardDungeon ? 35 : 15 },
            { id: "broken_pen",      weight: isHardDungeon ? 20 : 20 },
        ];
        const totalWeight = lootPool.reduce((s, i) => s + i.weight, 0);

        const dropChance = Math.random();
        if (dropChance <= baseDropChance) {
            // Взвешенный случайный выбор
            let roll = Math.random() * totalWeight;
            let newItem = lootPool[lootPool.length - 1].id;
            for (const entry of lootPool) {
                roll -= entry.weight;
                if (roll <= 0) { newItem = entry.id; break; }
            }

            const emptySlotIndex = state.inventory.indexOf(null);
            if (emptySlotIndex !== -1) {
                state.inventory[emptySlotIndex] = newItem;
                const itemLabel = translations[lang] && translations[lang].items[newItem]
                    ? translations[lang].items[newItem]
                    : newItem;
                itemNameEl.innerText = itemLabel;
                itemBox.classList.remove('hidden');
            }
        }

        saveGame();
        if (typeof updateUI === 'function') updateUI();

        // Показываем кнопку "Забрать награды" вместо мгновенного открытия
        const btn = document.getElementById('btn-next-room');
        btn.innerText = translations[lang].battle.collectRewards;
        btn.onclick = () => {
            document.getElementById('adv-controls').classList.add('hidden');
            btn.onclick = nextRoom;
            btn.innerText = translations[lang].battle.goDeeper;
            document.getElementById('loot-modal').classList.remove('hidden');
        };
        document.getElementById('adv-controls').classList.remove('hidden');
        
    } else {
        // Если еще есть комнаты
        document.getElementById('adv-controls').classList.remove('hidden');
        document.getElementById('btn-next-room').innerText = translations[lang].battle.goDeeper;
    }
}

function enemyTurn() {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    const desc = document.getElementById('adv-description');
    
    // --- ЛОГИКА АКВАРЕЛЬНОЙ ПИЯВКИ ---
if (currentAdventure.enemyType === 'leech') {
    const monsterName = translations[lang].battle.leechName;
    
    // Проверяем порог здоровья
    const lowHp = currentAdventure.enemyHp < currentAdventure.enemyMaxHp * 0.6;
    // Бросаем кубик: 50% шанс на хил, если ХП мало
    const decidesToHeal = lowHp && Math.random() < 0.5;

    if (decidesToHeal) {
        // ЛОГИКА ЛЕЧЕНИЯ
        const healAmt = Math.floor(Math.random() * 6) + 15; // Хил 15-20
        currentAdventure.enemyHp = Math.min(currentAdventure.enemyMaxHp, currentAdventure.enemyHp + healAmt);
        updateEnemyHpUI();
        
        desc.innerText = translations[lang].battle.leechHeal(monsterName, healAmt);
            
    } else {
        // ЛОГИКА АТАКИ (происходит если ХП > 60% ИЛИ если рандом не выбрал хил)
        const finalDamage = Math.max(1, Math.floor(state.pwr * 0.3));
        state.hp -= finalDamage;
        if (state.hp < 0) state.hp = 0;
        updatePlayerHpUI();
        
        desc.innerText = translations[lang].battle.leechHit(monsterName, finalDamage);
    }
        
    // --- ЛОГИКА ЧЕРНИЛЬНОГО ПАЛАДИНА ---
    } else if (currentAdventure.enemyType === 'paladin') {
        const monsterName = translations[lang].battle.paladinName;

        // Паладин атакует на 20% от урона игрока
        const finalDamage = Math.max(1, Math.floor(state.pwr * 0.2));
        state.hp -= finalDamage;
        if (state.hp < 0) state.hp = 0;
        updatePlayerHpUI();

        // После атаки паладин всегда поднимает щит снова
        currentAdventure.paladinShieldActive = true;

        desc.innerText = translations[lang].battle.paladinHit(monsterName, finalDamage);

    // --- ЛОГИКА ОБЫЧНОЙ КЛЯКСЫ ---
    } else {
        const monsterName = translations[lang].battle.blobName;
        const isCrit = Math.random() < 0.1;
        let finalDamage;

        if (isCrit) {
            finalDamage = state.pwr;
        } else {
            finalDamage = 5 + Math.floor(Math.random() * 4);
        }

        state.hp -= finalDamage;
        if (state.hp < 0) state.hp = 0;
        updatePlayerHpUI();

        if (isCrit) {
            desc.innerText = translations[lang].battle.blobCrit(monsterName, finalDamage);
            
            document.getElementById('game-container').classList.add('shake');
            setTimeout(() => document.getElementById('game-container').classList.remove('shake'), 500);
        } else {
            desc.innerText = translations[lang].battle.blobHit(monsterName, finalDamage);
        }
    }

    // Проверка на поражение
    if (state.hp <= 0) {
        setTimeout(gameOver, 1000);
    } else {
        setBattleButtonsEnabled(true);
    }
}

// Вспомогательная функция, чтобы игрок не спамил кликами, пока ходит враг
function setBattleButtonsEnabled(enabled) {
    const controls = document.getElementById('battle-controls');
    if (enabled) {
        controls.style.pointerEvents = 'auto';
        controls.style.opacity = '1';
    } else {
        controls.style.pointerEvents = 'none';
        controls.style.opacity = '0.5';
    }
}

// Что происходит, если ХП игрока падает до 0
function gameOver() {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    alert(translations[lang].battle.playerDefeated);
    
    state.hp = Math.floor(state.maxHp * 0.3); // Воскрешаем с 30% HP
    updatePlayerHpUI();
    saveGame();

    // 3. РАЗБЛОКИРУЕМ КНОПКИ (Устраняем баг)
    setBattleButtonsEnabled(true);

    // 4. Скрываем боевой интерфейс и возвращаем на экран выбора данжа
    document.getElementById('battle-controls').classList.add('hidden');
    document.getElementById('adv-controls').classList.add('hidden');
    
    showScreen('screen-dungeon-selection');
}

// Единая функция для обновления интерфейса очков (ромбиков)
function updateBPUI() {
    const container = document.getElementById('bp-container');
    if (!container) return;

    container.innerHTML = ''; 
    const maxBP = currentAdventure.maxBp || 10; 
    
    if (typeof currentAdventure.bp === 'undefined') currentAdventure.bp = 5; 
    if (currentAdventure.bp > maxBP) currentAdventure.bp = maxBP;

    for (let i = 0; i < maxBP; i++) {
        const diamond = document.createElement('div');
        diamond.classList.add('bp-diamond');
        
        if (i < currentAdventure.bp) {
            diamond.classList.add('filled');
        }
        
        container.appendChild(diamond);
    }

    // Делаем кнопку тусклой, если не хватает на навык (3 BP)
    const skillBtn = document.getElementById('btn-skill');
    if (skillBtn) {
        skillBtn.style.opacity = currentAdventure.bp < 3 ? "0.5" : "1";
    }
}

function showItemDropToast(itemName) {
    // Создаем элемент уведомления
    const toast = document.createElement('div');
    toast.className = 'achievement-toast item-drop'; // Добавим спец-класс для стиля
    
    const title = translations[currentLang].battle.itemFound;
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">🎁</span>
            <div>
                <div class="toast-title">${title}</div>
                <div class="toast-name">${itemName}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Анимация появления и удаления
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Новая функция для закрытия окна лута (добавь её куда-нибудь в конец dungeon.js)
function closeLootModal() {
    document.getElementById('loot-modal').classList.add('hidden');
    showScreen('screen-dungeon-selection'); // Возвращаем игрока в лобби данжей
}