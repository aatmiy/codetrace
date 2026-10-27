// @ts-nocheck
/* global Chart */
/**
 * CodeTrace Database & Examiner Analytics Dashboard
 * Module: Mohammad Haadi Kazi (Lab Roster, Chart.js Slopes & Time-Travel)
 * SVIT Vasad • Department of Computer Engineering
 */

let telemetryChart = null;
const telemetryLabels = ['00:00', '00:02', '00:04', '00:06', '00:08'];
const cumulativeCharPoints = [0, 42, 98, 160, 220];
const velocityPoints = [0, 18, 22, 19, 20];
const candidateAuditStore = {};

/**
 * Initialize Chart.js Dual-Axis Telemetry Curve
 */
function initExaminerChart() {
  const canvas = document.getElementById('telemetryChartCanvas');
  if (!canvas || typeof Chart === 'undefined') return;

  const ctx = canvas.getContext('2d');
  if (telemetryChart) telemetryChart.destroy();

  telemetryChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: telemetryLabels,
      datasets: [
        {
          label: 'Cumulative Characters',
          data: cumulativeCharPoints,
          borderColor: '#5b46f6',
          backgroundColor: 'rgba(91, 70, 246, 0.08)',
          borderWidth: 3,
          fill: true,
          tension: 0.2,
          yAxisID: 'y'
        },
        {
          label: 'Insertion Velocity (c/s)',
          data: velocityPoints,
          borderColor: '#ff4d80',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [4, 4],
          tension: 0.1,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { family: 'JetBrains Mono', size: 9 } }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { family: 'JetBrains Mono', size: 9 } }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { font: { family: 'JetBrains Mono', size: 9 } }
        }
      }
    }
  });
}

/**
 * Record Telemetry Data Point from Aatmiy's Engine
 */
function recordTelemetryPoint(chars, velocity) {
  const timeStr = new Date().toLocaleTimeString().split(' ')[0];
  telemetryLabels.push(timeStr);
  cumulativeCharPoints.push(chars);
  velocityPoints.push(velocity);

  if (telemetryLabels.length > 15) {
    telemetryLabels.shift();
    cumulativeCharPoints.shift();
    velocityPoints.shift();
  }

  if (telemetryChart) telemetryChart.update();
}

/**
 * Switch Candidate Terminal in Examiner Lab Roster
 */
function selectCandidateTerminal(candKey) {
  const cards = document.querySelectorAll('[id^="card-cand-"]');
  cards.forEach(c => c.classList.remove('border-lime', 'bg-yellow-50'));

  const activeCard = document.getElementById('card-cand-' + candKey);
  if (activeCard) activeCard.classList.add('border-lime', 'bg-yellow-50');

  const replayBox = document.getElementById('replayCodeBox');
  const vivaText = document.getElementById('vivaQuestionPromptText');

  if (candKey === 'aatmiy') {
    if (vivaText) vivaText.textContent = `"Candidate constructed the second largest array logic between min 02:10 and 04:30. Ask them to explain behavior when array contains identical duplicates."`;
  } else if (candKey === 'kunal') {
    if (vivaText) vivaText.textContent = `"Sudden paste of 310 characters detected at 00:03. Ask candidate to reconstruct the CSS media queries from memory on the whiteboard."`;
  } else if (candKey === 'nishant') {
    if (vivaText) vivaText.textContent = `"Steady OOP class implementation. Ask candidate how encapsulation prevents direct modification of class variables."`;
  } else {
    if (vivaText) vivaText.textContent = `"Review candidate's loop termination conditions during oral questioning."`;
  }

  showToastNotice(`Inspecting Workstation: ${candKey.toUpperCase()}`);
}

/**
 * Time-Travel Replay Scrubber Slider
 */
function handleReplayScrub(pct) {
  const label = document.getElementById('replayStepLabel');
  const replayBox = document.getElementById('replayCodeBox');
  if (label) label.textContent = `Step ${pct}%`;

  const editor = document.getElementById('codeEditor');
  const fullCode = editor ? editor.value : '';
  const sliceIndex = Math.floor((pct / 100) * fullCode.length);

  if (replayBox) {
    replayBox.textContent = fullCode.substring(0, sliceIndex) || '// [Exam Session Started - Editor Blank]';
  }
}

