(() => {
  "use strict";

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);
  const form = $("converterForm");
  const input = $("tempInput");
  const inputWrap = $("inputWrap");
  const inputUnit = $("inputUnit");
  const errorBox = $("error");
  const results = $("results");
  const outputs = { C: $("outC"), F: $("outF"), K: $("outK") };
  const tiles = { C: document.querySelector(".result-c"), F: document.querySelector(".result-f"), K: document.querySelector(".result-k") };
  const copyBtn = $("copyBtn");
  const copyStatus = $("copyStatus");
  const feelLabel = $("feelLabel");
  const gaugeMarker = $("gaugeMarker");
  const formulaList = $("formulaList");
  const historyBox = $("historyBox");
  const historyList = $("historyList");
  const clearHistoryBtn = $("clearHistory");
  const themeBtn = $("themeBtn");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  // ---------- Constants ----------
  const ABSOLUTE_ZERO = { C: -273.15, F: -459.67, K: 0 };
  const UNIT_LABEL = { C: "°C", F: "°F", K: "K" };
  const NUMBER_REGEX = /^[+-]?(\d+\.?\d*|\.\d+)$/; // 25, -40, +3.5, .5, 10.
  const HISTORY_KEY = "thermo:history";
  const THEME_KEY = "thermo:theme";
  const HISTORY_MAX = 5;

  let latest = null; // last valid result: { value, unit, c, f, k }

  // ---------- Safe storage (can throw in private mode) ----------
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, val) { try { localStorage.setItem(key, val); } catch { /* ignore */ } },
    remove(key) { try { localStorage.removeItem(key); } catch { /* ignore */ } },
  };

  // ---------- Helpers ----------
  const currentUnit = () => form.elements.unit.value;

  function format(n) {
    // 2 decimals max, trailing zeros trimmed, never "-0"
    const r = Math.round(n * 100) / 100;
    return (Object.is(r, -0) ? 0 : r).toLocaleString("en-US", { maximumFractionDigits: 2, useGrouping: false });
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.add("show");
    inputWrap.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
    results.classList.remove("show");
    latest = null;
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.classList.remove("show");
    inputWrap.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
  }

  function hideResults() {
    clearError();
    results.classList.remove("show");
    latest = null;
  }

  // ---------- Validation ----------
  // Returns a number, or null (after showing a message)
  function validate() {
    const raw = input.value.trim().replace(",", "."); // allow "36,6"
    if (raw === "") { showError("Please enter a temperature value."); return null; }
    if (!NUMBER_REGEX.test(raw)) {
      showError("Numbers only, please (for example 25 or -10.5).");
      return null;
    }
    const value = parseFloat(raw);
    const unit = currentUnit();
    if (value < ABSOLUTE_ZERO[unit]) {
      showError(`That is below absolute zero (${ABSOLUTE_ZERO[unit]} ${UNIT_LABEL[unit]}), which is not physically possible.`);
      return null;
    }
    clearError();
    return value;
  }

  // ---------- Conversion ----------
  const toCelsius = (v, u) => (u === "C" ? v : u === "F" ? ((v - 32) * 5) / 9 : v - 273.15);
  const fromCelsius = (c, u) => (u === "C" ? c : u === "F" ? (c * 9) / 5 + 32 : c + 273.15);

  // Step-by-step formulas for the two other scales
  function formulas(v, u) {
    const f = format;
    const x = f(v);
    if (u === "C") return [
      `°F = °C × 9/5 + 32  →  <b>${x} × 9/5 + 32 = ${f(fromCelsius(v, "F"))}</b>`,
      `K = °C + 273.15  →  <b>${x} + 273.15 = ${f(fromCelsius(v, "K"))}</b>`,
    ];
    if (u === "F") return [
      `°C = (°F − 32) × 5/9  →  <b>(${x} − 32) × 5/9 = ${f(toCelsius(v, "F"))}</b>`,
      `K = (°F − 32) × 5/9 + 273.15  →  <b>(${x} − 32) × 5/9 + 273.15 = ${f(toCelsius(v, "F") + 273.15)}</b>`,
    ];
    return [
      `°C = K − 273.15  →  <b>${x} − 273.15 = ${f(v - 273.15)}</b>`,
      `°F = (K − 273.15) × 9/5 + 32  →  <b>(${x} − 273.15) × 9/5 + 32 = ${f(fromCelsius(v - 273.15, "F"))}</b>`,
    ];
  }

  // Descriptive label + gauge position (based on °C)
  function feel(c) {
    if (c <= -273.14) return "Absolute zero";
    if (c < -40) return "Brutally cold";
    if (c < 0) return "Freezing";
    if (c < 10) return "Cold";
    if (c < 20) return "Cool";
    if (c < 28) return "Comfortable";
    if (c < 36) return "Warm";
    if (c < 45) return "Hot";
    if (c < 100) return "Scorching";
    return "Boiling or beyond";
  }

  function render() {
    const value = validate();
    if (value === null) return;

    const unit = currentUnit();
    const c = toCelsius(value, unit);
    const r = { value, unit, c, f: fromCelsius(c, "F"), k: c + 273.15 };
    latest = r;

    outputs.C.textContent = `${format(r.c)} °C`;
    outputs.F.textContent = `${format(r.f)} °F`;
    outputs.K.textContent = `${format(r.k)} K`;
    Object.entries(tiles).forEach(([u, el]) => el.classList.toggle("is-source", u === unit));

    feelLabel.textContent = feel(r.c);
    const pct = Math.min(100, Math.max(0, ((r.c + 50) / 110) * 100));
    gaugeMarker.style.left = `${pct}%`;

    formulaList.innerHTML = formulas(value, unit).map((t) => `<li>${t}</li>`).join("");
    copyStatus.textContent = "";
    results.classList.add("show");
  }

  // ---------- History ----------
  function loadHistory() {
    try { return JSON.parse(store.get(HISTORY_KEY)) || []; } catch { return []; }
  }

  function saveToHistory() {
    if (!latest) return;
    const entry = { value: format(latest.value), unit: latest.unit };
    const list = loadHistory().filter((h) => !(h.value === entry.value && h.unit === entry.unit));
    list.unshift(entry);
    store.set(HISTORY_KEY, JSON.stringify(list.slice(0, HISTORY_MAX)));
    renderHistory();
  }

  function renderHistory() {
    const list = loadHistory();
    historyBox.hidden = list.length === 0;
    historyList.innerHTML = "";
    list.forEach((h) => {
      const v = parseFloat(h.value);
      const c = toCelsius(v, h.unit);
      const targets = ["C", "F", "K"].filter((u) => u !== h.unit);
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.value = h.value;
      btn.dataset.unit = h.unit;
      btn.textContent = `${h.value} ${UNIT_LABEL[h.unit]} → ${format(fromCelsius(c, targets[0]))} ${UNIT_LABEL[targets[0]]}`;
      btn.title = "Use this value again";
      li.appendChild(btn);
      historyList.appendChild(li);
    });
  }

  // ---------- Applying a value programmatically (presets / history) ----------
  function apply(value, unit) {
    form.elements.unit.value = unit;
    inputUnit.textContent = UNIT_LABEL[unit];
    input.value = value;
    render();
    saveToHistory();
    input.focus();
  }

  // ---------- Copy ----------
  async function copyResults() {
    if (!latest) return;
    const text = `${format(latest.c)} °C = ${format(latest.f)} °F = ${format(latest.k)} K`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      ta.remove();
    }
    copyStatus.textContent = `Copied: ${text}`;
    clearTimeout(copyBtn._t);
    copyBtn._t = setTimeout(() => (copyStatus.textContent = ""), 2500);
  }

  // ---------- Theme ----------
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (themeMeta) themeMeta.content = theme === "light" ? "#f3f6fc" : "#0b1220";
    const next = theme === "light" ? "dark" : "light";
    themeBtn.textContent = theme === "light" ? "☾" : "☀";
    themeBtn.setAttribute("aria-label", `Switch to ${next} theme`);
  }

  // ---------- Events ----------
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stops the page reload on Enter / click
    render();
    saveToHistory();
  });

  // Live conversion while typing
  input.addEventListener("input", () => {
    if (input.value.trim() === "") return hideResults();
    render();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { input.value = ""; hideResults(); }
  });

  // Unit change: update suffix and re-convert
  form.querySelectorAll('input[name="unit"]').forEach((r) =>
    r.addEventListener("change", () => {
      inputUnit.textContent = UNIT_LABEL[currentUnit()];
      if (input.value.trim() !== "") render(); else hideResults();
    })
  );

  document.querySelector(".presets").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) apply(chip.dataset.value, chip.dataset.unit);
  });

  historyList.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn) apply(btn.dataset.value, btn.dataset.unit);
  });

  clearHistoryBtn.addEventListener("click", () => { store.remove(HISTORY_KEY); renderHistory(); });
  copyBtn.addEventListener("click", copyResults);
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    setTheme(next);
    store.set(THEME_KEY, next);
  });

  // ---------- Init ----------
  setTheme(store.get(THEME_KEY) === "light" ? "light" : "dark");
  renderHistory();
})();
