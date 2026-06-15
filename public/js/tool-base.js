// Shared utilities for all Toolzyo standalone tool pages
// Loaded via <script src="/js/tool-base.js"> in each tool's index.html

window._fmt  = n => Number(n).toLocaleString('en-IN');
window._fmtS = n => n>=1e7?'₹'+(n/1e7).toFixed(1)+'Cr':n>=1e5?'₹'+(n/1e5).toFixed(1)+'L':'₹'+_fmt(n);
window._cp   = v => navigator.clipboard.writeText(String(v));
window._fmtB = b => b>1048576?(b/1048576).toFixed(1)+' MB':b>1024?(b/1024).toFixed(1)+' KB':Math.round(b)+' B';

window._dlPdf = (bytes, name) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([bytes], {type:'application/pdf'}));
  a.download = name; a.click();
};

window._loadImgSrc = src => new Promise(res => {
  const i = new Image(); i.onload = () => res(i); i.src = src;
});

window._extFromFmt = fmt => (fmt==='image/png'?'.png':fmt==='image/webp'?'.webp':'.jpg');

window._dlCanvas = (canvas, fmt, quality, name) => {
  const a = document.createElement('a');
  a.href = canvas.toDataURL(fmt, quality/100);
  a.download = name + _extFromFmt(fmt); a.click();
};

window._hexToRgb = hex => {
  const r=parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255;
  return {r, g, b};
};

window._escXml = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

window._showLoader = () => {
  const l = document.getElementById('page-loader');
  if (l) { l.style.display='flex'; l.style.opacity='1'; l.classList.remove('done'); }
};

window._hideLoader = () => {
  const l = document.getElementById('page-loader');
  if (l) requestAnimationFrame(() => requestAnimationFrame(() => {
    l.classList.add('done'); setTimeout(() => l.style.display='none', 320);
  }));
};

// Call inside Vue setup() — returns {dark, toggleTheme} and sets up loader + nav
window._toolSetup = () => {
  const {ref} = Vue;
  const dark = ref(true);
  const applyTheme = () => document.body.className = dark.value ? 'dark' : 'light';
  applyTheme();
  const toggleTheme = () => { dark.value = !dark.value; applyTheme(); };
  _hideLoader();
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || a.target==='_blank' || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const href = a.getAttribute('href');
    if (!href || href==='#' || href.startsWith('javascript')) return;
    try { const u = new URL(a.href, location.href); if (u.origin===location.origin && u.pathname!==location.pathname) _showLoader(); } catch(err) {}
  }, true);
  window.addEventListener('pageshow', e => { if (e.persisted) { const l=document.getElementById('page-loader'); if(l) l.style.display='none'; } });
  return { dark, toggleTheme };
};
