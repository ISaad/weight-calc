
// DOM Elements
const tabs = document.querySelectorAll('.tab-content');
const navItems = document.querySelectorAll('.nav-item');
const subTabBtns = document.querySelectorAll('.sub-tab-btn');
const toast = document.getElementById('toast');

// Calculator Elements
const rmInputs = {
    muscleup: document.getElementById('rm-muscleup'),
    dip: document.getElementById('rm-dip'),
    squat: document.getElementById('rm-squat'),
    pullup: document.getElementById('rm-pullup')
};
const calcTitle = document.getElementById('calc-title');
const calcBwInput = document.getElementById('calc-bw');
const calcRepsInput = document.getElementById('calc-reps');
const calcRirSelect = document.getElementById('calc-rir');
const btnCalculate = document.getElementById('btn-calculate');
const resultWeight = document.getElementById('result-weight');
const resultBreakdown = document.getElementById('result-breakdown');

// Estimate Elements
const estWeightInput = document.getElementById('est-weight');
const estRepsInput = document.getElementById('est-reps');
const btnEstimate = document.getElementById('btn-estimate');
const estResultDiv = document.getElementById('est-result');
const estValSpan = document.getElementById('est-val');

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const workoutEmoji = document.getElementById('workout-emoji');
const pwaInstallBtn = document.getElementById('pwa-install');

// Routine Elements
const routineBlockSelect = document.getElementById('routine-block');
const routineWeekSelect = document.getElementById('routine-week');
const routineTableBody = document.getElementById('routine-table-body');
const workoutSubtitle = document.getElementById('workout-subtitle');
const workoutDisplay = document.getElementById('workout-display');

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

// Map RIR input values to RPE keys
const rirToRpeKey = {
    "0": "10",
    "0.5": "9.5",
    "1": "9",
    "1.5": "8.5",
    "2": "8",
    "2.5": "7.5",
    "3": "7",
    "3.5": "6.5",
    "4": "6"
};

// --- DATA INITIALIZATION ---

const defaultRoutine = [
    // Block 1
    [
        ["1x5 + 2x8", "3-4", "3x8", "3-4", "2x2", "3-4", "EMOM3 2-3r", "", "2x8-10", "3", "2x10-15", "3"], // W1
        ["1x5 + 3x8", "3", "3x8", "3", "3x2", "3", "EMOM4 2-3r", "", "3x8-10", "2", "3x10-15", "2"], // W2
        ["1x5 + 3x8", "2", "4x7", "3", "3x2", "2", "EMOM5 2-3r", "", "3x8-10", "2", "3x10-15", "2"], // W3
        ["1x5 + 3x8", "1-0", "4x7", "3", "3x2", "1", "EMOM6 2-3r", "", "3x8-10", "2", "3x10-15", "2"]  // W4
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
    initModal(); // Initialize Legal Modal
    updateCalculatorUI();
    renderRoutineTable();
    updateWorkoutDisplay();
});

// Modal Logic
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

// PWA Logic
let deferredPrompt;

function initPWA() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW Registered'))
            .catch(err => console.log('SW Error', err));
    }

    // Handle Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        pwaInstallBtn.style.display = 'flex';
    });

    // iOS Detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
        // We can't show a button, but we can remind them via a tip
        console.log("iOS detected: Use Share -> Add to Home Screen");
    }

    pwaInstallBtn.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    pwaInstallBtn.style.display = 'none';
                }
                deferredPrompt = null;
            });
        }
    });
}

// Theme Logic
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeUI(next);
});

function updateThemeUI(theme) {
    if (theme === 'light') {
        themeToggle.textContent = '☀️';
        workoutEmoji.textContent = '💪🏾';
    } else {
        themeToggle.textContent = '🌙';
        workoutEmoji.textContent = '💪🏻';
    }
}

// Tab Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        const targetId = item.getAttribute('data-target');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.id === targetId) tab.classList.add('active');
        });
    });
});

// Sub Tab Navigation
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
        updateWorkoutDisplay(); // Recalculate workout if 1RM changes
    });
});

// Calculator Inputs
btnCalculate.addEventListener('click', calculateSingle);
calcBwInput.addEventListener('input', () => {
    localStorage.setItem('bodyweight', calcBwInput.value);
    updateWorkoutDisplay();
});

// Estimate Logic
btnEstimate.addEventListener('click', () => {
    const w = parseFloat(estWeightInput.value) || 0;
    const r = parseInt(estRepsInput.value) || 0;
    const bw = parseFloat(calcBwInput.value) || 0;

    if (r === 0) {
        showToast('Please enter reps');
        return;
    }

    // 1RM estimate using Brzycki Formula on TOTAL weight
    const totalWeight = bw + w;
    const estimatedTotal = totalWeight * (36 / (37 - r));
    const estimatedAdded = estimatedTotal - bw;

    estValSpan.textContent = estimatedAdded.toFixed(1);
    estResultDiv.style.display = 'block';
});

// Routine Selectors
routineBlockSelect.addEventListener('change', () => {
    renderRoutineTable();
    updateWorkoutDisplay();
});
routineWeekSelect.addEventListener('change', () => {
    renderRoutineTable();
    updateWorkoutDisplay();
});

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

