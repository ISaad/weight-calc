
// DOM Elements
const tabs = document.querySelectorAll('.tab-content');
const navItems = document.querySelectorAll('.nav-item');
const subTabBtns = document.querySelectorAll('.sub-tab-btn');
const toast = document.getElementById('toast');

// Navigation & Menu Elements
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const sideMenu = document.getElementById('side-menu');
const sideMenuOverlay = document.getElementById('side-menu-overlay');
const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page-content');
const backBtns = document.querySelectorAll('.back-btn');

// Calculator Elements (Page: Calculator)
const rmInputs = {
    muscleup: document.getElementById('rm-muscleup'),
    dip: document.getElementById('rm-dip'),
    squat: document.getElementById('rm-squat'),
    pullup: document.getElementById('rm-pullup')
};
const calcTitle = document.getElementById('calc-title');
const calcBwInput = document.getElementById('calc-bw'); // Now in Get Started
const calcRepsInput = document.getElementById('calc-reps');
const calcRirSelect = document.getElementById('calc-rir');
const btnCalculate = document.getElementById('btn-calculate');
const resultWeight = document.getElementById('result-weight');
const resultBreakdown = document.getElementById('result-breakdown');

// Estimate Elements (Page: Get Started)
const estWeightInput = document.getElementById('est-weight');
const estRepsInput = document.getElementById('est-reps');
const estExerciseSelect = document.getElementById('est-exercise');
const btnEstimate = document.getElementById('btn-estimate');
const estResultDiv = document.getElementById('est-result');
const estValSpan = document.getElementById('est-val');

// Theme
const themeToggle = document.getElementById('theme-toggle');

// Routine & Workout Elements
const routineBlockSelect = document.getElementById('routine-block');
const routineWeekSelect = document.getElementById('routine-week');
const workoutDisplay = document.getElementById('workout-display');

// Account Routine Editor Elements
const routineBlockEdit = document.getElementById('routine-block-edit');
const routineWeekEdit = document.getElementById('routine-week-edit');
const routineTableBodyFull = document.getElementById('routine-table-body-full');

// Stats Elements
const statsBlockSelect = document.getElementById('stats-block');
const statsWeekSelect = document.getElementById('stats-week');
const statsLogContainer = document.getElementById('stats-log-container');

// State
let currentExercise = 'muscleup';
let routineData = []; // Will be loaded

// RPE Table (Inverted to RIR roughly)
// RIR 0 = RPE 10. RIR 1 = RPE 9.
const rpeToPercent = {
    "10": [100, 95.5, 92.2, 89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9],
    "9.5": [97.8, 93.9, 90.7, 87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3],
    "9": [95.5, 92.2, 89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7],
    "8.5": [93.9, 90.7, 87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3, 69.4],
    "8": [92.2, 89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7, 68.0],
    "7.5": [90.7, 87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3, 69.4, 66.7],
    "7": [89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7, 68.0, 65.3],
    "6.5": [87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3, 69.4, 66.7, 64.0],
    "6": [86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7, 68.0, 65.3, 62.6]
};

const rirToRpeKey = {
    "0": "10", "0.5": "9.5", "1": "9", "1.5": "8.5", "2": "8",
    "2.5": "7.5", "3": "7", "3.5": "6.5", "4": "6"
};

