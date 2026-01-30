// =====================
// Print constants (300 DPI)
// =====================
const DPI = 300;

const IN = { trimW: 3.5, trimH: 2.0, bleed: 0.125, safeInset: 0.125 };
const PX = {
  trimW: Math.round(IN.trimW * DPI), // 1050
  trimH: Math.round(IN.trimH * DPI), // 600
  bleed: Math.round(IN.bleed * DPI), // 38
  safe: Math.round(IN.safeInset * DPI), // 38
};
const ART = {
  w: Math.round((IN.trimW + IN.bleed * 2) * DPI), // 1125
  h: Math.round((IN.trimH + IN.bleed * 2) * DPI), // 675
};
const TRIM = { x: PX.bleed, y: PX.bleed, w: PX.trimW, h: PX.trimH };
const SAFE = {
  x: TRIM.x + PX.safe,
  y: TRIM.y + PX.safe,
  w: TRIM.w - PX.safe * 2,
  h: TRIM.h - PX.safe * 2,
};

// =====================
// CMYK-safe-ish palette (screen preview in sRGB; constrained to print-friendly tones)
// (For true CMYK conversion, use optional backend pipeline.)
// =====================
const PALETTE = [
  { name: "Cyan", hex: "#0077B6" },
  { name: "Teal", hex: "#0F766E" },
  { name: "Navy", hex: "#0A2540" },
  { name: "Indigo", hex: "#27338D" },
  { name: "Green", hex: "#166534" },
  { name: "Olive", hex: "#556B2F" },
  { name: "Orange", hex: "#B45309" },
  { name: "Red", hex: "#991B1B" },
  { name: "Magenta", hex: "#9D174D" },
  { name: "Purple", hex: "#4C1D95" },
  { name: "Slate", hex: "#334155" },
  { name: "Charcoal", hex: "#111827" },
];

const FONT_CLASS = {
  sans: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
};

// =====================
// Minimal vector icons (consistent stroke widths)
// =====================
const ICONS = {
  phone: `<path d="M7.5 3.5c.6-1 2-1.2 2.9-.4l1.8 1.5c.7.6.8 1.6.3 2.4l-1 1.6c.8 1.4 2 2.6 3.4 3.4l1.6-1c.8-.5 1.8-.4 2.4.3l1.5 1.8c.8.9.6 2.3-.4 2.9l-1.5.9c-1.2.7-2.6 1-4 .6-5-1.3-9-5.3-10.3-10.3-.4-1.4-.1-2.8.6-4L7.5 3.5z"/>`,
  mail: `<path d="M4 6.5h16v11H4z"/><path d="M4 7l8 6 8-6" fill="none"/>`,
  pin: `<path d="M12 21s6-5 6-10a6 6 0 10-12 0c0 5 6 10 6 10z"/><path d="M12 11.2a.8.8 0 100-1.6.8.8 0 000 1.6z" fill="none"/>`,
  globe: `<path d="M12 21a9 9 0 100-18 9 9 0 000 18z"/><path d="M3 12h18"/><path d="M12 3c2.6 2.6 2.6 15.4 0 18"/><path d="M12 3c-2.6 2.6-2.6 15.4 0 18"/>`,
};

