# Sitio Ricardo Vernal — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el sitio estático completo (6 páginas + 3 módulos JS) de Ricardo Vernal, editable por FTP sin build step, con diseño responsive y optimizaciones de rendimiento (imágenes adaptativas, lazy loading, minificación).

**Architecture:** HTML/CSS/JS plano en carpeta única. `styles.css` centraliza el sistema de diseño y las media queries. `main.js` maneja interacción global (nav, mega-menú, buscador, contadores, reveal). `quiz-urgencia.js` y `wizard-civil.js` contienen funciones puras de clasificación (testeadas con Node `assert`, sin dependencias npm) más su wiring de DOM. `build/minify.py` (solo stdlib de Python) genera una copia `dist/` minificada para subir a Hostinger, sin tocar los archivos fuente editables.

**Tech Stack:** HTML5, CSS3 (custom properties, Grid/Flexbox, media queries), JavaScript vanilla (ES2017+, `IntersectionObserver`), Python 3 stdlib (script de build opcional), Node.js stdlib `assert` (tests de lógica pura).

## Global Constraints

- Carpeta plana, sin subcarpetas obligatorias de código; sin bundler, sin npm en producción.
- Paleta fija: `--azul-noche:#0b0b0c`, `--dorado:#c9a24b`. No cambiar sin pedido explícito.
- Nunca mostrar porcentajes de probabilidad de resultado judicial en ningún módulo.
- Todo dato institucional no confirmado (timeline, enfoque compliance, "en los medios") lleva clase `.nota-confirmar` visible, nunca se inventa.
- `<meta name="viewport" content="width=device-width, initial-scale=1">` en las 6 páginas.
- Toda imagen: `max-width:100%; height:auto;` y `loading="lazy"` salvo la imagen hero above-the-fold.
- Sin cifras institucionales inventadas, sin testimonios fabricados, sin backend real (formulario es demo).

---

### Task 1: Sistema de diseño — `styles.css` + placeholder SVG

**Files:**
- Create: `styles.css`
- Create: `assets/placeholder-rv.svg`

**Interfaces:**
- Produces: variables CSS (`--azul-noche`, `--dorado`, `--blanco`, `--gris`, `--gris-claro`, `--font-serif`, `--font-sans`, `--max-width`, `--transition`), clases `.container`, `.site-header`, `.nav`, `.nav-links`, `.mega-menu`, `.hamburger`, `.hero`, `.stats-strip`, `.stat`, `.service-card`, `[data-reveal]`, `.img-placeholder`, `.nota-confirmar`, `.btn`, `.btn-primary`, `.btn-secondary`, breakpoints en `600px`/`960px`.

- [ ] **Step 1: Crear `assets/placeholder-rv.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500" role="img" aria-label="Retrato pendiente de Ricardo Vernal">
  <rect width="400" height="500" fill="#0b0b0c"/>
  <text x="200" y="260" font-family="Georgia, serif" font-size="72" fill="#c9a24b" text-anchor="middle">RV</text>
</svg>
```

- [ ] **Step 2: Escribir `styles.css`**

