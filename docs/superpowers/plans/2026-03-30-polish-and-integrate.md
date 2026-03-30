# Diagrammatic — Polish & Integrate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate two reference HTML files into a clean split architecture with token-based CSS, add framework presets, pricing section, and scroll animations at Stripe/Linear visual quality.

**Architecture:** Static site (no build step). `base.css` holds all design tokens. `landing.css` and `app.css` consume tokens only. Logic lives in `app.js`. Scroll animations in `animations.js`. Vercel rewrites `/` → landing, `/app` → app.

**Tech Stack:** Vanilla HTML5, CSS custom properties, plain JavaScript, Vercel static hosting, Formspree for email capture.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `vercel.json` | Rewrite | Route `/` → landing, `/app` → app |
| `src/styles/base.css` | Create | Design tokens: colors, spacing, typography, shadows, radii |
| `src/styles/landing.css` | Create | Landing layout, components, animation classes |
| `src/styles/app.css` | Create | App chrome: header, tabs, sidebar, canvas, toast |
| `src/js/animations.js` | Create | IntersectionObserver reveals, header scroll blur |
| `src/js/app.js` | Create | All state, SVG generators, export, 6 presets |
| `src/landing.html` | Rewrite | Marketing page — links base.css + landing.css + animations.js |
| `src/index.html` | Rewrite | App — links base.css + app.css + app.js |
| `src/styles.css` | Delete | Stub replaced by styles/ directory |

---

## Task 1: Scaffold

**Files:** `vercel.json`, create `src/styles/` and `src/js/` dirs

- [ ] **Step 1: Create directories**

```bash
mkdir -p /Volumes/zodlightning/sites/diagrammatic/src/styles
mkdir -p /Volumes/zodlightning/sites/diagrammatic/src/js
```

- [ ] **Step 2: Write vercel.json**

Write to `/Volumes/zodlightning/sites/diagrammatic/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/", "destination": "/src/landing.html" },
    { "source": "/app", "destination": "/src/index.html" }
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "chore: configure vercel routing for / and /app"
```

---

## Task 2: base.css

**Files:** Create `src/styles/base.css`

- [ ] **Step 1: Write base.css**

Write to `src/styles/base.css`:

```css
/* ============================================
   base.css — Diagrammatic Design Tokens
   All colours, spacing, radii, shadows, and
   typography live here. landing.css and app.css
   consume tokens only — never raw values.
   ============================================ */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  /* ── Palette ── */
  --teal:       #156082;
  --teal-mid:   #1B7A9F;
  --teal-soft:  #5BA3B8;
  --teal-light: #EBF4F7;

  --text:       #1A1A2E;
  --text-muted: #4A5568;
  --bg:         #FAFBFC;
  --white:      #FFFFFF;
  --border:     #E2E8F0;

  --coral: #E07A5F;
  --amber: #D4A03D;
  --sage:  #4A9E6B;

  /* ── Spacing (8px grid) ── */
  --space-1:  8px;
  --space-2:  16px;
  --space-3:  24px;
  --space-4:  32px;
  --space-5:  40px;
  --space-6:  48px;
  --space-8:  64px;
  --space-10: 80px;

  /* ── Radii ── */
  --radius-sm:   6px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-pill: 100px;

  /* ── Shadows ── */
  --shadow-sm:    0 1px 3px rgba(0,0,0,0.08);
  --shadow-md:    0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg:    0 8px 32px rgba(0,0,0,0.10);
  --shadow-hover: 0 12px 40px rgba(0,0,0,0.12);

  /* ── Typography ── */
  --font:      'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 16px;
  --text-lg:   20px;
  --text-xl:   24px;
  --text-hero: clamp(2.5rem, 5vw, 3.5rem);
}

html {
  font-family: var(--font);
  font-size: var(--text-base);
  color: var(--text);
  background: var(--bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

img, svg { display: block; }
a { color: inherit; }
button, input, select, textarea { font-family: var(--font); }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/base.css
git commit -m "feat: add design tokens in base.css"
```

---

## Task 3: app.js

**Files:** Create `src/js/app.js`

This extracts all logic from `diagrammatic-app.html` and adds the preset system. Key changes from reference: `onchange` → `oninput` for real-time updates; `alert()` → `showToast()`; `loadPreset()` is new.

- [ ] **Step 1: Write app.js**

Write to `src/js/app.js`:

