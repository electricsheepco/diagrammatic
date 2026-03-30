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
  { id: 'timeline',   name: 'Timeline', boxes: 3 },
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
          <input type="number" value="${pt.x}" min="0" max="100" oninput="updateMatrixPoint(${i},'x',parseInt(this.value)||0)">
        </div>
        <div class="form-group">
          <label>Y (0–100)</label>
          <input type="number" value="${pt.y}" min="0" max="100" oninput="updateMatrixPoint(${i},'y',parseInt(this.value)||0)">
        </div>
      </div>
      <div class="form-group">
        <label>Size</label>
        <input type="number" value="${pt.size}" min="20" max="80" oninput="updateMatrixPoint(${i},'size',parseInt(this.value)||20)">
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
  navigator.clipboard.writeText(svg)
    .then(() => showToast('SVG copied to clipboard'))
    .catch(() => showToast('Copy failed — try a different browser'));
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
  img.onerror = function () {
    URL.revokeObjectURL(url);
    showToast('Export failed — SVG could not be rendered');
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