function iconSvg(kind, size = 14) {
  // stroked, minimal
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    ${ICONS[kind] || ""}
  </svg>`;
}

// =====================
// State
// =====================
const state = {
  fullName: "Imamul Kadir",
  jobTitle: "Automation Specialist",
  company: "P'Pets Labs",
  phone: "+1 (555) 012-3456",
  email: "ppets@lab.com",
  address: "123 Market St, San Francisco, CA",
  website: "PPets",
  fontFamily: "sans",
  fontWeight: "600",
  accent: PALETTE[0].hex,
  templateId: "t03",
  overlays: { bleed: true, trim: true, safe: true },
  logo: null, // { kind: 'svg'|'png', dataUrl, svgText? }
};

// =====================
// Templates (15+)
// Each template returns layout nodes built in SAFE area.
// Keep grid-based, whitespace-heavy, no hairlines.
// =====================
const templates = [
  {
    id: "t01",
    name: "Corporate Left",
    style: "Corporate",
    render: tplCorporateLeft,
  },
  {
    id: "t02",
    name: "Corporate Right",
    style: "Corporate",
    render: tplCorporateRight,
  },
  {
    id: "t03",
    name: "Minimal Center",
    style: "Minimal",
    render: tplMinimalCenter,
  },
  {
    id: "t04",
    name: "Minimal Split",
    style: "Minimal",
    render: tplMinimalSplit,
  },
  { id: "t05", name: "Tech Bar", style: "Tech", render: tplTechBar },
  { id: "t06", name: "Tech Grid", style: "Tech", render: tplTechGrid },
  { id: "t07", name: "Elegant Mono", style: "Elegant", render: tplElegantMono },
  { id: "t08", name: "Elegant Line", style: "Elegant", render: tplElegantLine },
  {
    id: "t09",
    name: "Creative Accent",
    style: "Creative",
    render: tplCreativeAccent,
  },
  {
    id: "t10",
    name: "Creative Corner",
    style: "Creative",
    render: tplCreativeCorner,
  },
  {
    id: "t11",
    name: "Monochrome Stack",
    style: "Monochrome",
    render: tplMonoStack,
  },
  {
    id: "t12",
    name: "Monochrome Grid",
    style: "Monochrome",
    render: tplMonoGrid,
  },
  {
    id: "t13",
    name: "Startup Badge",
    style: "Startup",
    render: tplStartupBadge,
  },
  {
    id: "t14",
    name: "Startup Outline",
    style: "Startup",
    render: tplStartupOutline,
  },
  {
    id: "t15",
    name: "Minimal Icon Rail",
    style: "Minimal",
    render: tplIconRail,
  },
];
async function renderSvgToCanvas({ overlaysOff = true } = {}) {
  const tpl = templates.find((t) => t.id === state.templateId) || templates[0];

  const prevOverlays = { ...state.overlays };
  if (overlaysOff) state.overlays = { bleed: false, trim: false, safe: false };

  const svgString = buildCardSvg(tpl);

  state.overlays = prevOverlays;

  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
    img.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = ART.w;
  canvas.height = ART.h;

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  URL.revokeObjectURL(url);
  return canvas;
}

async function exportPDFExact300() {
  const { jsPDF } = window.jspdf || {};
  if (typeof jsPDF !== "function") {
    throw new Error(
      "jsPDF not found. Ensure jspdf.umd.min.js loads before app.js",
    );
  }

  // 3.75 x 2.25 inches INCLUDING BLEED
  const pageWin = IN.trimW + IN.bleed * 2; // 3.75
  const pageHin = IN.trimH + IN.bleed * 2; // 2.25

  // Use inches directly (avoid px/pt confusion entirely)
  const pdf = new jsPDF({
    unit: "in",
    format: [pageWin, pageHin],
    orientation: "landscape",
    compress: true,
    putOnlyUsedFonts: true,
  });

  // Render SVG to canvas at ART px (1125x675) — your PNG path already works
  const canvas = await renderSvgToCanvas({ overlaysOff: true });

  // Use PNG data (lossless)
  const pngData = canvas.toDataURL("image/png");

  // Fill the page exactly (bleed included)
  pdf.addImage(pngData, "PNG", 0, 0, pageWin, pageHin, undefined, "NONE");

  pdf.save(`business-card_${state.templateId}_exact.pdf`);
}

// =====================
// Boot
// =====================
const $ = (id) => document.getElementById(id);

function boot() {
  // specs
  $("specLabel").textContent = `${ART.w}×${ART.h}px @ ${DPI}DPI`;
  $("artSpec").textContent = `3.75×2.25 in (${ART.w}×${ART.h}px)`;
  $("trimSpec").textContent = `3.5×2 in (${PX.trimW}×${PX.trimH}px)`;
  $("safeSpec").textContent = `0.125 in (${PX.safe}px)`;

  // inputs
  bindInput("fullName");
  bindInput("jobTitle");
  bindInput("company");
  bindInput("phone");
  bindInput("email");
  bindInput("address");
  bindInput("website");

  $("fontFamily").value = state.fontFamily;
  $("fontFamily").addEventListener("change", (e) => {
    state.fontFamily = e.target.value;
    render();
  });

  $("fontWeight").value = state.fontWeight;
  $("fontWeight").addEventListener("change", (e) => {
    state.fontWeight = e.target.value;
    render();
  });

  // overlays
  $("toggleBleed").checked = state.overlays.bleed;
  $("toggleTrim").checked = state.overlays.trim;
  $("toggleSafe").checked = state.overlays.safe;

  $("toggleBleed").addEventListener("change", (e) => {
    state.overlays.bleed = e.target.checked;
    render();
  });
  $("toggleTrim").addEventListener("change", (e) => {
    state.overlays.trim = e.target.checked;
    render();
  });
  $("toggleSafe").addEventListener("change", (e) => {
    state.overlays.safe = e.target.checked;
    render();
  });

  // palette
  mountPalette();

  // templates
  mountTemplates();

  // logo upload
  $("logo").addEventListener("change", handleLogoUpload);

  // export
  $("btnPng").addEventListener("click", exportPNG300);
  $("btnPdfExact").addEventListener("click", exportPDFExact300);

  // theme toggle (UI only)
  $("btnTheme").addEventListener("click", toggleUITheme);

  // reset
  $("btnReset").addEventListener("click", () => {
    localStorage.removeItem("bcg_state_v1");
    location.reload();
  });

  // load saved state
  hydrate();
  // theme hydrate
  const savedTheme = localStorage.getItem("bcg_theme_v1");
  document.documentElement.dataset.theme = savedTheme || "dark";

  // initial render
  $("fullName").value = state.fullName;
  $("jobTitle").value = state.jobTitle;
  $("company").value = state.company;
  $("phone").value = state.phone;
  $("email").value = state.email;
  $("address").value = state.address;
  $("website").value = state.website;
  $("fontFamily").value = state.fontFamily;
  $("fontWeight").value = state.fontWeight;
  render();
}

function bindInput(id) {
  $(id).addEventListener("input", (e) => {
    state[id] = e.target.value;
    save();
    render();
  });
}

function save() {
  localStorage.setItem(
    "bcg_state_v1",
    JSON.stringify({
      ...state,
      // omit large logo fields if needed (keep)
    }),
  );
}

function normalizeSvgForPdf(svgString) {
  // jsPDF built-in fonts: helvetica, times, courier
  // Supported styles: normal, bold, italic, bolditalic
  // So: force weights to 400/700 and map font families to supported ones.

  // 1) Force 500/600 → 400 or 700 (avoid label lookup failure)
  let s = svgString
    .replaceAll("font-weight: 500", "font-weight: 400")
    .replaceAll("font-weight:500", "font-weight:400")
    .replaceAll("font-weight: 600", "font-weight: 700")
    .replaceAll("font-weight:600", "font-weight:700");

  // 2) Map your CSS stacks to jsPDF font names (best effort)
  // You used classes font-sans/font-serif/font-mono; ensure they become jsPDF-safe
  // If your SVG has inline font-family stacks, normalize them too.
  s = s
    .replaceAll("ui-sans-serif", "helvetica")
    .replaceAll("system-ui", "helvetica")
    .replaceAll("Segoe UI", "helvetica")
    .replaceAll("Helvetica Neue", "helvetica")
    .replaceAll("Arial", "helvetica")
    .replaceAll("Georgia", "times")
    .replaceAll("Times New Roman", "times")
    .replaceAll("Times", "times")
    .replaceAll("ui-monospace", "courier")
    .replaceAll("SFMono-Regular", "courier")
    .replaceAll("Menlo", "courier")
    .replaceAll("Monaco", "courier")
    .replaceAll("Consolas", "courier")
    .replaceAll("Courier New", "courier");

  // 3) (Optional) strip overlays just in case
  // If you already disable overlays via state, you can skip this.
  s = s
    .replaceAll('stroke="rgba(0,0,0,0.10)"', 'stroke="none"')
    .replaceAll('stroke="rgba(0,0,0,0.25)"', 'stroke="none"')
    .replaceAll('stroke="rgba(0,0,0,0.18)"', 'stroke="none"');

  return s;
}

function hydrate() {
  try {
    const raw = localStorage.getItem("bcg_state_v1");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed);
    // restore controls dependent UI
    setActivePalette(state.accent);
    setActiveTemplate(state.templateId);
    $("toggleBleed").checked = state.overlays.bleed;
    $("toggleTrim").checked = state.overlays.trim;
    $("toggleSafe").checked = state.overlays.safe;
  } catch {
    // ignore
  }
}

function toggleUITheme() {
  const root = document.documentElement;
  const current = root.dataset.theme || "dark";
  root.dataset.theme = current === "dark" ? "light" : "dark";

  // Optional: persist
  localStorage.setItem("bcg_theme_v1", root.dataset.theme);
}

// =====================
// Palette UI
// =====================
function mountPalette() {
  const wrap = $("palette");
  wrap.innerHTML = "";
  PALETTE.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "h-7 w-7 rounded-md border border-neutral-700 hover:scale-[1.02] transition";
    btn.style.background = c.hex;
    btn.title = c.name;
    btn.dataset.hex = c.hex;
    btn.addEventListener("click", () => {
      state.accent = c.hex;
      setActivePalette(c.hex);
      save();
      render();
    });
    wrap.appendChild(btn);
  });
  setActivePalette(state.accent);
}

function setActivePalette(hex) {
  document.querySelectorAll("#palette button").forEach((b) => {
    b.classList.toggle("ring-2", b.dataset.hex === hex);
    b.classList.toggle("ring-white", b.dataset.hex === hex);
  });
}

// =====================
// Templates UI
// =====================
function mountTemplates() {
  $("templateCount").textContent = `${templates.length} templates`;
  const wrap = $("templates");
  wrap.innerHTML = "";

  templates.forEach((t) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "rounded-xl border p-2 text-left t-tile";
    btn.dataset.id = t.id;

    btn.innerHTML = `
      <div class="text-xs font-semibold">${t.name}</div>
      <div class="text-[10px] text-neutral-400">${t.style}</div>
    `;
    btn.addEventListener("click", () => {
      state.templateId = t.id;
      setActiveTemplate(t.id);
      save();
      render();
    });
    wrap.appendChild(btn);
  });

  setActiveTemplate(state.templateId);
}

function setActiveTemplate(id) {
  document.querySelectorAll("#templates button").forEach((b) => {
    b.classList.toggle("ring-2", b.dataset.id === id);
    b.classList.toggle("ring-white", b.dataset.id === id);
  });
}

// =====================
// Logo upload
// =====================
async function handleLogoUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const isSvg = file.type === "image/svg+xml";
  const isPng = file.type === "image/png";

  if (!isSvg && !isPng) return;

  if (isSvg) {
    const text = await file.text();
    const dataUrl =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(text);
    state.logo = { kind: "svg", dataUrl, svgText: text };
  } else {
    const dataUrl = await readAsDataUrl(file);
    state.logo = { kind: "png", dataUrl };
  }

  save();
  render();
}

function readAsDataUrl(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}

// =====================
// Rendering (SVG)
// =====================
function render() {
  const tpl = templates.find((t) => t.id === state.templateId) || templates[0];
  const svg = buildCardSvg(tpl);
  $("previewWrap").innerHTML = "";

  // Scaled preview (responsive)
  const scale = 0.55; // preview scale
  const wrapper = document.createElement("div");
  wrapper.style.width = `${ART.w * scale}px`;
  wrapper.style.height = `${ART.h * scale}px`;
  wrapper.innerHTML = svg;

  const svgEl = wrapper.querySelector("svg");
  svgEl.style.width = `${ART.w * scale}px`;
  svgEl.style.height = `${ART.h * scale}px`;
  svgEl.style.display = "block";

  $("previewWrap").appendChild(wrapper);
}

function buildCardSvg(tpl) {
  const fontClass = FONT_CLASS[state.fontFamily] || FONT_CLASS.sans;
  const bg = "#FFFFFF";
  const fg = "#0B0F14";

  const overlay = overlaysSvg();
  const content = tpl.render({ ...state, bg, fg });

  // Entire artboard includes bleed
  return `
  <svg xmlns="http://www.w3.org/2000/svg"
      width="${ART.w}" height="${ART.h}"
      viewBox="0 0 ${ART.w} ${ART.h}"
      class="${fontClass}">
    <defs>
      <style>
        .t-fg { fill: ${fg}; }
        .t-muted { fill: rgba(11,15,20,0.70); }
        .t-accent { fill: ${state.accent}; }
        .stroke-accent { stroke: ${state.accent}; }
        .stroke-fg { stroke: ${fg}; }
        .w-regular { font-weight: 400; }
        .w-medium { font-weight: 400; }     /* was 500 */
        .w-semibold { font-weight: 700; }   /* was 600 */
        .w-bold { font-weight: 700; }
      </style>
    </defs>

    <!-- Background -->
    <rect x="0" y="0" width="${ART.w}" height="${ART.h}" fill="${bg}"/>

    ${content}

    ${overlay}
  </svg>`;
}

function overlaysSvg() {
  const parts = [];

  if (state.overlays.bleed) {
    // bleed boundary is entire artboard; show subtle outline
    parts.push(`<rect x="0.5" y="0.5" width="${ART.w - 1}" height="${ART.h - 1}"
      fill="none" stroke="rgba(0,0,0,0.10)" stroke-width="1" />`);
  }
  if (state.overlays.trim) {
    parts.push(`<rect x="${TRIM.x}" y="${TRIM.y}" width="${TRIM.w}" height="${TRIM.h}"
      fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="2" stroke-dasharray="8 6" />`);
  }
  if (state.overlays.safe) {
    parts.push(`<rect x="${SAFE.x}" y="${SAFE.y}" width="${SAFE.w}" height="${SAFE.h}"
      fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="2" stroke-dasharray="5 6" />`);
  }
  return `<g>${parts.join("\n")}</g>`;
}

// =====================
// Export: PNG 300 DPI (1125x675 px)
// =====================
async function exportPNG300() {
  const tpl = templates.find((t) => t.id === state.templateId) || templates[0];
  const svgString = buildCardSvg(tpl);

  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
    img.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = ART.w;
  canvas.height = ART.h;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, 0, 0);

  URL.revokeObjectURL(url);

  const pngUrl = canvas.toDataURL("image/png");
  downloadDataUrl(pngUrl, `business-card_${state.templateId}_300dpi.png`);
}

// =====================
// Export: PDF (vector) - browser print workflow
// This creates an SVG in a print-sized HTML and triggers print.
// Many browsers allow "Save as PDF".
// =====================
async function exportPDFVector() {
  const tpl = templates.find((t) => t.id === state.templateId) || templates[0];

  // Build SVG with overlays OFF
  const prevOverlays = { ...state.overlays };
  state.overlays = { bleed: false, trim: false, safe: false };
  let svgString = buildCardSvg(tpl);
  state.overlays = prevOverlays;

  // Normalize fonts/weights for jsPDF (your Fix A)
  svgString = normalizeSvgForPdf(svgString);

  // Parse SVG
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgEl = doc.documentElement;

  // jsPDF + svg2pdf globals
  const { jsPDF } = window.jspdf || {};
  if (typeof jsPDF !== "function") {
    throw new Error(
      "jsPDF not found. Ensure jspdf.umd.min.js loads before app.js",
    );
  }

  const svg2pdfFn =
    (typeof window.svg2pdf === "function" && window.svg2pdf) ||
    (window.svg2pdf &&
      typeof window.svg2pdf.svg2pdf === "function" &&
      window.svg2pdf.svg2pdf);

  if (typeof svg2pdfFn !== "function") {
    throw new Error(
      "svg2pdf not found. Ensure svg2pdf.umd.min.js loads after jsPDF and before app.js",
    );
  }

  // PDF page size INCLUDING BLEED: 3.75 x 2.25 in => 270 x 162 pt
  const pageWpt = (IN.trimW + IN.bleed * 2) * 72;
  const pageHpt = (IN.trimH + IN.bleed * 2) * 72;

  const pdf = new jsPDF({
    unit: "pt",
    format: [pageWpt, pageHpt],
    compress: true,
  });

  // IMPORTANT: Keep SVG units in "artboard pixels" (1125x675)
  // and let svg2pdf scale them into PDF points.
  svgEl.setAttribute("width", String(ART.w));
  svgEl.setAttribute("height", String(ART.h));
  svgEl.setAttribute("viewBox", `0 0 ${ART.w} ${ART.h}`);
  svgEl.setAttribute("preserveAspectRatio", "xMinYMin meet");

  // Correct scale: map ART px -> PDF pt
  const scale = pageWpt / ART.w; // should equal pageHpt / ART.h

  await svg2pdfFn(svgEl, pdf, {
    xOffset: 0,
    yOffset: 0,
    scale,
  });

  pdf.save(`business-card_${state.templateId}.pdf`);
}

// =====================
// Helpers
// =====================
function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function esc(s) {
  return (s || "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

// =====================
// Layout primitives
// =====================
function text(x, y, str, size, cls = "", anchor = "start") {
  return `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" class="${cls}">${esc(str)}</text>`;
}

