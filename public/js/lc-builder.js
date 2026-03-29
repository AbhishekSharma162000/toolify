/* ========================
   STATE
   ======================== */
let selectedElement = null;
let draggedWrapper = null;
let currentColorTarget = null;
let currentColorProp = null;
let isPreviewMode = false;
let history = [];
let historyIndex = -1;
let gridOn = false;
let countdownInterval = null;

function clearInsertIndicators() {
  document.querySelectorAll('.insert-above,.insert-below').forEach(el => {
    el.classList.remove('insert-above','insert-below');
  });
}

/* ========================
   INIT
   ======================== */
function lcBuilderInit() {
  document.getElementById('canvas').classList.add('edit-mode');
  document.getElementById('modeEdit').classList.add('active');
  initDragFromSidebar();
  initCanvas();
  renderTemplatesGrid();
  initCountdown();
  setupClickOutside();
  saveHistory();
}
// Run immediately if DOM is ready (scripts load after Vue mounts), else wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', lcBuilderInit);
} else {
  lcBuilderInit();
}

/* ========================
   DRAG FROM SIDEBAR
   ======================== */
function initDragFromSidebar() {
  document.querySelectorAll('.comp-item').forEach(item => {
    item.addEventListener('dragstart', e => {
      e.dataTransfer.setData('blockType', item.dataset.type);
      e.dataTransfer.effectAllowed = 'copy';
    });
  });
}

/* ========================
   CANVAS SETUP
   ======================== */
function initCanvas() {
  const canvas = document.getElementById('canvas');

  canvas.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    canvas.classList.add('drag-over');
    // highlight nearest drop zone
    const dz = nearestDropZone(e.clientY);
    document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drag-over'));
    if (dz) dz.classList.add('drag-over');
  });

  canvas.addEventListener('dragleave', e => {
    if (!canvas.contains(e.relatedTarget)) {
      canvas.classList.remove('drag-over');
      document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drag-over'));
    }
  });

  canvas.addEventListener('drop', e => {
    e.preventDefault();
    canvas.classList.remove('drag-over');
    document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drag-over'));

    const type = e.dataTransfer.getData('blockType');
    if (!type) return;

    hideEmpty();

    const dz = nearestDropZone(e.clientY);
    const html = createBlock(type);
    const wrapper = makeElementWrapper(type, html);

    if (dz) {
      dz.parentNode.insertBefore(wrapper, dz.nextSibling);
    } else {
      canvas.appendChild(wrapper);
    }
    insertDropZonesAround(wrapper);
    attachElementEvents(wrapper);
    selectElement(wrapper);
    saveHistory();
  });
}

function nearestDropZone(clientY) {
  const zones = [...document.querySelectorAll('.drop-zone')];
  if (!zones.length) return null;
  let closest = null, closestDist = Infinity;
  zones.forEach(z => {
    const rect = z.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    const dist = Math.abs(clientY - mid);
    if (dist < closestDist) { closestDist = dist; closest = z; }
  });
  return closest;
}

function createBlock(type) {
  if (BLOCK_GENERATORS[type]) return BLOCK_GENERATORS[type]();
  return `<div class="lc-section canvas-element" data-type="${type}"><p style="padding:20px;color:#aaa;text-align:center;">${type} block</p></div>`;
}

function makeElementWrapper(type, innerHtml) {
  const div = document.createElement('div');
  div.className = 'element-wrapper';
  div.dataset.type = type;
  div.innerHTML = innerHtml;
  return div;
}

function insertDropZonesAround(wrapper) {
  const canvas = document.getElementById('canvas');
  // Insert before
  if (!wrapper.previousSibling || !wrapper.previousSibling.classList?.contains('drop-zone')) {
    const dz = document.createElement('div');
    dz.className = 'drop-zone';
    canvas.insertBefore(dz, wrapper);
  }
  // Insert after
  if (!wrapper.nextSibling || !wrapper.nextSibling.classList?.contains('drop-zone')) {
    const dz = document.createElement('div');
    dz.className = 'drop-zone';
    canvas.insertBefore(dz, wrapper.nextSibling);
  }
}

