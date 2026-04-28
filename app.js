// ============================================
// АГРОХОЛДИНГ «БУРЁНКА» — ERP СИСТЕМА
// Полная логика приложения
// ============================================

// ============ ROLE SYSTEM ============
const ROLES = {
    director: {
        name: 'Директор хозяйства',
        permissions: ['dashboard', 'herd', 'reproduction', 'health', 'nutrition', 'milk', 'milking', 'storage', 'equipment', 'staff', 'schedule', 'salary', 'finance', 'sales', 'reports', 'settings', 'users', 'profile'],
        dept: 'Управление',
        level: 5
    },
    zootechnician: {
        name: 'Главный зоотехник',
        permissions: ['dashboard', 'herd', 'reproduction', 'health', 'nutrition', 'milk', 'milking', 'storage', 'equipment', 'staff', 'schedule', 'reports', 'profile'],
        dept: 'КРС',
        level: 4
    },
    veterinarian: {
        name: 'Главный ветврач',
        permissions: ['dashboard', 'herd', 'health', 'nutrition', 'milk', 'storage', 'staff', 'schedule', 'reports', 'profile'],
        dept: 'Ветслужба',
        level: 4
    },
    agronomist: {
        name: 'Агроном',
        permissions: ['dashboard', 'nutrition', 'storage', 'equipment', 'staff', 'schedule', 'reports', 'profile'],
        dept: 'Поля',
        level: 3
    },
    accountant: {
        name: 'Главный бухгалтер',
        permissions: ['dashboard', 'finance', 'sales', 'salary', 'staff', 'reports', 'settings', 'profile'],
        dept: 'Бухгалтерия',
        level: 4
    },
    milker: {
        name: 'Старший дояр',
        permissions: ['dashboard', 'milk', 'milking', 'herd', 'profile'],
        dept: 'Доильный зал',
        level: 2
    },
    mechanic: {
        name: 'Механизатор',
        permissions: ['dashboard', 'equipment', 'storage', 'profile'],
        dept: 'Техника',
        level: 2
    },
    operator: {
        name: 'Оператор',
        permissions: ['dashboard', 'herd', 'milk', 'profile'],
        dept: 'Операторский',
        level: 1
    },
    admin: {
        name: 'Администратор',
        permissions: ['all'],
        dept: 'IT',
        level: 5
    }
};

// ============ STATE ============
let currentUser = null;
let users = [
    { id: 1, login: 'admin', password: '12345rfr', name: 'Администратор', role: 'admin', phone: '+7 (900) 000-00-00', regDate: '2026-01-01', lastLogin: 'Сегодня, 06:30', status: 'active' },
    { id: 2, login: 'petrova_es', password: 'vet123', name: 'Петрова Елена Сергеевна', role: 'veterinarian', phone: '+7 (900) 123-45-67', regDate: '2026-01-15', lastLogin: 'Вчера, 18:20', status: 'active' },
    { id: 3, login: 'kuznetsov_si', password: 'agro456', name: 'Кузнецов Сергей Иванович', role: 'agronomist', phone: '+7 (911) 456-78-90', regDate: '2026-02-01', lastLogin: 'Сегодня, 07:15', status: 'active' }
];

let cows = [
    { id: 101, tag: 'RF-101', name: 'Зорька', birth: '2023-04-15', breed: 'Голштин', status: 'Здоров', milk: 24.5, weight: 580, calvings: 2, reproHistory: [
        { date: '2026-01-20', event: 'Отёл', bull: '—', expected: '—', status: 'Завершено' }
    ]},
    { id: 102, tag: 'RF-102', name: 'Бурёнка', birth: '2023-06-20', breed: 'Симментал', status: 'Здоров', milk: 21.0, weight: 620, calvings: 1, reproHistory: []},
    { id: 103, tag: 'RF-103', name: 'Ромашка', birth: '2022-08-10', breed: 'Айршир', status: 'Лечение', milk: 18.5, weight: 540, calvings: 3, reproHistory: []},
    { id: 104, tag: 'RF-104', name: 'Мурка', birth: '2023-01-05', breed: 'Джерси', status: 'Тельная', milk: 0, weight: 590, calvings: 1, reproHistory: [
        { date: '2026-03-15', event: 'Осеменение', bull: 'Бык №4521 (Голштин)', expected: '2026-12-10', status: 'Тельная' }
    ]},
    { id: 105, tag: 'RF-105', name: 'Белка', birth: '2022-11-12', breed: 'Голштин', status: 'Сухостойная', milk: 0, weight: 610, calvings: 2, reproHistory: [
        { date: '2025-11-05', event: 'Осеменение', bull: 'Бык №3891 (Симментал)', expected: '2026-08-15', status: 'Тельная' }
    ]},
    { id: 106, tag: 'RF-106', name: 'Звезда', birth: '2023-09-01', breed: 'Голштин', status: 'Здоров', milk: 26.0, weight: 570, calvings: 1, reproHistory: []}
];

let staff = [
    { id: 1, name: 'Петрова Елена Сергеевна', role: 'Ветврач', dept: 'Ветслужба', phone: '+7 (900) 123-45-67', exp: 9, salary: 65000, status: 'Работает' },
    { id: 2, name: 'Кузнецов Сергей Иванович', role: 'Агроном', dept: 'Поля', phone: '+7 (911) 456-78-90', exp: 4, salary: 55000, status: 'Работает' },
    { id: 3, name: 'Морозова Анна Павловна', role: 'Зоотехник', dept: 'КРС', phone: '+7 (921) 999-88-77', exp: 6, salary: 58000, status: 'Работает' },
    { id: 4, name: 'Соколов Дмитрий Олегович', role: 'Механизатор', dept: 'Техника', phone: '+7 (903) 111-22-33', exp: 3, salary: 48000, status: 'Отпуск' },
    { id: 5, name: 'Волкова Мария Андреевна', role: 'Дояр', dept: 'Доильный зал', phone: '+7 (905) 444-55-66', exp: 2, salary: 42000, status: 'Работает' }
];

let healthRecords = [
    { id: 1, date: '2026-04-20', cowTag: 'RF-103', cowName: 'Ромашка', type: 'Лечение', diagnosis: 'Мастит', treatment: 'Мастисепт, 10 мл', vet: 'Петрова Е.С.', status: 'В процессе' },
    { id: 2, date: '2026-04-18', cowTag: 'RF-101', cowName: 'Зорька', type: 'Вакцинация', diagnosis: 'Профилактика', treatment: 'Вакцина БКВ', vet: 'Петрова Е.С.', status: 'Завершено' },
    { id: 3, date: '2026-04-15', cowTag: 'RF-106', cowName: 'Звезда', type: 'Осмотр', diagnosis: 'Здорова', treatment: '-', vet: 'Петрова Е.С.', status: 'Завершено' }
];