```css
:root {
  --azul-noche: #0b0b0c;
  --dorado: #c9a24b;
  --blanco: #f5f5f2;
  --gris: #6b6b6b;
  --gris-claro: #e5e3dd;
  --font-serif: Georgia, "Times New Roman", serif;
  --font-sans: -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  --max-width: 1200px;
  --transition: 0.25s ease;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-sans);
  color: var(--azul-noche);
  line-height: 1.6;
  background: var(--blanco);
}

h1, h2, h3 { font-family: var(--font-serif); line-height: 1.2; }

img, picture, svg { max-width: 100%; height: auto; display: block; }

a { color: inherit; text-decoration: none; }

.container { max-width: var(--max-width); margin-inline: auto; padding-inline: 1.25rem; }

.btn {
  display: inline-block;
  padding: 0.85rem 1.75rem;
  font-weight: 600;
  border: 1px solid transparent;
  transition: background var(--transition), color var(--transition), border-color var(--transition);
}
.btn-primary { background: var(--dorado); color: var(--azul-noche); }
.btn-primary:hover { background: #b58f3d; }
.btn-secondary { border-color: var(--dorado); color: var(--dorado); }
.btn-secondary:hover { background: var(--dorado); color: var(--azul-noche); }

/* Header / nav */
.site-header {
  position: sticky; top: 0; z-index: 50;
  background: var(--azul-noche); color: var(--blanco);
  border-bottom: 1px solid rgba(201,162,75,0.3);
}
.nav { display: flex; align-items: center; justify-content: space-between; padding-block: 1rem; }
.nav-logo { font-family: var(--font-serif); font-size: 1.25rem; color: var(--dorado); }
.nav-links { display: none; gap: 1.5rem; align-items: center; }
.nav-links a:hover { color: var(--dorado); }
.hamburger {
  background: none; border: none; color: var(--blanco); font-size: 1.5rem; cursor: pointer;
}

.mega-menu {
  display: none; position: absolute; left: 0; right: 0; top: 100%;
  background: var(--azul-noche); border-top: 1px solid rgba(201,162,75,0.3);
  padding: 2rem 0;
}
.mega-menu.open { display: block; }
.mega-menu-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
.mega-menu-item { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; }
.mega-menu-item h4 { color: var(--dorado); font-size: 1rem; margin-bottom: 0.35rem; }
.mega-menu-item p { color: rgba(245,245,242,0.75); font-size: 0.9rem; }

.search-box { position: relative; }
.search-box input {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2);
  color: var(--blanco); padding: 0.5rem 0.85rem; font-size: 0.9rem; width: 100%;
}
.search-results {
  position: absolute; top: 100%; left: 0; right: 0; background: var(--blanco);
  color: var(--azul-noche); max-height: 320px; overflow-y: auto; z-index: 60;
  border: 1px solid var(--gris-claro); display: none;
}
.search-results.open { display: block; }
.search-results a { display: block; padding: 0.75rem 1rem; border-top: 1px solid var(--gris-claro); }
.search-results a:first-child { border-top: none; }
.search-results a:hover { background: var(--gris-claro); }
.search-empty { padding: 0.75rem 1rem; color: var(--gris); font-size: 0.9rem; }

/* Hero */
.hero {
  background: var(--azul-noche); color: var(--blanco);
  padding: 5rem 0 7rem;
  clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
}
.hero h1 { font-size: clamp(2rem, 5vw, 3.25rem); color: var(--blanco); margin-bottom: 1rem; }
.hero .dorado { color: var(--dorado); }
.hero p { max-width: 640px; color: rgba(245,245,242,0.85); font-size: 1.1rem; margin-bottom: 2rem; }
.hero-ctas { display: flex; flex-wrap: wrap; gap: 1rem; }

/* Stats strip */
.stats-strip {
  background: var(--azul-noche); color: var(--blanco);
  margin-top: -4rem; padding: 2.5rem 0;
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; text-align: center;
}
.stat-value { font-family: var(--font-serif); font-size: 2.25rem; color: var(--dorado); }
.stat-label { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(245,245,242,0.7); }

/* Cards */
.card-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
.service-card {
  border-top: 1px solid var(--gris-claro); padding: 1.75rem 0;
  transition: padding-left var(--transition);
}
.service-card:hover { padding-left: 0.75rem; border-color: var(--dorado); }
.service-card h3 { font-size: 1.15rem; margin-bottom: 0.5rem; }
.service-card p { color: var(--gris); font-size: 0.95rem; }
.service-card .arrow { color: var(--dorado); font-weight: 600; }

.office-card { border: 1px solid var(--gris-claro); padding: 1.5rem; }

/* Reveal on scroll */
[data-reveal] { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.6s ease; }
[data-reveal].visible { opacity: 1; transform: none; }

/* Placeholders de imagen / notas */
.img-placeholder { aspect-ratio: 4 / 5; overflow: hidden; }
.nota-confirmar {
  display: inline-block; font-style: italic; color: var(--gris); font-size: 0.85rem;
  border-left: 2px solid var(--dorado); padding-left: 0.6rem; margin-block: 0.5rem;
}

/* Accordion (FAQ) */
.accordion-item { border-top: 1px solid var(--gris-claro); }
.accordion-trigger {
  width: 100%; text-align: left; background: none; border: none; cursor: pointer;
  padding: 1.25rem 0; font-size: 1.05rem; font-weight: 600; display: flex; justify-content: space-between;
}
.accordion-panel { max-height: 0; overflow: hidden; transition: max-height var(--transition); color: var(--gris); }
.accordion-item.open .accordion-panel { max-height: 400px; padding-bottom: 1.25rem; }

footer.site-footer { background: var(--azul-noche); color: rgba(245,245,242,0.7); padding: 2.5rem 0; margin-top: 4rem; font-size: 0.9rem; }

/* Tablet */
@media (min-width: 600px) {
  .stats-strip { grid-template-columns: repeat(4, 1fr); }
  .card-grid { grid-template-columns: repeat(2, 1fr); gap: 0 2rem; }
}

/* Desktop */
@media (min-width: 960px) {
  .hamburger { display: none; }
  .nav-links { display: flex; }
  .mega-menu-grid { grid-template-columns: repeat(3, 1fr); }
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
```

- [ ] **Step 3: Verificar en navegador**

Abrir `styles.css` no se testea solo; se valida junto al Task 6 (páginas). Por ahora, confirmar que el archivo no tiene errores de sintaxis:

Run: `node -e "require('fs').readFileSync('styles.css','utf8')"`
Expected: sin salida (el archivo se lee sin excepción)

- [ ] **Step 4: Commit**

```bash
git add styles.css assets/placeholder-rv.svg
git commit -m "feat: sistema de diseño base y placeholder de imagen"
```

---

### Task 2: `main.js` — buscador, contadores, mega-menú, reveal

**Files:**
- Create: `main.js`
- Test: `build/test-main.js`

**Interfaces:**
- Consumes: elementos con `id="search-input"`, `id="search-results"`, `[data-counter]`, `[data-reveal]`, `#mega-menu-trigger`, `#mega-menu`, `#hamburger`, `#nav-links`.
- Produces: `window.VernalSearch.filterContent(query, data)`, `window.VernalSearch.extractNumber(text)`, array global `window.SITE_CONTENT` con `{titulo, texto, url}` (se completa por página en Task 6 vía `<script>` inline antes de `main.js`, o se define completo acá con todas las entradas de FAQ + servicios).

- [ ] **Step 1: Escribir test de las funciones puras**