function attachElementEvents(wrapper) {
  const el = wrapper.querySelector('.canvas-element') || wrapper;

  // Add toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'el-toolbar';
  const type = wrapper.dataset.type || el.dataset.type || 'block';
  toolbar.innerHTML = `
    <span class="drag-handle" title="Drag to reorder">⠿</span>
    <span class="el-label">${type}</span>
    <button onclick="moveElementUp(this)" title="Move Up"><i class="fa fa-arrow-up"></i></button>
    <button onclick="moveElementDown(this)" title="Move Down"><i class="fa fa-arrow-down"></i></button>
    <button onclick="duplicateElement(this)" title="Duplicate"><i class="fa fa-copy"></i></button>
    <button onclick="deleteElement(this)" title="Delete" style="color:#ff7070"><i class="fa fa-trash"></i></button>
  `;
  wrapper.style.position = 'relative';
  wrapper.insertBefore(toolbar, wrapper.firstChild);

  // Click to select
  wrapper.addEventListener('click', e => {
    if (e.target.closest('.el-toolbar')) return;
    if (isPreviewMode) return;
    selectElement(wrapper);
    e.stopPropagation();
  });

  // Double-click to edit inline — works on ANY text-bearing element
  wrapper.addEventListener('dblclick', e => {
    if (isPreviewMode) return;
    // Walk up from target to find the best editable node
    let target = e.target;
    // Skip toolbar, wrapper itself, and structural containers
    if (target.closest('.el-toolbar')) return;
    const SKIP = ['element-wrapper','el-toolbar','canvas-element','features-grid',
      'pricing-grid','testimonial-grid','stats-grid','team-grid','footer-grid',
      'countdown-timer','email-capture-form','contact-form','newsletter-form',
      'logo-strip-items','faq-item','lc-two-col','lc-three-col'];
    // Find the deepest element with direct text content
    const findEditable = (el) => {
      if (!el || el === wrapper) return null;
      const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      const tag = el.tagName;
      const skip = SKIP.some(c => el.classList.contains(c));
      if (!skip && hasText) return el;
      // Allow these tags even if no direct text child
      if (['H1','H2','H3','H4','P','A','BUTTON','SPAN','LI','BLOCKQUOTE','STRONG','EM','DIV'].includes(tag) && !skip) {
        const txt = el.textContent.trim();
        if (txt && txt.length < 400) return el;
      }
      return findEditable(el.parentElement);
    };
    const editable = findEditable(target);
    if (editable && editable !== wrapper) {
      // Temporarily suspend wrapper drag while editing
      wrapper.draggable = false;
      editable.contentEditable = 'true';
      editable.classList.add('lc-editing');
      editable.focus();
      // Place cursor at click position
      try {
        const range = document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : null;
        if (range) { const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range); }
      } catch(_) {}
      const finish = () => {
        editable.contentEditable = 'false';
        editable.classList.remove('lc-editing');
        wrapper.draggable = true;
        saveHistory();
      };
      editable.addEventListener('blur', finish, { once: true });
      editable.addEventListener('keydown', ev => {
        if (ev.key === 'Escape') { editable.blur(); }
        // Allow Enter for multi-line, Shift+Enter for line break
        ev.stopPropagation();
      });
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // ---- DRAG TO REORDER ----
  wrapper.draggable = true;
  // Track what was mousedown'd — dragstart e.target is always the wrapper, not the child
  let _mousedownTarget = null;
  wrapper.addEventListener('mousedown', e => { _mousedownTarget = e.target; });

  wrapper.addEventListener('dragstart', e => {
    // Allow drag only when mousedown was on toolbar or drag-handle
    const fromToolbar = _mousedownTarget && (
      _mousedownTarget.closest('.el-toolbar') ||
      _mousedownTarget.classList.contains('drag-handle')
    );
    if (!fromToolbar) { e.preventDefault(); return; }
    // Block drag while editing text
    if (document.querySelector('[contenteditable="true"]')) { e.preventDefault(); return; }
    draggedWrapper = wrapper;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('reorderEl', '1');
    setTimeout(() => { wrapper.classList.add('dragging-section'); }, 0);
  });

  wrapper.addEventListener('dragend', () => {
    wrapper.classList.remove('dragging-section');
    clearInsertIndicators();
    draggedWrapper = null;
    saveHistory();
  });

  wrapper.addEventListener('dragover', e => {
    e.preventDefault();
    if (!draggedWrapper || draggedWrapper === wrapper) return;
    // Determine top vs bottom half
    const rect = wrapper.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    clearInsertIndicators();
    if (e.clientY < mid) {
      wrapper.classList.add('insert-above');
    } else {
      wrapper.classList.add('insert-below');
    }
  });

  wrapper.addEventListener('dragleave', e => {
    if (!wrapper.contains(e.relatedTarget)) {
      wrapper.classList.remove('insert-above', 'insert-below');
    }
  });

  wrapper.addEventListener('drop', e => {
    e.preventDefault(); e.stopPropagation();
    wrapper.classList.remove('insert-above', 'insert-below');

    // Handle new component dropped from sidebar
    const srcType = e.dataTransfer.getData('blockType');
    if (srcType) {
      hideEmpty();
      const html = createBlock(srcType);
      const newWrapper = makeElementWrapper(srcType, html);
      wrapper.parentNode.insertBefore(newWrapper, wrapper);
      insertDropZonesAround(newWrapper);
      attachElementEvents(newWrapper);
      selectElement(newWrapper);
      saveHistory();
      return;
    }

    // Handle section reorder
    if (!draggedWrapper || draggedWrapper === wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    const canvas = document.getElementById('canvas');
    if (e.clientY < mid) {
      canvas.insertBefore(draggedWrapper, wrapper);
    } else {
      canvas.insertBefore(draggedWrapper, wrapper.nextSibling);
    }
    saveHistory();
  });
}

/* ========================
   ELEMENT ACTIONS
   ======================== */
function selectElement(wrapper) {
  document.querySelectorAll('.element-wrapper').forEach(w => w.classList.remove('selected'));
  wrapper.classList.add('selected');
  selectedElement = wrapper;
  const type = wrapper.dataset.type;
  renderPropertiesPanel(type, wrapper);
}

function deleteElement(btn) {
  const wrapper = btn.closest('.element-wrapper');
  // Remove adjacent drop zones
  if (wrapper.previousSibling?.classList?.contains('drop-zone')) wrapper.previousSibling.remove();
  wrapper.remove();
  selectedElement = null;
  document.getElementById('propertiesPanel').innerHTML = `<div class="no-selection"><i class="fa fa-mouse-pointer"></i><p>Click an element to edit its properties</p></div>`;
  if (!document.querySelector('.element-wrapper')) showEmpty();
  saveHistory();
}

function duplicateElement(btn) {
  const wrapper = btn.closest('.element-wrapper');
  const clone = wrapper.cloneNode(true);
  // Re-attach events (remove old toolbar, re-add)
  clone.querySelector('.el-toolbar')?.remove();
  wrapper.parentNode.insertBefore(clone, wrapper.nextSibling);
  insertDropZonesAround(clone);
  attachElementEvents(clone);
  selectElement(clone);
  saveHistory();
  showToast('Element duplicated', 'success');
}

function moveElementUp(btn) {
  const wrapper = btn.closest('.element-wrapper');
  const canvas = document.getElementById('canvas');
  const siblings = [...canvas.children].filter(c => c.classList.contains('element-wrapper'));
  const idx = siblings.indexOf(wrapper);
  if (idx > 0) {
    const prev = siblings[idx - 1];
    canvas.insertBefore(wrapper, prev);
    saveHistory();
  }
}

function moveElementDown(btn) {
  const wrapper = btn.closest('.element-wrapper');
  const canvas = document.getElementById('canvas');
  const siblings = [...canvas.children].filter(c => c.classList.contains('element-wrapper'));
  const idx = siblings.indexOf(wrapper);
  if (idx < siblings.length - 1) {
    const next = siblings[idx + 1];
    canvas.insertBefore(next, wrapper);
    saveHistory();
  }
}

/* ========================
   PROPERTIES PANEL
   ======================== */
function renderPropertiesPanel(type, wrapper) {
  const panel = document.getElementById('propertiesPanel');
  const el = wrapper.querySelector('.canvas-element') || wrapper;

  let html = '';

  // --- Common style section ---
  const bg = el.style.backgroundColor || '';
  const pad = parseInt(el.style.padding) || '';
  const mar = parseInt(el.style.marginBottom) || '';
  const opacity = el.style.opacity || '1';
  const borderRadius = el.style.borderRadius || '';

  html += `
  <div class="prop-section">
    <div class="prop-section-title">Background</div>
    <div class="prop-row">
      <label class="prop-label">Background Color</label>
      <div class="prop-color-row">
        <div class="prop-color-swatch" id="bgSwatch" style="background:${bg||'#ffffff'}" onclick="openColorPicker('bg', '${bg||'#ffffff'}')"></div>
        <input class="prop-input" id="bgColorInput" value="${bg||''}" placeholder="#ffffff or transparent" oninput="applyBgColor(this.value)">
      </div>
    </div>
    <div class="prop-row">
      <label class="prop-label">Background Gradient</label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        <div class="prop-color-swatch" style="background:${el.style.background||'#6c63ff'};width:100%;border-radius:6px;" onclick="openColorPicker('gradFrom', '#6c63ff')"></div>
        <div class="prop-color-swatch" style="background:${el.style.background||'#a855f7'};width:100%;border-radius:6px;" onclick="openColorPicker('gradTo', '#a855f7')"></div>
      </div>
      <button class="prop-btn" style="margin-top:6px;" onclick="applyGradient()">Apply Gradient</button>
    </div>
  </div>

  <div class="prop-section">
    <div class="prop-section-title">Spacing</div>
    <div class="prop-row">
      <label class="prop-label">Padding (px): <span class="prop-range-val" id="padVal">${pad||40}</span></label>
      <input type="range" class="prop-range" min="0" max="120" value="${pad||40}" oninput="document.getElementById('padVal').textContent=this.value;applyStyleProp('padding',this.value+'px')">
    </div>
    <div class="prop-row">
      <label class="prop-label">Margin Bottom (px): <span class="prop-range-val" id="marVal">${mar||0}</span></label>
      <input type="range" class="prop-range" min="0" max="100" value="${mar||0}" oninput="document.getElementById('marVal').textContent=this.value;applyStyleProp('marginBottom',this.value+'px')">
    </div>
    <div class="prop-row">
      <label class="prop-label">Border Radius (px): <span class="prop-range-val" id="radVal">${parseInt(borderRadius)||0}</span></label>
      <input type="range" class="prop-range" min="0" max="50" value="${parseInt(borderRadius)||0}" oninput="document.getElementById('radVal').textContent=this.value;applyStyleProp('borderRadius',this.value+'px')">
    </div>
  </div>

  <div class="prop-section">
    <div class="prop-section-title">Opacity & Visibility</div>
    <div class="prop-row">
      <label class="prop-label">Opacity: <span class="prop-range-val" id="opacVal">${parseFloat(opacity)*100|0}%</span></label>
      <input type="range" class="prop-range" min="10" max="100" value="${parseFloat(opacity)*100|0}" oninput="document.getElementById('opacVal').textContent=this.value+'%';applyStyleProp('opacity',this.value/100)">
    </div>
  </div>

  <div class="prop-section">
    <div class="prop-section-title">Border</div>
    <div class="prop-row">
      <label class="prop-label">Border Style</label>
      <select class="prop-select" onchange="applyBorder(this.value)">
        <option value="none">None</option>
        <option value="solid">Solid</option>
        <option value="dashed">Dashed</option>
        <option value="dotted">Dotted</option>
      </select>
    </div>
    <div class="prop-row">
      <label class="prop-label">Border Width & Color</label>
      <div class="prop-row-inline">
        <input type="number" class="prop-input" min="1" max="10" value="1" id="borderWidth" style="width:60px;">
        <div class="prop-color-swatch" style="background:#6c63ff;" onclick="openColorPicker('border', '#6c63ff')"></div>
        <button class="prop-btn" onclick="applyBorderFull()">Apply</button>
      </div>
    </div>
  </div>`;

  // --- Text section for text-heavy blocks ---
  if (['heading','subheading','paragraph','hero','cta','badge','quote','bullet-list'].includes(type)) {
    const h = el.querySelector('h1,h2,h3');
    const p = el.querySelector('p');
    const textColor = h?.style.color || p?.style.color || '';
    const fontSize = h?.style.fontSize || '';
    const align = el.style.textAlign || 'left';

    html += `
    <div class="prop-section">
      <div class="prop-section-title">Text</div>
      <div class="prop-row">
        <label class="prop-label">Text Color</label>
        <div class="prop-color-row">
          <div class="prop-color-swatch" style="background:${textColor||'#1a1d27'}" onclick="openColorPicker('textColor', '${textColor||'#1a1d27'}')"></div>
          <input class="prop-input" id="textColorInput" value="${textColor||''}" placeholder="#1a1d27" oninput="applyTextColor(this.value)">
        </div>
      </div>
      <div class="prop-row">
        <label class="prop-label">Text Align</label>
        <div class="prop-row-inline">
          <button class="prop-btn ${align==='left'?'active':''}" onclick="applyTextAlign('left',this)"><i class="fa fa-align-left"></i></button>
          <button class="prop-btn ${align==='center'?'active':''}" onclick="applyTextAlign('center',this)"><i class="fa fa-align-center"></i></button>
          <button class="prop-btn ${align==='right'?'active':''}" onclick="applyTextAlign('right',this)"><i class="fa fa-align-right"></i></button>
        </div>
      </div>
    </div>`;
  }

  // --- Image block ---
  if (type === 'image') {
    const img = el.querySelector('img');
    html += `
    <div class="prop-section">
      <div class="prop-section-title">Image</div>
      <div class="prop-row">
        <label class="prop-label">Image URL</label>
        <input class="prop-input" id="imgUrlInput" value="${img?.src||''}" placeholder="https://...">
      </div>
      <div class="prop-row">
        <label class="prop-label">Alt Text</label>
        <input class="prop-input" id="imgAltInput" value="${img?.alt||''}" placeholder="Image description">
      </div>
      <button class="apply-btn" onclick="applyImageProps()">Update Image</button>
    </div>`;
  }

  // --- Video block ---
  if (type === 'video') {
    html += `
    <div class="prop-section">
      <div class="prop-section-title">Video</div>
      <div class="prop-row">
        <label class="prop-label">YouTube / Vimeo URL</label>
        <input class="prop-input" id="videoUrlInput" placeholder="https://youtube.com/watch?v=...">
      </div>
      <button class="apply-btn" onclick="applyVideoProps()">Embed Video</button>
    </div>`;
  }

  // --- Button block ---
  if (type === 'button') {
    const a = el.querySelector('a');
    html += `
    <div class="prop-section">
      <div class="prop-section-title">Button</div>
      <div class="prop-row">
        <label class="prop-label">Button Label</label>
        <input class="prop-input" id="btnLabel" value="${a?.textContent||'Get Started'}">
      </div>
      <div class="prop-row">
        <label class="prop-label">Button URL</label>
        <input class="prop-input" id="btnUrl" value="${a?.href||'#'}" placeholder="https://...">
      </div>
      <div class="prop-row">
        <label class="prop-label">Button Style</label>
        <select class="prop-select" id="btnStyle">
          <option value="solid">Solid (Gradient)</option>
          <option value="outline">Outline</option>
          <option value="ghost">Ghost</option>
        </select>
      </div>
      <button class="apply-btn" onclick="applyButtonProps()">Update Button</button>
    </div>`;
  }

  // --- Spacer block ---
  if (type === 'spacer') {
    const h = parseInt(el.style.height) || 60;
    html += `
    <div class="prop-section">
      <div class="prop-section-title">Spacer</div>
      <div class="prop-row">
        <label class="prop-label">Height (px): <span class="prop-range-val" id="spacerVal">${h}</span></label>
        <input type="range" class="prop-range" min="10" max="300" value="${h}" oninput="document.getElementById('spacerVal').textContent=this.value;applyStyleProp('height',this.value+'px')">
      </div>
    </div>`;
  }

  // --- Countdown ---
  if (type === 'countdown') {
    html += `
    <div class="prop-section">
      <div class="prop-section-title">Countdown Target Date</div>
      <div class="prop-row">
        <label class="prop-label">End Date & Time</label>
        <input type="datetime-local" class="prop-input" id="countdownDate" onchange="setCountdownTarget(this.value)">
      </div>
    </div>`;
  }

  // --- Icon block ---
  if (type === 'icon') {
    html += `
    <div class="prop-section">
      <div class="prop-section-title">Icon</div>
      <div class="prop-row">
        <label class="prop-label">Icon Class (Font Awesome)</label>
        <input class="prop-input" id="iconClass" placeholder="fa fa-star" value="${el.querySelector('i')?.className||'fa fa-star'}">
      </div>
      <div class="prop-row">
        <label class="prop-label">Icon Size (rem): <span class="prop-range-val" id="iconSizeVal">3</span></label>
        <input type="range" class="prop-range" min="1" max="8" value="3" step="0.5" oninput="document.getElementById('iconSizeVal').textContent=this.value;applyIconSize(this.value)">
      </div>
      <div class="prop-row">
        <label class="prop-label">Icon Color</label>
        <div class="prop-color-row">
          <div class="prop-color-swatch" style="background:#6c63ff;" onclick="openColorPicker('iconColor','#6c63ff')"></div>
          <input class="prop-input" id="iconColorInput" value="#6c63ff" oninput="applyIconColor(this.value)">
        </div>
      </div>
      <button class="apply-btn" onclick="applyIconProps()">Update Icon</button>
    </div>`;
  }

  // --- FAQ block ---
  if (type === 'faq') {
    html += `
    <div class="prop-section">
      <div class="prop-section-title">FAQ Items</div>
      <div class="prop-row">
        <p style="font-size:0.78rem;color:var(--text-muted);line-height:1.5;">Double-click any question or answer text to edit it directly on the canvas.</p>
      </div>
      <button class="apply-btn" onclick="addFaqItem()">+ Add FAQ Item</button>
      <button class="apply-btn" style="background:var(--lc-surface2);border:1px solid var(--lc-border);color:var(--lc-text);margin-top:4px;" onclick="removeFaqItem()">− Remove Last Item</button>
    </div>`;
  }

  // --- Custom CSS ---
  html += `
  <div class="prop-section">
    <div class="prop-section-title">Custom CSS</div>
    <div class="prop-row">
      <label class="prop-label">Inline Styles</label>
      <textarea class="prop-textarea" id="customCssInput" placeholder="color: red; font-size: 18px;">${el.getAttribute('style')||''}</textarea>
    </div>
    <button class="apply-btn" onclick="applyCustomCss()">Apply CSS</button>
  </div>`;

  panel.innerHTML = html;
}

/* ========================
   STYLE APPLY HELPERS
   ======================== */
function getSelectedEl() {
  if (!selectedElement) return null;
  return selectedElement.querySelector('.canvas-element') || selectedElement;
}

function applyStyleProp(prop, value) {
  const el = getSelectedEl(); if (!el) return;
  el.style[prop] = value;
}

function applyBgColor(value) {
  const el = getSelectedEl(); if (!el) return;
  el.style.backgroundColor = value;
  const sw = document.getElementById('bgSwatch');
  if (sw) sw.style.background = value;
}

function applyTextColor(value) {
  const el = getSelectedEl(); if (!el) return;
  el.querySelectorAll('h1,h2,h3,p,span,li,blockquote').forEach(t => t.style.color = value);
}

function applyTextAlign(value, btn) {
  const el = getSelectedEl(); if (!el) return;
  el.style.textAlign = value;
  btn.closest('.prop-row-inline').querySelectorAll('.prop-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function applyBorder(style) {
  const el = getSelectedEl(); if (!el) return;
  if (style === 'none') { el.style.border = 'none'; return; }
  const w = document.getElementById('borderWidth')?.value || 1;
  el.style.borderStyle = style;
  el.style.borderWidth = w + 'px';
}

function applyBorderFull() {
  const el = getSelectedEl(); if (!el) return;
  const w = document.getElementById('borderWidth')?.value || 1;
  const style = el.style.borderStyle || 'solid';
  el.style.border = `${w}px ${style} ${currentBorderColor || '#6c63ff'}`;
}

let gradFrom = '#6c63ff', gradTo = '#a855f7', currentBorderColor = '#6c63ff';

function applyGradient() {
  const el = getSelectedEl(); if (!el) return;
  el.style.background = `linear-gradient(135deg, ${gradFrom}, ${gradTo})`;
  el.style.backgroundColor = '';
  saveHistory();
}

function applyImageProps() {
  const el = getSelectedEl(); if (!el) return;
  const img = el.querySelector('img');
  if (!img) return;
  img.src = document.getElementById('imgUrlInput')?.value || img.src;
  img.alt = document.getElementById('imgAltInput')?.value || img.alt;
  saveHistory();
}

function applyVideoProps() {
  const el = getSelectedEl(); if (!el) return;
  const url = document.getElementById('videoUrlInput')?.value || '';
  let embedUrl = url;
  if (url.includes('youtube.com/watch?v=')) {
    const id = new URLSearchParams(url.split('?')[1]).get('v');
    embedUrl = `https://www.youtube.com/embed/${id}`;
  } else if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1].split('?')[0];
    embedUrl = `https://www.youtube.com/embed/${id}`;
  } else if (url.includes('vimeo.com/')) {
    const id = url.split('vimeo.com/')[1];
    embedUrl = `https://player.vimeo.com/video/${id}`;
  }
  el.innerHTML = `<iframe src="${embedUrl}" style="width:100%;aspect-ratio:16/9;border:none;border-radius:12px;" allowfullscreen></iframe>`;
  saveHistory();
}

function applyButtonProps() {
  const el = getSelectedEl(); if (!el) return;
  const a = el.querySelector('a');
  if (!a) return;
  a.textContent = document.getElementById('btnLabel')?.value || a.textContent;
  a.href = document.getElementById('btnUrl')?.value || '#';
  const style = document.getElementById('btnStyle')?.value || 'solid';
  if (style === 'solid') {
    a.style.cssText = 'display:inline-block;background:linear-gradient(135deg,#6c63ff,#a855f7);color:#fff;padding:13px 32px;border-radius:50px;font-weight:700;text-decoration:none;font-size:0.97rem;';
  } else if (style === 'outline') {
    a.style.cssText = 'display:inline-block;background:transparent;border:2px solid #6c63ff;color:#6c63ff;padding:11px 30px;border-radius:50px;font-weight:700;text-decoration:none;font-size:0.97rem;';
  } else {
    a.style.cssText = 'display:inline-block;background:transparent;color:#6c63ff;padding:13px 32px;border-radius:50px;font-weight:700;text-decoration:none;font-size:0.97rem;text-decoration:underline;';
  }
  saveHistory();
}

function applyIconProps() {
  const el = getSelectedEl(); if (!el) return;
  const i = el.querySelector('i');
  if (!i) return;
  const cls = document.getElementById('iconClass')?.value || 'fa fa-star';
  i.className = cls;
  saveHistory();
}

function applyIconSize(val) {
  const el = getSelectedEl(); if (!el) return;
  const i = el.querySelector('i');
  if (i) i.style.fontSize = val + 'rem';
}

function applyIconColor(val) {
  const el = getSelectedEl(); if (!el) return;
  const i = el.querySelector('i');
  if (i) i.style.color = val;
}

function applyCustomCss() {
  const el = getSelectedEl(); if (!el) return;
  el.setAttribute('style', document.getElementById('customCssInput')?.value || '');
  saveHistory();
  showToast('Custom CSS applied', 'success');
}

/* ========================
   COLOR PICKER
   ======================== */
const PRESET_COLORS = [
  '#ffffff','#f8f9fa','#e9ecef','#dee2e6','#1a1d27','#212529','#343a40',
  '#6c63ff','#a855f7','#3b82f6','#0ea5e9','#10b981','#43e97b','#f59e0b',
  '#ef4444','#ff6584','#ec4899','#ff9a9e','#38f9d7','#f0f4ff','#fafbff'
];

function openColorPicker(target, currentColor) {
  currentColorTarget = target;
  const overlay = document.getElementById('colorPickerOverlay');
  const presets = document.getElementById('presetColors');
  const input = document.getElementById('customColorInput');
  presets.innerHTML = PRESET_COLORS.map(c =>
    `<div style="background:${c};" onclick="pickPresetColor('${c}')"></div>`
  ).join('');
  input.value = currentColor || '#ffffff';
  overlay.style.display = 'flex';
}

function pickPresetColor(color) {
  document.getElementById('customColorInput').value = color;
}

function applyColor() {
  const color = document.getElementById('customColorInput').value;
  document.getElementById('colorPickerOverlay').style.display = 'none';
  const el = getSelectedEl(); if (!el) return;

  if (currentColorTarget === 'bg') {
    el.style.backgroundColor = color;
    const sw = document.getElementById('bgSwatch');
    if (sw) sw.style.background = color;
    const inp = document.getElementById('bgColorInput');
    if (inp) inp.value = color;
  } else if (currentColorTarget === 'textColor') {
    el.querySelectorAll('h1,h2,h3,p,span,li,blockquote').forEach(t => t.style.color = color);
    const sw = document.querySelector('#propertiesPanel .prop-color-swatch');
    if (sw) sw.style.background = color;
    const inp = document.getElementById('textColorInput');
    if (inp) inp.value = color;
  } else if (currentColorTarget === 'gradFrom') {
    gradFrom = color;
  } else if (currentColorTarget === 'gradTo') {
    gradTo = color;
  } else if (currentColorTarget === 'border') {
    currentBorderColor = color;
    el.style.borderColor = color;
  } else if (currentColorTarget === 'iconColor') {
    const i = el.querySelector('i');
    if (i) i.style.color = color;
    const inp = document.getElementById('iconColorInput');
    if (inp) inp.value = color;
  }
  saveHistory();
}

/* ========================
   COUNTDOWN TIMER
   ======================== */
let countdownTarget = null;

function setCountdownTarget(val) {
  countdownTarget = new Date(val);
}

function initCountdown() {
  countdownInterval = setInterval(() => {
    const target = countdownTarget || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000);
    const diff = target - Date.now();
    if (diff <= 0) return;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const d = document.getElementById('cd-days');
    const h = document.getElementById('cd-hours');
    const m = document.getElementById('cd-mins');
    const s = document.getElementById('cd-secs');
    if (d) d.textContent = String(days).padStart(2,'0');
    if (h) h.textContent = String(hours).padStart(2,'0');
    if (m) m.textContent = String(mins).padStart(2,'0');
    if (s) s.textContent = String(secs).padStart(2,'0');
  }, 1000);
}

/* ========================
   CANVAS SIZE
   ======================== */
function setCanvasSize(size) {
  const canvas = document.getElementById('canvas');
  const label = document.getElementById('canvasDimLabel');
  canvas.className = 'canvas';
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  if (size === 'desktop') {
    canvas.classList.add('desktop-canvas');
    label.textContent = '1200px';
    event.currentTarget.classList.add('active');
  } else if (size === 'tablet') {
    canvas.classList.add('tablet-canvas');
    label.textContent = '768px';
    event.currentTarget.classList.add('active');
  } else {
    canvas.classList.add('mobile-canvas');
    label.textContent = '390px';
    event.currentTarget.classList.add('active');
  }
  if (gridOn) canvas.classList.add('grid-on');
}

function toggleGrid() {
  gridOn = !gridOn;
  document.getElementById('canvas').classList.toggle('grid-on', gridOn);
  // Visual feedback on the toolbar button
  const gridBtn = document.getElementById('gridBtn');
  if (gridBtn) gridBtn.classList.toggle('active', gridOn);
}

/* ========================
   MODES
   ======================== */
function setMode(mode) {
  isPreviewMode = mode === 'preview';
  const canvas = document.getElementById('canvas');
  canvas.classList.toggle('edit-mode', !isPreviewMode);
  canvas.classList.toggle('preview-mode', isPreviewMode);
  document.getElementById('modeEdit').classList.toggle('active', !isPreviewMode);
  document.getElementById('modePreview').classList.toggle('active', isPreviewMode);

  if (isPreviewMode) {
    document.querySelectorAll('.element-wrapper').forEach(w => w.classList.remove('selected'));
    selectedElement = null;
    document.getElementById('propertiesPanel').innerHTML = `<div class="no-selection"><i class="fa fa-eye"></i><p>Preview mode active. Switch to Edit to make changes.</p></div>`;
  }
}

/* ========================
   UNDO / REDO
   ======================== */
function saveHistory() {
  const canvas = document.getElementById('canvas');
  const snapshot = canvas.innerHTML;
  history = history.slice(0, historyIndex + 1);
  history.push(snapshot);
  historyIndex++;
  if (history.length > 50) { history.shift(); historyIndex--; }
}

function undoAction() {
  if (historyIndex <= 0) return showToast('Nothing to undo', 'error');
  historyIndex--;
  restoreHistory();
  showToast('Undone', 'success');
}

function redoAction() {
  if (historyIndex >= history.length - 1) return showToast('Nothing to redo', 'error');
  historyIndex++;
  restoreHistory();
  showToast('Redone', 'success');
}

function restoreHistory() {
  const canvas = document.getElementById('canvas');
  canvas.innerHTML = history[historyIndex];
  reattachAll();
  const hasElements = canvas.querySelector('.element-wrapper');
  if (!hasElements) showEmpty(); else hideEmpty();
}

function reattachAll() {
  document.querySelectorAll('.element-wrapper').forEach(w => {
    // Remove old toolbar if present, re-attach
    const oldTb = w.querySelector('.el-toolbar');
    if (oldTb) oldTb.remove();
    attachElementEvents(w);
  });
}

/* ========================
   TEMPLATES
   ======================== */
function renderTemplatesGrid(category = 'all') {
  const grid = document.getElementById('templatesGrid');
  if (!grid) return;
  const filtered = category === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === category);
  grid.innerHTML = filtered.map(t => `
    <div class="template-card" onclick="loadTemplate('${t.id}')">
      <div class="template-preview" style="--preview-from:${t.colors[0]};--preview-to:${t.colors[1]};">
        <div class="preview-label">
          <span style="font-size:2.5rem;">${t.icon}</span>
          <span>${t.name}</span>
          <small>${t.blocks.length} sections</small>
        </div>
      </div>
      <div class="template-info">
        <h3>${t.name}</h3>
        <p>${t.desc}</p>
        <div class="template-tag">${t.category}</div>
      </div>
    </div>
  `).join('');
}