function line(x1, y1, x2, y2, stroke = "rgba(0,0,0,0.15)", w = 2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}"/>`;
}

function rect(x, y, w, h, fill = "none") {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
}

function logoMark(x, y, w, h) {
  if (!state.logo) return "";
  // keep logo within safe area
  return `<image href="${state.logo.dataUrl}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" />`;
}

function infoRow(
  x,
  y,
  iconKind,
  value,
  size = 14,
  gap = 8,
  fontSize = 24,
  muted = false,
) {
  if (!value?.trim()) return "";
  return `
    <g transform="translate(${x},${y})" class="${muted ? "t-muted" : "t-fg"}">
      <g transform="translate(0,${-size + 2})">${iconSvg(iconKind, size)}</g>
      <text x="${size + gap}" y="0" font-size="${fontSize}" dominant-baseline="middle">${esc(value)}</text>
    </g>`;
}

// =====================
// 15 Templates
// Each template must keep all text inside SAFE.
// =====================
function tplCorporateLeft(data) {
  const padX = SAFE.x;
  const padY = SAFE.y;

  const nameY = nameBlockTop(padY + 70);
  const companyY = nameY + 48;

  const leftW = Math.round(SAFE.w * 0.55);
  const rightX = padX + leftW + 40;

  const contactStartY = padY + 210;
  const rowGap = 48;

  return `
    <!-- Accent bar -->
    <rect x="${TRIM.x}" y="${TRIM.y}" width="18" height="${TRIM.h}" fill="${data.accent}" opacity="0.95"/>

    <!-- Logo -->
    ${state.logo ? logoMark(SAFE.x + SAFE.w - 130, SAFE.y, 120, 120) : ""}

    <!-- Name block -->
    ${text(padX, nameY, data.fullName, 56, `t-fg w-bold`)}
    ${data.jobTitle ? text(padX, companyY, data.jobTitle, 28, `t-muted w-${weightClass(data.fontWeight)}`) : ""}

    <!-- Company -->
    ${text(padX, padY + SAFE.h - 24, data.company, 28, `t-fg w-semibold`)}

    <!-- Contact column -->
    <g>
      ${infoRow(rightX, contactStartY + 0 * rowGap, "phone", data.phone, 16, 10, 24, true)}
      ${infoRow(rightX, contactStartY + 1 * rowGap, "mail", data.email, 16, 10, 24, true)}
      ${infoRow(rightX, contactStartY + 2 * rowGap, "pin", data.address, 16, 10, 24, true)}
      ${infoRow(rightX, contactStartY + 3 * rowGap, "globe", data.website, 16, 10, 24, true)}
    </g>
  `;
}