```javascript
// build/test-main.js
const assert = require('assert');
const { filterContent, extractNumber } = require('../main.js');

// extractNumber
assert.strictEqual(extractNumber('20+'), 20);
assert.strictEqual(extractNumber('24/7'), 24);
assert.strictEqual(extractNumber('100%'), 100);
assert.strictEqual(extractNumber('NOA'), null);

// filterContent
const data = [
  { titulo: 'Excarcelaciones', texto: 'Pedidos de libertad y morigeración de prisión preventiva', url: 'servicios.html#excarcelaciones' },
  { titulo: '¿Puedo negarme a declarar?', texto: 'Sí, es un derecho constitucional', url: 'faq.html#declarar' },
];
assert.strictEqual(filterContent('excarce', data).length, 1);
assert.strictEqual(filterContent('declarar', data).length, 1);
assert.strictEqual(filterContent('inexistente', data).length, 0);
assert.strictEqual(filterContent('', data).length, 0);

console.log('main.js: todos los tests pasaron');
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `node build/test-main.js`
Expected: `Error: Cannot find module '../main.js'` (todavía no existe)

- [ ] **Step 3: Escribir `main.js`**

```javascript
function extractNumber(text) {
  const match = String(text).match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function filterContent(query, data) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return data.filter(function (item) {
    return item.titulo.toLowerCase().includes(q) || item.texto.toLowerCase().includes(q);
  });
}

function animateCounter(el, target, duration) {
  const start = performance.now();
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = prefix + value + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + target + suffix;
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent;
      const target = extractNumber(raw);
      if (target !== null) {
        const prefix = raw.split(String(target))[0] || '';
        const suffix = raw.split(String(target))[1] || '';
        el.dataset.prefix = prefix;
        el.dataset.suffix = suffix;
        animateCounter(el, target, 1200);
      }
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(function (el) { observer.observe(el); });
}

function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  const observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(function (el) { observer.observe(el); });
}

function initMegaMenu() {
  const trigger = document.getElementById('mega-menu-trigger');
  const menu = document.getElementById('mega-menu');
  if (!trigger || !menu) return;
  function close() { menu.classList.remove('open'); }
  trigger.addEventListener('click', function (e) {
    e.preventDefault();
    menu.classList.toggle('open');
  });
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && e.target !== trigger) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
}

function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!hamburger || !links) return;
  hamburger.addEventListener('click', function () {
    links.classList.toggle('open');
  });
}

function initSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input || !results || !window.SITE_CONTENT) return;
  input.addEventListener('input', function () {
    const matches = filterContent(input.value, window.SITE_CONTENT);
    if (!input.value.trim()) {
      results.classList.remove('open');
      results.innerHTML = '';
      return;
    }
    results.innerHTML = matches.length
      ? matches.map(function (m) { return '<a href="' + m.url + '">' + m.titulo + '</a>'; }).join('')
      : '<div class="search-empty">Sin resultados</div>';
    results.classList.add('open');
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    initCounters();
    initReveal();
    initMegaMenu();
    initMobileNav();
    initSearch();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { extractNumber, filterContent };
}
```

- [ ] **Step 4: Ejecutar el test y verificar que pasa**

Run: `node build/test-main.js`
Expected: `main.js: todos los tests pasaron`

- [ ] **Step 5: Commit**

```bash
git add main.js build/test-main.js
git commit -m "feat: buscador, contadores animados, mega-menu y reveal-on-scroll"
```

---

### Task 3: `wizard-civil.js` — clasificación cualitativa de prueba civil

**Files:**
- Create: `wizard-civil.js`
- Test: `build/test-wizard-civil.js`

**Interfaces:**
- Produces: `classifyCivilCase({ tipoProceso, pruebaDisponible, plazoAudiencia })` → `{ complejidad: 'baja'|'media'|'alta', cargaProueba: string, mensaje: string }`. Valores válidos: `tipoProceso ∈ {'ejecutivo','sumario','ordinario'}`, `pruebaDisponible ∈ {'completa','parcial','escasa'}`, `plazoAudiencia ∈ {'mas-30-dias','menos-30-dias','sin-fecha'}`.

- [ ] **Step 1: Escribir el test**

```javascript
// build/test-wizard-civil.js
const assert = require('assert');
const { classifyCivilCase } = require('../wizard-civil.js');

const baja = classifyCivilCase({ tipoProceso: 'ejecutivo', pruebaDisponible: 'completa', plazoAudiencia: 'mas-30-dias' });
assert.strictEqual(baja.complejidad, 'baja');

const alta = classifyCivilCase({ tipoProceso: 'ordinario', pruebaDisponible: 'escasa', plazoAudiencia: 'sin-fecha' });
assert.strictEqual(alta.complejidad, 'alta');

const media = classifyCivilCase({ tipoProceso: 'sumario', pruebaDisponible: 'parcial', plazoAudiencia: 'menos-30-dias' });
assert.strictEqual(media.complejidad, 'media');

['baja', 'media', 'alta'].forEach(function (nivel) {
  const r = [baja, media, alta].find(function (x) { return x.complejidad === nivel; });
  assert.ok(!/%|\d+\s*%/.test(r.mensaje), 'no debe contener porcentajes: ' + nivel);
});

console.log('wizard-civil.js: todos los tests pasaron');
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `node build/test-wizard-civil.js`
Expected: `Error: Cannot find module '../wizard-civil.js'`

- [ ] **Step 3: Escribir `wizard-civil.js`**

```javascript
function classifyCivilCase(input) {
  const pesoProceso = { ejecutivo: 0, sumario: 1, ordinario: 2 };
  const pesoPrueba = { completa: 0, parcial: 1, escasa: 2 };
  const pesoPlazo = { 'mas-30-dias': 0, 'menos-30-dias': 1, 'sin-fecha': 2 };

  const score = pesoProceso[input.tipoProceso] + pesoPrueba[input.pruebaDisponible] + pesoPlazo[input.plazoAudiencia];
  const complejidad = score <= 1 ? 'baja' : score <= 3 ? 'media' : 'alta';

  const cargaProuebaTexto = {
    completa: 'Contás con elementos de prueba sólidos para sostener tu posición procesal.',
    parcial: 'Tenés parte de la prueba necesaria; conviene reforzar los puntos débiles antes de la audiencia.',
    escasa: 'La prueba disponible es limitada; es prioritario definir una estrategia de producción probatoria cuanto antes.',
  }[input.pruebaDisponible];

  const mensajePorComplejidad = {
    baja: 'El proceso presenta una complejidad procesal baja: los plazos y el tipo de trámite son manejables con una preparación estándar.',
    media: 'El proceso presenta una complejidad procesal media: conviene planificar la estrategia probatoria con margen de tiempo.',
    alta: 'El proceso presenta una complejidad procesal alta: se recomienda asesoramiento inmediato para no perder plazos ni prueba clave.',
  }[complejidad];

  return { complejidad: complejidad, cargaProueba: cargaProuebaTexto, mensaje: mensajePorComplejidad };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { classifyCivilCase };
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `node build/test-wizard-civil.js`
Expected: `wizard-civil.js: todos los tests pasaron`

- [ ] **Step 5: Commit**

```bash
git add wizard-civil.js build/test-wizard-civil.js
git commit -m "feat: lógica de clasificación cualitativa del wizard civil"
```

---

### Task 4: `civil.html`

**Files:**
- Create: `civil.html`

**Interfaces:**
- Consumes: `styles.css`, `main.js`, `wizard-civil.js` (agrega su propio `<script>` inline que usa `classifyCivilCase` — en el navegador `wizard-civil.js` expone la función como global porque `module` no existe ahí, así que también debe asignarla a `window.classifyCivilCase` al final del archivo. **Ajuste a Task 3:** agregar `if (typeof window !== 'undefined') { window.classifyCivilCase = classifyCivilCase; }` antes del bloque de `module.exports`.

- [ ] **Step 1: Ajustar `wizard-civil.js` para exponerse también en `window`**

```javascript
if (typeof window !== 'undefined') {
  window.classifyCivilCase = classifyCivilCase;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { classifyCivilCase };
}
```

(Reemplaza el bloque final de `module.exports` de Task 3, Step 3.)

- [ ] **Step 2: Escribir `civil.html`**

Contenido: header/nav compartido (igual patrón que se define en Task 6 para todas las páginas), hero corto ("Derecho Civil — Teoría de la prueba"), wizard de 3 preguntas (una pantalla por pregunta con barra de progreso, igual patrón visual que el quiz de urgencia), resultado con `complejidad`, `cargaProueba` y `mensaje`, disclaimer: "Este resultado es orientativo, no constituye asesoramiento legal vinculante ni reemplaza una consulta profesional." Botón final a `contacto.html`.

Estructura del wizard en el `<script>` de la página (después de cargar `main.js` y `wizard-civil.js`):

```html
<script>
  (function () {
    const respuestas = {};
    const pasos = document.querySelectorAll('.wizard-step');
    let actual = 0;

    function mostrarPaso(i) {
      pasos.forEach(function (p, idx) { p.hidden = idx !== i; });
      document.getElementById('wizard-progress').style.width = ((i / (pasos.length - 1)) * 100) + '%';
    }

    document.querySelectorAll('[data-answer]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        respuestas[btn.dataset.question] = btn.dataset.answer;
        if (actual < pasos.length - 1) {
          actual++;
          mostrarPaso(actual);
        }
        if (actual === pasos.length - 1) {
          const resultado = window.classifyCivilCase(respuestas);
          document.getElementById('resultado-complejidad').textContent = resultado.complejidad.toUpperCase();
          document.getElementById('resultado-carga').textContent = resultado.cargaProueba;
          document.getElementById('resultado-mensaje').textContent = resultado.mensaje;
        }
      });
    });

    mostrarPaso(0);
  })();
