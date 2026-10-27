/* 
 * CodeTrace Neo-Brutalist Layout & Component Stylesheet
 * Module: Kunal Prajapati (Frontend Engineering & Environment)
 * SVIT Vasad - Diploma Computer Engineering Semester 5
 */

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body {
  background-color: #f7f5ed;
  background-image: 
    radial-gradient(#00000018 1.5px, transparent 1.5px),
    radial-gradient(#0000000d 1.5px, #f7f5ed 1.5px);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
  font-family: 'Space Grotesk', sans-serif;
}

/* Border Width Presets */
.border-3 { border-width: 3px; }
.border-4 { border-width: 4px; }

/* Brutalist Button Click Depression Effect */
.btn-brutal {
  transition: transform 0.06s ease, box-shadow 0.06s ease;
}
.btn-brutal:hover {
  transform: translate(-1px, -1px);
}
.btn-brutal:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #000 !important;
}

/* Hide Scrollbars while keeping scrollability */
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Code Editor Line Numbers Gutter */
.code-gutter {
  user-select: none;
  scrollbar-width: none;
}
.code-gutter::-webkit-scrollbar { display: none; }

/* Custom Sharp Scrollbars for Consoles */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #1e293b;
}
::-webkit-scrollbar-thumb {
  background: #475569;
  border: 1px solid #000;
}