// --- DATA INITIALIZATION ---
// Same default routine structure as before
const defaultRoutine = [
    // Block 1
    [
        ["1x5 + 2x8", "3-4", "3x8", "3-4", "2x2", "3-4", "EMOM3 2-3r", "", "2x8-10", "3", "2x10-15", "3"],
        ["1x5 + 3x8", "3", "3x8", "3", "3x2", "3", "EMOM4 2-3r", "", "3x8-10", "2", "3x10-15", "2"],
        ["1x5 + 3x8", "2", "4x7", "3", "3x2", "2", "EMOM5 2-3r", "", "3x8-10", "2", "3x10-15", "2"],
        ["1x5 + 3x8", "1-0", "4x7", "3", "3x2", "1", "EMOM6 2-3r", "", "3x8-10", "2", "3x10-15", "2"]
    ],
    // Block 2
    [
        ["1x4 + 2x7", "3-4", "3x7", "3-4", "3x2", "3-4", "EMOM3 3-4r", "", "3x8-10", "3", "2x10-15", "3"],
        ["1x4 + 3x7", "3", "4x7", "3", "4x2", "3", "EMOM4 3-4r", "", "4x8-10", "2", "3x10-15", "2"],
        ["1x4 + 3x7", "2", "4x7", "3", "4x2", "2", "EMOM5 3-4r", "", "4x8-10", "2", "3x10-15", "2"],
        ["1x4 + 3x7", "1-0", "4x7", "3", "4x2", "1", "EMOM6 3-4r", "", "4x8-10", "2", "3x10-15", "2"]
    ],
    // Block 3
    [
        ["1x3 + 2x6", "3-4", "3x7", "3-4", "4x2", "3-4", "EMOM3 2-3r", "", "3x6-8", "3", "2x10-15", "3"],
        ["1x3 + 3x6", "3", "4x6", "3", "5x2", "3", "EMOM4 2-3r", "", "4x6-8", "2", "3x10-15", "2"],
        ["1x3 + 3x6", "2", "4x6", "3", "5x2", "2", "EMOM5 2-3r", "", "4x6-8", "2", "3x10-15", "2"],
        ["1x3 + 3x6", "1-0", "4x6", "3", "5x2", "1", "EMOM6 2-3r", "", "4x6-8", "2", "3x10-15", "2"]
    ],
    // Block 4
    [
        ["1x2 + 2x5", "3-4", "3x6", "3-4", "5x2", "3-4", "4x1+1 Cluster", "3-4", "4x5-7", "3", "2x10-15", "3"],
        ["1x2 + 3x5", "3", "4x6", "3", "6x2", "3", "5x1+1 Cluster", "3", "5x5-7", "2", "3x10-15", "2"],
        ["1x2 + 3x5", "2", "4x5", "3", "6x2", "2", "5x1+1 Cluster", "2", "5x5-7", "2", "3x10-15", "2"],
        ["1x2 + 3x5", "1-0", "4x5", "3", "6x2", "1", "5x1+1 Cluster", "0-1", "5x5-7", "2", "3x10-15", "2"]
    ],
    // Block 5
    [
        ["1x2 + 2x5", "3-4", "3x5", "3-4", "4x2", "3-4", "4x1+1 Cluster", "3-4", "4x8", "3", "2x10-15", "3"],
        ["1x2 + 3x4", "3", "4x5", "3", "3x1 + 2x3", "3", "5x1+1 Cluster", "3", "5x7", "2", "3x10-15", "2"],
        ["1x1 + 3x3", "2", "4x4", "3", "3x1 + 2x3", "2", "5x1+1 Cluster", "2", "5x6", "2", "3x10-15", "2"],
        ["1x1 + 3x3", "1-0", "4x3", "3", "3x1 + 2x3", "1", "5x1+1 Cluster", "0-1", "5x5", "2", "3x10-15", "2"]
    ]
];

// --- EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initTheme();
    initPWA();
    initModal();
    updateCalculatorUI();
    renderFullRoutineTable(); // Initial Render for default selections
    updateWorkoutDisplay();
    renderStatsLog(); // Initial Render
});

// Navigation Logic
menuToggle.addEventListener('click', toggleMenu);
menuClose.addEventListener('click', toggleMenu);
sideMenuOverlay.addEventListener('click', toggleMenu);

function toggleMenu() {
    sideMenu.classList.toggle('active');
    sideMenuOverlay.classList.toggle('active');
}

menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = item.getAttribute('data-page');
        openPage(pageId);
        toggleMenu(); // Close menu
    });
});

backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Hide all pages, effectively returning to the underlying "Main Tabs" view
        pages.forEach(p => p.classList.remove('active'));
    });
});

function openPage(pageId) {
    pages.forEach(p => {
        p.classList.remove('active');
        if (p.id === pageId) p.classList.add('active');
    });
}