</script>
```

Cada pregunta es un `<div class="wizard-step">` con botones `<button data-question="tipoProceso" data-answer="ejecutivo">`, etc. La última "pantalla" (`pasos.length - 1`) es el resultado, sin botones de respuesta, solo con los `<span>` de salida (`#resultado-complejidad`, `#resultado-carga`, `#resultado-mensaje`) y el disclaimer fijo.

- [ ] **Step 3: Verificar en navegador**

Abrir `civil.html` en el navegador embebido, completar las 3 preguntas y confirmar que el resultado muestra complejidad/carga/mensaje sin ningún porcentaje.

- [ ] **Step 4: Commit**

```bash
git add civil.html wizard-civil.js
git commit -m "feat: página civil.html con wizard de teoría de la prueba"
```

---

### Task 5: `quiz-urgencia.js` + `contacto.html`

**Files:**
- Create: `quiz-urgencia.js`
- Create: `contacto.html`
- Test: `build/test-quiz-urgencia.js`

**Interfaces:**
- Produces: `classifyUrgency({ detencionEnCurso, allanamiento, notificacionFormal, tipoDelito })` → `{ nivel: 'urgente'|'alto'|'preventiva', complejidad: 'baja'|'media'|'alta', recomendaciones: string[], tripartito: { fiscal, juez, defensa }, disclaimer: string }`. `tipoDelito ∈ {'contravencional-menor','delito-comun','delito-complejo'}`. Booleans para las otras tres.

- [ ] **Step 1: Escribir el test**

