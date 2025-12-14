let teamName = '';
let score = 0;
let timeLeft = 600; // 10 minutes
let timerInterval;
let currentFire = null;
let firesExtinguished = 0;

const fires = [
    {
        id: 1,
        name: 'שריפת שמן במטבח',
        icon: '🍳',
        description: 'מחבת עם שמן בוער!',
        correctTool: 'blanket',
        hint: 'מים על שמן זה מסוכן! צריך לחנוק את האש.',
        explanation: 'שמיכה כיבוי מסירה את החמצן מהאש! מים היו גורמים לפיצוץ עם שמן.',
        points: 25,
        extinguished: false
    },
    {
        id: 2,
        name: 'שריפת עצים',
        icon: '🪵',
        description: 'ערמת עצים בוערת!',
        correctTool: 'water',
        hint: 'שריפה רגילה - מה מוריד את החום?',
        explanation: 'מים מסירים את החום מהאש ומכבים אותה!',
        points: 20,
        extinguished: false
    },
    {
        id: 3,
        name: 'שריפת ציוד אלקטרוני',
        icon: '💻',
        description: 'מחשבים וכבלים בוערים!',
        correctTool: 'co2',
        hint: 'אסור להשתמש במים על חשמל! צריך משהו שמדכא את הבעירה.',
        explanation: 'מטף CO₂ מכבה בלי מים (בטוח לחשמל) ומדכא את הבעירה על ידי הסרת החמצן!',
        points: 30,
        extinguished: false
    },
    {
        id: 4,
        name: 'שריפת נייר',
        icon: '📄',
        description: 'ערמת מסמכים בוערת!',
        correctTool: 'water',
        hint: 'חומר רגיל שבוער - מה הכי פשוט?',
        explanation: 'מים מתאימים למרבית השריפות הרגילות!',
        points: 20,
        extinguished: false
    },
    {
        id: 5,
        name: 'שריפה על אדם',
        icon: '🧍',
        description: 'הבגדים של מישהו עולים באש!',
        correctTool: 'blanket',
        hint: 'צריך לחנוק את האש במהירות מבלי לפגוע באדם!',
        explanation: 'שמיכה היא הדרך הבטוחה ביותר - מסירה את החמצן ולא פוגעת באדם!',
        points: 30,
        extinguished: false
    },
    {
        id: 6,
        name: 'שריפת גז',
        icon: '🔥',
        description: 'דליפת גז בוערת!',
        correctTool: 'remove',
        hint: 'במקרה של גז - הכי חשוב לסגור את המקור!',
        explanation: 'הסרת החומר הדליק (סגירת ברז הגז) היא הדרך היחידה לכבות שריפת גז!',
        points: 35,
        extinguished: false
    }
];

const tools = [
    {
        id: 'water',
        name: 'מים',
        icon: '💧',
        action: 'מסיר חום',
        description: 'מתאים לרוב השריפות, מוריד את הטמפרטורה'
    },
    {
        id: 'blanket',
        name: 'שמיכת כיבוי',
        icon: '🛏️',
        action: 'מסיר חמצן',
        description: 'חונקת את האש, מונעת חמצן מלהגיע'
    },
    {
        id: 'co2',
        name: 'מטף CO₂',
        icon: '🧯',
        action: 'מדכא בעירה',
        description: 'פחמן דו-חמצני מסיר חמצן ומדכא את הבעירה'
    },
    {
        id: 'remove',
        name: 'הסרת מקור',
        icon: '🚫',
        action: 'מסיר חומר דליק',
        description: 'הסרת החומר הבוער עצמו'
    },
    {
        id: 'oxygen',
        name: 'חמצן (טעות!)',
        icon: '💨',
        action: 'מחזק אש!',
        description: 'זהירות - חמצן מחזק את האש במקום לכבות!'
    }
];