// Tab Navigation (Workout vs Stats)
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();

        // Update nav UI
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Show target tab
        const targetId = item.getAttribute('data-target');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.id === targetId) tab.classList.add('active');
        });
    });
});

// Sub Tab Navigation (Calculator Page)
subTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        subTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentExercise = btn.getAttribute('data-ex');
        updateCalculatorUI();
    });
});

// 1RM Inputs
Object.keys(rmInputs).forEach(key => {
    rmInputs[key].addEventListener('input', () => {
        const val = rmInputs[key].value;
        localStorage.setItem(`rm_${key}`, val);
        updateWorkoutDisplay();
        // Also update calc breakdown if visible?
    });
});

// Calculator
btnCalculate.addEventListener('click', calculateSingle);
calcBwInput.addEventListener('input', () => {
    localStorage.setItem('bodyweight', calcBwInput.value);
    updateWorkoutDisplay();
});

// Estimate 1RM
btnEstimate.addEventListener('click', () => {
    const w = parseFloat(estWeightInput.value) || 0;
    const r = parseInt(estRepsInput.value) || 0;
    const bw = parseFloat(calcBwInput.value) || 0;
    const ex = estExerciseSelect.value; // "muscleup" etc.

    if (r === 0) {
        showToast('Please enter reps');
        return;
    }

    let estimated1RM = 0;

    // Logic dependent on exercise? 
    // Brzycki: 1RM = Weight / (1.0278 - 0.0278 * Reps)
    // Or weight * (36 / (37 - r))

    // For Weighted Calisthenics:
    // If Squat (no BW): Total = Weight
    // If Pull/Dip (BW): Total = BW + Weight

    let totalWeightUsed = w;
    if (ex !== 'squat') {
        if (bw === 0) {
            showToast('Please enter Bodyweight');
            return;
        }
        totalWeightUsed += bw;
    }

    // Estimate Total 1RM
    const estimatedTotal = totalWeightUsed * (36 / (37 - r));

    // Result to save/display (Added Weight)
    let finalResult = estimatedTotal;
    if (ex !== 'squat') {
        finalResult = estimatedTotal - bw;
    }

    estValSpan.textContent = finalResult.toFixed(2);
    estResultDiv.style.display = 'block';

    // Auto-save to Account?
    // User said: "The results of 1RM calculations will be included in the exercise slots they correspond to."
    rmInputs[ex].value = finalResult.toFixed(2);
    localStorage.setItem(`rm_${ex}`, finalResult.toFixed(2));
    showToast(`Saved to ${ex} stats!`);
    updateWorkoutDisplay();
});


// Routine & Stats Selectors
routineBlockSelect.addEventListener('change', updateWorkoutDisplay);
routineWeekSelect.addEventListener('change', updateWorkoutDisplay);

// In Account Page: Routine Editor Selectors
routineBlockEdit.addEventListener('change', renderFullRoutineTable);
routineWeekEdit.addEventListener('change', renderFullRoutineTable);

// Stats Page Selectors
statsBlockSelect.addEventListener('change', renderStatsLog);
statsWeekSelect.addEventListener('change', renderStatsLog);


// --- FUNCTIONS ---

function loadData() {
    // Load 1RMs
    Object.keys(rmInputs).forEach(key => {
        const saved = localStorage.getItem(`rm_${key}`);
        if (saved) rmInputs[key].value = saved;
    });

    // Load Bodyweight
    const savedBW = localStorage.getItem('bodyweight');
    if (savedBW) calcBwInput.value = savedBW;

    // Load Routine
    const savedRoutine = localStorage.getItem('routineData');
    if (savedRoutine) {
        routineData = JSON.parse(savedRoutine);
    } else {
        routineData = defaultRoutine;
    }
}

function updateCalculatorUI() {
    const names = {
        muscleup: 'Muscle-Up',
        dip: 'Dip',
        squat: 'Squat',
        pullup: 'Pull-Up'
    };
    calcTitle.textContent = `${names[currentExercise]} Calculator`;
}

// THEME
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleIcon(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeToggleIcon(theme);
}

function updateThemeToggleIcon(theme) {
    if (themeToggle) {
        themeToggle.textContent = theme === 'light' ? 'L' : 'D';
    }
}
// Add listener to the header toggle as well
themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});