```javascript
// ============================================
// CONSTANTS
// ============================================
const colorOptions = [
  { id: 'teal',      hex: '#156082', name: 'Teal' },
  { id: 'midTeal',   hex: '#1B7A9F', name: 'Mid Teal' },
  { id: 'softTeal',  hex: '#5BA3B8', name: 'Soft Teal' },
  { id: 'coral',     hex: '#E07A5F', name: 'Coral' },
  { id: 'amber',     hex: '#D4A03D', name: 'Amber' },
  { id: 'sage',      hex: '#4A9E6B', name: 'Sage' },
  { id: 'slate',     hex: '#4A5568', name: 'Slate' },
  { id: 'lightTeal', hex: '#EBF4F7', name: 'Light' }
];

const layouts = [
  { id: '2box',       name: '2 Box',    boxes: 2 },
  { id: '3box',       name: '3 Box',    boxes: 3 },
  { id: '4box',       name: '2×2',      boxes: 4 },
  { id: '5box',       name: '5 Box',    boxes: 5 },
  { id: '6box',       name: '3×2',      boxes: 6 },
  { id: 'pyramid3',   name: 'Pyramid',  boxes: 3 },
  { id: 'funnel',     name: 'Funnel',   boxes: 3 },
  { id: 'arrow3',     name: 'Arrows',   boxes: 3 },
  { id: 'timeline',   name: 'Timeline', boxes: 4 },
  { id: 'comparison', name: 'Compare',  boxes: 2 },
  { id: 'matrix',     name: 'Matrix',   boxes: 4 }
];

// ============================================
// PRESETS
// ============================================
const PRESETS = {
  bcg: {
    tab: 'frameworks',
    state: {
      layout: '4box', width: 862, height: 485,
      title: 'BCG Matrix', subtitle: '',
      boxes: [
        { title: 'Stars',          subtitle: 'High growth, high share', color: 'teal' },
        { title: 'Question Marks', subtitle: 'High growth, low share',  color: 'amber' },
        { title: 'Cash Cows',      subtitle: 'Low growth, high share',  color: 'softTeal' },
        { title: 'Dogs',           subtitle: 'Low growth, low share',   color: 'slate' }
      ]
    }
  },
  swot: {
    tab: 'frameworks',
    state: {
      layout: '4box', width: 862, height: 485,
      title: 'SWOT Analysis', subtitle: '',
      boxes: [
        { title: 'Strengths',     subtitle: 'Internal positives', color: 'sage' },
        { title: 'Weaknesses',    subtitle: 'Internal negatives', color: 'coral' },
        { title: 'Opportunities', subtitle: 'External positives', color: 'teal' },
        { title: 'Threats',       subtitle: 'External negatives', color: 'amber' }
      ]
    }
  },
  valuechain: {
    tab: 'frameworks',
    state: {
      layout: '5box', width: 1100, height: 400,
      title: 'Value Chain Analysis', subtitle: '',
      boxes: [
        { title: 'Inbound Logistics',  subtitle: '', color: 'teal' },
        { title: 'Operations',         subtitle: '', color: 'midTeal' },
        { title: 'Outbound Logistics', subtitle: '', color: 'softTeal' },
        { title: 'Marketing & Sales',  subtitle: '', color: 'teal' },
        { title: 'Service',            subtitle: '', color: 'midTeal' }
      ]
    }
  },
  threehorizons: {
    tab: 'frameworks',
    state: {
      layout: 'timeline', width: 862, height: 400,
      title: 'Three Horizons', subtitle: '',
      boxes: [
        { title: 'H1: Core Business',  subtitle: 'Defend & extend', color: 'teal' },
        { title: 'H2: Emerging',       subtitle: 'Build & scale',   color: 'midTeal' },
        { title: 'H3: Future Options', subtitle: 'Explore & seed',  color: 'softTeal' }
      ]
    }
  },
  ansoff: {
    tab: 'frameworks',
    state: {
      layout: '4box', width: 862, height: 485,
      title: 'Ansoff Matrix', subtitle: '',
      boxes: [
        { title: 'Market Penetration',  subtitle: 'Existing product, existing market', color: 'teal' },
        { title: 'Product Development', subtitle: 'New product, existing market',      color: 'midTeal' },
        { title: 'Market Development',  subtitle: 'Existing product, new market',      color: 'softTeal' },
        { title: 'Diversification',     subtitle: 'New product, new market',           color: 'amber' }
      ]
    }
  },
  prioritization: {
    tab: 'matrix',
    matrixState: {
      width: 862, height: 647,
      title: 'Prioritization Matrix',
      xLabel: 'Effort', yLabel: 'Impact',
      points: [
        { label: 'Quick Wins',      x: 20, y: 80, size: 40, color: 'sage' },
        { label: 'Major Projects',  x: 80, y: 80, size: 40, color: 'teal' },
        { label: 'Fill-Ins',        x: 20, y: 20, size: 30, color: 'softTeal' },
        { label: 'Thankless Tasks', x: 80, y: 20, size: 30, color: 'coral' }
      ]
    }
  }
};

// ============================================
// STATE
// ============================================
let state = {
  layout: '3box', width: 862, height: 485,
  title: '', subtitle: '',
  boxes: [
    { title: 'Step 1', subtitle: '', color: 'teal' },
    { title: 'Step 2', subtitle: '', color: 'midTeal' },
    { title: 'Step 3', subtitle: '', color: 'softTeal' }
  ]
};

let tableState = {
  width: 862, height: 485, title: '', rows: 4, cols: 4, data: []
};

let matrixState = {
  width: 862, height: 647, title: '',
  xLabel: 'Impact', yLabel: 'Effort',
  points: [
    { label: 'Initiative A', x: 80, y: 20, size: 40, color: 'teal' },
    { label: 'Initiative B', x: 30, y: 70, size: 30, color: 'coral' },
    { label: 'Initiative C', x: 60, y: 50, size: 50, color: 'sage' }
  ]
};

let currentTab = 'frameworks';

// ============================================
// PRESET LOADER
// ============================================
function loadPreset(id) {
  if (!id || !PRESETS[id]) return;
  const preset = PRESETS[id];

  if (preset.tab === 'matrix') {
    Object.assign(matrixState, preset.matrixState);
    switchTab('matrix');
    document.getElementById('matrix-canvas-width').value  = matrixState.width;
    document.getElementById('matrix-canvas-height').value = matrixState.height;
    document.getElementById('matrix-title').value         = matrixState.title;
    document.getElementById('matrix-x-label').value       = matrixState.xLabel;
    document.getElementById('matrix-y-label').value       = matrixState.yLabel;
    renderMatrixPoints();
    updateMatrixPreview();
  } else {
    Object.assign(state, preset.state);
    switchTab('frameworks');
    document.getElementById('canvas-width').value  = state.width;
    document.getElementById('canvas-height').value = state.height;
    document.getElementById('title').value         = state.title;
    document.getElementById('subtitle').value      = state.subtitle;
    renderLayoutGrid();
    renderBoxList();
    updatePreview();
  }
}

// ============================================
// INIT
// ============================================
function init() {
  renderLayoutGrid();
  renderBoxList();
  initTableData();
  renderTableEditor();
  renderMatrixPoints();
  bindEvents();
  updatePreview();
}

function bindEvents() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  document.getElementById('preset-select').addEventListener('change', e => {
    loadPreset(e.target.value);
  });

  document.getElementById('canvas-width').addEventListener('input', e => {
    state.width = parseInt(e.target.value) || 862; updatePreview();
  });
  document.getElementById('canvas-height').addEventListener('input', e => {
    state.height = parseInt(e.target.value) || 485; updatePreview();
  });
  document.getElementById('title').addEventListener('input', e => {
    state.title = e.target.value; updatePreview();
  });
  document.getElementById('subtitle').addEventListener('input', e => {
    state.subtitle = e.target.value; updatePreview();
  });
  document.getElementById('show-byline').addEventListener('change', updatePreview);

  document.getElementById('table-canvas-width').addEventListener('input', e => {
    tableState.width = parseInt(e.target.value) || 862; updateTablePreview();
  });
  document.getElementById('table-canvas-height').addEventListener('input', e => {
    tableState.height = parseInt(e.target.value) || 485; updateTablePreview();
  });
  document.getElementById('table-title').addEventListener('input', e => {
    tableState.title = e.target.value; updateTablePreview();
  });
  document.getElementById('table-rows').addEventListener('change', e => {
    tableState.rows = parseInt(e.target.value) || 4;
    initTableData(); renderTableEditor(); updateTablePreview();
  });
  document.getElementById('table-cols').addEventListener('change', e => {
    tableState.cols = parseInt(e.target.value) || 4;
    initTableData(); renderTableEditor(); updateTablePreview();
  });
  document.getElementById('table-show-byline').addEventListener('change', updateTablePreview);

  document.getElementById('matrix-canvas-width').addEventListener('input', e => {
    matrixState.width = parseInt(e.target.value) || 862; updateMatrixPreview();
  });
  document.getElementById('matrix-canvas-height').addEventListener('input', e => {
    matrixState.height = parseInt(e.target.value) || 647; updateMatrixPreview();
  });
  document.getElementById('matrix-title').addEventListener('input', e => {
    matrixState.title = e.target.value; updateMatrixPreview();
  });
  document.getElementById('matrix-x-label').addEventListener('input', e => {
    matrixState.xLabel = e.target.value; updateMatrixPreview();
  });
  document.getElementById('matrix-y-label').addEventListener('input', e => {
    matrixState.yLabel = e.target.value; updateMatrixPreview();
  });
  document.getElementById('matrix-show-byline').addEventListener('change', updateMatrixPreview);
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`.tab[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`${tab}-panel`).classList.add('active');
  if (tab === 'frameworks') updatePreview();
  else if (tab === 'tables') updateTablePreview();
  else if (tab === 'matrix') updateMatrixPreview();
}

// ============================================
// FRAMEWORKS TAB
// ============================================
function renderLayoutGrid() {
  const grid = document.getElementById('layout-grid');
  grid.innerHTML = layouts.map(layout => `
    <button class="layout-btn ${state.layout === layout.id ? 'active' : ''}"
            onclick="selectLayout('${layout.id}')">
      ${getLayoutIcon(layout.id)}
      <span>${layout.name}</span>
    </button>
  `).join('');
}

function getLayoutIcon(id) {
  const icons = {
    '2box':       '<svg viewBox="0 0 40 24"><rect x="2" y="4" width="17" height="16" fill="#156082" rx="2"/><rect x="21" y="4" width="17" height="16" fill="#1B7A9F" rx="2"/></svg>',
    '3box':       '<svg viewBox="0 0 40 24"><rect x="1" y="4" width="11" height="16" fill="#156082" rx="2"/><rect x="14" y="4" width="11" height="16" fill="#1B7A9F" rx="2"/><rect x="27" y="4" width="11" height="16" fill="#5BA3B8" rx="2"/></svg>',
    '4box':       '<svg viewBox="0 0 40 24"><rect x="2" y="2" width="17" height="9" fill="#156082" rx="2"/><rect x="21" y="2" width="17" height="9" fill="#1B7A9F" rx="2"/><rect x="2" y="13" width="17" height="9" fill="#5BA3B8" rx="2"/><rect x="21" y="13" width="17" height="9" fill="#E07A5F" rx="2"/></svg>',
    '5box':       '<svg viewBox="0 0 40 24"><rect x="1" y="4" width="6" height="16" fill="#156082" rx="1"/><rect x="9" y="4" width="6" height="16" fill="#1B7A9F" rx="1"/><rect x="17" y="4" width="6" height="16" fill="#5BA3B8" rx="1"/><rect x="25" y="4" width="6" height="16" fill="#E07A5F" rx="1"/><rect x="33" y="4" width="6" height="16" fill="#D4A03D" rx="1"/></svg>',
    '6box':       '<svg viewBox="0 0 40 24"><rect x="1" y="2" width="11" height="9" fill="#156082" rx="1"/><rect x="14" y="2" width="11" height="9" fill="#1B7A9F" rx="1"/><rect x="27" y="2" width="11" height="9" fill="#5BA3B8" rx="1"/><rect x="1" y="13" width="11" height="9" fill="#E07A5F" rx="1"/><rect x="14" y="13" width="11" height="9" fill="#D4A03D" rx="1"/><rect x="27" y="13" width="11" height="9" fill="#4A9E6B" rx="1"/></svg>',
    'pyramid3':   '<svg viewBox="0 0 40 24"><rect x="14" y="2" width="12" height="6" fill="#156082" rx="1"/><rect x="10" y="10" width="20" height="6" fill="#1B7A9F" rx="1"/><rect x="4" y="18" width="32" height="6" fill="#5BA3B8" rx="1"/></svg>',
    'funnel':     '<svg viewBox="0 0 40 24"><rect x="4" y="2" width="32" height="6" fill="#156082" rx="1"/><rect x="8" y="10" width="24" height="6" fill="#1B7A9F" rx="1"/><rect x="12" y="18" width="16" height="6" fill="#5BA3B8" rx="1"/></svg>',
    'arrow3':     '<svg viewBox="0 0 40 24"><polygon points="2,4 10,4 13,12 10,20 2,20" fill="#156082"/><polygon points="14,4 22,4 25,12 22,20 14,20" fill="#1B7A9F"/><polygon points="26,4 38,4 38,20 26,20" fill="#5BA3B8"/></svg>',
    'timeline':   '<svg viewBox="0 0 40 24"><line x1="4" y1="12" x2="36" y2="12" stroke="#E2E8F0" stroke-width="2"/><circle cx="10" cy="12" r="4" fill="#156082"/><circle cx="20" cy="12" r="4" fill="#1B7A9F"/><circle cx="30" cy="12" r="4" fill="#5BA3B8"/></svg>',
    'comparison': '<svg viewBox="0 0 40 24"><rect x="2" y="4" width="17" height="16" fill="#156082" rx="2"/><rect x="21" y="4" width="17" height="16" fill="#E07A5F" rx="2"/></svg>',
    'matrix':     '<svg viewBox="0 0 40 24"><line x1="20" y1="2" x2="20" y2="22" stroke="#E2E8F0" stroke-width="1"/><line x1="2" y1="12" x2="38" y2="12" stroke="#E2E8F0" stroke-width="1"/><rect x="4" y="4" width="14" height="6" fill="#156082" rx="1"/><rect x="22" y="4" width="14" height="6" fill="#1B7A9F" rx="1"/><rect x="4" y="14" width="14" height="6" fill="#5BA3B8" rx="1"/><rect x="22" y="14" width="14" height="6" fill="#E07A5F" rx="1"/></svg>'
  };
  return icons[id] || icons['3box'];
}

