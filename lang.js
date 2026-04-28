let currentLang = localStorage.getItem('pprpg_lang') || 'ru';

// --- ПЕРЕВОДЫ ---
const translations = {
    ru: {
        mainTitle: "Первые Наброски", choice1: "Дракон (Танк)", choice2: "Единорог (Хил)", choice3: "Кот-лучник (ДД)",
        actions: "Действия", train: "🏋️ Тренировка", dungeon: "🗺️ Данж", rest: "💤 Отдых",
        energyLabel: "Энергия", hero: "Герой", lvl: "Ур", xp: "Опыт", pwr: "Сила", def: "Защита", luck: "Удача", inks: "Чернила",
        inv: "🎒 Рюкзак", theme: "🌓 Тема", achTitle: "🏆 Достижения", achBtn: "🏆 Достижения", invTitle: "🎒 Инвентарь",
        btnAttack: "⚔️ Атака", btnSkill: "✨ Навык", btnFlee: "🏃 Сбежать", btnNextRoom: "Идти дальше ➡️",
        craft: "⚒️ Крафт", craftTitle: "⚒️ Верстак", craftBtn: "Создать", reqs: "Нужно:",
        items: {
            "scarlet_flame": "🔥 Алое пламя",
            "broken_pen": "🖊️ Сломанная ручка",
            "empty_jar": "🫙 Пустая банка",
            "graphite_piece": "✏️ Кусочек грифеля",
            "paper_scrap": "📄 Клочок бумаги",
            "glass_shard": "💎 Осколок стекла",
            "def_amulet": "🛡️ Амулет защиты",
            "ink_jar": "🫙 Чернильная банка",
            "plastic_sword": "🗡️ Пласт. меч",
            "none": "Пусто"
        },
        invEquip: "Экипировка",
        invItems: "Предметы",
        slotHead: "Голова", slotBody: "Тело", slotLegs: "Ноги",
        slotRing: "Кольцо", slotAmulet: "Амулет", slotCloak: "Плащ",
        dungeonTitle: "Доступные локации",
        recPower: "Сила",
        roomsCount: "Комнат",
        forest: "Тихий Лес",
        cave: "Чернильная Пещера",
        temple: "Забытый Храм",
        pet_dragon: "Дракон", pet_unicorn: "Единорог", pet_cat: "Кот-лучник",
        // Строки боевки
        battle: {
            roomCounter: "Комната",
            leechName: "Акварельная Пиявка", leechDesc: "Склизкая пиявка преграждает путь!",
            paladinName: "Чернильный Паладин", paladinDesc: "Чернильный Паладин поднимает щит! 🛡️",
            blobName: "Клякса", blobDesc: "Дикий монстр преграждает путь!",
            shieldAbsorb: (dmg) => `Щит поглотил удар! Вы нанесли лишь ${dmg} урона. 🛡️`,
            dealDamage: (dmg) => `Вы нанесли ${dmg} урона. ⚔️`,
            paladinHit: (name, dmg) => `${name} наносит слабый удар: -${dmg} HP и поднимает щит! 🛡️`,
            blobCrit: (name, dmg) => `ОПАСНОСТЬ! ${name} поглотила твою энергию и нанесла КРИТ в ${dmg} урона! ⚠️`,
            blobHit: (name, dmg) => `${name} атакует и наносит ${dmg} урона. 💥`,
            leechHit: (name, dmg) => `${name} наносит ${dmg} урона.`,
            leechHeal: (name, hp) => `${name} исцеляется на ${hp} HP!`,
            leechHeal: (name, hp) => `${name} пульсирует и восстанавливает ${hp} HP! 💧`,
            leechHitHeal: (name, dmg, hp) => `${name} наносит ${dmg} урона и исцеляется на ${hp} HP!`,
            defeated: "Враг повержен!",
            dungeonCleared: "Подземелье зачищено!",
            collectRewards: "🎁 Забрать награды",
            goDeeper: "Идти дальше ➡️",
            playerDefeated: "Вас одолели... Придется отступить.",
            itemFound: "Предмет найден!",
            lootTitle: "🎁 Награды",
            skillDragonName: "Щит", skillDragonDesc: "Дракон применяет Щит! Вы восстановили 15 HP и готовы к защите.",
            skillUnicornName: "Исцеление", skillUnicornDesc: "Единорог восстановил вам 30 HP!",
            skillCatName: "Азарт", skillCatDesc: (dmg) => `Кот-лучник впадает в Азарт и наносит ${dmg} критического урона!`,
            skillNoBP: "Недостаточно очков действия!",
        },
        // Загрузчик данжа
        loader: {
            drawingMonsters: "Рисуем монстров...",
            settingRooms: "Стелим ковры в данже...",
        },
        achs: {
            first_steps: { title: "Первые шаги", desc: "Потренируйтесь 2 раза" },
            sleep_time: { title: "Время сна", desc: "Отдохните 1 раз" },
            theme_master: { title: "Мастер теней", desc: "Смените тему 5 раз" },
            czech: { title: "Пражский гость", desc: "Откройте секретный язык" }
        }
    },
    en: {
        mainTitle: "First Sketches", choice1: "Dragon (Tank)", choice2: "Unicorn (Heal)", choice3: "Archer Cat (DD)",
        actions: "Actions", train: "🏋️ Training", dungeon: "🗺️ Dungeon", rest: "💤 Rest",
        energyLabel: "Energy", hero: "Hero", lvl: "Lvl", xp: "XP", pwr: "Pwr", def: "Def", luck: "Luck", inks: "Inks",
        inv: "🎒 Inventory", theme: "🌓 Theme", achTitle: "🏆 Achievements", achBtn: "🏆 Achievements", invTitle: "🎒 Inventory",
        btnAttack: "⚔️ Attack", btnSkill: "✨ Skill", btnFlee: "🏃 Flee", btnNextRoom: "Go deeper ➡️",
        craft: "⚒️ Craft", craftTitle: "⚒️ Workbench", craftBtn: "Craft", reqs: "Requires:",
        items: {
            "scarlet_flame": "🔥 Scarlet Flame",
            "broken_pen": "🖊️ Broken Pen",
            "empty_jar": "🫙 Empty Jar",
            "graphite_piece": "✏️ Graphite Piece",
            "paper_scrap": "📄 Paper Scrap",
            "glass_shard": "💎 Glass Shard",
            "def_amulet": "🛡️ Amulet of Def",
            "ink_jar": "🫙 Ink Jar",
            "plastic_sword": "🗡️ Plastic Sword",
            "none": "Empty"
        },
        invEquip: "Equipment",
        invItems: "Items",
        slotHead: "Head", slotBody: "Body", slotLegs: "Legs",
        slotRing: "Ring", slotAmulet: "Amulet", slotCloak: "Cloak",
        dungeonTitle: "Available Locations",
        recPower: "Power",
        roomsCount: "Rooms",
        forest: "Quiet Forest",
        cave: "Ink Cave",
        temple: "Forgotten Temple",
        pet_dragon: "Dragon", pet_unicorn: "Unicorn", pet_cat: "Archer Cat",
        // Battle strings
        battle: {
            roomCounter: "Room",
            leechName: "Watercolor Leech", leechDesc: "A slimy leech blocks the way!",
            paladinName: "Ink Paladin", paladinDesc: "The Ink Paladin raises his shield! 🛡️",
            blobName: "Ink Blob", blobDesc: "A wild monster appears!",
            shieldAbsorb: (dmg) => `The shield absorbed the blow! You dealt only ${dmg} damage. 🛡️`,
            dealDamage: (dmg) => `You dealt ${dmg} damage. ⚔️`,
            paladinHit: (name, dmg) => `${name} strikes weakly: -${dmg} HP and raises shield! 🛡️`,
            blobCrit: (name, dmg) => `DANGER! ${name} drained your energy and dealt a CRIT of ${dmg} damage! ⚠️`,
            blobHit: (name, dmg) => `${name} attacks for ${dmg} damage. 💥`,
            leechHit: (name, dmg) => `${name} deals ${dmg} damage.`,
            leechHeal: (name, hp) => `${name} heals for ${hp} HP!`,
            leechHeal: (name, hp) => `${name} pulses and restores ${hp} HP! 💧`,
            leechHitHeal: (name, dmg, hp) => `${name} deals ${dmg} damage and heals for ${hp} HP!`,
            defeated: "Enemy defeated!",
            dungeonCleared: "Dungeon Cleared!",
            collectRewards: "🎁 Collect Rewards",
            goDeeper: "Go deeper ➡️",
            playerDefeated: "You have been defeated... Retreat!",
            itemFound: "Item Found!",
            lootTitle: "🎁 Rewards",
            skillDragonName: "Shield", skillDragonDesc: "Dragon activates Shield! You restored 15 HP and brace for impact.",
            skillUnicornName: "Heal", skillUnicornDesc: "Unicorn healed you for 30 HP!",
            skillCatName: "Frenzy", skillCatDesc: (dmg) => `Archer Cat enters Frenzy and deals ${dmg} critical damage!`,
            skillNoBP: "Not enough action points!",
        },
        // Dungeon loader
        loader: {
            drawingMonsters: "Drawing monsters...",
            settingRooms: "Setting up the rooms...",
        },
        achs: {
            first_steps: { title: "First Steps", desc: "Train 2 times" },
            sleep_time: { title: "Sleep Time", desc: "Rest 1 time" },
            theme_master: { title: "Shadow Master", desc: "Change theme 5 times" },
            czech: { title: "Prague Guest", desc: "Unlock secret language" }
        }
    },
    cz: {
        mainTitle: "První Náčrtky", choice1: "Drak (Tank)", choice2: "Jednorožec (Heal)", choice3: "Kočičí Lukostřelec",
        actions: "Akce", train: "🏋️ Trénink", dungeon: "🗺️ Kobka", rest: "💤 Odpočinek",
        energyLabel: "Energie", hero: "Hrdina", lvl: "Úr", xp: "XP", pwr: "Síla", def: "Obrana", luck: "Štěstí", inks: "Inkoust",
        inv: "🎒 Batoh", theme: "🌓 Téma", achTitle: "🏆 Úspěchy", achBtn: "🏆 Úspěchy", invTitle: "🎒 Inventář",
        btnAttack: "⚔️ Útok", btnSkill: "✨ Dovednost", btnFlee: "🏃 Utéct", btnNextRoom: "Jít dál ➡️",
        craft: "⚒️ Výroba", craftTitle: "⚒️ Pracovní stůl", craftBtn: "Vyrobit", reqs: "Vyžaduje:",
        items: {
            "scarlet_flame": "🔥 Šarlatový plamen",
            "broken_pen": "🖊️ Zlomené pero",
            "empty_jar": "🫙 Prázdná sklenice",
            "graphite_piece": "✏️ Kousek grafitu",
            "paper_scrap": "📄 Útržek papíru",
            "glass_shard": "💎 Střep skla",
            "def_amulet": "🛡️ Amulet obrany",
            "ink_jar": "🫙 Nádoba inkoustu",
            "plastic_sword": "🗡️ Plastový meč",
            "none": "Prázdné"
        },
        invEquip: "Vybavení",
        invItems: "Předměty",
        slotHead: "Hlava", slotBody: "Tělo", slotLegs: "Nohy",
        slotRing: "Prsten", slotAmulet: "Amulet", slotCloak: "Plášť",
        dungeonTitle: "Dostupné lokace",
        recPower: "Síla",
        roomsCount: "Místnosti",
        forest: "Tichý les",
        cave: "Inkoustová jeskyně",
        temple: "Zapomenutý chrám",
        pet_dragon: "Drak", pet_unicorn: "Jednorožec", pet_cat: "Kočičí lukostřelec",
        // Řetězce boje
        battle: {
            roomCounter: "Místnost",
            leechName: "Akvarelová pijavice", leechDesc: "Slizká pijavice blokuje cestu!",
            paladinName: "Inkoustový paladin", paladinDesc: "Inkoustový paladin zvedá štít! 🛡️",
            blobName: "Inkoustová skvrna", blobDesc: "Divoká příšera blokuje cestu!",
            shieldAbsorb: (dmg) => `Štít pohltil úder! Způsobili jste jen ${dmg} poškození. 🛡️`,
            dealDamage: (dmg) => `Způsobili jste ${dmg} poškození. ⚔️`,
            paladinHit: (name, dmg) => `${name} zasáhne slabě: -${dmg} HP a zvedne štít! 🛡️`,
            blobCrit: (name, dmg) => `NEBEZPEČÍ! ${name} vysála tvou energii a zasadila KRITICKÝ úder ${dmg} poškození! ⚠️`,
            blobHit: (name, dmg) => `${name} útočí a způsobuje ${dmg} poškození. 💥`,
            leechHit: (name, dmg) => `${name} způsobuje ${dmg} poškození.`,
            leechHeal: (name, hp) => `${name} se léčí o ${hp} HP!`,
            leechHeal: (name, hp) => `${name} pulzuje a obnovuje ${hp} HP! 💧`,
            leechHitHeal: (name, dmg, hp) => `${name} způsobuje ${dmg} poškození a léčí se o ${hp} HP!`,
            defeated: "Nepřítel poražen!",
            dungeonCleared: "Kobka vyčištěna!",
            collectRewards: "🎁 Vzít odměny",
            goDeeper: "Jít dál ➡️",
            playerDefeated: "Byl jsi poražen... Musíš ustoupit.",
            itemFound: "Předmět nalezen!",
            lootTitle: "🎁 Odměny",
            skillDragonName: "Štít", skillDragonDesc: "Drak aktivuje Štít! Obnovili jste 15 HP a jste připraveni bránit se.",
            skillUnicornName: "Léčení", skillUnicornDesc: "Jednorožec vás uzdravil o 30 HP!",
            skillCatName: "Zápal", skillCatDesc: (dmg) => `Kočičí lukostřelec vstupuje do Zápalu a způsobuje ${dmg} kritického poškození!`,
            skillNoBP: "Nedostatek bodů akce!",
        },
        // Nakladač kobky
        loader: {
            drawingMonsters: "Kreslíme příšery...",
            settingRooms: "Připravujeme místnosti...",
        },
        achs: {
            first_steps: { title: "První kroky", desc: "Trénujte 2krát" },
            sleep_time: { title: "Čas na spaní", desc: "Odpočiňte si 1krát" },
            theme_master: { title: "Mistr stínů", desc: "Změňte téma 5krát" },
            czech: { title: "Pražský host", desc: "Odemkněte tajný jazyk" }
        }
    }
};

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

    const btnCraft = document.getElementById('btn-craft');
    if (btnCraft) btnCraft.innerText = t.craft;
    const txtCraftTitle = document.getElementById('txt-craft-title');
    if (txtCraftTitle) txtCraftTitle.innerText = t.craftTitle;

    // Кнопки боя
    const btnAttack = document.getElementById('btn-attack');
    if (btnAttack) btnAttack.innerText = t.btnAttack;
    const btnSkill = document.getElementById('btn-skill');
    if (btnSkill && !btnSkill.dataset.customLabel) btnSkill.innerText = t.btnSkill;
    const btnFlee = document.getElementById('btn-flee');
    if (btnFlee) btnFlee.innerText = t.btnFlee;
    const btnNextRoom = document.getElementById('btn-next-room');
    if (btnNextRoom) btnNextRoom.innerText = t.btnNextRoom;

    // Заголовок лута и статус загрузки
    const lootTitle = document.getElementById('txt-loot-title');
    if (lootTitle) lootTitle.innerText = t.battle ? t.battle.lootTitle : '🎁';
    const dungeonSelTitle = document.getElementById('dungeon-selection-title');
    if (dungeonSelTitle) dungeonSelTitle.innerText = t.dungeonTitle;

    // Перерисовываем крафт и экипировку если открыты
    if (typeof renderEquipment === 'function') renderEquipment();
    if (typeof renderCraft === 'function' && !document.getElementById('craft-modal').classList.contains('hidden')) renderCraft();

    updateUI();
}

function changeLanguage(lang) {
    // 1. Логика пасхалки (считаем клики по EN)
    if (lang === 'en') {
        enClicks++;
        if (enClicks >= 5 && !state.achievements.czech) {
            state.achievements.czech = true;
            saveGame();
            showCzechButton();
            showAchievementToast(translations[currentLang].achs.czech.title);
        }
    } else {
        // Если кликнули на RU или CZ, сбрасываем счетчик
        enClicks = 0; 
    }

    // 2. Установка нового языка
    currentLang = lang;
    localStorage.setItem('pprpg_lang', lang);
    
    // 3. Обновление основного интерфейса
    applyLanguage();
    
    // 4. Обновление окна достижений, если оно открыто
    if (!document.getElementById('achievements-modal').classList.contains('hidden')) {
        renderAchievements();
    }
    
    // 5. Перерисовка данжей (чтобы названия перевелись сразу)
    if (typeof renderDungeons === 'function') {
        renderDungeons();
    }
}

