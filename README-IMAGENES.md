# Cómo reemplazar los placeholders de imagen

Todas las fotos reales (Ricardo, oficina) hoy son placeholders SVG (`assets/placeholder-rv.svg`).

Cuando tengas fotos reales:

1. Exportalas en formato **WebP** (mejor compresión que JPG/PNG a igual calidad).
2. Generá 2 tamaños: uno para mobile (ancho ~480px) y otro para desktop (ancho ~800px).
3. Reemplazá el `<img>` del placeholder por:

```html
<picture class="img-placeholder">
  <source media="(min-width: 960px)" srcset="assets/ricardo-desktop.webp">
  <img src="assets/ricardo-mobile.webp" alt="Ricardo Vernal" loading="lazy" width="400" height="500">
</picture>
```

4. No le pongas `loading="lazy"` a la imagen del hero (la primera que se ve al cargar la página):
   eso empeora el tiempo de carga percibido. El resto de las imágenes (perfil, oficina) sí deben
   llevar `loading="lazy"`.

# Cómo generar la versión optimizada para subir a Hostinger

El sitio se edita en los archivos de esta carpeta (`styles.css`, `main.js`, etc. — legibles,
sin minificar). Antes de subir por FTP, corré:

```
python build/minify.py
```

Esto genera una carpeta `dist/` con copias minificadas de `.css` y `.js` (mismo nombre de
archivo, así el HTML no necesita cambios). Subí el **contenido de `dist/`**, no la carpeta
raíz del proyecto.