function tplCorporateRight(data) {
  return `
    <rect x="${TRIM.x + TRIM.w - 18}" y="${TRIM.y}" width="18" height="${TRIM.h}" fill="${data.accent}" opacity="0.95"/>
    ${tplMinimalSplit(data)}
  `;
}

function tplMinimalCenter(data) {
  const cx = SAFE.x + SAFE.w / 2;
  const top = SAFE.y + 110;

  return `
    ${state.logo ? logoMark(cx - 60, SAFE.y, 120, 120) : ""}

    ${text(cx, top + 70, data.fullName, 58, "t-fg w-bold", "middle")}
    ${data.jobTitle ? text(cx, top + 115, data.jobTitle, 28, "t-muted w-medium", "middle") : ""}

    <g transform="translate(${SAFE.x}, ${SAFE.y + 260})">
      ${line(0, 0, SAFE.w, 0, "rgba(0,0,0,0.10)", 2)}
    </g>

    <g transform="translate(${SAFE.x + 40}, ${SAFE.y + 330})">
      ${infoRow(0, 0, "phone", data.phone, 16, 10, 24, true)}
      ${infoRow(0, 48, "mail", data.email, 16, 10, 24, true)}
      ${infoRow(0, 96, "pin", data.address, 16, 10, 24, true)}
      ${infoRow(0, 144, "globe", data.website, 16, 10, 24, true)}
    </g>

    ${text(cx, SAFE.y + SAFE.h, data.company, 26, "t-fg w-semibold", "middle")}
  `;
}