// LOGIC: Calculate Single
function calculateSingle() {
    const addedRM = parseFloat(rmInputs[currentExercise].value) || 0;
    const bodyweight = parseFloat(calcBwInput.value) || 0;
    const reps = parseInt(calcRepsInput.value) || 0;
    const rir = calcRirSelect.value;

    // Squat check
    const isSquat = currentExercise === 'squat';

    if (reps === 0) {
        showToast('Please enter reps');
        return;
    }
    if (!isSquat && bodyweight === 0) {
        showToast('Enter Bodyweight in Get Started');
        return;
    }

    const rpeKey = rirToRpeKey[rir];
    const intensities = rpeToPercent[rpeKey];
    if (!intensities || reps > 10) {
        showToast('Reps too high for estimate');
        return;
    }

    const percentage = intensities[reps - 1];

    let targetTotal = 0;
    let targetAdded = 0;

    if (isSquat) {
        // Pure weight calculation
        // 1RM is just the weight on bar
        targetTotal = addedRM * (percentage / 100);
        targetAdded = targetTotal; // Display total for squat usually? Or added? User input "Squat (kg)" usually refers to weight on bar for simple squats, OR added weight?
        // "If I’m 62kg, and I lift 75 of squats, my 1RM is 75" -> 75 is Total.
        // So addedRM input for squat IS the total weight.
        resultBreakdown.innerHTML = `Total Load: ${targetTotal.toFixed(2)}kg`;
    } else {
        // Bodyweight calculation
        const oneRMTotal = bodyweight + addedRM;
        targetTotal = oneRMTotal * (percentage / 100);
        targetAdded = targetTotal - bodyweight;
        resultBreakdown.innerHTML = `Total Load: ${targetTotal.toFixed(2)}kg`;
    }

    resultWeight.textContent = targetAdded.toFixed(2);
}

// LOGIC: Routine Table Editor (Account Page)
function renderFullRoutineTable() {
    const block = parseInt(routineBlockEdit.value) - 1;
    const week = parseInt(routineWeekEdit.value) - 1;
    const data = routineData[block][week];

    // Defined Rows mapping to data indices
    // 0: Dip Main, 2: Dip Sec ... wait.
    // Data Array Indices:
    // 0,1: Primary Main (Dip/Squat/Pull)
    // 2,3: Secondary Main (Paused)
    // 4,5: Primary MU
    // 6,7: Secondary MU
    // 8,9: Assist 1
    // 10,11: Assist 2

    const rows = [
        { label: "Primary Muscle-Up", idxSet: 4, idxRir: 5 },
        { label: "Primary Main Lift (Dip/Squat/Pull)", idxSet: 0, idxRir: 1 },
        { label: "Secondary Muscle-Up", idxSet: 6, idxRir: 7 },
        { label: "Secondary Main Lift", idxSet: 2, idxRir: 3 },
        { label: "Assistance 1", idxSet: 8, idxRir: 9 },
        { label: "Assistance 2", idxSet: 10, idxRir: 11 },
    ];

    routineTableBodyFull.innerHTML = '';

    rows.forEach(row => {
        const tr = document.createElement('tr');

        // Exercise Column
        const tdName = document.createElement('td');
        const nameDiv = document.createElement('div');
        nameDiv.textContent = row.label;
        const rirDiv = document.createElement('div');
        rirDiv.contentEditable = true;
        rirDiv.textContent = `RIR ${data[row.idxRir]}`;
        rirDiv.style.fontWeight = "normal";
        rirDiv.style.opacity = "0.8";
        rirDiv.style.fontSize = "0.75rem";
        rirDiv.onblur = () => {
            // Extract number from "RIR X" string if user typed that
            let val = rirDiv.textContent.replace(/RIR/i, '').trim();
            routineData[block][week][row.idxRir] = val;
            saveRoutine();
        };

        tdName.appendChild(nameDiv);
        tdName.appendChild(rirDiv);
        tr.appendChild(tdName);

        // Protocol Column
        const tdProto = document.createElement('td');
        const protoDiv = document.createElement('div');
        protoDiv.contentEditable = true;
        protoDiv.textContent = data[row.idxSet];
        protoDiv.style.color = "var(--accent-color)";
        protoDiv.style.fontWeight = "bold";
        protoDiv.onblur = () => {
            routineData[block][week][row.idxSet] = protoDiv.textContent;
            saveRoutine();
            // Update workout view if it matches current selection
            if (routineBlockSelect.value == (block + 1) && routineWeekSelect.value == (week + 1)) {
                updateWorkoutDisplay();
            }
        };
        tdProto.appendChild(protoDiv);
        tr.appendChild(tdProto);

        routineTableBodyFull.appendChild(tr);
    });
}