function calculateSingle() {
    const addedRM = parseFloat(rmInputs[currentExercise].value) || 0;
    const bodyweight = parseFloat(calcBwInput.value) || 0;
    const reps = parseInt(calcRepsInput.value) || 0;
    const rir = calcRirSelect.value;

    if (reps === 0) {
        showToast('Please enter reps');
        return;
    }

    const rpeKey = rirToRpeKey[rir];
    const intensities = rpeToPercent[rpeKey];
    if (!intensities || reps > 10) {
        showToast('Reps too high for estimate');
        return;
    }

    const percentage = intensities[reps - 1];

    // Total 1RM = Bodyweight + AddedRM
    const oneRMTotal = bodyweight + addedRM;
    const targetTotal = oneRMTotal * (percentage / 100);
    const targetAdded = targetTotal - bodyweight;

    resultWeight.textContent = targetAdded.toFixed(2);
    resultBreakdown.innerHTML = `Total Load: ${targetTotal.toFixed(2)}kg`;
}

function renderRoutineTable() {
    const block = parseInt(routineBlockSelect.value) - 1;
    const data = routineData[block];
    const currentWeekIdx = parseInt(routineWeekSelect.value) - 1;

    routineTableBody.innerHTML = '';

    data.forEach((weekData, weekIndex) => {
        const tr = document.createElement('tr');
        if (weekIndex === currentWeekIdx) tr.classList.add('active-week');

        // Week Label
        const tdWeek = document.createElement('td');
        const weekDiv = document.createElement('div');
        weekDiv.textContent = `Week ${weekIndex + 1}`;

        const rirDiv = document.createElement('div');
        rirDiv.textContent = 'RIR';
        rirDiv.style.fontSize = '0.7rem';
        rirDiv.style.marginTop = '4px';
        rirDiv.style.fontWeight = 'bold';
        // Use color of first RIR cell in row (primary main lift)
        rirDiv.style.color = 'var(--accent-color)';

        tdWeek.appendChild(weekDiv);
        tdWeek.appendChild(rirDiv);
        tr.appendChild(tdWeek);

        // Columns: Main, Sec Main, MU, Sec MU, A1, A2
        // Data index mapping: 
        // Main: 0(sets) 1(rir)
        // Sec: 2(sets) 3(rir)
        // MU: 4(sets) 5(rir)
        // SecMU: 6(sets) 7(rir)
        // A1: 8(sets) 9(rir)
        // A2: 10(sets) 11(rir)

        const pairs = [
            [0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11]
        ];

        pairs.forEach(pair => {
            const indexSets = pair[0];
            const indexRir = pair[1];

            const cellSets = weekData[indexSets];
            const cellRir = weekData[indexRir];

            const td = document.createElement('td');

            // Create Editable Fields
            const inputSets = document.createElement('div');
            inputSets.contentEditable = true;
            inputSets.textContent = cellSets;
            inputSets.style.fontWeight = "bold";
            inputSets.onblur = function () {
                routineData[block][weekIndex][indexSets] = inputSets.textContent;
                saveRoutine();
            };

            const inputRir = document.createElement('div');
            inputRir.contentEditable = true;
            inputRir.textContent = cellRir;
            inputRir.style.fontSize = "0.75rem";
            inputRir.style.color = "var(--accent-color)";
            inputRir.onblur = function () {
                routineData[block][weekIndex][indexRir] = inputRir.textContent;
                saveRoutine();
            };

            td.appendChild(inputSets);
            td.appendChild(inputRir);
            tr.appendChild(td);
        });

        routineTableBody.appendChild(tr);
    });
}

function saveRoutine() {
    localStorage.setItem('routineData', JSON.stringify(routineData));
    updateWorkoutDisplay();
}

// Helper to calculate weight
// Returns an array of objects for multi-part sets: [{protocol: "1x2", weight: "18.3"}, {protocol: "2x5", weight: "11.1"}]
function getWeightDetails(exName, setString, rirString, isSecondary = false) {
    const bodyweightInput = document.getElementById('calc-bw');
    const bw = parseFloat(bodyweightInput.value) || 0;
    const addedRM = parseFloat(rmInputs[exName].value) || 0;
    const oneRMTotal = bw + addedRM;

    if (oneRMTotal === 0) return [{ protocol: setString, weight: "1RM?", rir: rirString }];

    // Split "1x2 + 2x5" into parts
    const parts = setString.split('+').map(p => p.trim());
    const results = [];

    parts.forEach(part => {
        // More robust rep parsing
        // Case: "1x5" -> 5
        // Case: "5" -> 5
        // Case: "2x10-15" -> 15 (assume higher for percentage)
        // Case: "EMOM3 2r" -> 2

        let reps = 0;
        const repsMatch = part.match(/(\d+)$/) || part.match(/x(\d+)/);
        if (repsMatch) {
            reps = parseInt(repsMatch[1]);
        } else {
            const rangeMatch = part.match(/-(\d+)/);
            if (rangeMatch) reps = parseInt(rangeMatch[1]);
        }

        if (reps === 0 || isNaN(reps)) {
            // Check for Cluster
            if (part.toLowerCase().includes('cluster')) {
                const clusterMatch = part.match(/(\d+)\+(\d+)/);
                if (clusterMatch) reps = parseInt(clusterMatch[1]) + parseInt(clusterMatch[2]);
            }
        }

        if (reps === 0 || isNaN(reps)) {
            results.push({ protocol: part, weight: "Manual", rir: rirString });
            return;
        }

        // Parse RIR "3-4" -> use average or lower end
        const rirMatch = rirString.match(/(\d+(\.\d+)?)/);
        const rirVal = rirMatch ? parseFloat(rirMatch[0]) : 3;

        // Map RIR to RPE
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
            let totalLoad = oneRMTotal * (intensity / 100);
            if (isSecondary) totalLoad *= 0.90;

            const addedLoad = totalLoad - bw;
            // No rounding as requested: "Keep them exactly as in the Calculator tab"
            // Actually, keep 1 or 2 decimals for readability but don't "round up" to nearest 2.5
            weightText = addedLoad.toFixed(2);
        }

        results.push({ protocol: part, weight: weightText, rir: rirString });
    });

    return results;
}