function tplMinimalSplit(data) {
  const leftX = SAFE.x;
  const leftY = SAFE.y;
  const split = SAFE.x + Math.round(SAFE.w * 0.58);

  return `
    ${state.logo ? logoMark(leftX, leftY, 120, 120) : ""}

    ${text(leftX, leftY + 170, data.fullName, 56, "t-fg w-bold")}
    ${data.jobTitle ? text(leftX, leftY + 215, data.jobTitle, 28, "t-muted w-medium") : ""}

    <rect x="${split}" y="${SAFE.y}" width="3" height="${SAFE.h}" fill="${data.accent}" opacity="0.85"/>

    <g transform="translate(${split + 30}, ${SAFE.y + 90})">
      ${text(0, -40, data.company, 28, "t-fg w-semibold")}
      ${infoRow(0, 0, "phone", data.phone, 16, 10, 24, true)}
      ${infoRow(0, 48, "mail", data.email, 16, 10, 24, true)}
      ${infoRow(0, 96, "pin", data.address, 16, 10, 24, true)}
      ${infoRow(0, 144, "globe", data.website, 16, 10, 24, true)}
    </g>
  `;
}

function tplTechBar(data) {
  return `
    <rect x="${TRIM.x}" y="${TRIM.y}" width="${TRIM.w}" height="64" fill="${data.accent}" opacity="0.95"/>
    ${tplMonoStack({ ...data })}
  `;
}

