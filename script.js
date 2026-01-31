// RPE Table Data (Mike Tuchscherer)
// Rows: RPE (10, 9.5, 9, 8.5, 8, 7.5, 7)
// Cols: Reps (1 to 10)
const rpePercentages = {
    "10": [100, 95.5, 92.2, 89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9],
    "9.5": [97.8, 93.9, 90.7, 87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3],
    "9": [95.5, 92.2, 89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7],
    "8.5": [93.9, 90.7, 87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3, 69.4],
    "8": [92.2, 89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7, 68.0],
    "7.5": [90.7, 87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3, 69.4, 66.7],
    "7": [89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7, 68.0, 65.3]
};

// DOM Elements
const modeToggle = document.getElementById('mode-toggle');
const bwGroup = document.getElementById('bw-group');
const weightLabel = document.getElementById('weight-label');
const bwInput = document.getElementById('bodyweight');
const addedInput = document.getElementById('added-weight');
const repsInput = document.getElementById('reps');
const rpeSelect = document.getElementById('rpe');
const calcBtn = document.getElementById('calculate-btn');
const saveBtn = document.getElementById('save-btn');
const total1RMDisplay = document.getElementById('total-1rm');
const added1RMDisplay = document.getElementById('added-1rm');
const addedResultItem = document.getElementById('added-result-item');
const tableHead = document.getElementById('table-head-row');
const tableBody = document.getElementById('table-body');

// Load Data from LocalStorage
window.addEventListener('DOMContentLoaded', () => {
    const savedBW = localStorage.getItem('bodyweight');
    const savedMode = localStorage.getItem('isWeighted');
    const savedAdded = localStorage.getItem('lastAdded');
    const savedReps = localStorage.getItem('lastReps');
    const savedRPE = localStorage.getItem('lastRPE');

    if (savedBW) bwInput.value = savedBW;
    if (savedAdded) addedInput.value = savedAdded;
    if (savedReps) repsInput.value = savedReps;
    if (savedRPE) rpeSelect.value = savedRPE || '10';

    if (savedMode !== null) {
        modeToggle.checked = savedMode === 'true';
    }

    updateModeUI(); // This sets labels and visibility
    initTable();

    // Auto-calculate if we have enough data
    if (addedInput.value && repsInput.value) {
        calculate();
    }
});

// Update UI based on mode (Weighted vs Barbell)
function updateModeUI() {
    const isWeighted = modeToggle.checked;
    if (isWeighted) {
        bwGroup.style.display = 'flex';
        weightLabel.textContent = 'Added Weight (kg)';
        addedResultItem.style.display = 'flex';
    } else {
        bwGroup.style.display = 'none';
        weightLabel.textContent = 'Lift Weight (kg)';
        addedResultItem.style.display = 'none';
    }
    localStorage.setItem('isWeighted', isWeighted);
}

modeToggle.addEventListener('change', updateModeUI);

// Initialization of Table Header
function initTable() {
    // Add rep numbers 1-10 to head
    for (let i = 1; i <= 10; i++) {
        const th = document.createElement('th');
        th.textContent = i === 1 ? '1 Rep' : `${i} Reps`;
        tableHead.appendChild(th);
    }
    renderEmptyTable();
}

function renderEmptyTable() {
    tableBody.innerHTML = '';
    Object.keys(rpePercentages).sort((a, b) => b - a).forEach(rpe => {
        const tr = document.createElement('tr');
        const tdRpe = document.createElement('td');
        tdRpe.textContent = `RPE ${rpe}`;
        tr.appendChild(tdRpe);

        for (let i = 0; i < 10; i++) {
            const td = document.createElement('td');
            td.textContent = '-';
            tr.appendChild(td);
        }
        tableBody.appendChild(tr);
    });
}

// Save Current Data
saveBtn.addEventListener('click', () => {
    const bw = bwInput.value;
    const added = addedInput.value;
    const reps = repsInput.value;
    const rpe = rpeSelect.value;

    localStorage.setItem('bodyweight', bw);
    localStorage.setItem('lastAdded', added);
    localStorage.setItem('lastReps', reps);
    localStorage.setItem('lastRPE', rpe);
    localStorage.setItem('isWeighted', modeToggle.checked);

    showToast('All data saved to device!');
});

// Calculation Core
function calculate() {
    const bw = parseFloat(bwInput.value) || 0;
    const added = parseFloat(addedInput.value);
    const reps = parseInt(repsInput.value);
    const rpe = rpeSelect.value;

    if (isNaN(added) || isNaN(reps) || reps < 1 || reps > 10) {
        showToast('Please enter valid weight and reps (1-10)');
        return;
    }

    const isWeighted = modeToggle.checked;
    const totalCurrent = isWeighted ? (added + bw) : added;

    // Get percentage for given reps/rpe
    const intensity = rpePercentages[rpe][reps - 1]; // reps is 1-indexed, array is 0-indexed

    // Calculate 1RM (100%)
    const estimatedTotal1RM = totalCurrent / (intensity / 100);

    // Display results
    total1RMDisplay.textContent = estimatedTotal1RM.toFixed(1);

    if (isWeighted) {
        const estimatedAdded1RM = estimatedTotal1RM - bw;
        added1RMDisplay.textContent = estimatedAdded1RM.toFixed(1);
    }

    updateRPETable(estimatedTotal1RM, bw);
    showToast('Calculated! RPE table updated.');
}

// Clear Data
function clearData() {
    localStorage.clear();
    bwInput.value = '';
    addedInput.value = '';
    repsInput.value = '';
    rpeSelect.value = '10';
    updateModeUI();
    renderEmptyTable();
    total1RMDisplay.textContent = '--';
    added1RMDisplay.textContent = '--';
    showToast('All performance data cleared.');
}

calcBtn.addEventListener('click', calculate);

// Update RPE Table with calculated values
function updateRPETable(totalMax, bw) {
    const isWeighted = modeToggle.checked;
    tableBody.innerHTML = '';

    Object.keys(rpePercentages).sort((a, b) => b - a).forEach(rpe => {
        const tr = document.createElement('tr');
        const tdRpe = document.createElement('td');
        tdRpe.textContent = `RPE ${rpe}`;
        tr.appendChild(tdRpe);

        rpePercentages[rpe].forEach(intensity => {
            const td = document.createElement('td');
            const weightValueTotal = totalMax * (intensity / 100);

            if (isWeighted) {
                const weightValueAdded = weightValueTotal - bw;
                // Show added weight, but color it if it's below 0 (though unlikely for 1RM calculation)
                td.textContent = weightValueAdded.toFixed(1);
            } else {
                td.textContent = weightValueTotal.toFixed(1);
            }

            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

// Simple Toast feedback
function showToast(msg) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = 'var(--accent-color)';
    toast.style.color = 'black';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    toast.style.fontWeight = 'bold';
    toast.style.zIndex = '1000';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