```javascript
// build/test-quiz-urgencia.js
const assert = require('assert');
const { classifyUrgency } = require('../quiz-urgencia.js');

const urgente = classifyUrgency({ detencionEnCurso: true, allanamiento: false, notificacionFormal: false, tipoDelito: 'delito-comun' });
assert.strictEqual(urgente.nivel, 'urgente');

const urgentePorAllanamiento = classifyUrgency({ detencionEnCurso: false, allanamiento: true, notificacionFormal: false, tipoDelito: 'contravencional-menor' });
assert.strictEqual(urgentePorAllanamiento.nivel, 'urgente');

const alto = classifyUrgency({ detencionEnCurso: false, allanamiento: false, notificacionFormal: true, tipoDelito: 'delito-comun' });
assert.strictEqual(alto.nivel, 'alto');

const preventiva = classifyUrgency({ detencionEnCurso: false, allanamiento: false, notificacionFormal: false, tipoDelito: 'contravencional-menor' });
assert.strictEqual(preventiva.nivel, 'preventiva');

[urgente, urgentePorAllanamiento, alto, preventiva].forEach(function (r) {
  assert.ok(!/%/.test(JSON.stringify(r)), 'no debe contener porcentajes');
  assert.ok(r.disclaimer.length > 0);
  assert.ok(r.tripartito.fiscal && r.tripartito.juez && r.tripartito.defensa);
});

console.log('quiz-urgencia.js: todos los tests pasaron');
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `node build/test-quiz-urgencia.js`
Expected: `Error: Cannot find module '../quiz-urgencia.js'`

- [ ] **Step 3: Escribir `quiz-urgencia.js`**

```javascript
function classifyUrgency(input) {
  let nivel;
  if (input.detencionEnCurso || input.allanamiento) nivel = 'urgente';
  else if (input.notificacionFormal) nivel = 'alto';
  else nivel = 'preventiva';

  const pesoDelito = { 'contravencional-menor': 0, 'delito-comun': 1, 'delito-complejo': 2 };
  let complejidad = ['baja', 'media', 'alta'][pesoDelito[input.tipoDelito]];
  if (nivel === 'urgente' && complejidad === 'baja') complejidad = 'media';

  const recomendacionesPorNivel = {
    urgente: [
      'Comunicate de inmediato por WhatsApp o teléfono: la actuación en las primeras horas es clave.',
      'No firmes ni declares nada sin asistencia letrada presente.',
      'Anotá horarios, lugar y nombres de los funcionarios intervinientes.',
    ],
    alto: [
      'Reuní toda la documentación de la notificación o citación recibida.',
      'Agendá la consulta antes de la fecha de audiencia indicada.',
      'No respondas requerimientos del MPF sin asesoramiento previo.',
    ],
    preventiva: [
      'Programá una consulta para evaluar tu situación con anticipación.',
      'Reuní antecedentes y documentación relevante antes de la reunión.',
      'Definí junto al abogado una estrategia preventiva.',
    ],
  };

  const tripartito = {
    fiscal: 'El Ministerio Público evalúa la calificación legal de los hechos y la necesidad de medidas cautelares.',
    juez: 'El juez controla la legalidad de lo actuado y resuelve sobre la libertad y las medidas solicitadas.',
    defensa: 'La defensa puede cuestionar la calificación, aportar prueba propia y plantear alternativas a la prisión preventiva.',
  };

  return {
    nivel: nivel,
    complejidad: complejidad,
    recomendaciones: recomendacionesPorNivel[nivel],
    tripartito: tripartito,
    disclaimer: 'Este análisis es orientativo: no predice resultados judiciales, no genera relación abogado-cliente y no reemplaza una entrevista profesional.',
  };
}

