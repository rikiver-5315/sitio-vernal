# Sitio Ricardo Vernal — Diseño

Fecha: 2026-07-19
Estado: Aprobado

## 1. Objetivo

Sitio estático (HTML/CSS/JS plano, sin build step) para Ricardo Vernal, abogado penalista con
20+ años de litigación en el fuero penal ordinario de Tucumán y federal. Alcance regional NOA.
Debe poder subirse por FTP/File Manager a Hostinger y editarse sin depender de un desarrollador.

## 2. Identidad real (no alterar ni inflar)

- Nombre: Ricardo Vernal
- Ubicación: San Miguel de Tucumán, Argentina
- Teléfono / WhatsApp: +54 381 632 1536
- Email: audienicasvernal@gmail.com
- Experiencia: 20+ años, ejercicio exclusivo en derecho penal, fuero ordinario (Tucumán) y federal
- Marco normativo de referencia: CP, CPPN, CPP Tucumán, CN, CADH, PIDCP
- Escala real: práctica boutique / unipersonal. Ninguna cifra institucional (fundación, cantidad
  de abogados, sedes, premios) se inventa; todo lo no confirmado queda como placeholder visible.

## 3. Arquitectura de archivos

```
sitio-vernal/
├── index.html
├── perfil.html
├── servicios.html
├── civil.html
├── faq.html
├── contacto.html
├── styles.css
├── main.js              (nav, mega-menú, buscador, contadores, reveal-on-scroll — global)
├── quiz-urgencia.js     (wizard 4 preguntas, solo contacto.html)
├── wizard-civil.js      (wizard 3 preguntas, solo civil.html)
└── docs/superpowers/specs/2026-07-19-sitio-vernal-design.md
```

Carpeta plana, sin subcarpetas de assets obligatorias (los placeholders de imagen son CSS/SVG
inline, no archivos binarios). JS separado por módulo para que la lógica de cada wizard sea
legible de forma aislada, pero sin bundler ni framework.

## 4. Sistema de diseño

- Paleta: `--azul-noche:#0b0b0c`, `--dorado:#c9a24b`. No se cambia salvo pedido explícito.
- Tipografía: serif en títulos, sans-serif en cuerpo.
- Hero con `clip-path` diagonal.
- Tarjetas separadas por líneas hairline (1px) en vez de sombras/bordes gruesos.
- Placeholders de imagen: bloques sólidos `--azul-noche` con iniciales "RV" o ícono SVG, mismo
  ratio que la imagen real futura, para que el reemplazo no rompa el layout.
- Clase `.nota-confirmar`: marca visualmente (itálica + color atenuado) cualquier dato
  institucional pendiente de validación por Ricardo (fechas de timeline, enfoque compliance
  salud/farmacéutico, enlaces de "en los medios").

## 5. Páginas

1. **index.html** — Home: mensaje de especialización penal NOA, CTAs (consulta urgente /
   evaluar situación), diferenciadores, teaser de servicios, teaser del quiz de urgencia, cita
   institucional. Franja de stats con contadores animados (20+, NOA, 24/7, 100%).
2. **perfil.html** — Trayectoria, timeline institucional (con `.nota-confirmar` donde falten
   fechas reales), enfoque diferencial (compliance penal / salud-farmacéutico — a confirmar),
   sección "en los medios" (vacía / placeholder hasta tener links reales).
3. **servicios.html** — Segmentado: urgencias 24/7, delitos complejos, querellas, asesoramiento
   preventivo, excarcelaciones, recursos y casación. Sección "Derecho civil" con link a civil.html.
4. **civil.html** — Wizard de 3 preguntas (tipo de proceso, prueba disponible, plazo/audiencia) →
   resultado cualitativo sobre carga de la prueba y complejidad procesal.
5. **faq.html** — Preguntas frecuentes en lenguaje claro, formato acordeón.
6. **contacto.html** — Horario 24/7, tarjetas de oficina, formulario de consulta (demo, sin envío
   real todavía), módulo de Análisis de urgencia con IA (#quiz).

## 6. Módulos interactivos

- **Mega-menú** (`main.js`): hover/click en "Servicios" despliega grid de 6 áreas con
  ícono+texto+link. Cierra con click afuera o Escape.
- **Buscador** (`main.js`): input filtra client-side un array `{titulo, texto, url}` con contenido
  de FAQ + servicios. Sin backend, sin fetch.
- **Contadores animados** (`main.js`): `IntersectionObserver` dispara conteo 0→valor una sola vez
  vía `requestAnimationFrame` cuando la franja de stats entra al viewport.
- **Reveal on scroll** (`main.js`): `IntersectionObserver` agrega `.visible` a `[data-reveal]`;
  CSS controla fade/slide.
- **Quiz de urgencia** (`quiz-urgencia.js`, contacto.html): 4 preguntas, una por pantalla, con
  barra de progreso y avance automático:
  1. ¿Hay una detención en curso ahora mismo?
  2. ¿Hubo un allanamiento con secuestro de bienes?
  3. ¿Fuiste notificado de imputación formal o citación a audiencia?
  4. Tipo de delito denunciado

  Clasificación determinística (if/else, sin backend, sin IA real) en: **urgente / alto /
  preventiva**. Cada resultado incluye recomendaciones prácticas, bloque tripartito (qué evalúa
  el fiscal / qué mira el juez / qué puede trabajar la defensa, en lenguaje cualitativo) y
  semáforo de complejidad procesal (baja/media/alta). **Regla no negociable: nunca mostrar
  porcentajes de probabilidad de resultado judicial.** Disclaimer fijo en todo resultado: no
  predice resultados, no genera relación abogado-cliente, no reemplaza entrevista profesional.
- **Wizard civil** (`wizard-civil.js`, civil.html): 3 preguntas → resultado cualitativo (no
  numérico) sobre carga probatoria y complejidad procesal.

## 7. Contenido y copy

Copy completo en español rioplatense, tono profesional serio, sin clichés ni jerga de IA.
Framework PAS en páginas de conversión (home, contacto), JTBD para segmentar servicios.
`.nota-confirmar` solo en los puntos donde el brief marca datos institucionales no confirmables
(timeline exacto, enfoque compliance salud/farmacéutico, "en los medios"). No se inventa
jurisprudencia, expedientes, cargos, premios, testimonios ni cifras de escala institucional.

## 8. QA / testing (sitio estático, sin test runner)

Checklist manual post-build:
- Navegación entre las 6 páginas y enlaces cruzados (servicios.html → civil.html, etc.)
- Mega-menú y buscador funcionando en desktop y mobile
- Contadores animan una sola vez al entrar al viewport (no se repiten al re-scrollear)
- Reveal-on-scroll aplicado a cada sección relevante
- Quiz de urgencia cubre todas las combinaciones de las 4 preguntas sin mostrar nunca porcentajes
- Wizard civil entrega resultado cualitativo para las combinaciones de las 3 preguntas
- Formulario de contacto es demo (no envía datos reales todavía)
- Responsive en los breakpoints definidos en styles.css

## 9. Fuera de alcance (explícito)

- Backend real / envío de formulario (se conecta a Web3Forms o similar recién con el sitio
  publicado)
- Build step, framework o dependencias npm en producción
- Cifras institucionales inventadas (fundación, cantidad de abogados, sedes, premios)
- Porcentajes de probabilidad de resultado judicial en cualquier módulo
- Contenido fabricado de "en los medios" o testimonios sin fuente real
- Migración a un framework con build step sin pedido explícito de Ricardo
