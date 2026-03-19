// --- Data Management ---
let db = JSON.parse(localStorage.getItem('data')) || {};
let activeClass = null;

const colors = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c", "#e67e22", "#34495e"];

function saveData() {
    localStorage.setItem('data', JSON.stringify(db));
    render();
}

// --- Helpers ---
const toSnake = (str) => str.trim().toLowerCase().replace(/\s+/g, '_');
const toDisplay = (str) => str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

// --- Navigation ---
function showGroups() {
    activeClass = null;
    document.getElementById('view-groups').classList.remove('hidden');
    document.getElementById('view-students').classList.add('hidden');
    document.getElementById('current-view-name').innerText = "Groups";
    render();
}

function openClass(className) {
    activeClass = className;
    document.getElementById('view-groups').classList.add('hidden');
    document.getElementById('view-students').classList.remove('hidden');
    document.getElementById('active-class-title').innerText = className;
    document.getElementById('current-view-name').innerText = className;
    render();
}

// --- CRUD Actions ---
function addClass() {
    const input = document.getElementById('new-group-name');
    const name = input.value.trim();
    if (name && !db[name]) {
        db[name] = {};
        input.value = '';
        saveData();
    }
}

function deleteClass(className) {
    if (confirm(`Delete class "${className}" and all student data?`)) {
        delete db[className];
        saveData();
    }
}

function addStudent() {
    const input = document.getElementById('new-student-name');
    const name = input.value.trim();
    if (!name) return;
    const key = toSnake(name);
    if (!db[activeClass][key]) {
        db[activeClass][key] = 0;
        input.value = '';
        saveData();
    }
}

function deleteStudent(key) {
    delete db[activeClass][key];
    saveData();
}

function updatePoints(key, val) {
    let current = db[activeClass][key];
    db[activeClass][key] = Math.max(0, current + val);
    saveData();
}

// --- Rendering ---
function render() {
    if (!activeClass) {
        const list = document.getElementById('groups-list');
        list.innerHTML = '';
        Object.keys(db).forEach(name => {
            const row = `<tr>
                <td style="cursor:pointer; font-weight:bold; color:var(--accent)" onclick="openClass('${name}')">${name}</td>
                <td><button class="btn btn-del" onclick="deleteClass('${name}')">Delete</button></td>
            </tr>`;
            list.insertAdjacentHTML('beforeend', row);
        });
    } else {
        const list = document.getElementById('students-list');
        list.innerHTML = '';
        const students = db[activeClass];
        
        Object.keys(students).forEach(key => {
            const row = `<tr>
                <td>${toDisplay(key)}</td>
                <td><strong>${students[key]}</strong></td>
                <td>
                    <div class="point-controls">
                        <button class="point-btn" onclick="updatePoints('${key}', -1)">-</button>
                        <button class="point-btn" onclick="updatePoints('${key}', 1)">+</button>
                    </div>
                </td>
                <td><button class="btn btn-del" onclick="deleteStudent('${key}')">Remove</button></td>
            </tr>`;
            list.insertAdjacentHTML('beforeend', row);
        });
        drawChart(students);
    }
}

// --- Pizza Chart Logic (SVG) ---
function drawChart(students) {
    const svg = document.getElementById('pizza-chart');
    const legend = document.getElementById('chart-legend');
    svg.innerHTML = '';
    legend.innerHTML = '';

    const keys = Object.keys(students);
    const totalPoints = Object.values(students).reduce((a, b) => a + b, 0);

    if (totalPoints === 0) {
        document.getElementById('chart-section').classList.add('hidden');
        return;
    }
    document.getElementById('chart-section').classList.remove('hidden');

    let accumulatedPercent = 0;

    keys.forEach((key, i) => {
        const points = students[key];
        if (points === 0) return;

        const percent = (points / totalPoints) * 100;
        const color = colors[i % colors.length];

        // Create SVG Circle Slice
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("r", "16");
        circle.setAttribute("cx", "16");
        circle.setAttribute("cy", "16");
        circle.setAttribute("fill", "transparent");
        circle.setAttribute("stroke", color);
        circle.setAttribute("stroke-width", "32");
        circle.setAttribute("stroke-dasharray", `${percent} 100`);
        circle.setAttribute("stroke-dashoffset", `-${accumulatedPercent}`);
        svg.appendChild(circle);

        // Add Legend
        const label = document.createElement('div');
        label.className = 'legend-item';
        label.innerHTML = `<span class="dot" style="background:${color}"></span> 
                            ${toDisplay(key)}: ${points}pts (${percent.toFixed(1)}%)`;
        legend.appendChild(label);

        accumulatedPercent += percent;
    });
}

init();
function init() { render(); }