function filterTemplates(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTemplatesGrid(cat);
}

function loadTemplate(id) {
  const t = TEMPLATES.find(t => t.id === id);
  if (!t) return;
  clearCanvasSilent();
  t.blocks.forEach(type => {
    const html = createBlock(type);
    const wrapper = makeElementWrapper(type, html);
    document.getElementById('canvas').appendChild(wrapper);
    insertDropZonesAround(wrapper);
    attachElementEvents(wrapper);
  });
  hideEmpty();
  closeModal('templatesModal');
  saveHistory();
  showToast(`Template "${t.name}" loaded!`, 'success');
}

/* ========================
   EXPORT
   ======================== */
function getPageHTML() {
  const title = document.getElementById('exportTitle')?.value || 'My Landing Page';
  const meta = document.getElementById('exportMeta')?.value || '';

  // Clone canvas and strip builder UI
  const canvas = document.getElementById('canvas');
  const clone = canvas.cloneNode(true);
  clone.querySelectorAll('.el-toolbar, .drop-zone').forEach(el => el.remove());
  clone.querySelectorAll('.element-wrapper').forEach(w => {
    w.removeAttribute('draggable');
    w.style.position = '';
  });
  clone.querySelectorAll('.canvas-element').forEach(el => {
    el.classList.remove('selected');
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
${meta ? `<meta name="description" content="${meta}">` : ''}
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; }
  :root { --accent: #6c63ff; }
  /* Paste full CSS here */
  ${getExportCSS()}
</style>
</head>
<body>
${clone.innerHTML}
<script>
  // FAQ toggles
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', function() {
      this.classList.toggle('open');
      this.nextElementSibling.classList.toggle('open');
    });
  });
  // Countdown
  (function() {
    const target = new Date(Date.now() + 3*24*60*60*1000);
    setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      const pad = n => String(Math.floor(n)).padStart(2,'0');
      const d = document.getElementById('cd-days'), h = document.getElementById('cd-hours'),
            m = document.getElementById('cd-mins'), s = document.getElementById('cd-secs');
      if(d) d.textContent = pad(diff/86400000);
      if(h) h.textContent = pad((diff%86400000)/3600000);
      if(m) m.textContent = pad((diff%3600000)/60000);
      if(s) s.textContent = pad((diff%60000)/1000);
    }, 1000);
  })();