function updateWorkoutDisplay() {
    console.log("Updating Workout Display...");
    const block = parseInt(routineBlockSelect.value);
    const week = parseInt(routineWeekSelect.value);

    workoutSubtitle.textContent = `Target for Block ${block}, Week ${week}`;
    workoutDisplay.innerHTML = '';

    const weekData = routineData[block - 1][week - 1];

    // --- PRIMARY LIFTS SECTION ---
    const primaryTitle = document.createElement('div');
    primaryTitle.className = 'workout-section-title';
    primaryTitle.textContent = "Primary Lifts";
    workoutDisplay.appendChild(primaryTitle);

    // Primary Muscle Up
    createExerciseCard("Muscle-Up", "muscleup", weekData[4], weekData[5], false);
    // Primary Main Lifts
    createExerciseCard("Dip", "dip", weekData[0], weekData[1], false);
    createExerciseCard("Squat", "squat", weekData[0], weekData[1], false);
    createExerciseCard("Pull-Up", "pullup", weekData[0], weekData[1], false);

    // --- SECONDARY LIFTS SECTION ---
    const secondaryTitle = document.createElement('div');
    secondaryTitle.className = 'workout-section-title';
    secondaryTitle.textContent = "Secondary Lifts";
    workoutDisplay.appendChild(secondaryTitle);

    const secondaryNote = document.createElement('p');
    secondaryNote.className = 'section-desc';
    secondaryNote.style.textAlign = 'left';
    secondaryNote.style.marginBottom = '1.5rem';
    secondaryNote.innerHTML = "* Secondary lifts are calculated with a <strong>10% decrease</strong> in intensity to focus on technique and recovery.";
    workoutDisplay.appendChild(secondaryNote);

    // Secondary Muscle Up (EMOM or Cluster)
    createExerciseCard("EMOM Muscle-Ups", "muscleup", weekData[6], weekData[7], true);
    // Secondary Main Lifts (Paused Variations)
    createExerciseCard("Paused Dips", "dip", weekData[2], weekData[3], true);
    createExerciseCard("Paused Squats", "squat", weekData[2], weekData[3], true);
    createExerciseCard("Paused Pull-Ups", "pullup", weekData[2], weekData[3], true);
}

function createExerciseCard(title, exKey, sets, rir, isSec) {
    if (!sets || sets === "-" || sets === "" || sets === " ") return;

    const el = document.createElement('div');
    el.className = 'workout-exercise';

    // RIR processing for intensity label
    let rirText = rir || "0";
    let intensityLabel = "Heavy";
    const rirMatch = rirText.match(/(\d+)/);
    const rirVal = rirMatch ? parseInt(rirMatch[0]) : 3;

    if (rirVal <= 1) intensityLabel = "Very Heavy";
    else if (rirVal <= 2) intensityLabel = "Heavy";
    else if (rirVal <= 3) intensityLabel = "Moderate";
    else intensityLabel = "Light";

    const details = getWeightDetails(exKey, sets, rirText, isSec);

    let detailsHtml = "";
    details.forEach(d => {
        let weightDisplay = d.weight;
        if (!isNaN(parseFloat(weightDisplay))) {
            const w = parseFloat(weightDisplay);
            // If exactly 0, just "0"
            if (Math.abs(w) < 0.01) weightDisplay = "BW (0)";
            else weightDisplay = w.toFixed(2); // Match calculator formatting
        }

        detailsHtml += `
            <div class="exercise-details">
                <div class="detail-item">
                    <span class="detail-label">Protocol</span>
                    <span class="detail-value" style="font-size:1rem">${d.protocol}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Target RIR</span>
                    <span class="detail-value" style="font-size:1rem">${rirText}</span>
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
            <span class="exercise-tag">${intensityLabel}</span>
        </div>
        ${detailsHtml}
    `;
    workoutDisplay.appendChild(el);
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
