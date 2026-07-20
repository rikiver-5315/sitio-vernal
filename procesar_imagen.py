from PIL import Image, ImageFilter
import os

# Rutas
input_path = "C:\\Users\\LENOVO\\Desktop\\ricardo-vernal.jpg"
output_path = "assets/ricardo-vernal-hero.jpg"

try:
    # Abrir imagen
    img = Image.open(input_path)
    print(f"✅ Imagen abierta: {img.size}")

    # Crop a proporciones 4:5 (500x650px)
    width, height = img.size
    target_ratio = 4/5

    # Calcular crop centrado
    if width / height > target_ratio:
        # Imagen muy ancha, crop horizontal
        new_width = int(height * target_ratio)
        left = (width - new_width) // 2
        img = img.crop((left, 0, left + new_width, height))
    else:
        # Imagen muy alta, crop vertical
        new_height = int(width / target_ratio)
        top = (height - new_height) // 2
        img = img.crop((0, top, width, top + new_height))

    print(f"✅ Imagen recortada: {img.size}")

    # Redimensionar a 500x650
    img = img.resize((500, 650), Image.Resampling.LANCZOS)
    print(f"✅ Imagen redimensionada a 500x650")

    # Difuminar esquina superior derecha (marca de agua)
    img_copy = img.copy()
    corner_region = img_copy.crop((320, 0, 500, 120))
    corner_blurred = corner_region.filter(ImageFilter.GaussianBlur(radius=25))
    img_copy.paste(corner_blurred, (320, 0))
    print(f"✅ Marca de agua difuminada")

    # Crear directorio si no existe
    os.makedirs("assets", exist_ok=True)

    # Guardar con compresión
    img_copy.save(output_path, "JPEG", quality=90, optimize=True)
    print(f"✅ Imagen guardada: {output_path}")

    # Obtener tamaño del archivo
    file_size = os.path.getsize(output_path) / 1024
    print(f"✅ Tamaño del archivo: {file_size:.1f} KB")
    print(f"\n🎉 ¡Listo para usar en el sitio web!")

except FileNotFoundError:
    print(f"❌ Error: No encontré la imagen en {input_path}")
    print("⚠️  Guarda la imagen como 'ricardo-vernal.jpg' en C:\\Users\\LENOVO\\Desktop\\")
except Exception as e:
    print(f"❌ Error: {e}")