function saveRoutine() {
    localStorage.setItem('routineData', JSON.stringify(routineData));
}

// LOGIC: Weight Calculation Helper
function getWeightDetails(exKey, setString, rirString, isSecondary = false) {
    const bodyweightInput = document.getElementById('calc-bw');
    const bw = parseFloat(bodyweightInput.value) || 0;
    const addedRM = parseFloat(rmInputs[exKey].value) || 0;

    // Squat Fix: If squat, OneRMTotal IS the addedRM (which represents total).
    // Else, OneRMTotal = bw + addedRM
    let oneRMTotal = bw + addedRM;
    if (exKey === 'squat') oneRMTotal = addedRM;

    if (oneRMTotal === 0) return [{ protocol: setString, weight: "?", rir: rirString }];

    const parts = setString.split('+').map(p => p.trim());
    const results = [];

    parts.forEach(part => {
        let reps = 0;
        const repsMatch = part.match(/(\d+)$/) || part.match(/x(\d+)/);
        if (repsMatch) {
            reps = parseInt(repsMatch[1]);
        } else {
            const rangeMatch = part.match(/-(\d+)/);
            if (rangeMatch) reps = parseInt(rangeMatch[1]);
        }

        if (reps === 0 || isNaN(reps)) {
            if (part.toLowerCase().includes('cluster')) {
                const clusterMatch = part.match(/(\d+)\+(\d+)/);
                if (clusterMatch) reps = parseInt(clusterMatch[1]) + parseInt(clusterMatch[2]);
            }
        }

        if (reps === 0 || isNaN(reps)) {
            results.push({ protocol: part, weight: "Manual", rir: rirString });
            return;
        }

        const rirMatch = rirString.match(/(\d+(\.\d+)?)/);
        const rirVal = rirMatch ? parseFloat(rirMatch[0]) : 3;

        let rpeEst = 10 - rirVal;
        rpeEst = Math.round(rpeEst * 2) / 2;
        if (rpeEst < 6) rpeEst = 6;
        if (rpeEst > 10) rpeEst = 10;

        const rpeKey = rpeEst.toString();
        const arr = rpeToPercent[rpeKey] || rpeToPercent["7"];

        let weightText = "";
        if (reps > 10) {
            weightText = "Light";
        } else {
            let intensity = arr[reps - 1];

            // Secondary Logic: User said "too high".
            // Previous was * 0.90. Let's try * 0.85 approx (-15%).
            // Or better: Simulate a higher RIR? 
            // Just drop percentage.
            if (isSecondary) intensity = intensity * 0.88;

            let totalLoad = oneRMTotal * (intensity / 100);

            let finalLoad = 0;
            if (exKey === 'squat') {
                finalLoad = totalLoad;
            } else {
                finalLoad = totalLoad - bw;
            }

            weightText = finalLoad.toFixed(2);
        }

        results.push({ protocol: part, weight: weightText, rir: rirString });
    });

    return results;
}

