from PIL import Image
import os

# Rutas
input_path = "assets/ricardo-vernal-hero.jpg"
output_path = "assets/ricardo-vernal-hero.jpg"

# Color azul marino de la página
azul_noche = (0, 51, 102)  # #003366

try:
    # Abrir imagen
    img = Image.open(input_path)
    print(f"✅ Imagen abierta: {img.size}")

    # Convertir a RGB si es necesario
    if img.mode != 'RGB':
        img = img.convert('RGB')

    # Crear nueva imagen
    pixels = img.load()
    width, height = img.size

    # Reemplazar fondo gris por azul marino
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]

            # Si el píxel es gris (valores similares) y claro, reemplazar
            if (160 <= r <= 200 and 160 <= g <= 200 and 160 <= b <= 200):
                # Mantener gradualmente hacia los bordes
                pixels[x, y] = azul_noche
            elif (140 <= r <= 220 and 140 <= g <= 220 and 140 <= b <= 220):
                # Gris más claro
                pixels[x, y] = azul_noche

    print(f"✅ Fondo reemplazado con azul marino")

    # Guardar
    img.save(output_path, "JPEG", quality=90, optimize=True)
    print(f"✅ Imagen guardada: {output_path}")
    print(f"\n🎉 ¡Fondo actualizado!")

except Exception as e:
    print(f"❌ Error: {e}")