function tplTechGrid(data) {
  const gx = SAFE.x,
    gy = SAFE.y;
  return `
    <rect x="${TRIM.x}" y="${TRIM.y}" width="${TRIM.w}" height="${TRIM.h}" fill="#ffffff"/>
    <g opacity="0.08" stroke="${data.accent}" stroke-width="2">
      ${Array.from({ length: 6 })
        .map((_, i) =>
          line(
            TRIM.x,
            TRIM.y + i * 100,
            TRIM.x + TRIM.w,
            TRIM.y + i * 100,
            data.accent,
            2,
          ),
        )
        .join("")}
    </g>
    ${text(gx, gy + 90, data.fullName, 56, "t-fg w-bold")}
    ${data.jobTitle ? text(gx, gy + 135, data.jobTitle, 28, "t-muted w-medium") : ""}
    ${text(gx, gy + 205, data.company, 28, "t-fg w-semibold")}
    <g transform="translate(${gx}, ${gy + 300})">
      ${infoRow(0, 0, "phone", data.phone, 16, 10, 24, true)}
      ${infoRow(0, 48, "mail", data.email, 16, 10, 24, true)}
      ${infoRow(0, 96, "pin", data.address, 16, 10, 24, true)}
      ${infoRow(0, 144, "globe", data.website, 16, 10, 24, true)}
    </g>
  `;
}

