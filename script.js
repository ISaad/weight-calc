
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
const calcWeightedToggle = document.getElementById('calc-weighted');
const weightedContainer = document.getElementById('weighted-toggle-container');
const calcBwGroup = document.getElementById('calc-bw-group');
const calcBwInput = document.getElementById('calc-bw');
const calcRepsInput = document.getElementById('calc-reps');
const calcRirSelect = document.getElementById('calc-rir');
const btnCalculate = document.getElementById('btn-calculate');
const resultWeight = document.getElementById('result-weight');
const resultBreakdown = document.getElementById('result-breakdown');

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
    updateCalculatorUI();
    renderRoutineTable();
    updateWorkoutDisplay();
});

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
calcWeightedToggle.addEventListener('change', () => {
    if (currentExercise !== 'squat') {
        calcBwGroup.style.display = calcWeightedToggle.checked ? 'block' : 'none';
        localStorage.setItem(`weighted_${currentExercise}`, calcWeightedToggle.checked);
    }
});
calcBwInput.addEventListener('input', () => localStorage.setItem('bodyweight', calcBwInput.value));

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
    // Title
    const names = {
        muscleup: 'Muscle-Up',
        dip: 'Dip',
        squat: 'Squat',
        pullup: 'Pull-Up'
    };
    calcTitle.textContent = `${names[currentExercise]} Calculator`;

    // Squat logic
    if (currentExercise === 'squat') {
        calcWeightedToggle.checked = false;
        weightedContainer.style.display = 'none';
        calcBwGroup.style.display = 'none';
    } else {
        weightedContainer.style.display = 'flex';
        // Check saved preference or default to true
        calcWeightedToggle.checked = true; // Default
        calcBwGroup.style.display = 'block';
    }
}

function calculateSingle() {
    // Get Stats
    const oneRM = parseFloat(rmInputs[currentExercise].value) || 0;
    const bodyweight = parseFloat(calcBwInput.value) || 0;
    const reps = parseInt(calcRepsInput.value) || 0;
    const rir = calcRirSelect.value; // string key

    if (oneRM === 0 || reps === 0) {
        showToast('Please set your 1RM and Reps');
        return;
    }

    // Determine Intensity
    // Handle RIR ranges or decimals mapping
    // We map strict values from select to keys.
    const rpeKey = rirToRpeKey[rir];
    if (!rpeKey) return;

    // Get intensity array
    const intensities = rpeToPercent[rpeKey];
    if (!intensities || reps > 10) {
        showToast('Reps too high for this RIR estimate');
        return;
    }

    const percentage = intensities[reps - 1]; // 0-indexed

    // Calculate Total Weight needed
    // 1RM = TotalWeight / (Percentage/100)
    // So TotalWeight = 1RM * (Percentage/100)
    const totalWeight = oneRM * (percentage / 100);

    // Display
    const isWeighted = (currentExercise !== 'squat' && calcWeightedToggle.checked);

    if (isWeighted) {
        const addedWeight = totalWeight - bodyweight;
        resultWeight.textContent = addedWeight.toFixed(1);
        resultBreakdown.innerHTML = `Total: ${totalWeight.toFixed(1)}kg <br> Added Weight`;

        if (addedWeight < 0) {
            resultBreakdown.innerHTML += ` <br>(Assisted: ${(addedWeight * -1).toFixed(1)}kg)`;
        }
    } else {
        resultWeight.textContent = totalWeight.toFixed(1);
        resultBreakdown.textContent = `Total Load`;
    }
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
        tdWeek.textContent = `Week ${weekIndex + 1}`;
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
// Returns string "Total: X kg / Added: Y kg"
function getWeightRecommendation(exName, setString, rirString, isSecondary = false) {
    const oneRM = parseFloat(rmInputs[exName].value) || 0;
    const bodyweightInput = document.getElementById('calc-bw');
    const bw = parseFloat(bodyweightInput.value) || 0;

    if (oneRM === 0) return "Set 1RM first";

    // Parse Reps from "1x5" or "10"
    const match = setString.match(/(\d+)x(\d+)/);
    if (!match) return "Manual Calc";

    const reps = parseInt(match[2]);

    // Parse RIR "3-4"
    const rirMatch = rirString.match(/(\d+(\.\d+)?)/);
    const rirVal = rirMatch ? parseFloat(rirMatch[0]) : 3;

    // Map RIR to RPE
    let rpeEst = 10 - rirVal;
    rpeEst = Math.round(rpeEst * 2) / 2;
    if (rpeEst < 6) rpeEst = 6;
    if (rpeEst > 10) rpeEst = 10;

    const rpeKey = rpeEst.toString();
    const arr = rpeToPercent[rpeKey] || rpeToPercent["7"];

    if (reps > 10) return "Hypertrophy (Light)";

    let intensity = arr[reps - 1];
    let totalLoad = oneRM * (intensity / 100);

    if (isSecondary) {
        totalLoad = totalLoad * 0.90;
    }

    const addedLoad = totalLoad - bw;

    if (exName === 'squat') {
        return `${totalLoad.toFixed(1)} kg`;
    } else {
        return `+${addedLoad.toFixed(1)} kg <span style="font-size:0.8em; opacity:0.7">(Tot: ${totalLoad.toFixed(1)})</span>`;
    }
}

function updateWorkoutDisplay() {
    console.log("Updating Workout Display...");
    const block = parseInt(routineBlockSelect.value);
    const week = parseInt(routineWeekSelect.value);

    workoutSubtitle.textContent = `Target for Block ${block}, Week ${week}`;
    workoutDisplay.innerHTML = '';

    const weekData = routineData[block - 1][week - 1];

    // Define the exercises for the day
    // Exercise 1: Muscle Up
    createExerciseCard("Muscle-Up", "muscleup", weekData[4], weekData[5], false); // Primary MU
    // Exercise 2: Dip (Main)
    createExerciseCard("Dip", "dip", weekData[0], weekData[1], false);

    // Exercise 3: Squat (Main)
    createExerciseCard("Squat", "squat", weekData[0], weekData[1], false);

    // Exercise 4: Pull-Up (Main)
    createExerciseCard("Pull-Up", "pullup", weekData[0], weekData[1], false);

    // Secondary lifts
    const div = document.createElement('div');
    div.innerHTML = "<h3 style='margin-top:2rem'>Secondary Day Reference</h3>";
    workoutDisplay.appendChild(div);

    createExerciseCard("Dip (Secondary)", "dip", weekData[2], weekData[3], true);
    createExerciseCard("Pull-Up (Secondary)", "pullup", weekData[2], weekData[3], true);
}

function createExerciseCard(title, exKey, sets, rir, isSec) {
    if (!sets || sets === "-" || sets === "") return;

    const el = document.createElement('div');
    el.className = 'workout-exercise';

    const weight = getWeightRecommendation(exKey, sets, rir, isSec);

    el.innerHTML = `
        <div class="exercise-header">
            <span class="exercise-name">${title}</span>
            <span class="exercise-tag">${isSec ? 'Paused / Light' : 'Heavy'}</span>
        </div>
        <div class="exercise-details">
            <div class="detail-item">
                <span class="detail-label">Protocol</span>
                <span class="detail-value" style="font-size:1rem">${sets}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Intensity</span>
                <span class="detail-value" style="font-size:1rem">RIR ${rir}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Target Weight</span>
                <span class="detail-value">${weight}</span>
            </div>
        </div>
    `;
    workoutDisplay.appendChild(el);
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