if (typeof window !== 'undefined') {
  window.classifyUrgency = classifyUrgency;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { classifyUrgency };
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `node build/test-quiz-urgencia.js`
Expected: `quiz-urgencia.js: todos los tests pasaron`

- [ ] **Step 5: Escribir `contacto.html`**

Contenido: header/nav compartido, sección de horario 24/7 para detenciones/allanamientos (con el teléfono +54 381 632 1536 como link `tel:` y `https://wa.me/5493816321536`), 2–3 `.office-card` (dirección real pendiente → `.nota-confirmar`), formulario demo (`<form onsubmit="event.preventDefault(); ...">` que solo muestra un mensaje de confirmación en pantalla, sin envío real, con disclaimer de confidencialidad), y el wizard de 4 preguntas (`#quiz`) con el mismo patrón de `.wizard-step` + barra de progreso que Task 4, pero llamando a `window.classifyUrgency` y renderizando `nivel`, `complejidad` (semáforo con clases `.semaforo-baja/media/alta`), lista de `recomendaciones`, bloque tripartito y `disclaimer`.

- [ ] **Step 6: Verificar en navegador**

Completar el quiz con las 4 combinaciones principales (detención, allanamiento, notificación, ninguna) y confirmar que nunca aparece un porcentaje y que el disclaimer siempre se muestra.

- [ ] **Step 7: Commit**

```bash
git add quiz-urgencia.js contacto.html build/test-quiz-urgencia.js
git commit -m "feat: quiz de urgencia y página de contacto"
```

---

### Task 6: `index.html`, `perfil.html`, `servicios.html`, `faq.html`

**Files:**
- Create: `index.html`
- Create: `perfil.html`
- Create: `servicios.html`
- Create: `faq.html`

**Interfaces:**
- Consumes: `styles.css`, `main.js`. Cada página define `window.SITE_CONTENT` (mismo array completo en las 4 páginas, ver contenido abajo) **antes** de cargar `main.js`, para que el buscador funcione en cualquier página.

- [ ] **Step 1: Definir el array compartido `SITE_CONTENT`** (va inline en un `<script>` antes de `main.js` en las 6 páginas)

```html
<script>
  window.SITE_CONTENT = [
    { titulo: 'Urgencias 24/7', texto: 'Atención inmediata ante detenciones y allanamientos', url: 'servicios.html#urgencias' },
    { titulo: 'Delitos complejos', texto: 'Defensa técnica en causas de alta complejidad probatoria', url: 'servicios.html#complejos' },
    { titulo: 'Querellas', texto: 'Representación de la parte querellante', url: 'servicios.html#querellas' },
    { titulo: 'Asesoramiento preventivo', texto: 'Prevención de riesgo penal antes de que exista una causa', url: 'servicios.html#preventivo' },
    { titulo: 'Excarcelaciones', texto: 'Pedidos de libertad y morigeración de la prisión preventiva', url: 'servicios.html#excarcelaciones' },
    { titulo: 'Recursos y casación', texto: 'Apelación y casación ante decisiones desfavorables', url: 'servicios.html#recursos' },
    { titulo: 'Derecho civil — teoría de la prueba', texto: 'Evaluación cualitativa de carga probatoria en procesos civiles', url: 'civil.html' },
    { titulo: '¿Me pueden detener sin orden judicial?', texto: 'Casos de flagrancia y sus límites', url: 'faq.html#deteccion-sin-orden' },
    { titulo: '¿Qué es la audiencia de control de detención?', texto: 'Qué pasa en las primeras 24-48 horas', url: 'faq.html#audiencia-control' },
    { titulo: '¿Cómo pido la excarcelación?', texto: 'Requisitos y momento procesal oportuno', url: 'faq.html#excarcelacion' },
    { titulo: '¿Tengo que declarar?', texto: 'El derecho a no autoincriminarse', url: 'faq.html#declarar' },
    { titulo: '¿Qué hago si allanan mi domicilio?', texto: 'Pasos inmediatos y qué controlar del acta', url: 'faq.html#allanamiento' },
    { titulo: '¿Cuánto dura un proceso penal?', texto: 'Plazos habituales según el fuero', url: 'faq.html#duracion' },
  ];
</script>
```

- [ ] **Step 2: Escribir el header/nav/footer compartido** (mismo bloque HTML en las 6 páginas, ajustando la clase `.active` del link correspondiente)

```html
<header class="site-header">
  <div class="container nav">
    <a href="index.html" class="nav-logo">Ricardo Vernal</a>
    <nav id="nav-links" class="nav-links">
      <a href="index.html">Inicio</a>
      <a href="perfil.html">Perfil</a>
      <a href="servicios.html" id="mega-menu-trigger">Servicios ▾</a>
      <a href="faq.html">FAQ</a>
      <a href="contacto.html" class="btn btn-primary">Consulta urgente</a>
      <div class="search-box">
        <input id="search-input" type="search" placeholder="Buscar..." aria-label="Buscar en el sitio">
        <div id="search-results" class="search-results"></div>
      </div>
    </nav>
    <button id="hamburger" class="hamburger" aria-label="Abrir menú">☰</button>
  </div>
  <div id="mega-menu" class="mega-menu">
    <div class="container mega-menu-grid">
      <div class="mega-menu-item"><h4>Urgencias 24/7</h4><p>Detenciones y allanamientos en curso</p></div>
      <div class="mega-menu-item"><h4>Delitos complejos</h4><p>Causas de alta complejidad probatoria</p></div>
      <div class="mega-menu-item"><h4>Querellas</h4><p>Representación de la parte querellante</p></div>
      <div class="mega-menu-item"><h4>Asesoramiento preventivo</h4><p>Prevención de riesgo penal</p></div>
      <div class="mega-menu-item"><h4>Excarcelaciones</h4><p>Pedidos de libertad</p></div>
      <div class="mega-menu-item"><h4>Recursos y casación</h4><p>Apelación ante decisiones desfavorables</p></div>
    </div>
  </div>
</header>

<!-- ... contenido específico de cada página ... -->

<footer class="site-footer">
  <div class="container">
    <p>Ricardo Vernal — Abogado penalista · San Miguel de Tucumán, Argentina</p>
    <p>+54 381 632 1536 · audienicasvernal@gmail.com</p>
    <p class="nota-confirmar">Este sitio no reemplaza asesoramiento legal profesional ni constituye publicidad de resultados.</p>
  </div>
</footer>
<script src="main.js"></script>
```

- [ ] **Step 3: Escribir `index.html`** (hero + stats + diferenciadores + teaser servicios + teaser quiz + cita)

Hero: `<h1>Defensa penal <span class="dorado">seria y directa</span> en Tucumán y el NOA</h1>`, bajada PAS: "Una detención, un allanamiento o una citación judicial no dan tiempo para dudar. 20 años de litigación exclusiva en derecho penal para actuar desde la primera hora." CTAs: "Consulta urgente" (→ `contacto.html#quiz`) y "Evaluar mi situación" (→ `contacto.html#quiz`).

Stats (`data-counter` en cada valor): `20+` (años de litigación), `NOA` (alcance regional, sin animar por no ser numérico), `24/7` (disponibilidad en urgencias), `100%` (dedicación exclusiva al derecho penal).

Diferenciadores (`data-reveal` en cada bloque): "Ejercicio exclusivo en derecho penal", "Litigación en fuero ordinario y federal", "Atención directa con el abogado, no con gestores".

Teaser de servicios: grid `.card-grid` con las 6 áreas (mismo contenido que el mega-menú, con `<a class="service-card" data-reveal>`).

Teaser del quiz: bloque con CTA "Hacé el análisis de urgencia" → `contacto.html#quiz`.

Cita institucional (real, del propio Ricardo — placeholder hasta confirmar la frase exacta): `<blockquote class="nota-confirmar">[Cita de Ricardo Vernal — a confirmar el texto exacto]</blockquote>`.

- [ ] **Step 4: Escribir `perfil.html`**

Trayectoria: párrafo con los datos confirmados (20+ años, fuero ordinario Tucumán y federal, marco normativo CP/CPPN/CPP Tucumán/CN/CADH/PIDCP). Timeline institucional: lista de hitos con `<span class="nota-confirmar">Fecha a confirmar</span>` en cada ítem hasta tener años reales. Enfoque diferencial: párrafo sobre compliance penal y sector salud/farmacéutico envuelto en `.nota-confirmar` (marcado explícitamente como "a confirmar" según el brief). Sección "En los medios": `<p class="nota-confirmar">Próximamente: menciones y publicaciones verificadas.</p>` (vacía hasta tener enlaces reales, sin fabricar contenido).

- [ ] **Step 5: Escribir `servicios.html`**

6 secciones con anchors (`id="urgencias"`, `id="complejos"`, `id="querellas"`, `id="preventivo"`, `id="excarcelaciones"`, `id="recursos"`), cada una con título, párrafo JTBD ("Cuando [situación del cliente], necesitás [resultado]...") y CTA a `contacto.html`. Sección final "Derecho civil" con párrafo corto y link a `civil.html`.

- [ ] **Step 6: Escribir `faq.html`**

Acordeón con `.accordion-item` para cada pregunta del `SITE_CONTENT` de FAQ (detención sin orden, audiencia de control, excarcelación, declarar o no, allanamiento, duración del proceso). Wiring del acordeón en un `<script>` inline:

```html
<script>
  document.querySelectorAll('.accordion-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.parentElement.classList.toggle('open');
    });
  });
</script>
```

- [ ] **Step 7: Verificar en navegador**

Navegar por las 4 páginas, confirmar que el buscador encuentra resultados de `faq.html` y `servicios.html` desde `index.html`, que los contadores animan una sola vez al hacer scroll, y que el acordeón de `faq.html` abre/cierra correctamente.

- [ ] **Step 8: Commit**

```bash
git add index.html perfil.html servicios.html faq.html
git commit -m "feat: páginas de contenido (home, perfil, servicios, faq)"
```

---

### Task 7: Optimización de rendimiento — imágenes y minificación

**Files:**
- Create: `build/minify.py`
- Create: `build/test_minify.py`
- Create: `README-IMAGENES.md`

**Interfaces:**
- Produces: `minify_css(text)`, `minify_js(text)`, `build_dist(source_dir, dist_dir)` en `build/minify.py`.

- [ ] **Step 1: Escribir el test del minificador**

```python
# build/test_minify.py
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from minify import minify_css, minify_js

def test_minify_css_strips_comments_and_whitespace():
    src = """
    /* comentario */
    .a {   color:   red;   }

    .b { color: blue; }
    """
    out = minify_css(src)
    assert '/*' not in out
    assert len(out) < len(src)
    assert '.a{color: red;}'.replace(' ', '') in out.replace(' ', '')

def test_minify_js_strips_comments_and_blank_lines():
    src = "\n\n// comentario\nfunction f() {\n  return 1;\n}\n\n"
    out = minify_js(src)
    assert '// comentario' not in out
    assert 'function f()' in out
    assert out.count('\n\n') == 0

test_minify_css_strips_comments_and_whitespace()
test_minify_js_strips_comments_and_blank_lines()
print('minify.py: todos los tests pasaron')
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `python build/test_minify.py`
Expected: `ModuleNotFoundError: No module named 'minify'`

- [ ] **Step 3: Escribir `build/minify.py`**

```python
import re
import shutil
import os

EXCLUDE_DIRS = {'.git', 'docs', 'build', 'dist'}


def minify_css(text):
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\s*([{}:;,])\s*', r'\1', text)
    return text.strip()


def minify_js(text):
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)
    lines = text.split('\n')
    kept = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith('//'):
            continue
        kept.append(stripped)
    return '\n'.join(kept)


