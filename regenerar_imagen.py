from PIL import Image, ImageFilter
import os

# Ruta original
input_path = r"C:\Users\LENOVO\Desktop\DELTA MEDICA\foto de perfil .png"
output_path = "assets/ricardo-vernal-hero.jpg"

try:
    # Abrir imagen original
    img = Image.open(input_path)
    print(f"✅ Imagen abierta: {img.size}")

    # Convertir PNG a RGB
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = background
        print(f"✅ Convertida a RGB")

    # Crop a proporciones 4:5
    width, height = img.size
    target_ratio = 4/5

    if width / height > target_ratio:
        new_width = int(height * target_ratio)
        left = (width - new_width) // 2
        img = img.crop((left, 0, left + new_width, height))
    else:
        new_height = int(width / target_ratio)
        top = (height - new_height) // 2
        img = img.crop((0, top, width, top + new_height))

    # Redimensionar a 500x650
    img = img.resize((500, 650), Image.Resampling.LANCZOS)
    print(f"✅ Redimensionada a 500x650")

    # Difuminar solo la esquina superior derecha (marca de agua)
    img_copy = img.copy()
    corner_region = img_copy.crop((320, 0, 500, 120))
    corner_blurred = corner_region.filter(ImageFilter.GaussianBlur(radius=25))
    img_copy.paste(corner_blurred, (320, 0))
    print(f"✅ Marca de agua difuminada")

    # Guardar
    os.makedirs("assets", exist_ok=True)
    img_copy.save(output_path, "JPEG", quality=92, optimize=True)
    print(f"✅ Guardada: {output_path}")

    file_size = os.path.getsize(output_path) / 1024
    print(f"✅ Tamaño: {file_size:.1f} KB")
    print(f"\n🎉 ¡Imagen regenerada correctamente!")

except Exception as e:
    print(f"❌ Error: {e}")