/**
 * Switch between Student Workspace and Examiner Audit Views
 */
function switchView(view) {
  const studentView = document.getElementById('studentViewSection');
  const examinerView = document.getElementById('examinerViewSection');
  const navStudentBtn = document.getElementById('navStudentBtn');
  const navExaminerBtn = document.getElementById('navExaminerBtn');

  if (view === 'examiner') {
    if (!isExaminerAuthenticated) {
      document.getElementById('examinerAuthModal')?.classList.remove('hidden');
      return;
    }
    if (studentView) studentView.classList.add('hidden');
    if (examinerView) examinerView.classList.remove('hidden');

    if (navStudentBtn) navStudentBtn.className = 'bg-white text-black border-2 border-transparent px-3 py-1 font-bold flex items-center gap-1.5 hover:border-black';
    if (navExaminerBtn) navExaminerBtn.className = 'bg-purple-electric text-white border-2 border-black px-3 py-1 font-extrabold flex items-center gap-1.5 btn-brutal';

    setTimeout(initExaminerChart, 50);
  } else {
    if (examinerView) examinerView.classList.add('hidden');
    if (studentView) studentView.classList.remove('hidden');

    if (navStudentBtn) navStudentBtn.className = 'bg-purple-electric text-white border-2 border-black px-3 py-1 font-extrabold flex items-center gap-1.5 btn-brutal';
    if (navExaminerBtn) navExaminerBtn.className = 'bg-white text-black border-2 border-transparent px-3 py-1 font-bold flex items-center gap-1.5 hover:border-black';
  }
}

/**
 * Switch Console Tab between Terminal and Live Web Sandbox
 */
function switchOutputTab(tab) {
  const termView = document.getElementById('outputTerminalView');
  const prevView = document.getElementById('outputWebPreviewView');
  const btnTerm = document.getElementById('tabTerminalBtn');
  const btnPrev = document.getElementById('tabWebPreviewBtn');

  if (tab === 'terminal') {
    termView?.classList.remove('hidden');
    prevView?.classList.add('hidden');
    if (btnTerm) btnTerm.className = 'px-2.5 py-0.5 bg-purple-electric text-white border border-white font-bold btn-brutal';
    if (btnPrev) btnPrev.className = 'px-2.5 py-0.5 bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold btn-brutal';
  } else {
    prevView?.classList.remove('hidden');
    termView?.classList.add('hidden');
    if (btnPrev) btnPrev.className = 'px-2.5 py-0.5 bg-purple-electric text-white border border-white font-bold btn-brutal';
    if (btnTerm) btnTerm.className = 'px-2.5 py-0.5 bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold btn-brutal';
  }
}

/**
 * Helper: Toggle Practical Question Drawer
 */
function toggleQuestionDrawer() {
  document.getElementById('questionDrawer')?.classList.toggle('hidden');
}

/**
 * Helper: Notification Toasts
 */
function showToastNotice(msg) {
  const t = document.getElementById('toastNotice');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2400);
}

/**
 * Helper: Copy to Clipboard
 */
function copyCodeToClipboard() {
  const ed = document.getElementById('codeEditor');
  if (ed) {
    navigator.clipboard?.writeText(ed.value);
    showToastNotice("Code copied to clipboard!");
  }
}

/**
 * Helper: Clear Console Output
 */
function clearConsoleOutput() {
  const term = document.getElementById('outputTerminalView');
  if (term) term.innerHTML = '<span class="text-gray-500">// Console output cleared.</span>\n';
}

// Lifecycle Initialization
window.addEventListener('DOMContentLoaded', () => {
  if (typeof setLanguage === 'function') setLanguage('python');
  initExaminerChart();
  handleReplayScrub(100);
});

// Global Exports
window.recordTelemetryPoint = recordTelemetryPoint;
window.selectCandidateTerminal = selectCandidateTerminal;
window.handleReplayScrub = handleReplayScrub;
window.switchView = switchView;
window.switchOutputTab = switchOutputTab;
window.toggleQuestionDrawer = toggleQuestionDrawer;
window.showToastNotice = showToastNotice;
window.copyCodeToClipboard = copyCodeToClipboard;
window.clearConsoleOutput = clearConsoleOutput;