function tplElegantMono(data) {
  const x = SAFE.x;
  const y = SAFE.y;
  const cx = SAFE.x + SAFE.w / 2;
  return `
    <rect x="${TRIM.x}" y="${TRIM.y}" width="${TRIM.w}" height="${TRIM.h}" fill="#ffffff"/>
    ${text(cx, y + 80, data.company, 28, "t-fg w-semibold", "middle")}
    ${line(SAFE.x + 140, y + 110, SAFE.x + SAFE.w - 140, y + 110, "rgba(0,0,0,0.18)", 2)}

    ${text(cx, y + 205, data.fullName, 60, "t-fg w-bold", "middle")}
    ${data.jobTitle ? text(cx, y + 250, data.jobTitle, 28, "t-muted w-medium", "middle") : ""}

    <g transform="translate(${SAFE.x + 40}, ${y + 340})">
      ${infoRow(0, 0, "phone", data.phone, 16, 10, 24, true)}
      ${infoRow(0, 48, "mail", data.email, 16, 10, 24, true)}
      ${infoRow(0, 96, "globe", data.website, 16, 10, 24, true)}
    </g>

    ${state.logo ? logoMark(SAFE.x + SAFE.w - 120, SAFE.y + SAFE.h - 120, 120, 120) : ""}
  `;
}

function tplElegantLine(data) {
  const x = SAFE.x,
    y = SAFE.y;
  return `
    <rect x="${TRIM.x}" y="${TRIM.y}" width="${TRIM.w}" height="${TRIM.h}" fill="#ffffff"/>
    <rect x="${SAFE.x}" y="${SAFE.y + 40}" width="8" height="${SAFE.h - 80}" fill="${data.accent}" opacity="0.9"/>
    ${text(x + 30, y + 120, data.fullName, 58, "t-fg w-bold")}
    ${data.jobTitle ? text(x + 30, y + 165, data.jobTitle, 28, "t-muted w-medium") : ""}
    ${text(x + 30, y + 235, data.company, 28, "t-fg w-semibold")}
    <g transform="translate(${x + 30}, ${y + 330})">
      ${infoRow(0, 0, "phone", data.phone, 16, 10, 24, true)}
      ${infoRow(0, 48, "mail", data.email, 16, 10, 24, true)}
      ${infoRow(0, 96, "pin", data.address, 16, 10, 24, true)}
      ${infoRow(0, 144, "globe", data.website, 16, 10, 24, true)}
    </g>
  `;
}

function tplCreativeAccent(data) {
  const x = SAFE.x,
    y = SAFE.y;
  return `
    <circle cx="${TRIM.x + TRIM.w - 40}" cy="${TRIM.y + 40}" r="90" fill="${data.accent}" opacity="0.18"/>
    <circle cx="${TRIM.x + 40}" cy="${TRIM.y + TRIM.h - 40}" r="110" fill="${data.accent}" opacity="0.12"/>
    ${tplMinimalSplit(data)}
  `;
}

function tplCreativeCorner(data) {
  return `
    <path d="M ${TRIM.x} ${TRIM.y} L ${TRIM.x + 260} ${TRIM.y} L ${TRIM.x} ${TRIM.y + 260} Z" fill="${data.accent}" opacity="0.18"/>
    <path d="M ${TRIM.x + TRIM.w} ${TRIM.y + TRIM.h} L ${TRIM.x + TRIM.w - 260} ${TRIM.y + TRIM.h} L ${TRIM.x + TRIM.w} ${TRIM.y + TRIM.h - 260} Z" fill="${data.accent}" opacity="0.12"/>
    ${tplCorporateLeft(data)}
  `;
}

