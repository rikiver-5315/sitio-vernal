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

## Diseño

- Paleta "Precisión: Seguridad y Dinamismo": azul petróleo (`--azul-noche: #004c54`), plateado
  (`--plateado: #c0c0c0`) y acento terracota (`--acento: #a0522d`), definida en `:root` en
  `styles.css`. El acento se usa solo en botones/elementos interactivos críticos.
- Tipografía: Montserrat (encabezados) + Playfair Display (cuerpo), cargadas desde Google Fonts
  con `preconnect` y `display=swap` para no penalizar el rendimiento.
- Responsive: mobile-first, con breakpoints en 600px (tablet) y 960px (desktop).

## Publicar (FTP a Hostinger)

1. Corré `python build/minify.py` para generar `dist/`.
2. Subí el contenido de `dist/` (no la carpeta raíz) por FTP o File Manager.

## Tests

```
node build/test-main.js
node build/test-wizard-civil.js
node build/test-quiz-urgencia.js
python build/test_minify.py
```