def build_dist(source_dir, dist_dir):
    if os.path.exists(dist_dir):
        shutil.rmtree(dist_dir)

    def ignore(dir_path, names):
        rel = os.path.relpath(dir_path, source_dir)
        if rel == '.':
            return [n for n in names if n in EXCLUDE_DIRS]
        return []

    shutil.copytree(source_dir, dist_dir, ignore=ignore)

    for root, dirs, files in os.walk(dist_dir):
        for name in files:
            path = os.path.join(root, name)
            if name.endswith('.css'):
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(minify_css(content))
            elif name.endswith('.js'):
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(minify_js(content))


if __name__ == '__main__':
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dist_path = os.path.join(project_root, 'dist')
    build_dist(project_root, dist_path)
    print('dist/ generado en:', dist_path)
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `python build/test_minify.py`
Expected: `minify.py: todos los tests pasaron`

- [ ] **Step 5: Generar `dist/` y verificar reducción de tamaño**

Run: `python build/minify.py`
Expected: imprime la ruta de `dist/`; luego comparar tamaños:

Run: `du -sh styles.css dist/styles.css` (o `Get-Item` en PowerShell)
Expected: `dist/styles.css` es igual o menor en bytes que `styles.css`

- [ ] **Step 6: Añadir `loading="lazy"` y dimensiones a imágenes no-hero**

En cada `<picture class="img-placeholder">` usado en `perfil.html` (foto de Ricardo) agregar:

```html
<picture class="img-placeholder">
  <img src="assets/placeholder-rv.svg" alt="Foto de Ricardo Vernal (a incorporar)" loading="lazy" width="400" height="500">
</picture>
```

La imagen del hero (si se agrega alguna en el futuro) NO lleva `loading="lazy"`, para no retrasar el LCP.

- [ ] **Step 7: Escribir `README-IMAGENES.md`**