function tplMonoStack(data) {
  const x = SAFE.x,
    y = SAFE.y;
  return `
    ${text(x, y + 120, data.fullName, 58, "t-fg w-bold")}
    ${data.jobTitle ? text(x, y + 165, data.jobTitle, 28, "t-muted w-medium") : ""}
    ${text(x, y + 235, data.company, 28, "t-fg w-semibold")}
    <g transform="translate(${x}, ${y + 320})">
      ${infoRow(0, 0, "phone", data.phone, 16, 10, 24, true)}
      ${infoRow(0, 48, "mail", data.email, 16, 10, 24, true)}
      ${infoRow(0, 96, "pin", data.address, 16, 10, 24, true)}
      ${infoRow(0, 144, "globe", data.website, 16, 10, 24, true)}
    </g>
    ${state.logo ? logoMark(SAFE.x + SAFE.w - 120, SAFE.y, 120, 120) : ""}
  `;
}

function tplMonoGrid(data) {
  const x = SAFE.x,
    y = SAFE.y;
  return `
    <g opacity="0.08" stroke="rgba(0,0,0,0.7)" stroke-width="2">
      ${Array.from({ length: 10 })
        .map((_, i) =>
          line(
            TRIM.x,
            TRIM.y + i * 70,
            TRIM.x + TRIM.w,
            TRIM.y + i * 70,
            "rgba(0,0,0,0.7)",
            2,
          ),
        )
        .join("")}
    </g>
    ${tplElegantLine(data)}
  `;
}

function tplStartupBadge(data) {
  const cx = SAFE.x + SAFE.w - 100;
  const cy = SAFE.y + 70;
  return `
    <rect x="${TRIM.x}" y="${TRIM.y}" width="${TRIM.w}" height="${TRIM.h}" fill="#ffffff"/>
    <circle cx="${cx}" cy="${cy}" r="62" fill="${data.accent}" opacity="0.9"/>
    <text x="${cx}" y="${cy + 8}" font-size="26" text-anchor="middle" fill="#ffffff" font-weight="700">
      ${esc((data.company || "CO").slice(0, 2).toUpperCase())}
    </text>
    ${tplCorporateLeft(data)}
  `;
}

function tplStartupOutline(data) {
  return `
    <rect x="${TRIM.x + 8}" y="${TRIM.y + 8}" width="${TRIM.w - 16}" height="${TRIM.h - 16}"
      fill="none" stroke="${data.accent}" stroke-width="4" opacity="0.9"/>
    ${tplMinimalSplit(data)}
  `;
}

function tplIconRail(data) {
  const x = SAFE.x,
    y = SAFE.y;
  const railX = SAFE.x + SAFE.w - 56;
  return `
    <rect x="${railX}" y="${SAFE.y}" width="6" height="${SAFE.h}" fill="${data.accent}" opacity="0.9"/>
    ${text(x, y + 120, data.fullName, 58, "t-fg w-bold")}
    ${data.jobTitle ? text(x, y + 165, data.jobTitle, 28, "t-muted w-medium") : ""}
    ${text(x, y + 235, data.company, 28, "t-fg w-semibold")}
    <g transform="translate(${x}, ${y + 320})">
      ${infoRow(0, 0, "phone", data.phone, 16, 10, 24, true)}
      ${infoRow(0, 48, "mail", data.email, 16, 10, 24, true)}
      ${infoRow(0, 96, "pin", data.address, 16, 10, 24, true)}
      ${infoRow(0, 144, "globe", data.website, 16, 10, 24, true)}
    </g>
    ${state.logo ? logoMark(SAFE.x + SAFE.w - 140, SAFE.y + SAFE.h - 140, 120, 120) : ""}
  `;
}

function weightClass(weight) {
  // normalize to our css class buckets
  const w = parseInt(weight, 10);
  if (w >= 700) return "bold";
  if (w >= 600) return "semibold";
  if (w >= 500) return "medium";
  return "regular";
}
function hasLogo() {
  return !!state.logo;
}

function nameBlockTop(baseTop) {
  // If logo exists, push name down to avoid overlap
  // Logo is typically ~120px tall; add spacing.
  return hasLogo() ? baseTop + 120 + 20 : baseTop;
}

// Start
boot();