// LOGIC: Workout Display
function updateWorkoutDisplay() {
    const block = parseInt(routineBlockSelect.value);
    const week = parseInt(routineWeekSelect.value);

    workoutDisplay.innerHTML = '';

    const weekData = routineData[block - 1][week - 1];

    // Primary
    const primaryTitle = document.createElement('div');
    primaryTitle.className = 'workout-section-title';
    primaryTitle.textContent = "Primary Lifts";
    workoutDisplay.appendChild(primaryTitle);

    createExerciseCard("Muscle-Up", "muscleup", weekData[4], weekData[5], false);
    createExerciseCard("Dip", "dip", weekData[0], weekData[1], false);
    createExerciseCard("Squat", "squat", weekData[0], weekData[1], false);
    createExerciseCard("Pull-Up", "pullup", weekData[0], weekData[1], false);

    // Secondary
    const secondaryTitle = document.createElement('div');
    secondaryTitle.className = 'workout-section-title';
    secondaryTitle.textContent = "Secondary Lifts";
    workoutDisplay.appendChild(secondaryTitle);

    const secondaryNote = document.createElement('p');
    secondaryNote.className = 'section-desc';
    secondaryNote.style.textAlign = 'left';
    secondaryNote.style.marginBottom = '1.5rem';
    secondaryNote.innerHTML = "* Secondary lifts are calculated with reduced intensity to focus on technique.";
    workoutDisplay.appendChild(secondaryNote);

    createExerciseCard("EMOM Muscle-Ups", "muscleup", weekData[6], weekData[7], true);
    createExerciseCard("Paused Dips", "dip", weekData[2], weekData[3], true);
    createExerciseCard("Paused Squats", "squat", weekData[2], weekData[3], true);
    createExerciseCard("Paused Pull-Ups", "pullup", weekData[2], weekData[3], true);
}

function createExerciseCard(title, exKey, sets, rir, isSec) {
    if (!sets || sets === "-" || sets === "" || sets === " ") return;

    const el = document.createElement('div');
    el.className = 'workout-exercise';

    const details = getWeightDetails(exKey, sets, rir, isSec);

    let detailsHtml = "";
    details.forEach(d => {
        let weightDisplay = d.weight;
        if (!isNaN(parseFloat(weightDisplay))) {
            const w = parseFloat(weightDisplay);
            if (Math.abs(w) < 0.01 && exKey !== 'squat') weightDisplay = "BW";
            else weightDisplay = w.toFixed(2);
        }

        detailsHtml += `
            <div class="exercise-details">
                <div class="detail-item">
                    <span class="detail-label">Sets/Reps</span>
                    <span class="detail-value" style="font-size:1rem">${d.protocol}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Target RIR</span>
                    <span class="detail-value" style="font-size:1rem">${d.rir}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Target Weight</span>
                    <span class="detail-value">${weightDisplay} <span style="font-size:0.6rem">kg</span></span>
                </div>
            </div>
        `;
    });

    el.innerHTML = `
        <div class="exercise-header">
            <span class="exercise-name">${title}</span>
        </div>
        ${detailsHtml}
    `;
    workoutDisplay.appendChild(el);
}

// LOGIC: Stats Log (Basic Implementation)
function renderStatsLog() {
    const block = parseInt(statsBlockSelect.value);
    const week = parseInt(statsWeekSelect.value);

    // Ideally this would check for *saved* stats logic. For now, we generate inputs.
    // To make it simple, we will list the main exercises and a place to write what was done.

    statsLogContainer.innerHTML = '';

    const exercises = ["Muscle-Up", "Dip", "Squat", "Pull-Up"];

    exercises.forEach(ex => {
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.marginBottom = '1rem';
        card.innerHTML = `
            <h3>${ex}</h3>
            <div class="routine-controls">
                <div class="input-group">
                    <label>Weight Used</label>
                    <input type="text" placeholder="e.g. 20kg">
                </div>
                <div class="input-group">
                    <label>Reps Performance</label>
                    <input type="text" placeholder="e.g. 5, 5, 4">
                </div>
            </div>
         `;
        statsLogContainer.appendChild(card);
    });
}


// Legal Modal
function initModal() {
    const modal = document.getElementById('legal-modal');
    const trigger = document.getElementById('legal-trigger');
    const closeBtn = document.querySelector('.close-modal');

    if (!modal || !trigger) return;

    trigger.addEventListener('click', () => {
        modal.classList.add('show');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

function initPWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW Registered'))
            .catch(err => console.log('SW Error', err));
    }
}

function showToast(msg) {
    if (toast) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}