```markdown
# Cómo reemplazar los placeholders de imagen

Todas las fotos reales (Ricardo, oficina) hoy son placeholders SVG (`assets/placeholder-rv.svg`).

Cuando tengas fotos reales:

1. Exportalas en formato **WebP** (mejor compresión que JPG/PNG a igual calidad).
2. Generá 2 tamaños: uno para mobile (ancho ~480px) y otro para desktop (ancho ~800px).
3. Reemplazá el `<img>` del placeholder por:

\`\`\`html
<picture class="img-placeholder">
  <source media="(min-width: 960px)" srcset="assets/ricardo-desktop.webp">
  <img src="assets/ricardo-mobile.webp" alt="Ricardo Vernal" loading="lazy" width="400" height="500">
</picture>
\`\`\`

4. No le pongas `loading="lazy"` a la imagen del hero (la primera que se ve al cargar la página):
   eso empeora el tiempo de carga percibido.

# Cómo generar la versión optimizada para subir a Hostinger

El sitio se edita en los archivos de esta carpeta (`styles.css`, `main.js`, etc. — legibles,
sin minificar). Antes de subir por FTP, corré:

\`\`\`
python build/minify.py
\`\`\`

Esto genera una carpeta `dist/` con copias minificadas de `.css` y `.js` (mismo nombre de
archivo, así el HTML no necesita cambios). Subí el **contenido de `dist/`**, no la carpeta
raíz del proyecto.
```

- [ ] **Step 8: Commit**

```bash
git add build/minify.py build/test_minify.py README-IMAGENES.md perfil.html
git commit -m "feat: minificación de build, lazy loading e instrucciones de imágenes"
```

---

### Task 8: QA final, README general y verificación

**Files:**
- Create: `README.md`
- Modify: `.gitignore` (crear si no existe)

**Interfaces:**
- Ninguna nueva; este task valida la integración completa de Tasks 1–7.

- [ ] **Step 1: Crear `.gitignore`**

```
dist/
```

- [ ] **Step 2: Escribir `README.md`**

```markdown
# Sitio de Ricardo Vernal

Sitio estático (HTML/CSS/JS plano, sin build step) para edición directa por FTP/File Manager
de Hostinger.

## Estructura

- `index.html`, `perfil.html`, `servicios.html`, `civil.html`, `faq.html`, `contacto.html`
- `styles.css` — todo el diseño y las media queries responsive
- `main.js` — nav, mega-menú, buscador, contadores, reveal-on-scroll
- `quiz-urgencia.js` — lógica del análisis de urgencia (contacto.html)
- `wizard-civil.js` — lógica del wizard de teoría de la prueba civil (civil.html)
- `assets/` — imágenes (hoy, placeholders SVG — ver `README-IMAGENES.md`)
- `build/` — script de minificación y tests (no se sube a Hostinger)

## Editar contenido

Todo el texto está directamente en los `.html`. Buscá el texto en el editor y reemplazalo.
Los bloques marcados con la clase `nota-confirmar` son datos institucionales pendientes de
validar (fechas, enfoque de compliance, menciones en medios) — completalos cuando tengas la
información real y sacá la clase `nota-confirmar` del elemento.

## Publicar (FTP a Hostinger)

1. Corré `python build/minify.py` para generar `dist/`.
2. Subí el contenido de `dist/` (no la carpeta raíz) por FTP o File Manager.

## Tests

\`\`\`
node build/test-main.js
node build/test-wizard-civil.js
node build/test-quiz-urgencia.js
python build/test_minify.py
\`\`\`
```

- [ ] **Step 3: Correr todos los tests**

Run: `node build/test-main.js && node build/test-wizard-civil.js && node build/test-quiz-urgencia.js && python build/test_minify.py`
Expected: los 4 mensajes de "todos los tests pasaron"

- [ ] **Step 4: Checklist manual en navegador**

Abrir `index.html` y recorrer: navegación a las 6 páginas, mega-menú, buscador (probar "excarce" y "declarar"), contadores animando una vez, reveal-on-scroll, acordeón de FAQ, wizard civil (3 preguntas → resultado sin porcentajes), quiz de urgencia (4 preguntas, las 3 combinaciones de nivel → resultado sin porcentajes, con disclaimer), formulario de contacto (confirma sin enviar datos reales), responsive en ancho mobile (375px) y desktop (1280px).

- [ ] **Step 5: Commit final**

```bash
git add README.md .gitignore
git commit -m "docs: README de edición, publicación y tests"
```

## Self-Review

**Cobertura del spec:** arquitectura de archivos (Task 1–7), sistema de diseño y placeholders (Task 1), mega-menú/buscador/contadores/reveal (Task 2), quiz de urgencia sin porcentajes con disclaimer (Task 5), wizard civil cualitativo (Task 3–4), las 6 páginas con copy real y `.nota-confirmar` (Task 6), responsive/viewport/media queries (Task 1 + verificación Task 8), imágenes adaptativas + lazy loading + WebP a futuro (Task 7), minificación CSS/JS sin build step en producción (Task 7), QA manual (Task 8). Sin gaps.

**Placeholders:** ninguno de tipo "TBD"/"implementar después" — los únicos placeholders son de **contenido institucional no confirmable** (`.nota-confirmar`), que es un requisito explícito del brief, no una omisión del plan.

**Consistencia de tipos:** `classifyCivilCase` y `classifyUrgency` devuelven siempre los mismos campos usados en Tasks 4 y 5 (`complejidad`, `cargaProueba`/`mensaje` para civil; `nivel`, `complejidad`, `recomendaciones`, `tripartito`, `disclaimer` para urgencia). `filterContent`/`extractNumber` firmas iguales entre Task 2 (definición) y su uso en Task 6 (vía `SITE_CONTENT`).