let stockOps = [
    { id: 1, date: '2026-04-20', type: 'Сено', operation: 'Приход', amount: 15, unit: 'т', supplier: 'ООО АгроСнаб', cost: 75000, responsible: 'Кузнецов С.И.' },
    { id: 2, date: '2026-04-18', type: 'Комбикорм', operation: 'Приход', amount: 8, unit: 'т', supplier: 'ООО КормПлюс', cost: 120000, responsible: 'Кузнецов С.И.' },
    { id: 3, date: '2026-04-15', type: 'Сено', operation: 'Расход', amount: 2.1, unit: 'т', supplier: 'Кормление КРС', cost: 0, responsible: 'Морозова А.П.' }
];

let hayStock = { hay: 68.5, feed: 32.0, silage: 45.0, minerals: 120 };
let systemLogs = [];
let nextCowId = 107;
let nextHealthId = 4;
let nextStockId = 4;
let nextUserId = 4;

// ============ NAVIGATION CONFIG ============
const NAV_SECTIONS = [
    {
        title: 'Основное',
        items: [
            { page: 'dashboard', label: 'Дашборд', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
            { page: 'herd', label: 'Поголовье КРС', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>', badge: 'herdCountBadge' },
            { page: 'reproduction', label: 'Репродукция', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>' },
            { page: 'health', label: 'Ветконтроль', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>', badge: 'healthBadge' },
            { page: 'nutrition', label: 'Кормление', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>' },
            { page: 'milk', label: 'Учёт молока', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>' }
        ]
    },
    {
        title: 'Производство',
        items: [
            { page: 'milking', label: 'Доильный зал', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 6v6l4 2"/></svg>' },
            { page: 'storage', label: 'Склад и запасы', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
            { page: 'equipment', label: 'Оборудование', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>' }
        ]
    },
    {
        title: 'Персонал',
        items: [
            { page: 'staff', label: 'Сотрудники', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>' },
            { page: 'schedule', label: 'График смен', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
            { page: 'salary', label: 'Зарплаты', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>' }
        ]
    },
    {
        title: 'Финансы',
        items: [
            { page: 'finance', label: 'Финансы', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>' },
            { page: 'sales', label: 'Продажи', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>' }
        ]
    },
    {
        title: 'Система',
        items: [
            { page: 'reports', label: 'Отчёты', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' },
            { page: 'settings', label: 'Настройки', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>' }
        ]
    }
];

// ============ UTILS ============
function showToast(title, message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icons = { success: '✓', error: '✕', warning: '!' };
    const iconClass = type === 'success' ? 'success' : type === 'error' ? 'error' : 'warning';
    
    toast.innerHTML = `
        <div class="toast-icon ${iconClass}">${icons[type]}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-text">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

function addLog(msg) {
    const time = new Date().toLocaleTimeString('ru-RU');
    systemLogs.unshift(`${time} — ${msg}`);
    if (systemLogs.length > 100) systemLogs.pop();
}

function formatNumber(num) {
    return num.toLocaleString('ru-RU');
}

function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    const now = new Date();
    return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// ============ AUTH ============
function initAuth() {
    // Login/Register tabs
    document.querySelectorAll('.login-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const formId = tab.dataset.tab === 'login' ? 'loginForm' : 'registerForm';
            document.querySelectorAll('.login-form').forEach(f => f.classList.remove('active'));
            document.getElementById(formId).classList.add('active');
        });
    });

    // Login
    document.getElementById('doLoginBtn').addEventListener('click', doLogin);
    document.getElementById('loginPass').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') doLogin();
    });

    // Register
    document.getElementById('doRegisterBtn').addEventListener('click', doRegister);
}

function doLogin() {
    const login = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    
    const user = users.find(u => u.login === login && u.password === pass && u.status === 'active');
    
    if (user) {
        currentUser = user;
        user.lastLogin = 'Сегодня, ' + new Date().toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'});
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('appLayout').style.display = 'flex';
        initApp();
        showToast('Добро пожаловать', `Вы вошли как ${user.name}`);
        addLog(`Вход пользователя ${user.login}`);
    } else {
        document.getElementById('loginError').textContent = 'Неверный логин или пароль';
    }
}

function doRegister() {
    const name = document.getElementById('regName').value.trim();
    const login = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value;
    const role = document.getElementById('regRole').value;
    const phone = document.getElementById('regPhone').value.trim();
    
    if (!name || !login || !pass || !role) {
        document.getElementById('registerError').textContent = 'Заполните все обязательные поля';
        return;
    }
    
    if (pass.length < 6) {
        document.getElementById('registerError').textContent = 'Пароль должен быть не менее 6 символов';
        return;
    }
    
    if (users.find(u => u.login === login)) {
        document.getElementById('registerError').textContent = 'Пользователь с таким логином уже существует';
        return;
    }
    
    const roleConfig = ROLES[role];
    const newUser = {
        id: nextUserId++,
        login,
        password: pass,
        name,
        role,
        phone: phone || '—',
        regDate: new Date().toLocaleDateString('ru-RU'),
        lastLogin: '—',
        status: 'active'
    };
    
    users.push(newUser);
    
    // Switch to login
    document.querySelectorAll('.login-tab')[0].click();
    document.getElementById('loginUser').value = login;
    document.getElementById('loginPass').value = '';
    document.getElementById('loginError').textContent = '';
    
    showToast('Успешно', `Аккаунт ${name} создан. Роль: ${roleConfig.name}`);
    addLog(`Регистрация пользователя ${login} с ролью ${roleConfig.name}`);
}

// ============ SIDEBAR ============
function buildSidebar() {
    const nav = document.getElementById('sidebarNav');
    const roleConfig = ROLES[currentUser.role] || ROLES.operator;
    const perms = roleConfig.permissions;
    
    nav.innerHTML = '';
    
    NAV_SECTIONS.forEach(section => {
        const allowedItems = section.items.filter(item => 
            perms.includes('all') || perms.includes(item.page)
        );
        
        if (allowedItems.length === 0) return;
        
        const sectionEl = document.createElement('div');
        sectionEl.className = 'nav-section';
        sectionEl.innerHTML = `<div class="nav-section-title">${section.title}</div>`;
        
        allowedItems.forEach(item => {
            const navItem = document.createElement('div');
            navItem.className = 'nav-item';
            navItem.dataset.page = item.page;
            navItem.innerHTML = `
                <span class="nav-icon">${item.icon}</span>
                <span>${item.label}</span>
                ${item.badge ? `<span class="nav-badge" id="${item.badge}">0</span>` : ''}
            `;
            navItem.addEventListener('click', () => switchPage(item.page));
            sectionEl.appendChild(navItem);
        });
        
        nav.appendChild(sectionEl);
    });
    
    // Admin users link
    if (perms.includes('all') || perms.includes('users')) {
        const adminSection = document.createElement('div');
        adminSection.className = 'nav-section';
        adminSection.innerHTML = `
            <div class="nav-section-title">Администрирование</div>
            <div class="nav-item" data-page="users">
                <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></span>
                <span>Пользователи</span>
            </div>
        `;
        adminSection.querySelector('.nav-item').addEventListener('click', () => switchPage('users'));
        nav.appendChild(adminSection);
    }
    
    // Update user card
    document.getElementById('userAvatar').textContent = getInitials(currentUser.name);
    document.getElementById('userNameDisplay').textContent = currentUser.name;
    document.getElementById('userRoleDisplay').textContent = roleConfig.name;
}

// ============ MODALS ============
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// ============ NAVIGATION ============
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById(pageId + 'Page');
    if (pageEl) pageEl.classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navItem = document.querySelector(`[data-page="${pageId}"]`);
    if (navItem) navItem.classList.add('active');
    
    const titles = {
        dashboard: 'Дашборд',
        herd: 'Поголовье КРС',
        cowProfile: 'Карточка коровы',
        reproduction: 'Репродукция',
        health: 'Ветконтроль',
        nutrition: 'Кормление',
        milk: 'Учёт молока',
        milking: 'Доильный зал',
        storage: 'Склад и запасы',
        equipment: 'Оборудование',
        staff: 'Сотрудники',
        profile: 'Личная карточка',
        schedule: 'График смен',
        salary: 'Зарплаты',
        finance: 'Финансы',
        sales: 'Продажи',
        reports: 'Отчёты',
        settings: 'Настройки',
        users: 'Пользователи'
    };
    
    document.getElementById('breadcrumb').innerHTML = `
        <span class="breadcrumb-icon">◈</span>
        <span class="breadcrumb-divider">/</span>
        <span class="breadcrumb-text">${titles[pageId] || pageId}</span>
    `;
    
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('mobile-open');
    }
    
    renderPage(pageId);
}

function renderPage(pageId) {
    switch(pageId) {
        case 'dashboard': renderDashboard(); break;
        case 'herd': renderHerd(); break;
        case 'reproduction': renderReproduction(); break;
        case 'health': renderHealth(); break;
        case 'nutrition': renderNutrition(); break;
        case 'milk': renderMilk(); break;
        case 'milking': renderMilking(); break;
        case 'storage': renderStorage(); break;
        case 'equipment': renderEquipment(); break;
        case 'staff': renderStaff(); break;
        case 'profile': renderProfile(); break;
        case 'salary': renderSalary(); break;
        case 'finance': renderFinance(); break;
        case 'sales': renderSales(); break;
        case 'users': renderUsers(); break;
    }
}

// ============ DASHBOARD ============
function renderDashboard() {
    const totalCows = cows.length;
    const totalMilk = cows.reduce((a, c) => a + c.milk, 0);
    const sickCows = cows.filter(c => c.status === 'Лечение').length;
    const dryCows = cows.filter(c => c.status === 'Сухостойная').length;
    const healthyCows = cows.filter(c => c.status === 'Здоров').length;
    const pregnantCows = cows.filter(c => c.status === 'Тельная').length;
    
    document.getElementById('dashTotalCows').textContent = totalCows;
    document.getElementById('dashTotalMilk').textContent = totalMilk.toFixed(1);
    document.getElementById('dashSickCows').textContent = sickCows;
    document.getElementById('dashHayStock').textContent = hayStock.hay.toFixed(1);
    document.getElementById('dashHayDays').textContent = Math.floor(hayStock.hay / (totalCows * 0.007));
    document.getElementById('dashRevenue').textContent = formatNumber(Math.floor(totalMilk * 38 * 30));
    
    // Health bars
    const healthyPct = totalCows ? Math.round(healthyCows / totalCows * 100) : 0;
    const sickPct = totalCows ? Math.round(sickCows / totalCows * 100) : 0;
    const dryPct = totalCows ? Math.round(dryCows / totalCows * 100) : 0;
    const pregnantPct = totalCows ? Math.round(pregnantCows / totalCows * 100) : 0;
    
    document.getElementById('healthPctHealthy').textContent = healthyPct + '%';
    document.getElementById('healthBarHealthy').style.width = healthyPct + '%';
    document.getElementById('healthPctSick').textContent = sickPct + '%';
    document.getElementById('healthBarSick').style.width = sickPct + '%';
    document.getElementById('healthPctDry').textContent = dryPct + '%';
    document.getElementById('healthBarDry').style.width = dryPct + '%';
    document.getElementById('healthPctPregnant').textContent = pregnantPct + '%';
    document.getElementById('healthBarPregnant').style.width = pregnantPct + '%';
    
    // Milk chart
    const chartContainer = document.getElementById('milkChart');
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const values = [210, 225, 218, 235, 242, 238, 245];
    const maxVal = Math.max(...values);
    
    chartContainer.innerHTML = days.map((day, i) => `
        <div class="chart-bar" style="height: ${(values[i] / maxVal * 100)}%" data-value="${values[i]}л" title="${day}: ${values[i]}л"></div>
    `).join('');
    
    // Timeline
    const timeline = document.getElementById('dashTimeline');
    const events = [
        { date: 'Сегодня, 06:00', text: 'Доение утренней смены завершено', type: '' },
        { date: 'Сегодня, 14:00', text: 'Осмотр коровы RF-103 (Ромашка)', type: 'warning' },
        { date: 'Завтра, 05:00', text: 'Плановая вакцинация группы А', type: '' },
        { date: '26 апр, 10:00', text: 'Поставка комбикорма (ООО КормПлюс)', type: 'info' },
        { date: '28 апр, 09:00', text: 'Ожидаемый отёл RF-104 (Мурка)', type: 'danger' }
    ];
    
    timeline.innerHTML = events.map(e => `
        <div class="timeline-item ${e.type}">
            <div class="timeline-date">${e.date}</div>
            <div class="timeline-text">${e.text}</div>
        </div>
    `).join('');
    
    // Alerts
    const alerts = document.getElementById('alertsList');
    const alertItems = [
        { icon: '🌾', text: 'Запас сена ниже 70т — планируйте закупку', type: 'warning' },
        { icon: '🏥', text: 'RF-103 Ромашка — мастит, требуется контроль', type: 'danger' },
        { icon: '💉', text: 'Вакцинация группы А просрочена на 2 дня', type: 'danger' },
        { icon: '🐄', text: 'RF-104 Мурка — отёл через 4 дня', type: 'warning' }
    ];
    
    alerts.innerHTML = alertItems.map(a => `
        <div class="alert-item alert-${a.type}">
            <span class="alert-icon">${a.icon}</span>
            <span class="alert-text">${a.text}</span>
        </div>
    `).join('');
    
    // Update badges
    document.getElementById('herdCountBadge').textContent = totalCows;
    document.getElementById('healthBadge').textContent = sickCows;
    document.getElementById('notifDot').style.display = sickCows > 0 ? 'block' : 'none';
}

// ============ HERD ============
function renderHerd() {
    const tbody = document.getElementById('herdTableBody');
    const search = document.getElementById('herdSearch')?.value.toLowerCase() || '';
    const breedFilter = document.getElementById('herdFilterBreed')?.value || '';
    const statusFilter = document.getElementById('herdFilterStatus')?.value || '';
    
    let filtered = cows.filter(c => {
        const matchSearch = !search || c.name.toLowerCase().includes(search) || c.tag.toLowerCase().includes(search);
        const matchBreed = !breedFilter || c.breed === breedFilter;
        const matchStatus = !statusFilter || c.status === statusFilter;
        return matchSearch && matchBreed && matchStatus;
    });
    
    tbody.innerHTML = filtered.map(c => {
        const age = calculateAge(c.birth);
        const statusClass = c.status === 'Здоров' ? 'badge-green' : 
                           c.status === 'Лечение' ? 'badge-red' : 
                           c.status === 'Тельная' ? 'badge-blue' : 'badge-amber';
        
        return `
            <tr>
                <td><span class="badge badge-gray">${c.tag}</span></td>
                <td><strong>${c.name}</strong></td>
                <td>${age} мес</td>
                <td>${c.breed}</td>
                <td><span class="badge ${statusClass}">${c.status}</span></td>
                <td>${c.milk > 0 ? c.milk + ' л' : '-'}</td>
                <td>${c.calvings}</td>
                <td>
                    <button class="btn btn-sm btn-secondary btn-icon" onclick="openCowProfile(${c.id})" title="Карточка">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </button>
                    <button class="btn btn-sm btn-secondary btn-icon" onclick="editCow(${c.id})" title="Редактировать">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-sm btn-danger btn-icon" onclick="deleteCow(${c.id})" title="Удалить">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function openCowProfile(cowId) {
    const cow = cows.find(c => c.id === cowId);
    if (!cow) return;
    
    document.getElementById('cowProfileTitle').textContent = `Карточка коровы ${cow.tag}`;
    document.getElementById('cowProfileName').textContent = cow.name;
    document.getElementById('cowProfileBadge').textContent = cow.status;
    document.getElementById('cowProfileBadge').className = `badge ${cow.status === 'Здоров' ? 'badge-green' : cow.status === 'Лечение' ? 'badge-red' : cow.status === 'Тельная' ? 'badge-blue' : 'badge-amber'}`;
    document.getElementById('cowProfileTag').textContent = cow.tag;
    document.getElementById('cowProfileBreed').textContent = cow.breed;
    document.getElementById('cowProfileBirth').textContent = new Date(cow.birth).toLocaleDateString('ru-RU');
    document.getElementById('cowProfileAge').textContent = calculateAge(cow.birth) + ' мес';
    document.getElementById('cowProfileWeight').textContent = cow.weight + ' кг';
    document.getElementById('cowProfileCalvings').textContent = cow.calvings;
    document.getElementById('cowProfileMilk').textContent = cow.milk > 0 ? cow.milk + ' л/день' : 'Нет';
    
    // Health timeline
    const healthTimeline = document.getElementById('cowHealthTimeline');
    const cowHealth = healthRecords.filter(r => r.cowTag === cow.tag);
    healthTimeline.innerHTML = cowHealth.length ? cowHealth.map(r => `
        <div class="timeline-item ${r.status === 'В процессе' ? 'warning' : ''}">
            <div class="timeline-date">${r.date}</div>
            <div class="timeline-text">${r.type}: ${r.diagnosis} (${r.vet})</div>
        </div>
    `).join('') : '<div class="timeline-item"><div class="timeline-text">Нет записей</div></div>';
    
    // Repro timeline
    const reproTimeline = document.getElementById('cowReproTimeline');
    reproTimeline.innerHTML = cow.reproHistory.length ? cow.reproHistory.map(r => `
        <div class="timeline-item ${r.status === 'Тельная' ? 'info' : 'green'}">
            <div class="timeline-date">${r.date}</div>
            <div class="timeline-text">${r.event}${r.bull !== '—' ? ' — ' + r.bull : ''}${r.expected !== '—' ? ' (ожид.: ' + r.expected + ')' : ''}</div>
        </div>
    `).join('') : '<div class="timeline-item"><div class="timeline-text">Нет записей</div></div>';
    
    // Milk chart
    const milkChart = document.getElementById('cowMilkChart');
    const milkData = [18, 20, 22, 21, 23, 24, cow.milk || 0];
    const maxMilk = Math.max(...milkData, 1);
    milkChart.innerHTML = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map((day, i) => `
        <div class="chart-bar" style="height: ${(milkData[i] / maxMilk * 100)}%" data-value="${milkData[i]}л"></div>
    `).join('');
    
    switchPage('cowProfile');
}

function saveCow() {
    const name = document.getElementById('modalCowName').value;
    const tag = document.getElementById('modalCowTag').value;
    
    if (!name || !tag) {
        showToast('Ошибка', 'Заполните обязательные поля', 'error');
        return;
    }
    
    cows.push({
        id: nextCowId++,
        tag,
        name,
        birth: document.getElementById('modalCowBirth').value || '2023-01-01',
        breed: document.getElementById('modalCowBreed').value,
        status: document.getElementById('modalCowStatus').value,
        milk: parseFloat(document.getElementById('modalCowMilk').value) || 0,
        weight: parseInt(document.getElementById('modalCowWeight').value) || 550,
        calvings: parseInt(document.getElementById('modalCowCalvings').value) || 0,
        reproHistory: []
    });
    
    closeModal('addCowModal');
    renderHerd();
    renderDashboard();
    addLog(`Добавлена корова ${name} (${tag})`);
    showToast('Успешно', `Корова ${name} добавлена`);
}

function deleteCow(id) {
    if (!confirm('Удалить корову из реестра?')) return;
    cows = cows.filter(c => c.id !== id);
    renderHerd();
    renderDashboard();
    addLog(`Удалена корова ID ${id}`);
    showToast('Удалено', 'Корова удалена из реестра');
}

function editCow(id) {
    showToast('Инфо', 'Редактирование в разработке', 'warning');
}

// ============ REPRODUCTION ============
function renderReproduction() {
    const pregnant = cows.filter(c => c.status === 'Тельная').length;
    const lactating = cows.filter(c => c.milk > 0).length;
    const dry = cows.filter(c => c.status === 'Сухостойная').length;
    const avgLactation = lactating ? (cows.filter(c => c.milk > 0).reduce((a, c) => a + c.milk, 0) / lactating * 305).toFixed(0) : 0;
    
    document.getElementById('repPregnant').textContent = pregnant;
    document.getElementById('repLactating').textContent = lactating;
    document.getElementById('repDry').textContent = dry;
    document.getElementById('repAvgLactation').textContent = avgLactation + ' л';
    
    document.getElementById('reproTableBody').innerHTML = `
        <tr>
            <td>2026-03-15</td>
            <td><span class="badge badge-gray">RF-104</span> Мурка</td>
            <td><span class="badge badge-blue">Осеменение</span></td>
            <td>Бык №4521 (Голштин)</td>
            <td>2026-12-10</td>
            <td><span class="badge badge-amber">Тельная</span></td>
            <td><button class="btn btn-sm btn-secondary btn-icon">✏️</button></td>
        </tr>
        <tr>
            <td>2026-01-20</td>
            <td><span class="badge badge-gray">RF-101</span> Зорька</td>
            <td><span class="badge badge-green">Отёл</span></td>
            <td>—</td>
            <td>—</td>
            <td><span class="badge badge-green">Лактация</span></td>
            <td><button class="btn btn-sm btn-secondary btn-icon">✏️</button></td>
        </tr>
        <tr>
            <td>2025-11-05</td>
            <td><span class="badge badge-gray">RF-105</span> Белка</td>
            <td><span class="badge badge-blue">Осеменение</span></td>
            <td>Бык №3891 (Симментал)</td>
            <td>2026-08-15</td>
            <td><span class="badge badge-amber">Тельная</span></td>
            <td><button class="btn btn-sm btn-secondary btn-icon">✏️</button></td>
        </tr>
    `;
}

// ============ HEALTH ============
function renderHealth() {
    const tbody = document.getElementById('healthTableBody');
    tbody.innerHTML = healthRecords.map(r => {
        const statusClass = r.status === 'Завершено' ? 'badge-green' : 
                           r.status === 'В процессе' ? 'badge-amber' : 'badge-blue';
        return `
            <tr>
                <td>${r.date}</td>
                <td><span class="badge badge-gray">${r.cowTag}</span></td>
                <td>${r.cowName}</td>
                <td><span class="badge ${r.type === 'Вакцинация' ? 'badge-blue' : r.type === 'Лечение' ? 'badge-red' : 'badge-green'}">${r.type}</span></td>
                <td>${r.diagnosis}</td>
                <td>${r.treatment}</td>
                <td>${r.vet}</td>
                <td><span class="badge ${statusClass}">${r.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-secondary btn-icon">✏️</button>
                    <button class="btn btn-sm btn-danger btn-icon" onclick="deleteHealthRecord(${r.id})">🗑</button>
                </td>
            </tr>
        `;
    }).join('');
    
    document.getElementById('healthHealthy').textContent = cows.filter(c => c.status === 'Здоров').length;
    document.getElementById('healthTreating').textContent = cows.filter(c => c.status === 'Лечение').length;
    document.getElementById('healthVaccines').textContent = healthRecords.filter(r => r.type === 'Вакцинация').length;
    document.getElementById('healthChecks').textContent = healthRecords.filter(r => r.type === 'Осмотр').length;
    
    document.getElementById('drugsTableBody').innerHTML = `
        <tr><td>Мастисепт</td><td>Мастит</td><td>10 мл/вымя</td><td>2027-03-15</td><td>45 уп</td></tr>
        <tr><td>Вакцина БКВ</td><td>Профилактика</td><td>5 мл/гол</td><td>2026-09-20</td><td>120 доз</td></tr>
        <tr><td>Йодинол</td><td>Обработка пупка</td><td>50 мл</td><td>2027-01-10</td><td>12 фл</td></tr>
        <tr><td>Кальций хлорид</td><td>После отёла</td><td>200 мл</td><td>2026-12-01</td><td>30 фл</td></tr>
    `;
}

function saveHealthRecord() {
    const cowTag = document.getElementById('modalHealthCow').value;
    const cow = cows.find(c => c.tag === cowTag);
    
    if (!cowTag) {
        showToast('Ошибка', 'Укажите бирку коровы', 'error');
        return;
    }
    
    healthRecords.unshift({
        id: nextHealthId++,
        date: document.getElementById('modalHealthDate').value,
        cowTag,
        cowName: cow?.name || 'Неизвестно',
        type: document.getElementById('modalHealthType').value,
        diagnosis: document.getElementById('modalHealthDiagnosis').value,
        treatment: document.getElementById('modalHealthTreatment').value,
        vet: document.getElementById('modalHealthVet').value,
        status: document.getElementById('modalHealthStatus').value
    });
    
    closeModal('addHealthModal');
    renderHealth();
    addLog(`Добавлена медзапись для ${cowTag}`);
    showToast('Успешно', 'Медицинская запись добавлена');
}

function deleteHealthRecord(id) {
    healthRecords = healthRecords.filter(r => r.id !== id);
    renderHealth();
    showToast('Удалено', 'Запись удалена');
}

// ============ NUTRITION ============
function renderNutrition() {
    document.getElementById('nutrHay').textContent = hayStock.hay.toFixed(1);
    document.getElementById('nutrFeed').textContent = hayStock.feed.toFixed(1);
    document.getElementById('nutrMinerals').textContent = hayStock.minerals;
    document.getElementById('nutrCost').textContent = formatNumber(Math.floor(cows.length * 450));
}

function calculateRation() {
    const cowCount = parseInt(document.getElementById('calcCows').value) || 50;
    const milk = parseInt(document.getElementById('calcMilk').value) || 22;
    const weight = parseInt(document.getElementById('calcWeight').value) || 550;
    
    const hay = (weight * 0.012).toFixed(1);
    const feed = (milk * 0.45).toFixed(1);
    const silage = (weight * 0.015).toFixed(1);
    const minerals = (weight * 0.003).toFixed(1);
    
    document.getElementById('rationResult').style.display = 'block';
    document.getElementById('rationTableBody').innerHTML = `
        <tr><td><strong>Сено</strong></td><td>${hay}</td><td>${(hay * 0.85).toFixed(1)}</td><td>${(hay * 80).toFixed(0)}</td><td>${(hay * 8).toFixed(1)}</td><td>${formatNumber(Math.floor(hay * 5000))}</td></tr>
        <tr><td><strong>Комбикорм</strong></td><td>${feed}</td><td>${(feed * 0.88).toFixed(1)}</td><td>${(feed * 180).toFixed(0)}</td><td>${(feed * 12).toFixed(1)}</td><td>${formatNumber(Math.floor(feed * 15000))}</td></tr>
        <tr><td><strong>Силос</strong></td><td>${silage}</td><td>${(silage * 0.25).toFixed(1)}</td><td>${(silage * 20).toFixed(0)}</td><td>${(silage * 3).toFixed(1)}</td><td>${formatNumber(Math.floor(silage * 3000))}</td></tr>
        <tr><td><strong>Минералы</strong></td><td>${minerals}</td><td>${minerals}</td><td>—</td><td>—</td><td>${formatNumber(Math.floor(minerals * 20000))}</td></tr>
        <tr style="background: var(--bg-secondary); font-weight: 700;"><td>ИТОГО на голову</td><td>${(parseFloat(hay) + parseFloat(feed) + parseFloat(silage) + parseFloat(minerals)).toFixed(1)} кг</td><td></td><td></td><td></td><td>${formatNumber(Math.floor((parseFloat(hay) * 5000 + parseFloat(feed) * 15000 + parseFloat(silage) * 3000 + parseFloat(minerals) * 20000) / 1000))} ₽</td></tr>
    `;
    
    showToast('Расчёт выполнен', `Рацион рассчитан для ${cowCount} голов`);
}

// ============ MILK ============
function renderMilk() {
    const weekData = [210, 225, 218, 235, 242, 238, 245];
    const maxVal = Math.max(...weekData);
    
    document.getElementById('milkWeekChart').innerHTML = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map((day, i) => `
        <div class="chart-bar" style="height: ${(weekData[i] / maxVal * 100)}%" data-value="${weekData[i]}л" title="${day}: ${weekData[i]}л"></div>
    `).join('');
    
    document.getElementById('milkTableBody').innerHTML = `
        <tr><td>24.04.2026</td><td>82.5</td><td>78.0</td><td>84.5</td><td><strong>245.0</strong></td><td>3.8%</td><td>3.2%</td><td>180</td></tr>
        <tr><td>23.04.2026</td><td>80.0</td><td>76.5</td><td>81.5</td><td><strong>238.0</strong></td><td>3.7%</td><td>3.1%</td><td>195</td></tr>
        <tr><td>22.04.2026</td><td>85.0</td><td>79.0</td><td>78.0</td><td><strong>242.0</strong></td><td>3.9%</td><td>3.3%</td><td>172</td></tr>
        <tr><td>21.04.2026</td><td>78.5</td><td>75.0</td><td>81.5</td><td><strong>235.0</strong></td><td>3.6%</td><td>3.0%</td><td>210</td></tr>
        <tr><td>20.04.2026</td><td>72.0</td><td>70.5</td><td>75.5</td><td><strong>218.0</strong></td><td>3.7%</td><td>3.1%</td><td>188</td></tr>
        <tr><td>19.04.2026</td><td>75.5</td><td>73.0</td><td>76.5</td><td><strong>225.0</strong></td><td>3.8%</td><td>3.2%</td><td>165</td></tr>
        <tr><td>18.04.2026</td><td>70.0</td><td>68.5</td><td>71.5</td><td><strong>210.0</strong></td><td>3.6%</td><td>3.0%</td><td>205</td></tr>
    `;
}

// ============ MILKING ============
function renderMilking() {
    const milked = 42;
    const total = cows.length;
    const efficiency = Math.round(milked / total * 100);
    
    document.getElementById('milkedToday').textContent = milked;
    document.getElementById('milkedTotal').textContent = total;
    document.getElementById('milkingEfficiency').textContent = efficiency + '%';
    
    document.getElementById('equipmentTableBody').innerHTML = `
        <tr>
            <td>Доильный аппарат (зал)</td>
            <td>DeLaval VMS</td>
            <td><span class="badge badge-green">Работает</span></td>
            <td>15.04.2026</td>
            <td>15.05.2026</td>
            <td><button class="btn btn-sm btn-secondary btn-icon">🔧</button></td>
        </tr>
        <tr>
            <td>Холодильная установка</td>
            <td>Carrier AquaForce</td>
            <td><span class="badge badge-green">Работает</span></td>
            <td>01.04.2026</td>
            <td>01.07.2026</td>
            <td><button class="btn btn-sm btn-secondary btn-icon">🔧</button></td>
        </tr>
        <tr>
            <td>Насос моющий</td>
            <td>Alfa Laval LKH</td>
            <td><span class="badge badge-amber">Требует ТО</span></td>
            <td>10.02.2026</td>
            <td>25.04.2026</td>
            <td><button class="btn btn-sm btn-accent btn-icon">🔧</button></td>
        </tr>
    `;
}

// ============ STORAGE ============
function renderStorage() {
    document.getElementById('storeHay').textContent = hayStock.hay.toFixed(1);
    document.getElementById('storeFeed').textContent = hayStock.feed.toFixed(1);
    document.getElementById('storeSilage').textContent = hayStock.silage.toFixed(1);
    document.getElementById('storeDays').textContent = Math.floor(hayStock.hay / (cows.length * 0.007));
    
    document.getElementById('storeHayBar').style.width = Math.min(hayStock.hay / 100 * 100, 100) + '%';
    document.getElementById('storeFeedBar').style.width = Math.min(hayStock.feed / 50 * 100, 100) + '%';
    document.getElementById('storeSilageBar').style.width = Math.min(hayStock.silage / 60 * 100, 100) + '%';
    
    document.getElementById('stockTableBody').innerHTML = stockOps.map(op => `
        <tr>
            <td>${op.date}</td>
            <td>${op.type}</td>
            <td><span class="badge ${op.operation === 'Приход' ? 'badge-green' : 'badge-amber'}">${op.operation}</span></td>
            <td>${op.amount} ${op.unit}</td>
            <td>${op.supplier}</td>
            <td>${op.cost > 0 ? formatNumber(op.cost) + ' ₽' : '-'}</td>
            <td>${op.responsible}</td>
        </tr>
    `).join('');
}

function switchStorageTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
}

function saveStockOp() {
    const type = document.getElementById('modalStockType').value;
    const op = document.getElementById('modalStockOp').value;
    const amount = parseFloat(document.getElementById('modalStockAmount').value);
    
    if (!amount || amount <= 0) {
        showToast('Ошибка', 'Укажите количество', 'error');
        return;
    }
    
    stockOps.unshift({
        id: nextStockId++,
        date: document.getElementById('modalStockDate').value,
        type,
        operation: op,
        amount,
        unit: type === 'Минералы' ? 'кг' : 'т',
        supplier: document.getElementById('modalStockSupplier').value || '-',
        cost: parseInt(document.getElementById('modalStockCost').value) || 0,
        responsible: currentUser.name
    });
    
    const multiplier = type === 'Минералы' ? 0.001 : 1;
    const change = amount * multiplier;
    if (op === 'Приход') {
        if (type === 'Сено') hayStock.hay += change;
        else if (type === 'Комбикорм') hayStock.feed += change;
        else if (type === 'Силос') hayStock.silage += change;
        else if (type === 'Минералы') hayStock.minerals += amount;
    } else {
        if (type === 'Сено') hayStock.hay = Math.max(0, hayStock.hay - change);
        else if (type === 'Комбикорм') hayStock.feed = Math.max(0, hayStock.feed - change);
        else if (type === 'Силос') hayStock.silage = Math.max(0, hayStock.silage - change);
        else if (type === 'Минералы') hayStock.minerals = Math.max(0, hayStock.minerals - amount);
    }
    
    closeModal('addStockModal');
    renderStorage();
    renderDashboard();
    addLog(`${op} ${type}: ${amount} ${type === 'Минералы' ? 'кг' : 'т'}`);
    showToast('Успешно', `Операция "${op}" сохранена`);
}

// ============ EQUIPMENT ============
function renderEquipment() {
    document.getElementById('machineryTableBody').innerHTML = `
        <tr>
            <td>Трактор</td>
            <td>John Deere 8R</td>
            <td>А123БС 50</td>
            <td><span class="badge badge-green">Исправен</span></td>
            <td>3 450</td>
            <td>01.03.2026</td>
            <td>01.06.2026</td>
        </tr>
        <tr>
            <td>Кормораздатчик</td>
            <td>Kuhn SPW</td>
            <td>В456КМ 50</td>
            <td><span class="badge badge-green">Исправен</span></td>
            <td>1 280</td>
            <td>15.02.2026</td>
            <td>15.05.2026</td>
        </tr>
        <tr>
            <td>Погрузчик</td>
            <td>Manitou MLT</td>
            <td>Е789НР 50</td>
            <td><span class="badge badge-amber">Ремонт</span></td>
            <td>2 150</td>
            <td>10.01.2026</td>
            <td>30.04.2026</td>
        </tr>
    `;
}

// ============ STAFF ============
function renderStaff() {
    const tbody = document.getElementById('staffTableBody');
    const search = document.getElementById('staffSearch')?.value.toLowerCase() || '';
    const roleFilter = document.getElementById('staffFilterRole')?.value || '';
    const statusFilter = document.getElementById('staffFilterStatus')?.value || '';
    
    let filtered = staff.filter(s => {
        const matchSearch = !search || s.name.toLowerCase().includes(search) || s.role.toLowerCase().includes(search);
        const matchRole = !roleFilter || s.role === roleFilter;
        const matchStatus = !statusFilter || s.status === statusFilter;
        return matchSearch && matchRole && matchStatus;
    });
    
    tbody.innerHTML = filtered.map(s => {
        const statusClass = s.status === 'Работает' ? 'badge-green' : 
                           s.status === 'Отпуск' ? 'badge-blue' : 
                           s.status === 'Больничный' ? 'badge-amber' : 'badge-gray';
        return `
            <tr>
                <td><span class="badge badge-gray">#${s.id}</span></td>
                <td><strong>${s.name}</strong></td>
                <td>${s.role}</td>
                <td>${s.dept}</td>
                <td>${s.phone}</td>
                <td>${s.exp} лет</td>
                <td>${formatNumber(s.salary)} ₽</td>
                <td><span class="badge ${statusClass}">${s.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-secondary btn-icon">✏️</button>
                    <button class="btn btn-sm btn-danger btn-icon">🗑</button>
                </td>
            </tr>
        `;
    }).join('');
    
    document.getElementById('staffTotal').textContent = staff.length;
    document.getElementById('staffAvgExp').textContent = (staff.reduce((a, s) => a + s.exp, 0) / staff.length).toFixed(1);
    document.getElementById('staffOnDuty').textContent = staff.filter(s => s.status === 'Работает').length;
    document.getElementById('staffVacation').textContent = staff.filter(s => s.status === 'Отпуск').length;
    
    document.getElementById('scheduleTableBody').innerHTML = staff.filter(s => s.status === 'Работает').map(s => `
        <tr>
            <td><strong>${s.name}</strong><br><small style="color: var(--text-muted);">${s.role}</small></td>
            <td><span class="badge badge-green">07-15</span></td>
            <td><span class="badge badge-green">07-15</span></td>
            <td><span class="badge badge-green">07-15</span></td>
            <td><span class="badge badge-green">07-15</span></td>
            <td><span class="badge badge-green">07-15</span></td>
            <td><span class="badge badge-gray">Вых</span></td>
            <td><span class="badge badge-gray">Вых</span></td>
            <td>40</td>
        </tr>
    `).join('');
}

// ============ PROFILE ============
function renderProfile() {
    const roleConfig = ROLES[currentUser.role] || ROLES.operator;
    
    document.getElementById('profileAvatar').textContent = getInitials(currentUser.name);
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileRoleBadge').textContent = roleConfig.name;
    document.getElementById('profileLogin').textContent = '@' + currentUser.login;
    document.getElementById('profileRole').textContent = roleConfig.name;
    document.getElementById('profileDept').textContent = roleConfig.dept;
    document.getElementById('profilePhone').textContent = currentUser.phone;
    document.getElementById('profileRegDate').textContent = currentUser.regDate;
    document.getElementById('profileLastLogin').textContent = currentUser.lastLogin;
    
    // Permissions
    const permsList = document.getElementById('permissionsList');
    const allPages = ['dashboard', 'herd', 'reproduction', 'health', 'nutrition', 'milk', 'milking', 'storage', 'equipment', 'staff', 'schedule', 'salary', 'finance', 'sales', 'reports', 'settings', 'users'];
    const pageNames = {
        dashboard: 'Дашборд', herd: 'Поголовье КРС', reproduction: 'Репродукция', health: 'Ветконтроль',
        nutrition: 'Кормление', milk: 'Учёт молока', milking: 'Доильный зал', storage: 'Склад',
        equipment: 'Оборудование', staff: 'Сотрудники', schedule: 'График', salary: 'Зарплаты',
        finance: 'Финансы', sales: 'Продажи', reports: 'Отчёты', settings: 'Настройки', users: 'Пользователи'
    };
    
    permsList.innerHTML = allPages.map(page => {
        const hasAccess = roleConfig.permissions.includes('all') || roleConfig.permissions.includes(page);
        return `
            <div class="permission-item ${hasAccess ? 'allowed' : 'denied'}">
                <span>${pageNames[page]}</span>
                <span class="badge ${hasAccess ? 'badge-green' : 'badge-gray'}">${hasAccess ? '✓ Доступно' : '✕ Нет доступа'}</span>
            </div>
        `;
    }).join('');
    
    // Timeline
    document.getElementById('profileTimeline').innerHTML = systemLogs.slice(0, 6).map(log => `
        <div class="timeline-item">
            <div class="timeline-text">${log}</div>
        </div>
    `).join('');
}

// ============ SALARY ============
function renderSalary() {
    const totalSalary = staff.reduce((a, s) => a + s.salary, 0);
    const avgSalary = totalSalary / staff.length;
    const bonus = Math.floor(totalSalary * 0.15);
    const deduction = Math.floor(totalSalary * 0.13);
    
    document.getElementById('salaryTotal').textContent = formatNumber(totalSalary);
    document.getElementById('salaryAvg').textContent = formatNumber(Math.floor(avgSalary));
    document.getElementById('salaryBonus').textContent = formatNumber(bonus);
    document.getElementById('salaryDeduction').textContent = formatNumber(deduction);
    
    document.getElementById('salaryTableBody').innerHTML = staff.map(s => {
        const workedDays = s.status === 'Работает' ? 22 : s.status === 'Отпуск' ? 0 : 10;
        const bonusAmount = Math.floor(s.salary * 0.15);
        const deduct = Math.floor(s.salary * 0.13);
        const total = s.salary + bonusAmount - deduct;
        
        return `
            <tr>
                <td><strong>${s.name}</strong></td>
                <td>${s.role}</td>
                <td>${formatNumber(s.salary)} ₽</td>
                <td>${workedDays} дн</td>
                <td>${formatNumber(bonusAmount)} ₽</td>
                <td>${formatNumber(deduct)} ₽</td>
                <td><strong>${formatNumber(total)} ₽</strong></td>
            </tr>
        `;
    }).join('');
}

// ============ FINANCE ============
function renderFinance() {
    const revenue = 2850000;
    const expenses = 1980000;
    const profit = revenue - expenses;
    const margin = Math.round(profit / revenue * 100);
    
    document.getElementById('finRevenue').textContent = formatNumber(revenue);
    document.getElementById('finExpenses').textContent = formatNumber(expenses);
    document.getElementById('finProfit').textContent = formatNumber(profit);
    document.getElementById('finMargin').textContent = margin + '%';
    
    const chartContainer = document.getElementById('financeChart');
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
    const revenues = [2400, 2550, 2380, 2850, 0, 0];
    const maxRev = Math.max(...revenues.filter(r => r > 0));
    
    chartContainer.innerHTML = months.map((m, i) => `
        <div class="chart-bar" style="height: ${revenues[i] ? (revenues[i] / maxRev * 100) : 0}%; opacity: ${revenues[i] ? 1 : 0.3}" data-value="${revenues[i] ? revenues[i] + 'K' : '-'}"></div>
    `).join('');
    
    document.getElementById('expenseTableBody').innerHTML = `
        <tr><td>Корма</td><td>${formatNumber(680000)} ₽</td><td>34%</td><td><span class="text-warning">▲ 5%</span></td></tr>
        <tr><td>ФОТ</td><td>${formatNumber(520000)} ₽</td><td>26%</td><td><span class="text-success">▼ 2%</span></td></tr>
        <tr><td>Ветпрепараты</td><td>${formatNumber(120000)} ₽</td><td>6%</td><td><span class="text-success">▼ 8%</span></td></tr>
        <tr><td>Электроэнергия</td><td>${formatNumber(95000)} ₽</td><td>5%</td><td><span class="text-warning">▲ 12%</span></td></tr>
        <tr><td>Топливо</td><td>${formatNumber(85000)} ₽</td><td>4%</td><td><span class="text-warning">▲ 15%</span></td></tr>
        <tr><td>Амортизация</td><td>${formatNumber(180000)} ₽</td><td>9%</td><td><span class="text-muted">—</span></td></tr>
        <tr><td>Прочие</td><td>${formatNumber(300000)} ₽</td><td>15%</td><td><span class="text-warning">▲ 3%</span></td></tr>
    `;
}

// ============ SALES ============
function renderSales() {
    document.getElementById('clientsTableBody').innerHTML = `
        <tr>
            <td><strong>ООО «Молочный комбинат»</strong></td>
            <td>7701234567</td>
            <td>Молоко сырое</td>
            <td>45 000 л/мес</td>
            <td>38 ₽/л</td>
            <td><span class="text-success">0 ₽</span></td>
            <td><span class="badge badge-green">Активен</span></td>
        </tr>
        <tr>
            <td><strong>ОАО «Сыродельный завод»</strong></td>
            <td>7709876543</td>
            <td>Молоко высший сорт</td>
            <td>28 000 л/мес</td>
            <td>42 ₽/л</td>
            <td><span class="text-warning">156 000 ₽</span></td>
            <td><span class="badge badge-amber">Задолженность</span></td>
        </tr>
    `;
    
    document.getElementById('shipmentsTableBody').innerHTML = `
        <tr>
            <td>24.04.2026</td>
            <td>ООО «Молочный комбинат»</td>
            <td>Молоко сырое</td>
            <td>1 500 л</td>
            <td>38 ₽</td>
            <td><strong>57 000 ₽</strong></td>
            <td><span class="badge badge-green">Оплачено</span></td>
        </tr>
        <tr>
            <td>22.04.2026</td>
            <td>ОАО «Сыродельный завод»</td>
            <td>Молоко высший сорт</td>
            <td>980 л</td>
            <td>42 ₽</td>
            <td><strong>41 160 ₽</strong></td>
            <td><span class="badge badge-amber">Ожидает оплаты</span></td>
        </tr>
    `;
}

// ============ USERS ============
function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = users.map(u => {
        const roleConfig = ROLES[u.role] || ROLES.operator;
        return `
            <tr>
                <td><span class="badge badge-gray">#${u.id}</span></td>
                <td><strong>${u.login}</strong></td>
                <td>${u.name}</td>
                <td><span class="badge badge-blue">${roleConfig.name}</span></td>
                <td>${roleConfig.dept}</td>
                <td><span class="badge ${u.status === 'active' ? 'badge-green' : 'badge-gray'}">${u.status === 'active' ? 'Активен' : 'Заблокирован'}</span></td>
                <td>${u.lastLogin}</td>
                <td>
                    <button class="btn btn-sm btn-secondary btn-icon">✏️</button>
                    <button class="btn btn-sm btn-danger btn-icon" onclick="toggleUserStatus(${u.id})">${u.status === 'active' ? '🔒' : '🔓'}</button>
                </td>
            </tr>
        `;
    }).join('');
}

function toggleUserStatus(userId) {
    const user = users.find(u => u.id === userId);
    if (!user || user.id === 1) {
        showToast('Ошибка', 'Нельзя заблокировать администратора', 'error');
        return;
    }
    user.status = user.status === 'active' ? 'blocked' : 'active';
    renderUsers();
    showToast('Успешно', `Пользователь ${user.login} ${user.status === 'active' ? 'разблокирован' : 'заблокирован'}`);
}

// ============ EXPORT ============
function exportHerd() {
    const data = {
        exportDate: new Date().toISOString(),
        totalCows: cows.length,
        cows: cows
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `burenka_herd_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Экспорт', 'Реестр КРС экспортирован');
    addLog('Экспорт реестра КРС');
}

function exportReport() {
    showToast('Экспорт', 'Отчёт формируется...');
}

function refreshDashboard() {
    renderDashboard();
    showToast('Обновлено', 'Данные дашборда актуализированы');
}

// ============ APP INIT ============
function initApp() {
    buildSidebar();
    
    // Theme
    document.getElementById('themeToggleBtn').addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        showToast('Тема', isDark ? 'Тёмная тема включена' : 'Светлая тема включена');
    });
    
    document.getElementById('settingsThemeToggle')?.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Sidebar toggle
    document.getElementById('toggleSidebar').addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        const main = document.getElementById('mainContent');
        sidebar.classList.toggle('hidden');
        main.classList.toggle('full');
        localStorage.setItem('sidebarHidden', sidebar.classList.contains('hidden'));
    });
    
    // Restore sidebar state
    if (localStorage.getItem('sidebarHidden') === 'true') {
        document.getElementById('sidebar').classList.add('hidden');
        document.getElementById('mainContent').classList.add('full');
    }
    
    // Restore theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
    
    // Profile
    document.getElementById('profileBtn').addEventListener('click', () => switchPage('profile'));
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        currentUser = null;
        document.getElementById('appLayout').style.display = 'none';
        document.getElementById('loginOverlay').style.display = 'flex';
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPass').value = '';
        showToast('Выход', 'Сеанс завершён');
    });
    
    // Mobile sidebar
    document.getElementById('toggleSidebar').addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.stopPropagation();
            document.getElementById('sidebar').classList.toggle('mobile-open');
        }
    });
    
    // Filters
    document.getElementById('herdSearch')?.addEventListener('input', renderHerd);
    document.getElementById('herdFilterBreed')?.addEventListener('change', renderHerd);
    document.getElementById('herdFilterStatus')?.addEventListener('change', renderHerd);
    document.getElementById('staffSearch')?.addEventListener('input', renderStaff);
    document.getElementById('staffFilterRole')?.addEventListener('change', renderStaff);
    document.getElementById('staffFilterStatus')?.addEventListener('change', renderStaff);
    
    // Global search
    document.getElementById('globalSearch').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) return;
        const found = cows.filter(c => c.name.toLowerCase().includes(query) || c.tag.toLowerCase().includes(query));
        if (found.length > 0) {
            switchPage('herd');
            document.getElementById('herdSearch').value = query;
            renderHerd();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('globalSearch').focus();
        }
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        }
    });
    
    // Notifications
    document.getElementById('notifBtn').addEventListener('click', () => {
        showToast('Уведомления', 'У вас 3 непрочитанных уведомления', 'warning');
    });
    
    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    });
    
    // Initial render
    renderDashboard();
}

// ============ DOM READY ============
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});