function selectLayout(layoutId) {
  state.layout = layoutId;
  const layout = layouts.find(l => l.id === layoutId);
  while (state.boxes.length < layout.boxes) {
    const ci = state.boxes.length % colorOptions.length;
    state.boxes.push({ title: `Box ${state.boxes.length + 1}`, subtitle: '', color: colorOptions[ci].id });
  }
  state.boxes = state.boxes.slice(0, layout.boxes);
  renderLayoutGrid();
  renderBoxList();
  updatePreview();
}

function renderBoxList() {
  const list = document.getElementById('box-list');
  list.innerHTML = state.boxes.map((box, i) => `
    <div class="box-item">
      <div class="box-header">
        <span class="box-number">Box ${i + 1}</span>
        ${state.boxes.length > 2 ? `<button class="box-delete" onclick="deleteBox(${i})">×</button>` : ''}
      </div>
      <div class="form-group">
        <label>Title</label>
        <input type="text" value="${escapeHtml(box.title)}" oninput="updateBox(${i}, 'title', this.value)">
      </div>
      <div class="form-group">
        <label>Subtitle</label>
        <input type="text" value="${escapeHtml(box.subtitle)}" oninput="updateBox(${i}, 'subtitle', this.value)">
      </div>
      <div class="form-group">
        <label>Color</label>
        <div class="color-options">
          ${colorOptions.map(c => `
            <div class="color-option ${box.color === c.id ? 'active' : ''}"
                 style="background:${c.hex}" onclick="updateBox(${i},'color','${c.id}')"
                 title="${c.name}"></div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function updateBox(index, prop, value) {
  state.boxes[index][prop] = value;
  if (prop === 'color') renderBoxList();
  updatePreview();
}

function addBox() {
  const ci = state.boxes.length % colorOptions.length;
  state.boxes.push({ title: `Box ${state.boxes.length + 1}`, subtitle: '', color: colorOptions[ci].id });
  renderBoxList();
  updatePreview();
}

function deleteBox(index) {
  if (state.boxes.length > 2) {
    state.boxes.splice(index, 1);
    renderBoxList();
    updatePreview();
  }
}

// ============================================
// TABLES TAB
// ============================================
function initTableData() {
  tableState.data = [];
  for (let r = 0; r < tableState.rows; r++) {
    const row = [];
    for (let c = 0; c < tableState.cols; c++) {
      row.push({ text: r === 0 ? `Header ${c + 1}` : `Cell ${r},${c + 1}`, isHeader: r === 0 });
    }
    tableState.data.push(row);
  }
}

function renderTableEditor() {
  const editor = document.getElementById('table-data-editor');
  let html = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:11px">';
  for (let r = 0; r < tableState.rows; r++) {
    html += '<tr>';
    for (let c = 0; c < tableState.cols; c++) {
      const cell = tableState.data[r]?.[c] || { text: '' };
      html += `<td style="padding:2px"><input type="text" value="${escapeHtml(cell.text)}"
        style="width:100%;padding:4px;font-size:11px;border:1px solid #e2e8f0;border-radius:3px;font-family:inherit"
        oninput="updateTableCell(${r},${c},this.value)"></td>`;
    }
    html += '</tr>';
  }
  html += '</table></div>';
  editor.innerHTML = html;
}

function updateTableCell(row, col, value) {
  if (tableState.data[row]?.[col]) {
    tableState.data[row][col].text = value;
    updateTablePreview();
  }
}

function updateTablePreview() {
  const showByline = document.getElementById('table-show-byline').checked;
  const container = document.getElementById('preview-container');
  container.innerHTML = generateTableSVG(showByline);
  const svgEl = container.querySelector('svg');
  if (svgEl) {
    svgEl.setAttribute('width', tableState.width);
    svgEl.setAttribute('height', tableState.height);
    svgEl.style.cssText = 'display:block;max-width:100%;height:auto';
  }
  document.getElementById('canvas-info').textContent = `${tableState.width} × ${tableState.height}px`;
}

function generateTableSVG(showByline = true) {
  const w = tableState.width, h = tableState.height;
  const pad = 40, titleH = tableState.title ? 50 : 0, bylineH = showByline ? 24 : 0;
  const tableTop = pad + titleH;
  const tableH   = h - tableTop - pad - bylineH;
  const tableW   = w - pad * 2;
  const rowH     = tableH / tableState.rows;
  const colW     = tableW / tableState.cols;

  let svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .t-title  { font-family:'Inter',sans-serif; font-size:20px; font-weight:600; fill:#1A1A2E }
    .t-hcell  { font-family:'Inter',sans-serif; font-size:13px; font-weight:600; fill:white }
    .t-cell   { font-family:'Inter',sans-serif; font-size:12px; fill:#1A1A2E }
    .byline   { font-family:'Inter',sans-serif; font-size:10px; fill:#5BA3B8 }
  </style>
  <rect width="${w}" height="${h}" fill="white"/>`;
  if (tableState.title) svg += `\n  <text x="${w/2}" y="${pad+24}" text-anchor="middle" class="t-title">${escapeXml(tableState.title)}</text>`;
  for (let r = 0; r < tableState.rows; r++) {
    for (let c = 0; c < tableState.cols; c++) {
      const x = pad + c * colW, y = tableTop + r * rowH;
      const cell = tableState.data[r]?.[c] || { text: '' };
      if (r === 0) {
        svg += `\n  <rect x="${x}" y="${y}" width="${colW}" height="${rowH}" fill="#156082"/>`;
        svg += `\n  <text x="${x+colW/2}" y="${y+rowH/2+5}" text-anchor="middle" class="t-hcell">${escapeXml(cell.text)}</text>`;
      } else {
        svg += `\n  <rect x="${x}" y="${y}" width="${colW}" height="${rowH}" fill="${r%2===0?'#F8FAFC':'white'}" stroke="#E2E8F0"/>`;
        svg += `\n  <text x="${x+colW/2}" y="${y+rowH/2+5}" text-anchor="middle" class="t-cell">${escapeXml(cell.text)}</text>`;
      }
    }
  }
  if (showByline) svg += `\n  <text x="${w-pad}" y="${h-10}" text-anchor="end" class="byline">diagrammatic.ai</text>`;
  return svg + '\n</svg>';
}

// ============================================
// MATRIX TAB
// ============================================
function renderMatrixPoints() {
  const list = document.getElementById('matrix-points-list');
  list.innerHTML = matrixState.points.map((pt, i) => `
    <div class="box-item">
      <div class="box-header">
        <span class="box-number">Point ${i + 1}</span>
        ${matrixState.points.length > 1 ? `<button class="box-delete" onclick="deleteMatrixPoint(${i})">×</button>` : ''}
      </div>
      <div class="form-group">
        <label>Label</label>
        <input type="text" value="${escapeHtml(pt.label)}" oninput="updateMatrixPoint(${i},'label',this.value)">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>X (0–100)</label>
          <input type="number" value="${pt.x}" min="0" max="100" oninput="updateMatrixPoint(${i},'x',parseInt(this.value))">
        </div>
        <div class="form-group">
          <label>Y (0–100)</label>
          <input type="number" value="${pt.y}" min="0" max="100" oninput="updateMatrixPoint(${i},'y',parseInt(this.value))">
        </div>
      </div>
      <div class="form-group">
        <label>Size</label>
        <input type="number" value="${pt.size}" min="20" max="80" oninput="updateMatrixPoint(${i},'size',parseInt(this.value))">
      </div>
      <div class="form-group">
        <label>Color</label>
        <div class="color-options">
          ${colorOptions.slice(0,6).map(c => `
            <div class="color-option ${pt.color===c.id?'active':''}" style="background:${c.hex}"
                 onclick="updateMatrixPoint(${i},'color','${c.id}')" title="${c.name}"></div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function updateMatrixPoint(index, prop, value) {
  matrixState.points[index][prop] = value;
  if (prop === 'color') renderMatrixPoints();
  updateMatrixPreview();
}

function addMatrixPoint() {
  const ci = matrixState.points.length % 6;
  matrixState.points.push({ label: `Item ${matrixState.points.length+1}`, x:50, y:50, size:35, color: colorOptions[ci].id });
  renderMatrixPoints();
  updateMatrixPreview();
}

function deleteMatrixPoint(index) {
  if (matrixState.points.length > 1) {
    matrixState.points.splice(index, 1);
    renderMatrixPoints();
    updateMatrixPreview();
  }
}

function updateMatrixPreview() {
  const showByline = document.getElementById('matrix-show-byline').checked;
  const container = document.getElementById('preview-container');
  container.innerHTML = generateMatrixSVG(showByline);
  const svgEl = container.querySelector('svg');
  if (svgEl) {
    svgEl.setAttribute('width', matrixState.width);
    svgEl.setAttribute('height', matrixState.height);
    svgEl.style.cssText = 'display:block;max-width:100%;height:auto';
  }
  document.getElementById('canvas-info').textContent = `${matrixState.width} × ${matrixState.height}px`;
}

function generateMatrixSVG(showByline = true) {
  const w = matrixState.width, h = matrixState.height;
  const pad = 60, titleH = matrixState.title ? 50 : 0, bylineH = showByline ? 24 : 0;
  const cL = pad + 30, cT = pad + titleH;
  const cW = w - cL - pad, cH = h - cT - pad - bylineH - 30;

  let svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .c-title { font-family:'Inter',sans-serif; font-size:20px; font-weight:600; fill:#1A1A2E }
    .c-axis  { font-family:'Inter',sans-serif; font-size:12px; font-weight:500; fill:#4A5568 }
    .c-pt    { font-family:'Inter',sans-serif; font-size:11px; font-weight:500; fill:#1A1A2E }
    .byline  { font-family:'Inter',sans-serif; font-size:10px; fill:#5BA3B8 }
  </style>
  <rect width="${w}" height="${h}" fill="white"/>`;
  if (matrixState.title) svg += `\n  <text x="${w/2}" y="${pad+24}" text-anchor="middle" class="c-title">${escapeXml(matrixState.title)}</text>`;
  svg += `\n  <line x1="${cL}" y1="${cT+cH}" x2="${cL+cW}" y2="${cT+cH}" stroke="#E2E8F0" stroke-width="2"/>`;
  svg += `\n  <line x1="${cL}" y1="${cT}" x2="${cL}" y2="${cT+cH}" stroke="#E2E8F0" stroke-width="2"/>`;
  svg += `\n  <text x="${cL+cW/2}" y="${cT+cH+35}" text-anchor="middle" class="c-axis">${escapeXml(matrixState.xLabel)} →</text>`;
  svg += `\n  <text x="${cL-25}" y="${cT+cH/2}" text-anchor="middle" transform="rotate(-90,${cL-25},${cT+cH/2})" class="c-axis">${escapeXml(matrixState.yLabel)} →</text>`;
  svg += `\n  <line x1="${cL+cW/2}" y1="${cT}" x2="${cL+cW/2}" y2="${cT+cH}" stroke="#F0F0F0" stroke-width="1" stroke-dasharray="4,4"/>`;
  svg += `\n  <line x1="${cL}" y1="${cT+cH/2}" x2="${cL+cW}" y2="${cT+cH/2}" stroke="#F0F0F0" stroke-width="1" stroke-dasharray="4,4"/>`;
  [...matrixState.points].reverse().forEach(pt => {
    const cx = cL + (pt.x/100)*cW, cy = cT + cH - (pt.y/100)*cH;
    const color = colorOptions.find(c => c.id === pt.color)?.hex || '#156082';
    const r = pt.size / 2;
    svg += `\n  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.85"/>`;
    svg += `\n  <text x="${cx}" y="${cy-r-8}" text-anchor="middle" class="c-pt">${escapeXml(pt.label)}</text>`;
  });
  if (showByline) svg += `\n  <text x="${w-pad}" y="${h-10}" text-anchor="end" class="byline">diagrammatic.ai</text>`;
  return svg + '\n</svg>';
}

// ============================================
// FRAMEWORK SVG
// ============================================
function generateSVG() {
  const showByline = document.getElementById('show-byline').checked;
  const w = state.width, h = state.height, pad = 40;
  const titleH = state.title ? (state.subtitle ? 70 : 50) : 0;
  const bylineH = showByline ? 24 : 0;
  const boxTitleSize = Math.min(16, Math.max(12, w / 60));

  let svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .f-title    { font-family:'Inter',sans-serif; font-size:22px; font-weight:600; fill:#1A1A2E }
    .f-subtitle { font-family:'Inter',sans-serif; font-size:14px; fill:#4A5568 }
    .box-title  { font-family:'Inter',sans-serif; font-size:${boxTitleSize}px; font-weight:600; fill:white }
    .box-sub    { font-family:'Inter',sans-serif; font-size:${boxTitleSize-2}px; fill:rgba(255,255,255,0.85) }
    .byline     { font-family:'Inter',sans-serif; font-size:10px; fill:#5BA3B8 }
  </style>
  <rect width="${w}" height="${h}" fill="white"/>`;
  if (state.title) {
    svg += `\n  <text x="${w/2}" y="${pad+20}" text-anchor="middle" class="f-title">${escapeXml(state.title)}</text>`;
    if (state.subtitle) svg += `\n  <text x="${w/2}" y="${pad+45}" text-anchor="middle" class="f-subtitle">${escapeXml(state.subtitle)}</text>`;
  }
  const cTop = pad + titleH;
  svg += renderLayout(pad, cTop, w - pad*2, h - cTop - pad - bylineH, boxTitleSize);
  if (showByline) svg += `\n  <text x="${w-pad}" y="${h-10}" text-anchor="end" class="byline">diagrammatic.ai</text>`;
  return svg + '\n</svg>';
}

function renderLayout(x, y, w, h, ts) {
  const boxes = state.boxes, gap = 12;
  let svg = '';
  switch (state.layout) {
    case '2box': case 'comparison': {
      const bw = (w-gap)/2;
      boxes.forEach((b,i) => { svg += renderBox(x+i*(bw+gap), y, bw, h, b, ts); });
      break;
    }
    case '3box': {
      const bw = (w-gap*2)/3;
      boxes.forEach((b,i) => { svg += renderBox(x+i*(bw+gap), y, bw, h, b, ts); });
      break;
    }
    case '4box': {
      const bw=(w-gap)/2, bh=(h-gap)/2;
      boxes.forEach((b,i) => { svg += renderBox(x+(i%2)*(bw+gap), y+Math.floor(i/2)*(bh+gap), bw, bh, b, ts); });
      break;
    }
    case '5box': {
      const bw=(w-gap*4)/5;
      boxes.forEach((b,i) => { svg += renderBox(x+i*(bw+gap), y, bw, h, b, ts); });
      break;
    }
    case '6box': {
      const bw=(w-gap*2)/3, bh=(h-gap)/2;
      boxes.forEach((b,i) => { svg += renderBox(x+(i%3)*(bw+gap), y+Math.floor(i/3)*(bh+gap), bw, bh, b, ts); });
      break;
    }
    case 'pyramid3': {
      const th=h/3;
      boxes.forEach((b,i) => {
        const tw=w*(0.4+i*0.3), tx=x+(w-tw)/2;
        svg += renderBox(tx, y+i*th+3, tw, th-6, b, ts);
      });
      break;
    }
    case 'funnel': {
      const th=h/3;
      boxes.forEach((b,i) => {
        const tw=w*(1-i*0.25), tx=x+(w-tw)/2;
        svg += renderBox(tx, y+i*th+3, tw, th-6, b, ts);
      });
      break;
    }
    case 'arrow3': {
      const aw=(w-gap*2)/3;
      boxes.forEach((b,i) => { svg += renderArrow(x+i*(aw+gap), y, aw, h, b, i===boxes.length-1, ts); });
      break;
    }
    case 'timeline': {
      const ns=w/(boxes.length+1), ly=y+h/2, nr=Math.min(30,h/4);
      svg += `  <line x1="${x}" y1="${ly}" x2="${x+w}" y2="${ly}" stroke="#E2E8F0" stroke-width="3"/>\n`;
      boxes.forEach((b,i) => {
        const nx=x+ns*(i+1), color=colorOptions.find(c=>c.id===b.color)?.hex||'#156082';
        svg += `  <circle cx="${nx}" cy="${ly}" r="${nr}" fill="${color}"/>\n`;
        svg += `  <text x="${nx}" y="${ly-nr-12}" text-anchor="middle" class="box-title" style="fill:#1A1A2E">${escapeXml(b.title)}</text>\n`;
        if (b.subtitle) svg += `  <text x="${nx}" y="${ly+nr+18}" text-anchor="middle" class="box-sub" style="fill:#4A5568">${escapeXml(b.subtitle)}</text>\n`;
      });
      break;
    }
    case 'matrix': {
      const mx=x+w/2, my=y+h/2, qw=(w-gap)/2, qh=(h-gap)/2;
      svg += `  <line x1="${mx}" y1="${y}" x2="${mx}" y2="${y+h}" stroke="#E2E8F0" stroke-width="2"/>\n`;
      svg += `  <line x1="${x}" y1="${my}" x2="${x+w}" y2="${my}" stroke="#E2E8F0" stroke-width="2"/>\n`;
      boxes.forEach((b,i) => { svg += renderBox(x+(i%2)*(qw+gap), y+Math.floor(i/2)*(qh+gap), qw, qh, b, ts); });
      break;
    }
  }
  return svg;
}

function renderBox(x, y, w, h, box, ts) {
  const color = colorOptions.find(c => c.id === box.color)?.hex || '#156082';
  const cx = x+w/2, cy = y+h/2;
  let svg = `  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" rx="6"/>\n`;
  if (box.subtitle) {
    svg += `  <text x="${cx}" y="${cy-4}" text-anchor="middle" class="box-title">${escapeXml(box.title)}</text>\n`;
    svg += `  <text x="${cx}" y="${cy+14}" text-anchor="middle" class="box-sub">${escapeXml(box.subtitle)}</text>\n`;
  } else {
    svg += `  <text x="${cx}" y="${cy+5}" text-anchor="middle" class="box-title">${escapeXml(box.title)}</text>\n`;
  }
  return svg;
}

function renderArrow(x, y, w, h, box, isLast, ts) {
  const color = colorOptions.find(c => c.id === box.color)?.hex || '#156082';
  const cx = x+w/2, cy = y+h/2, ah = 20;
  const pts = isLast
    ? `${x},${y} ${x+w},${y} ${x+w},${y+h} ${x},${y+h}`
    : `${x},${y} ${x+w-ah},${y} ${x+w},${y+h/2} ${x+w-ah},${y+h} ${x},${y+h}`;
  let svg = `  <polygon points="${pts}" fill="${color}"/>\n`;
  if (box.subtitle) {
    svg += `  <text x="${cx}" y="${cy-4}" text-anchor="middle" class="box-title">${escapeXml(box.title)}</text>\n`;
    svg += `  <text x="${cx}" y="${cy+14}" text-anchor="middle" class="box-sub">${escapeXml(box.subtitle)}</text>\n`;
  } else {
    svg += `  <text x="${cx}" y="${cy+5}" text-anchor="middle" class="box-title">${escapeXml(box.title)}</text>\n`;
  }
  return svg;
}

// ============================================
// UTILITIES
// ============================================
function escapeXml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}
function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================
// PREVIEW & EXPORT
// ============================================
function updatePreview() {
  const container = document.getElementById('preview-container');
  container.innerHTML = generateSVG();
  const svgEl = container.querySelector('svg');
  if (svgEl) {
    svgEl.setAttribute('width', state.width);
    svgEl.setAttribute('height', state.height);
    svgEl.style.cssText = 'display:block;max-width:100%;height:auto';
  }
  document.getElementById('canvas-info').textContent = `${state.width} × ${state.height}px`;
}

function copySVG() {
  let svg;
  if (currentTab === 'frameworks')    svg = generateSVG();
  else if (currentTab === 'tables')   svg = generateTableSVG(document.getElementById('table-show-byline').checked);
  else                                svg = generateMatrixSVG(document.getElementById('matrix-show-byline').checked);
  navigator.clipboard.writeText(svg).then(() => showToast('SVG copied to clipboard'));
}

function downloadPNG() {
  let svg, width, height, title;
  if (currentTab === 'frameworks') {
    svg = generateSVG(); width = state.width; height = state.height;
    title = document.getElementById('title').value || 'framework';
  } else if (currentTab === 'tables') {
    svg = generateTableSVG(document.getElementById('table-show-byline').checked);
    width = tableState.width; height = tableState.height;
    title = document.getElementById('table-title').value || 'table';
  } else {
    svg = generateMatrixSVG(document.getElementById('matrix-show-byline').checked);
    width = matrixState.width; height = matrixState.height;
    title = document.getElementById('matrix-title').value || 'matrix';
  }
  const canvas = document.getElementById('export-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width * 2; canvas.height = height * 2;
  const img = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  img.onload = function () {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `diagrammatic-${title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.png`;
    a.click();
  };
  img.src = url;
}

function resetToDefaults() {
  if (currentTab === 'frameworks') {
    state = { layout:'3box', width:862, height:485, title:'', subtitle:'',
      boxes: [
        { title:'Step 1', subtitle:'', color:'teal' },
        { title:'Step 2', subtitle:'', color:'midTeal' },
        { title:'Step 3', subtitle:'', color:'softTeal' }
      ]
    };
    document.getElementById('canvas-width').value  = 862;
    document.getElementById('canvas-height').value = 485;
    document.getElementById('title').value         = '';
    document.getElementById('subtitle').value      = '';
    document.getElementById('preset-select').value = '';
    renderLayoutGrid(); renderBoxList(); updatePreview();
  } else if (currentTab === 'tables') {
    tableState = { width:862, height:485, title:'', rows:4, cols:4, data:[] };
    document.getElementById('table-canvas-width').value  = 862;
    document.getElementById('table-canvas-height').value = 485;
    document.getElementById('table-title').value         = '';
    document.getElementById('table-rows').value          = 4;
    document.getElementById('table-cols').value          = 4;
    initTableData(); renderTableEditor(); updateTablePreview();
  } else {
    matrixState = { width:862, height:647, title:'', xLabel:'Impact', yLabel:'Effort',
      points: [
        { label:'Initiative A', x:80, y:20, size:40, color:'teal' },
        { label:'Initiative B', x:30, y:70, size:30, color:'coral' },
        { label:'Initiative C', x:60, y:50, size:50, color:'sage' }
      ]
    };
    document.getElementById('matrix-canvas-width').value  = 862;
    document.getElementById('matrix-canvas-height').value = 647;
    document.getElementById('matrix-title').value         = '';
    document.getElementById('matrix-x-label').value       = 'Impact';
    document.getElementById('matrix-y-label').value       = 'Effort';
    renderMatrixPoints(); updateMatrixPreview();
  }
}

// ============================================
// TOAST
// ============================================
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('toast--visible')));
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ============================================
// BOOT
// ============================================
document.addEventListener('DOMContentLoaded', init);
if (document.readyState === 'complete' || document.readyState === 'interactive') init();
```

- [ ] **Step 2: Verify escapeXml in browser console**

Open `diagrammatic-app.html` reference file in a browser. In the console:

```javascript
console.assert(escapeXml('A & B') === 'A &amp; B', 'ampersand failed');
console.assert(escapeXml('<b>') === '&lt;b&gt;', 'angle brackets failed');
console.assert(escapeXml('"hi"') === '&quot;hi&quot;', 'quotes failed');
console.log('All escapeXml assertions passed');
```

Expected: "All escapeXml assertions passed" with no assertion errors.

- [ ] **Step 3: Commit**

```bash
git add src/js/app.js
git commit -m "feat: add app.js with all logic, SVG generators, and 6 framework presets"
```

---

## Task 4: app.css

**Files:** Create `src/styles/app.css`

- [ ] **Step 1: Write app.css**

Write to `src/styles/app.css`:

```css
/* ============================================
   app.css — Diagrammatic App UI
   Consumes tokens from base.css only.
   ============================================ */

/* ── Chrome ── */
.app-header {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: 0 var(--space-3);
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  color: var(--text);
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: var(--teal);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.logo-wordmark { font-size: var(--text-base); font-weight: 600; letter-spacing: -0.02em; }
.logo-wordmark span { color: var(--teal); }

.header-actions { display: flex; gap: var(--space-1); }

/* ── Tab Bar ── */
.tabs {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-shrink: 0;
}

.tab {
  padding: 10px var(--space-3);
  border: none;
  background: none;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s, border-color 0.15s;
}

.tab:hover  { color: var(--teal); }
.tab.active { color: var(--teal); border-bottom-color: var(--teal); }

/* ── Layout ── */
.main {
  display: flex;
  height: calc(100vh - 57px - 41px);
  overflow: hidden;
}

.tab-panel        { display: none; }
.tab-panel.active { display: flex; }

/* ── Sidebar ── */
.sidebar {
  width: 320px;
  background: var(--white);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-section { border-bottom: 1px solid var(--border); padding: var(--space-2); }
.sidebar-section:last-child { border-bottom: none; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.section-header h3 {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--teal);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ── Layout Grid ── */
.layout-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.layout-btn {
  aspect-ratio: 1.4;
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--white);
  cursor: pointer;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, background 0.15s;
}

.layout-btn:hover  { border-color: var(--teal); background: var(--teal-light); }
.layout-btn.active { border-color: var(--teal); background: var(--teal-light); box-shadow: 0 0 0 2px rgba(21,96,130,0.2); }
.layout-btn svg    { width: 100%; height: 70%; }
.layout-btn span   { font-size: 8px; color: var(--text-muted); margin-top: 2px; }

/* ── Form Elements ── */
.form-group { margin-bottom: var(--space-2); }
.form-group:last-child { margin-bottom: 0; }

.form-group label {
  display: block;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  color: var(--text);
  background: var(--white);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--teal);
  box-shadow: 0 0 0 3px rgba(21,96,130,0.1);
}

.form-group textarea { resize: vertical; min-height: 60px; }

.form-row { display: flex; gap: var(--space-1); }
.form-row .form-group { flex: 1; }

/* ── Toggle ── */
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-1) 0;
}

.toggle-label { font-size: var(--text-sm); color: var(--text); }

.toggle-switch { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }

.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #CBD5E0;
  border-radius: 22px;
  transition: 0.25s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 16px; height: 16px;
  left: 3px; bottom: 3px;
  background: var(--white);
  border-radius: 50%;
  transition: 0.25s;
}

.toggle-switch input:checked + .toggle-slider { background: var(--teal); }
.toggle-switch input:checked + .toggle-slider::before { transform: translateX(18px); }

/* ── Box Editor ── */
.box-item {
  background: var(--teal-light);
  border-radius: var(--radius-md);
  padding: var(--space-2);
  margin-bottom: var(--space-1);
}
.box-item:last-child { margin-bottom: 0; }

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-1);
}

.box-number { font-size: var(--text-xs); font-weight: 600; color: var(--teal); }

.box-delete {
  background: none;
  border: none;
  color: var(--coral);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background 0.15s;
}
.box-delete:hover { background: rgba(224,122,95,0.12); }

/* ── Color Swatches ── */
.color-options { display: flex; gap: 4px; flex-wrap: wrap; }

.color-option {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.12s;
}
.color-option:hover  { transform: scale(1.15); }
.color-option.active { border-color: var(--text); box-shadow: 0 0 0 2px var(--white), 0 0 0 4px var(--text); }

/* ── Buttons ── */
.btn {
  padding: 8px var(--space-2);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
  white-space: nowrap;
}

.btn-primary { background: var(--teal); color: var(--white); }
.btn-primary:hover {
  background: var(--teal-mid);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(21,96,130,0.25);
}

.btn-secondary { background: var(--teal-light); color: var(--teal); }
.btn-secondary:hover { background: #d5e9ef; }

.btn-small { padding: 6px var(--space-2); font-size: 12px; }
.btn-block { width: 100%; }

/* ── Canvas ── */
.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.canvas-toolbar {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: 8px var(--space-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.canvas-info { font-size: 12px; color: var(--text-muted); }

.preview-wrapper {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #E8ECEF;
  background-image: radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px);
  background-size: 20px 20px;
}

.preview-container {
  background: var(--white);
  box-shadow: var(--shadow-lg);
  border-radius: 4px;
  overflow: hidden;
}

#preview-container svg { display: block; }

/* ── Toast ── */
.toast {
  position: fixed;
  bottom: var(--space-3);
  left: 50%;
  transform: translateX(-50%) translateY(12px);
  background: var(--text);
  color: var(--white);
  padding: 10px var(--space-3);
  border-radius: var(--radius-pill);
  font-size: var(--text-sm);
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
  pointer-events: none;
  z-index: 200;
}
.toast--visible { opacity: 1; transform: translateX(-50%) translateY(0); }

#export-canvas { display: none; }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/app.css
git commit -m "feat: add token-based app.css"
```

---

## Task 5: index.html

**Files:** Modify `src/index.html`

- [ ] **Step 1: Write index.html**

Write to `src/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diagrammatic — Consulting-grade diagrams</title>
  <link rel="stylesheet" href="styles/base.css">
  <link rel="stylesheet" href="styles/app.css">
</head>
<body>

  <header class="app-header">
    <a href="/" class="logo">
      <div class="logo-icon">D</div>
      <span class="logo-wordmark">diagrammatic<span>.ai</span></span>
    </a>
    <div class="header-actions">
      <button class="btn btn-secondary btn-small" onclick="copySVG()">Copy SVG</button>
      <button class="btn btn-primary btn-small" onclick="downloadPNG()">Download PNG</button>
    </div>
  </header>

  <div class="tabs">
    <button class="tab active" data-tab="frameworks">Frameworks</button>
    <button class="tab" data-tab="tables">Tables</button>
    <button class="tab" data-tab="matrix">Matrix Chart</button>
  </div>

  <main class="main">

    <!-- FRAMEWORKS -->
    <div class="tab-panel active" id="frameworks-panel">
      <aside class="sidebar">
        <section class="sidebar-section">
          <div class="section-header"><h3>Preset</h3></div>
          <div class="form-group">
            <label>Load a framework</label>
            <select id="preset-select">
              <option value="">— Custom —</option>
              <option value="bcg">BCG Matrix</option>
              <option value="swot">SWOT Analysis</option>
              <option value="valuechain">Value Chain</option>
              <option value="threehorizons">Three Horizons</option>
              <option value="ansoff">Ansoff Matrix</option>
            </select>
          </div>
        </section>
        <section class="sidebar-section">
          <div class="section-header"><h3>Layout</h3></div>
          <div class="layout-grid" id="layout-grid"></div>
        </section>
        <section class="sidebar-section">
          <div class="section-header"><h3>Canvas</h3></div>
          <div class="form-row">
            <div class="form-group"><label>Width</label><input type="number" id="canvas-width" value="862" min="400" max="1920"></div>
            <div class="form-group"><label>Height</label><input type="number" id="canvas-height" value="485" min="300" max="1080"></div>
          </div>
        </section>
        <section class="sidebar-section">
          <div class="section-header"><h3>Content</h3></div>
          <div class="form-group"><label>Title</label><input type="text" id="title" placeholder="Framework Title"></div>
          <div class="form-group"><label>Subtitle</label><input type="text" id="subtitle" placeholder="Optional subtitle"></div>
        </section>
        <section class="sidebar-section">
          <div class="section-header">
            <h3>Boxes</h3>
            <button class="btn btn-secondary btn-small" onclick="addBox()">+ Add</button>
          </div>
          <div id="box-list"></div>
        </section>
        <section class="sidebar-section">
          <div class="section-header"><h3>Export Options</h3></div>
          <div class="toggle-row">
            <span class="toggle-label">Show "diagrammatic.ai" badge</span>
            <label class="toggle-switch">
              <input type="checkbox" id="show-byline" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </section>
      </aside>
    </div>

    <!-- TABLES -->
    <div class="tab-panel" id="tables-panel">
      <aside class="sidebar">
        <section class="sidebar-section">
          <div class="section-header"><h3>Table Settings</h3></div>
          <div class="form-row">
            <div class="form-group"><label>Rows</label><input type="number" id="table-rows" value="4" min="2" max="12"></div>
            <div class="form-group"><label>Columns</label><input type="number" id="table-cols" value="4" min="2" max="8"></div>
          </div>
        </section>
        <section class="sidebar-section">
          <div class="section-header"><h3>Canvas</h3></div>
          <div class="form-row">
            <div class="form-group"><label>Width</label><input type="number" id="table-canvas-width" value="862" min="400" max="1920"></div>
            <div class="form-group"><label>Height</label><input type="number" id="table-canvas-height" value="485" min="300" max="1080"></div>
          </div>
        </section>
        <section class="sidebar-section">
          <div class="section-header"><h3>Content</h3></div>
          <div class="form-group"><label>Table Title</label><input type="text" id="table-title" placeholder="Table Title"></div>
        </section>
        <section class="sidebar-section">
          <div class="section-header"><h3>Table Data</h3></div>
          <div id="table-data-editor"></div>
        </section>
        <section class="sidebar-section">
          <div class="section-header"><h3>Export Options</h3></div>
          <div class="toggle-row">
            <span class="toggle-label">Show "diagrammatic.ai" badge</span>
            <label class="toggle-switch">
              <input type="checkbox" id="table-show-byline" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </section>
      </aside>
    </div>

    <!-- MATRIX -->
    <div class="tab-panel" id="matrix-panel">
      <aside class="sidebar">
        <section class="sidebar-section">
          <div class="section-header"><h3>Preset</h3></div>
          <div class="form-group">
            <label>Load a framework</label>
            <select id="matrix-preset-select" onchange="if(this.value){loadPreset(this.value);this.value='';}">
              <option value="">— Custom —</option>
              <option value="prioritization">Prioritization Matrix</option>
            </select>
          </div>
        </section>
        <section class="sidebar-section">
          <div class="section-header"><h3>Axes</h3></div>
          <div class="form-group"><label>X-Axis Label</label><input type="text" id="matrix-x-label" value="Impact"></div>
          <div class="form-group"><label>Y-Axis Label</label><input type="text" id="matrix-y-label" value="Effort"></div>
        </section>
        <section class="sidebar-section">
          <div class="section-header"><h3>Canvas</h3></div>
          <div class="form-row">
            <div class="form-group"><label>Width</label><input type="number" id="matrix-canvas-width" value="862" min="400" max="1920"></div>
            <div class="form-group"><label>Height</label><input type="number" id="matrix-canvas-height" value="647" min="300" max="1080"></div>
          </div>
        </section>
        <section class="sidebar-section">
          <div class="section-header"><h3>Content</h3></div>
          <div class="form-group"><label>Chart Title</label><input type="text" id="matrix-title" placeholder="Prioritization Matrix"></div>
        </section>
        <section class="sidebar-section">
          <div class="section-header">
            <h3>Data Points</h3>
            <button class="btn btn-secondary btn-small" onclick="addMatrixPoint()">+ Add</button>
          </div>
          <div id="matrix-points-list"></div>
        </section>
        <section class="sidebar-section">
          <div class="section-header"><h3>Export Options</h3></div>
          <div class="toggle-row">
            <span class="toggle-label">Show "diagrammatic.ai" badge</span>
            <label class="toggle-switch">
              <input type="checkbox" id="matrix-show-byline" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </section>
      </aside>
    </div>

    <!-- SHARED CANVAS -->
    <div class="canvas-area">
      <div class="canvas-toolbar">
        <span class="canvas-info" id="canvas-info">862 × 485px</span>
        <button class="btn btn-secondary btn-small" onclick="resetToDefaults()">Reset</button>
      </div>
      <div class="preview-wrapper">
        <div class="preview-container" id="preview-container"></div>
      </div>
    </div>

  </main>

  <canvas id="export-canvas"></canvas>
  <script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

Open `src/index.html` (via local HTTP server or `file://`). Confirm:
- [ ] Header, tabs, sidebar, canvas render correctly
- [ ] BCG Matrix preset: 4 boxes with correct titles, subtitles, colors
- [ ] SWOT preset: sage/coral/teal/amber colors in correct positions
- [ ] Value Chain: 5-box layout loads at 1100×400
- [ ] Three Horizons: timeline with 3 nodes and subtitles
- [ ] Ansoff: 4-box with subtitle descriptions
- [ ] Prioritization Matrix (Matrix tab): 4 points in correct quadrants
- [ ] Download PNG triggers file save
- [ ] Copy SVG shows toast (not alert)
- [ ] Reset clears state and resets preset dropdown

- [ ] **Step 3: Commit**

```bash
git add src/index.html
git commit -m "feat: add polished app index.html wired to app.js and app.css"
```

---

## Task 6: landing.css

**Files:** Create `src/styles/landing.css`

- [ ] **Step 1: Write landing.css**

Write to `src/styles/landing.css`:

```css
/* ============================================
   landing.css — Diagrammatic Marketing Page
   Consumes tokens from base.css only.
   ============================================ */

body { padding-top: 72px; }

/* ── Header ── */
.site-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: 72px;
  display: flex;
  align-items: center;
  transition: background 0.2s, border-color 0.2s, backdrop-filter 0.2s;
}

.site-header.scrolled {
  background: rgba(250,251,252,0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 var(--space-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.site-logo {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.02em;
}
.site-logo span { color: var(--teal); }

.site-nav a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  margin-left: var(--space-4);
  transition: color 0.15s;
}
.site-nav a:hover { color: var(--teal); }
.site-nav .nav-cta { color: var(--teal); font-weight: 600; }

/* ── Shared Section Wrapper ── */
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-3);
}

/* ── Hero ── */
.hero {
  padding: var(--space-10) var(--space-3) var(--space-8);
  text-align: center;
}

.hero-inner { max-width: 800px; margin: 0 auto; }

.hero h1 {
  font-size: var(--text-hero);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: var(--space-3);
}
.hero h1 span { color: var(--teal); }

.hero .subtitle {
  font-size: 1.2rem;
  color: var(--text-muted);
  max-width: 580px;
  margin: 0 auto var(--space-4);
  line-height: 1.6;
}

/* ── Email Form ── */
.email-form {
  display: flex;
  gap: var(--space-1);
  max-width: 440px;
  margin: 0 auto;
  flex-wrap: wrap;
  justify-content: center;
}

.email-form input[type="email"] {
  flex: 1;
  min-width: 220px;
  padding: 14px var(--space-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  background: var(--white);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.email-form input[type="email"]:focus {
  outline: none;
  border-color: var(--teal);
  box-shadow: 0 0 0 3px rgba(21,96,130,0.1);
}

.btn-hero {
  padding: 14px var(--space-3);
  background: var(--teal);
  color: var(--white);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
}
.btn-hero:hover {
  background: var(--teal-mid);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(21,96,130,0.3);
}

.form-note {
  width: 100%;
  text-align: center;
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-top: var(--space-1);
}

/* ── Section Headings ── */
.section-heading {
  text-align: center;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-6);
}

.section-subhead {
  text-align: center;
  color: var(--text-muted);
  margin-top: calc(-1 * var(--space-4));
  margin-bottom: var(--space-5);
}

/* ── How It Works ── */
.how-it-works { padding: var(--space-8) 0; }

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-3);
}

.step {
  background: var(--white);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  transition: transform 0.2s, box-shadow 0.2s;
}
.step:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }

.step-number {
  width: 40px; height: 40px;
  background: var(--teal-light);
  color: var(--teal);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-bottom: var(--space-2);
}

.step h3 { font-size: 1.05rem; font-weight: 600; margin-bottom: var(--space-1); }
.step p  { color: var(--text-muted); font-size: 0.95rem; }

/* ── Framework Library ── */
.frameworks { background: var(--white); padding: var(--space-8) 0; }

.framework-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-1);
}

.framework-item {
  background: var(--teal-light);
  color: var(--teal);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, transform 0.15s;
}
.framework-item:hover {
  background: var(--teal);
  color: var(--white);
  transform: translateY(-1px);
}

/* ── Audience ── */
.audience { padding: var(--space-8) 0; text-align: center; }

.audience-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  justify-content: center;
  max-width: 700px;
  margin: 0 auto;
}

.audience-item {
  background: var(--white);
  border: 1px solid var(--border);
  padding: 10px var(--space-3);
  border-radius: var(--radius-pill);
  font-size: var(--text-sm);
  color: var(--text-muted);
}

/* ── Pricing ── */
.pricing { background: var(--white); padding: var(--space-8) 0; }

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-3);
  align-items: start;
}

.pricing-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  background: var(--white);
  position: relative;
}
.pricing-card--featured { border-color: var(--teal); border-width: 2px; box-shadow: var(--shadow-md); }

.pricing-badge {
  position: absolute;
  top: -14px; left: 50%;
  transform: translateX(-50%);
  padding: 4px var(--space-2);
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
}
.pricing-badge--teal  { background: var(--teal);  color: var(--white); }
.pricing-badge--amber { background: var(--amber); color: var(--white); }

.pricing-name  { font-size: 1.1rem; font-weight: 700; margin-bottom: var(--space-1); }

.pricing-price {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: var(--space-1);
}
.pricing-price sup  { font-size: 1rem; font-weight: 600; vertical-align: super; margin-right: 2px; }
.pricing-price span { font-size: var(--text-sm); font-weight: 400; color: var(--text-muted); }

.pricing-founding { font-size: 1.6rem; font-weight: 700; color: var(--amber); margin-bottom: var(--space-1); }

.pricing-desc {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-3);
  line-height: 1.5;
}

.pricing-features { list-style: none; margin-bottom: var(--space-4); }
.pricing-features li {
  font-size: var(--text-sm);
  color: var(--text-muted);
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
.pricing-features li:last-child { border-bottom: none; }
.pricing-features .check { color: var(--teal); font-weight: 700; flex-shrink: 0; }

.pricing-cta {
  width: 100%;
  padding: 12px var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.15s, transform 0.15s;
}
.pricing-cta--primary { background: var(--teal); color: var(--white); }
.pricing-cta--primary:hover { background: var(--teal-mid); transform: translateY(-1px); }
.pricing-cta--secondary { background: var(--teal-light); color: var(--teal); border: 1px solid var(--border); }
.pricing-cta--secondary:hover { background: #d5e9ef; }

/* ── Final CTA ── */
.cta-section {
  background: var(--teal);
  color: var(--white);
  padding: var(--space-8) var(--space-3);
  text-align: center;
}
.cta-section h2 { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: var(--space-1); }
.cta-section p  { opacity: 0.9; margin-bottom: var(--space-4); font-size: 1.05rem; }
.cta-section .email-form input[type="email"] { background: var(--white); border-color: transparent; }
.cta-section .btn-hero { background: var(--text); }
.cta-section .btn-hero:hover { background: #2D2D44; }

/* ── Footer ── */
.site-footer {
  padding: var(--space-3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-muted);
  max-width: 1200px;
  margin: 0 auto;
}
.site-footer a { color: var(--text-muted); text-decoration: none; transition: color 0.15s; }
.site-footer a:hover { color: var(--teal); }

/* ── Scroll Animations ── */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }

/* ── Responsive ── */
@media (max-width: 640px) {
  .hero { padding: var(--space-8) var(--space-2) var(--space-6); }
  .hero h1 { font-size: 2.2rem; }
  .site-nav a { margin-left: var(--space-2); }
  .pricing-grid, .steps { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/landing.css
git commit -m "feat: add token-based landing.css"
```

---

## Task 7: animations.js

**Files:** Create `src/js/animations.js`

- [ ] **Step 1: Write animations.js**

Write to `src/js/animations.js`:

```javascript
// ============================================
// animations.js — Landing Page Animations
// 1. Header backdrop blur on scroll
// 2. Hero load-in (staggered via data-delay)
// 3. Scroll-triggered .reveal elements
// ============================================
(function () {
  // 1. Header scroll behaviour
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // 2. Hero load-in — elements with data-delay animate immediately
  document.querySelectorAll('[data-delay]').forEach(function (el) {
    el.style.transitionDelay = (el.getAttribute('data-delay') || '0') + 'ms';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el.classList.add('visible'); });
    });
  });

  // 3. Scroll reveals
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    // Skip hero elements — they animate on load, not scroll
    if (!el.hasAttribute('data-delay')) observer.observe(el);
  });
}());
```

- [ ] **Step 2: Commit**

```bash
git add src/js/animations.js
git commit -m "feat: add animations.js for scroll reveals and header blur"
```

---

## Task 8: landing.html

**Files:** Modify `src/landing.html`

- [ ] **Step 1: Write landing.html**

Write to `src/landing.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diagrammatic — Consulting-grade diagrams. Instantly.</title>
  <meta name="description" content="The frameworks McKinsey uses. The speed napkin.ai promises. No design skills required.">
  <meta property="og:title" content="Diagrammatic — Consulting-grade diagrams. Instantly.">
  <meta property="og:description" content="Stop rebuilding the same BCG matrix in PowerPoint. Pick a framework, fill in your content, export in seconds.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://diagrammatic.ai">
  <link rel="canonical" href="https://diagrammatic.ai">
  <link rel="stylesheet" href="styles/base.css">
  <link rel="stylesheet" href="styles/landing.css">
</head>
<body>

  <header class="site-header" id="site-header">
    <div class="header-inner">
      <a href="/" class="site-logo">diagrammatic<span>.ai</span></a>
      <nav class="site-nav">
        <a href="#frameworks">Frameworks</a>
        <a href="#pricing">Pricing</a>
        <a href="/app" class="nav-cta">Try It →</a>
      </nav>
    </div>
  </header>

  <section class="hero">
    <div class="hero-inner">
      <h1>
        <span class="reveal" data-delay="0">Consulting-grade diagrams.</span><br>
        <span class="reveal" data-delay="120" style="color:var(--teal)">Instantly.</span>
      </h1>
      <p class="subtitle reveal" data-delay="240">
        Stop rebuilding the same BCG matrix in PowerPoint.
        Pick a framework, fill in your content, export in seconds.
      </p>
      <form class="email-form reveal" data-delay="360"
            action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
        <input type="email" name="email" placeholder="you@company.com" required>
        <button type="submit" class="btn-hero">Get Early Access →</button>
        <p class="form-note">Free while in beta. No credit card required.</p>
      </form>
    </div>
  </section>

  <section class="how-it-works">
    <div class="section-inner">
      <h2 class="section-heading reveal">How It Works</h2>
      <div class="steps">
        <div class="step reveal"><div class="step-number">1</div><h3>Choose a framework</h3><p>BCG matrix, value chain, maturity curve — pick from 20+ consulting standards.</p></div>
        <div class="step reveal"><div class="step-number">2</div><h3>Add your content</h3><p>Labels, data, colors. We handle the layout and visual hierarchy.</p></div>
        <div class="step reveal"><div class="step-number">3</div><h3>Export anywhere</h3><p>PNG, SVG, PPTX. Drop into your deck, report, or publication.</p></div>
      </div>
    </div>
  </section>

  <section class="frameworks" id="frameworks">
    <div class="section-inner">
      <h2 class="section-heading reveal">The Framework Library</h2>
      <p class="section-subhead reveal">The classics, ready in seconds.</p>
      <div class="framework-grid reveal">
        <div class="framework-item">BCG Matrix</div>
        <div class="framework-item">McKinsey 7S</div>
        <div class="framework-item">Value Chain</div>
        <div class="framework-item">Prioritization Matrix</div>
        <div class="framework-item">Maturity Curve</div>
        <div class="framework-item">Three Horizons</div>
        <div class="framework-item">SWOT</div>
        <div class="framework-item">Ansoff Matrix</div>
        <div class="framework-item">RACI Matrix</div>
        <div class="framework-item">Pyramid / MECE</div>
        <div class="framework-item">Stakeholder Map</div>
        <div class="framework-item">Kano Model</div>
        <div class="framework-item">Decision Tree</div>
        <div class="framework-item">Competitive Map</div>
        <div class="framework-item">Process Flow</div>
      </div>
    </div>
  </section>

  <section class="audience">
    <div class="section-inner">
      <h2 class="section-heading reveal">Built for people who think in frameworks</h2>
      <div class="audience-list reveal">
        <span class="audience-item">Solo consultants</span>
        <span class="audience-item">Strategy teams</span>
        <span class="audience-item">GCC practitioners</span>
        <span class="audience-item">MBA students</span>
        <span class="audience-item">Transformation leads</span>
        <span class="audience-item">Analysts</span>
      </div>
    </div>
  </section>

  <section class="pricing" id="pricing">
    <div class="section-inner">
      <h2 class="section-heading reveal">Start free. Scale when ready.</h2>
      <div class="pricing-grid">

        <div class="pricing-card reveal">
          <div class="pricing-badge pricing-badge--amber">Limited Time</div>
          <div class="pricing-name">Founding Member</div>
          <div class="pricing-founding">Early Adopter</div>
          <p class="pricing-desc">Lock in a lifetime discount before we launch publicly.</p>
          <ul class="pricing-features">
            <li><span class="check">✓</span> 5 exports / month</li>
            <li><span class="check">✓</span> PNG export</li>
            <li><span class="check">✓</span> Watermark</li>
            <li><span class="check">✓</span> All framework presets</li>
          </ul>
          <button class="pricing-cta pricing-cta--secondary">Join Waitlist</button>
        </div>

        <div class="pricing-card pricing-card--featured reveal">
          <div class="pricing-badge pricing-badge--teal">Most Popular</div>
          <div class="pricing-name">Pro</div>
          <div class="pricing-price"><sup>$</sup>12<span> / mo</span></div>
          <p class="pricing-desc">Everything you need to ship consulting-grade diagrams at speed.</p>
          <ul class="pricing-features">
            <li><span class="check">✓</span> Unlimited exports</li>
            <li><span class="check">✓</span> No watermark</li>
            <li><span class="check">✓</span> PNG + SVG + PPTX</li>
            <li><span class="check">✓</span> Brand kit</li>
            <li><span class="check">✓</span> All framework presets</li>
          </ul>
          <button class="pricing-cta pricing-cta--primary">Get Early Access</button>
        </div>

        <div class="pricing-card reveal">
          <div class="pricing-name">Team</div>
          <div class="pricing-price"><sup>$</sup>29<span> / mo</span></div>
          <p class="pricing-desc">For teams that collaborate on strategy and ship decks together.</p>
          <ul class="pricing-features">
            <li><span class="check">✓</span> Everything in Pro</li>
            <li><span class="check">✓</span> Shared templates</li>
            <li><span class="check">✓</span> API access</li>
            <li><span class="check">✓</span> Priority support</li>
          </ul>
          <button class="pricing-cta pricing-cta--secondary">Get Early Access</button>
        </div>

      </div>
    </div>
  </section>

  <section class="cta-section">
    <h2>Ready to ship better diagrams?</h2>
    <p>Join the beta and never rebuild a BCG matrix from scratch again.</p>
    <form class="email-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
      <input type="email" name="email" placeholder="you@company.com" required>
      <button type="submit" class="btn-hero">Get Early Access →</button>
    </form>
  </section>

  <footer class="site-footer">
    <span>© 2026 Diagrammatic. An <a href="https://electric-sheep-supply-co.in">Electric Sheep</a> product.</span>
    <a href="mailto:hello@diagrammatic.ai">Contact</a>
  </footer>

  <script src="js/animations.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

Open `src/landing.html`. Confirm:
- [ ] Header transparent on load; backdrop blur appears after scrolling 50px
- [ ] Hero: headline and subtitle animate in staggered on page load
- [ ] Sections reveal on scroll
- [ ] How It Works cards: hover lifts with shadow
- [ ] Framework pills: hover turns teal
- [ ] Pricing: Founding Member card has amber "Limited Time" badge
- [ ] Pricing: Pro card has teal border + "Most Popular" badge
- [ ] Final CTA section: teal background, dark button
- [ ] Mobile (375px): pricing stacks to 1 column, nav stays readable

- [ ] **Step 3: Commit**

```bash
git add src/landing.html
git commit -m "feat: add polished landing page with all 8 sections"
```

---

## Task 9: Cleanup + Final Verification

**Files:** Delete `src/styles.css`; verify no raw hex values leak into landing.css/app.css

- [ ] **Step 1: Remove the stub styles.css**

```bash
rm /Volumes/zodlightning/sites/diagrammatic/src/styles.css
```

- [ ] **Step 2: Check for raw hex values in landing.css and app.css**

```bash
grep -n '#[0-9A-Fa-f]\{3,6\}[^;]*$' \
  /Volumes/zodlightning/sites/diagrammatic/src/styles/landing.css \
  /Volumes/zodlightning/sites/diagrammatic/src/styles/app.css
```

Expected: no matches. If any appear, replace with the corresponding `var(--token)` from `base.css`.

- [ ] **Step 3: Verify vercel.json**

```bash
cat /Volumes/zodlightning/sites/diagrammatic/vercel.json
```

Expected:
```json
{
  "rewrites": [
    { "source": "/", "destination": "/src/landing.html" },
    { "source": "/app", "destination": "/src/index.html" }
  ]
}
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git status
git commit -m "chore: remove stub styles.css, finalize file structure"
```

---

## Spec Coverage

| Requirement | Task |
|-------------|------|
| Option B split architecture | Tasks 1–9 |
| vercel.json `/` and `/app` rewrites | Task 1 |
| base.css token strategy | Task 2 |
| 6 presets with correct sample data | Task 3 |
| Prioritization Matrix quadrant positions | Task 3 (`PRESETS.prioritization`) |
| app.css tokens-only | Task 4 |
| Dot-grid canvas background | Task 4 |
| Toast replaces alert | Tasks 3 + 4 |
| index.html preset dropdowns | Task 5 |
| landing.css tokens-only | Task 6 |
| Scroll animations + header blur | Task 7 |
| All 8 landing sections | Task 8 |
| Founding Member amber badge | Task 8 |
| Pro card teal border + badge | Task 8 |
| oninput real-time updates | Task 3 |