function startMission() {
    teamName = document.getElementById('teamName').value.trim();
    if (!teamName) {
        alert('בבקשה הכניסו שם לצוות! 😊');
        return;
    }

    document.getElementById('welcomeScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    document.getElementById('teamNameDisplay').textContent = teamName;

    initGame();
    startTimer();
}

function initGame() {
    renderFires();
}

function renderFires() {
    const container = document.getElementById('fireZones');
    container.innerHTML = '';

    fires.forEach(fire => {
        const zone = document.createElement('div');
        zone.className = `fire-zone ${fire.extinguished ? 'extinguished' : ''}`;
        zone.onclick = () => selectFire(fire.id);

        zone.innerHTML = `
            <div class="fire-icon">${fire.icon}</div>
            <div class="fire-label">${fire.name}</div>
            <div class="fire-status">
                ${fire.extinguished ? '✅ כבויה' : '🔥 בוערת!'}
            </div>
        `;

        container.appendChild(zone);
    });
}

function selectFire(fireId) {
    const fire = fires.find(f => f.id === fireId);
    if (fire.extinguished) return;

    currentFire = fire;

    // Update active state
    document.querySelectorAll('.fire-zone').forEach((zone, index) => {
        zone.classList.remove('active');
        if (index === fireId - 1) {
            zone.classList.add('active');
        }
    });

    // Update mission
    document.getElementById('missionText').textContent =
        `${fire.description} איזה כלי תשתמשו?`;

    // Show tools
    document.getElementById('toolsPanel').style.display = 'block';
    renderTools();
}

function renderTools() {
    const container = document.getElementById('toolsGrid');
    container.innerHTML = '';

    tools.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.onclick = () => useTool(tool.id);

        card.innerHTML = `
            <div class="tool-icon">${tool.icon}</div>
            <div class="tool-name">${tool.name}</div>
            <div class="tool-action">${tool.action}</div>
        `;

        container.appendChild(card);
    });
}

function useTool(toolId) {
    if (!currentFire) return;

    const tool = tools.find(t => t.id === toolId);

    if (toolId === 'oxygen') {
        showPopup('❌', 'טעות!', 'חמצן מחזק את האש! הוא לא מכבה אותה.\nזכרו: O₂ = מעודד בעירה 🔥\nCO₂ = מדכא בעירה 🧯', false);
        return;
    }

    if (toolId === currentFire.correctTool) {
        // Correct!
        currentFire.extinguished = true;
        firesExtinguished++;
        score += currentFire.points;

        updateScore();
        renderFires();

        showPopup(
            '✅',
            'מצוין!',
            currentFire.explanation + `\n\n+${currentFire.points} נקודות!`,
            true
        );

        document.getElementById('toolsPanel').style.display = 'none';
        currentFire = null;

        // Check if won
        if (firesExtinguished === fires.length) {
            setTimeout(winGame, 1500);
        }
    } else {
        showPopup(
            '❌',
            'לא מתאים!',
            `${tool.name} לא מתאים לשריפה הזו.\nנסו כלי אחר!`,
            false
        );
    }
}

function showHint() {
    if (!currentFire) {
        alert('בחרו שריפה קודם!');
        return;
    }

    showPopup('💡', 'רמז', currentFire.hint, false);
}

function showPopup(icon, title, content, isSuccess) {
    document.getElementById('popupIcon').textContent = icon;
    document.getElementById('popupTitle').textContent = title;
    document.getElementById('popupContent').textContent = content;
    document.getElementById('overlay').classList.add('show');
    document.getElementById('infoPopup').classList.add('show');
}

function closePopup() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('infoPopup').classList.remove('show');
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            gameOver();
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerDisplay').textContent =
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateScore() {
    document.getElementById('scoreDisplay').textContent = score;
}

function winGame() {
    clearInterval(timerInterval);

    const timeTaken = 600 - timeLeft;
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    // Bonus for time
    const timeBonus = Math.floor(timeLeft / 10);
    score += timeBonus;

    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('victoryScreen').classList.add('active');
    document.getElementById('finalScore').textContent = score + ' נקודות';
    document.getElementById('finalTime').textContent =
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function gameOver() {
    clearInterval(timerInterval);
    alert('הזמן נגמר! הבניין נשרף... נסו שוב!');
    location.reload();
}
