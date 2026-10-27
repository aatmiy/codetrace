// @ts-nocheck
/**
 * CodeTrace Tracking & Anomaly Detection Engine
 * Module: Aatmiy Chavda (Tracking, Deltas, Velocity & Insertion Heuristics)
 * SVIT Vasad • Department of Computer Engineering
 */

// Tracking State
let keystrokeCount = 0;
let characterCount = 0;
let pasteCount = 0;
let lastInputTimestamp = performance.now();
let typingIntervals = [];
let recentDeltas = [];
let typingSimulationTimer = null;

/**
 * Handle in-editor keystrokes, update line numbers and velocity
 */
function handleEditorInput() {
  const now = performance.now();
  const delta = now - lastInputTimestamp;
  lastInputTimestamp = now;

  keystrokeCount++;
  typingIntervals.push(delta);
  if (typingIntervals.length > 20) typingIntervals.shift();

  updateEditorMetrics();

  // Calculate current typing velocity (characters per second)
  const avgDelta = typingIntervals.reduce((a, b) => a + b, 0) / typingIntervals.length;
  const currentCharsPerSec = avgDelta > 0 ? (1000 / avgDelta).toFixed(1) : 0;
  
  const velBadge = document.getElementById('typingVelocityBadge');
  if (velBadge) velBadge.textContent = `${currentCharsPerSec} chars/sec`;

  // Sample telemetry data point to Haadi's database every 8 keystrokes
  if (keystrokeCount % 8 === 0) {
    if (typeof recordTelemetryPoint === 'function') {
      recordTelemetryPoint(characterCount, parseFloat(currentCharsPerSec));
    }
  }
}

/**
 * Inspect clipboard insertions for sudden bulk text cliffs
 */
function handleEditorPaste(e) {
  pasteCount++;
  let pastedContent = '';

  if (e && e.clipboardData && typeof e.clipboardData.getData === 'function') {
    pastedContent = e.clipboardData.getData('text') || '';
  }

  const pasteLength = pastedContent.length;
  const timeStr = new Date().toLocaleTimeString();

  // Anomaly Heuristic: Insertion of > 60 characters in a single event
  if (pasteLength > 60) {
    const banner = document.getElementById('examinerAnomalyBanner');
    const desc = document.getElementById('examinerAnomalyDesc');
    const rosterPill = document.getElementById('rosterStatusAatmiy');

    if (banner && desc) {
      banner.classList.remove('hidden');
      desc.textContent = `Unusual bulk insertion of ${pasteLength} characters detected at ${timeStr}. Activity flagged for manual faculty review.`;
    }
    if (rosterPill) {
      rosterPill.textContent = 'FLAGGED REVIEW';
      rosterPill.className = 'text-pink-600 font-black';
    }

    if (typeof logAuditEventEntry === 'function') {
      logAuditEventEntry({
        time: timeStr,
        type: 'LARGE_INSERTION_DETECTED',
        chars: pasteLength,
        flagged: true
      });
    }

    // Record vertical velocity cliff in telemetry slope
    if (typeof recordTelemetryPoint === 'function') {
      recordTelemetryPoint(characterCount + pasteLength, 120);
    }
  } else {
    if (typeof logAuditEventEntry === 'function') {
      logAuditEventEntry({
        time: timeStr,
        type: 'NORMAL_PASTE',
        chars: pasteLength,
        flagged: false
      });
    }
  }

  setTimeout(updateEditorMetrics, 40);
}

/**
 * Recalculate line numbers gutter and total character counts
 */
function updateEditorMetrics() {
  const editor = document.getElementById('codeEditor');
  const gutter = document.getElementById('lineNumbers');
  if (!editor || !gutter) return;

  const code = editor.value;
  characterCount = code.length;
  const lines = code.split('\n').length;

  // Build gutter HTML
  let gutterHTML = '';
  const totalLines = Math.max(lines, 1);
  for (let i = 1; i <= totalLines; i++) {
    gutterHTML += `<div>${i}</div>`;
  }
  gutter.innerHTML = gutterHTML;

  // Update UI Counters
  const statLine = document.getElementById('statLineCount');
  const statChar = document.getElementById('statCharCount');
  const keyDisplay = document.getElementById('keystrokeCounter');

  if (statLine) statLine.textContent = `Lines: ${lines}`;
  if (statChar) statChar.textContent = `Chars: ${characterCount}`;
  if (keyDisplay) keyDisplay.textContent = `Keys: ${keystrokeCount}`;
}

/**
 * Presentation Demo 1: Simulate Natural Incremental Human Coding
 */
function simulateGradualTyping() {
  if (typingSimulationTimer) clearInterval(typingSimulationTimer);
  const sampleText = "\n\n# Natural gradual coding step-by-step\ndef compute_factorial(n):\n    if n <= 1:\n        return 1\n    return n * compute_factorial(n - 1)\n";
  let idx = 0;
  const editor = document.getElementById('codeEditor');
  if (!editor) return;

  typingSimulationTimer = setInterval(() => {
    if (idx < sampleText.length) {
      editor.value += sampleText[idx];
      idx++;
      handleEditorInput();
    } else {
      clearInterval(typingSimulationTimer);
      typingSimulationTimer = null;
      showToastNotice("Gradual typing demo complete (Natural Human Slope).");
    }
  }, 45);
}

/**
 * Presentation Demo 2: Simulate Sudden Bulk Insertion Cliff (Cheat Scenario)
 */
function simulateBulkPaste() {
  const editor = document.getElementById('codeEditor');
  if (!editor) return;

  const cheatBlock = "\n\n/* CHEAT DUMP: SUDDEN 240+ CHARS FROM EXTERNAL USB */\nfunction externalMatrixSolver(dataset) {\n    return dataset.map(row => row.filter(val => val > 0).reduce((a, b) => a + Math.pow(b, 2), 0));\n}\nconsole.log(externalMatrixSolver([[1, 2], [3, 4]]));\n";
  editor.value += cheatBlock;

  handleEditorPaste({
    clipboardData: {
      getData: () => cheatBlock
    }
  });

  updateEditorMetrics();
  showToastNotice("Bulk Paste Injected: Flagged for Examiner Review!");
}

// Global Exports
window.handleEditorInput = handleEditorInput;
window.handleEditorPaste = handleEditorPaste;
window.simulateGradualTyping = simulateGradualTyping;
window.simulateBulkPaste = simulateBulkPaste;
window.updateEditorMetrics = updateEditorMetrics;