<\/script>
</body>
</html>`;
}

function getExportCSS() {
  // Inline critical component CSS for standalone export
  return `
  .lc-navbar{padding:16px 40px;background:#fff;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #eee;position:sticky;top:0;z-index:10;}
  .lc-navbar .nav-brand{font-size:1.3rem;font-weight:800;color:#6c63ff;}
  .lc-navbar .nav-links{display:flex;gap:28px;list-style:none;}
  .lc-navbar .nav-links a{text-decoration:none;color:#444;font-size:.92rem;font-weight:500;}
  .lc-navbar .nav-cta{background:#6c63ff;color:#fff;padding:9px 22px;border-radius:50px;border:none;font-weight:700;cursor:pointer;}
  .lc-hero{padding:80px 40px;text-align:center;background:linear-gradient(135deg,#6c63ff 0%,#a855f7 100%);color:#fff;}
  .lc-hero h1{font-size:3rem;font-weight:800;line-height:1.15;margin-bottom:20px;}
  .lc-hero p{font-size:1.2rem;opacity:.9;max-width:600px;margin:0 auto 32px;}
  .lc-hero .lc-btn{background:#fff;color:#6c63ff;border:none;padding:14px 36px;border-radius:50px;font-size:1rem;font-weight:700;cursor:pointer;}
  .lc-cta{padding:60px 40px;text-align:center;background:#f0f4ff;}
  .lc-cta h2{font-size:2rem;font-weight:700;color:#1a1d27;margin-bottom:16px;}
  .lc-cta p{color:#555;margin-bottom:28px;}
  .lc-cta .lc-btn{background:linear-gradient(135deg,#6c63ff,#a855f7);color:#fff;border:none;padding:14px 36px;border-radius:50px;font-size:1rem;font-weight:700;cursor:pointer;}
  .lc-features{padding:60px 40px;}
  .lc-features h2{text-align:center;font-size:2rem;font-weight:700;color:#1a1d27;margin-bottom:8px;}
  .lc-features .subtitle{text-align:center;color:#777;margin-bottom:40px;}
  .features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
  .feature-card{background:#fff;border:1.5px solid #eee;border-radius:14px;padding:28px 24px;text-align:center;transition:box-shadow .2s,transform .2s;}
  .feature-card:hover{box-shadow:0 8px 32px rgba(108,99,255,.15);transform:translateY(-4px);}
  .feature-card i{font-size:2rem;color:#6c63ff;margin-bottom:16px;}
  .feature-card h3{font-size:1.1rem;font-weight:700;color:#1a1d27;margin-bottom:10px;}
  .feature-card p{color:#777;font-size:.9rem;line-height:1.6;}
  .lc-pricing{padding:60px 40px;}
  .lc-pricing h2{text-align:center;font-size:2rem;font-weight:700;color:#1a1d27;margin-bottom:40px;}
  .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
  .pricing-card{border:1.5px solid #eee;border-radius:16px;padding:32px 24px;text-align:center;position:relative;}
  .pricing-card.featured{border-color:#6c63ff;background:linear-gradient(135deg,#f0eeff,#f8f4ff);}
  .pricing-card .badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#6c63ff;color:#fff;padding:4px 16px;border-radius:50px;font-size:.75rem;font-weight:700;}
  .pricing-card h3{font-size:1.1rem;font-weight:700;color:#333;margin-bottom:12px;}
  .pricing-card .price{font-size:2.8rem;font-weight:800;color:#1a1d27;line-height:1;}
  .pricing-card .price span{font-size:1rem;color:#888;font-weight:400;}
  .pricing-card ul{list-style:none;margin:20px 0;text-align:left;}
  .pricing-card ul li{padding:6px 0;color:#555;font-size:.9rem;display:flex;align-items:center;gap:8px;}
  .pricing-card ul li::before{content:"✓";color:#43e97b;font-weight:700;}
  .pricing-card .lc-btn{width:100%;border:none;padding:12px;border-radius:50px;font-weight:700;cursor:pointer;font-size:.95rem;}
  .pricing-card:not(.featured) .lc-btn{background:#f0f0f0;color:#333;}
  .pricing-card.featured .lc-btn{background:linear-gradient(135deg,#6c63ff,#a855f7);color:#fff;}
  .lc-testimonial{padding:60px 40px;background:#fafbff;}
  .lc-testimonial h2{text-align:center;font-size:2rem;font-weight:700;color:#1a1d27;margin-bottom:40px;}
  .testimonial-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
  .testimonial-card{background:#fff;border:1.5px solid #eee;border-radius:14px;padding:28px;}
  .testimonial-card .stars{color:#f59e0b;font-size:1rem;margin-bottom:14px;}
  .testimonial-card p{color:#555;font-size:.9rem;line-height:1.7;margin-bottom:20px;font-style:italic;}
  .testimonial-author{display:flex;align-items:center;gap:12px;}
  .testimonial-author .name{font-weight:700;font-size:.9rem;color:#1a1d27;}
  .testimonial-author .role{font-size:.8rem;color:#888;}
  .lc-stats{padding:50px 40px;background:linear-gradient(135deg,#6c63ff,#a855f7);}
  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center;}
  .stat-item .stat-num{font-size:2.8rem;font-weight:800;color:#fff;line-height:1;}
  .stat-item .stat-label{font-size:.9rem;color:rgba(255,255,255,.8);margin-top:6px;}
  .lc-faq{padding:60px 40px;}
  .lc-faq h2{text-align:center;font-size:2rem;font-weight:700;color:#1a1d27;margin-bottom:40px;}
  .faq-item{border-bottom:1px solid #eee;}
  .faq-q{display:flex;justify-content:space-between;align-items:center;padding:18px 0;cursor:pointer;font-weight:600;color:#1a1d27;font-size:.97rem;}
  .faq-q i{color:#6c63ff;transition:transform .2s;}
  .faq-q.open i{transform:rotate(45deg);}
  .faq-a{padding:0 0 16px;color:#666;font-size:.9rem;line-height:1.7;display:none;}
  .faq-a.open{display:block;}
  .lc-countdown{padding:50px 40px;background:#1a1d27;text-align:center;}
  .lc-countdown h2{color:#fff;font-size:1.8rem;font-weight:700;margin-bottom:8px;}
  .lc-countdown p{color:#aaa;margin-bottom:32px;}
  .countdown-timer{display:flex;justify-content:center;gap:24px;}
  .countdown-block{background:#22263a;border-radius:12px;padding:20px 28px;min-width:90px;}
  .countdown-block .num{font-size:2.5rem;font-weight:800;color:#6c63ff;display:block;}
  .countdown-block .label{font-size:.75rem;color:#888;text-transform:uppercase;letter-spacing:1px;}
  .lc-email-form{padding:60px 40px;background:linear-gradient(135deg,#6c63ff 0%,#a855f7 100%);text-align:center;}
  .lc-email-form h2{color:#fff;font-size:2rem;font-weight:700;margin-bottom:10px;}
  .lc-email-form p{color:rgba(255,255,255,.85);margin-bottom:28px;}
  .email-capture-form{display:flex;gap:12px;max-width:500px;margin:0 auto;}
  .email-capture-form input{flex:1;padding:13px 18px;border:none;border-radius:50px;font-size:.95rem;outline:none;}
  .email-capture-form button{background:#1a1d27;color:#fff;border:none;padding:13px 28px;border-radius:50px;font-weight:700;cursor:pointer;}
  .lc-contact-form{padding:60px 40px;}
  .lc-contact-form h2{font-size:2rem;font-weight:700;color:#1a1d27;margin-bottom:32px;text-align:center;}
  .contact-form{max-width:600px;margin:0 auto;display:flex;flex-direction:column;gap:16px;}
  .contact-form input,.contact-form textarea{width:100%;padding:12px 16px;border:1.5px solid #ddd;border-radius:8px;font-size:.95rem;outline:none;font-family:inherit;}
  .contact-form textarea{resize:vertical;min-height:120px;}
  .contact-form button{background:linear-gradient(135deg,#6c63ff,#a855f7);color:#fff;border:none;padding:13px;border-radius:50px;font-weight:700;cursor:pointer;font-size:1rem;}
  .lc-footer{padding:60px 40px 30px;background:#1a1d27;color:#aaa;}
  .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px;}
  .footer-brand{font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:12px;}
  .footer-desc{font-size:.88rem;line-height:1.7;}
  .footer-col h4{color:#fff;font-size:.9rem;font-weight:700;margin-bottom:14px;}
  .footer-col ul{list-style:none;}
  .footer-col ul li{margin-bottom:8px;}
  .footer-col ul li a{color:#888;text-decoration:none;font-size:.88rem;}
  .footer-bottom{border-top:1px solid #2d3150;padding-top:20px;display:flex;justify-content:space-between;font-size:.8rem;}
  .lc-heading{padding:20px 40px;}
  .lc-heading h1{font-size:2.5rem;font-weight:800;color:#1a1d27;}
  .lc-subheading{padding:10px 40px;}
  .lc-subheading h2{font-size:1.5rem;font-weight:600;color:#333;}
  .lc-paragraph{padding:10px 40px;}
  .lc-paragraph p{color:#555;line-height:1.8;font-size:1rem;}
  .lc-bullet-list{padding:10px 40px;}
  .lc-bullet-list ul{list-style:none;padding:0;}
  .lc-bullet-list ul li{padding:6px 0;color:#444;display:flex;align-items:flex-start;gap:10px;}
  .lc-bullet-list ul li::before{content:"✓";color:#6c63ff;font-weight:700;}
  .lc-quote{padding:20px 40px;}
  .lc-quote blockquote{border-left:4px solid #6c63ff;padding:16px 24px;background:#f8f0ff;color:#444;font-style:italic;border-radius:0 8px 8px 0;}
  .lc-badge{padding:8px 40px;}
  .lc-badge span{display:inline-block;background:#e9e3ff;color:#6c63ff;padding:4px 16px;border-radius:50px;font-size:.82rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;}
  .lc-button{padding:12px 40px;}
  .lc-button a{display:inline-block;background:linear-gradient(135deg,#6c63ff,#a855f7);color:#fff;padding:13px 32px;border-radius:50px;font-weight:700;text-decoration:none;}
  .lc-divider{padding:12px 40px;}
  .lc-divider hr{border:none;border-top:1.5px solid #e0e0e0;}
  .lc-image{padding:16px 40px;text-align:center;}
  .lc-image img{max-width:100%;border-radius:10px;}
  .lc-logo-strip{padding:24px 40px;background:#fafbff;text-align:center;}
  .lc-logo-strip p{font-size:.82rem;color:#aaa;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:20px;}
  .logo-strip-items{display:flex;gap:40px;justify-content:center;flex-wrap:wrap;}
  .logo-strip-items span{font-size:1.2rem;font-weight:700;color:#bbb;}
  .lc-newsletter{padding:40px;background:#f0f4ff;}
  .lc-newsletter h3{font-size:1.4rem;font-weight:700;color:#1a1d27;margin-bottom:8px;}
  .lc-newsletter p{color:#666;margin-bottom:20px;}
  .newsletter-form{display:flex;gap:10px;}
  .newsletter-form input{flex:1;padding:11px 16px;border:1.5px solid #ddd;border-radius:50px;font-size:.9rem;outline:none;}
  .newsletter-form button{background:#6c63ff;color:#fff;border:none;padding:11px 24px;border-radius:50px;font-weight:700;cursor:pointer;}
  .lc-team{padding:60px 40px;}
  .lc-team h2{text-align:center;font-size:2rem;font-weight:700;color:#1a1d27;margin-bottom:40px;}
  .team-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
  .team-card{text-align:center;}
  .team-card .avatar{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#6c63ff,#a855f7);margin:0 auto 14px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:2rem;font-weight:700;}
  .team-card h3{font-weight:700;color:#1a1d27;font-size:.97rem;}
  .team-card p{color:#888;font-size:.85rem;}
  @media(max-width:768px){
    .features-grid,.testimonial-grid,.pricing-grid,.team-grid{grid-template-columns:1fr!important;}
    .stats-grid{grid-template-columns:repeat(2,1fr)!important;}
    .footer-grid{grid-template-columns:1fr 1fr!important;}
    .lc-hero h1{font-size:2rem!important;}
    .email-capture-form{flex-direction:column!important;}
    .newsletter-form{flex-direction:column!important;}
  }
  `;
}

function exportHTML() {
  const html = getPageHTML();
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (document.getElementById('exportTitle')?.value || 'landing-page').toLowerCase().replace(/\s+/g,'-') + '.html';
  a.click();
  URL.revokeObjectURL(url);
  closeModal('exportModal');
  showToast('HTML exported successfully!', 'success');
}

function exportZip() {
  // Since we can't import JSZip, we'll just do HTML export and inform user
  exportHTML();
  showToast('Exporting as HTML (ZIP requires server upload)', 'success');
}

function copyHTMLToClipboard() {
  const html = getPageHTML();
  navigator.clipboard.writeText(html).then(() => {
    showToast('HTML copied to clipboard!', 'success');
    closeModal('exportModal');
  }).catch(() => showToast('Copy failed — try HTML export instead', 'error'));
}

/* ========================
   COMPONENT SEARCH
   ======================== */
function filterComponents(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.comp-item').forEach(item => {
    const label = (item.dataset.label || item.textContent).toLowerCase();
    item.classList.toggle('hidden', q.length > 0 && !label.includes(q));
  });
  document.querySelectorAll('.comp-group').forEach(group => {
    const visible = [...group.querySelectorAll('.comp-item')].some(i => !i.classList.contains('hidden'));
    group.style.display = visible ? '' : 'none';
  });
}

/* ========================
   HELPERS
   ======================== */
function openTemplates() {
  document.getElementById('templatesModal').classList.add('open');
}

function openExport() {
  document.getElementById('exportModal').classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function clearCanvas() {
  if (!document.querySelector('.element-wrapper')) return;
  if (!confirm('Clear the canvas? This cannot be undone.')) return;
  clearCanvasSilent();
  showToast('Canvas cleared', 'success');
}

function clearCanvasSilent() {
  const canvas = document.getElementById('canvas');
  [...canvas.children].forEach(c => {
    if (!c.id || c.id !== 'emptyState') c.remove();
  });
  showEmpty();
  selectedElement = null;
  document.getElementById('propertiesPanel').innerHTML = `<div class="no-selection"><i class="fa fa-mouse-pointer"></i><p>Click an element to edit its properties</p></div>`;
  saveHistory();
}

function showEmpty() {
  const es = document.getElementById('emptyState');
  if (es) es.style.display = 'flex';
}

function hideEmpty() {
  const es = document.getElementById('emptyState');
  if (es) es.style.display = 'none';
}

function setupClickOutside() {
  document.getElementById('canvas').addEventListener('click', e => {
    if (e.target === document.getElementById('canvas')) {
      document.querySelectorAll('.element-wrapper').forEach(w => w.classList.remove('selected'));
      selectedElement = null;
      document.getElementById('propertiesPanel').innerHTML = `<div class="no-selection"><i class="fa fa-mouse-pointer"></i><p>Click an element to edit its properties</p></div>`;
    }
  });
}

function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fa ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${msg}`;
  (document.getElementById('lc-app') || document.body).appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* ========================
   FAQ ADD / REMOVE
   ======================== */
function addFaqItem() {
  const el = getSelectedEl(); if (!el) return;
  const item = document.createElement('div');
  item.className = 'faq-item';
  item.innerHTML = `<div class="faq-q">New Question Here <i class="fa fa-plus"></i></div><div class="faq-a">Answer goes here. Double-click to edit.</div>`;
  el.appendChild(item);
  saveHistory();
  showToast('FAQ item added — double-click to edit', 'success');
}

function removeFaqItem() {
  const el = getSelectedEl(); if (!el) return;
  const items = el.querySelectorAll('.faq-item');
  if (items.length > 1) { items[items.length - 1].remove(); saveHistory(); }
  else showToast('Need at least one FAQ item', 'error');
}

/* ========================
   FAQ DELEGATION (works after clone/undo too)
   ======================== */
document.getElementById('canvas').addEventListener('click', e => {
  const faqQ = e.target.closest('.faq-q');
  if (!faqQ || isPreviewMode) return;
  if (e.target.isContentEditable || e.target.closest('[contenteditable="true"]')) return;
  faqQ.classList.toggle('open');
  const ans = faqQ.nextElementSibling;
  if (ans && ans.classList.contains('faq-a')) ans.classList.toggle('open');
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undoAction(); }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redoAction(); }
  if (e.key === 'Delete' && selectedElement && document.activeElement === document.body) {
    deleteElement(selectedElement.querySelector('.el-toolbar button'));
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElement) {
    e.preventDefault();
    duplicateElement(selectedElement.querySelector('.el-toolbar button'));
  }
});
