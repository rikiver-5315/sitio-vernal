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
