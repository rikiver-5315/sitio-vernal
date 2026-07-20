from PIL import Image
import os

# Ruta de la imagen original
input_path = "assets/ricardo-vernal-hero.jpg"
output_dir = "assets"

try:
    # Abrir imagen original
    img = Image.open(input_path)
    print(f"✅ Imagen original: {img.size}")

    # 1. Mobile version (250x325px)
    mobile = img.copy()
    mobile.thumbnail((250, 325), Image.Resampling.LANCZOS)
    mobile.save(f"{output_dir}/ricardo-vernal-hero-mobile.jpg", "JPEG", quality=90, optimize=True)
    size_mobile = os.path.getsize(f"{output_dir}/ricardo-vernal-hero-mobile.jpg") / 1024
    print(f"✅ Mobile (250x325): {mobile.size} - {size_mobile:.1f} KB")

    # 2. Mobile @2x (500x650px - mismo que original)
    mobile_2x = img.copy()
    mobile_2x.thumbnail((500, 650), Image.Resampling.LANCZOS)
    mobile_2x.save(f"{output_dir}/ricardo-vernal-hero-mobile@2x.jpg", "JPEG", quality=92, optimize=True)
    size_mobile_2x = os.path.getsize(f"{output_dir}/ricardo-vernal-hero-mobile@2x.jpg") / 1024
    print(f"✅ Mobile @2x (500x650): {mobile_2x.size} - {size_mobile_2x:.1f} KB")

    # 3. Desktop (500x650px - es el actual)
    desktop = img.copy()
    desktop.thumbnail((500, 650), Image.Resampling.LANCZOS)
    desktop.save(f"{output_dir}/ricardo-vernal-hero-desktop.jpg", "JPEG", quality=92, optimize=True)
    size_desktop = os.path.getsize(f"{output_dir}/ricardo-vernal-hero-desktop.jpg") / 1024
    print(f"✅ Desktop (500x650): {desktop.size} - {size_desktop:.1f} KB")

    # 4. Desktop @2x (1000x1300px - retina)
    desktop_2x = img.copy()
    desktop_2x.thumbnail((1000, 1300), Image.Resampling.LANCZOS)
    desktop_2x.save(f"{output_dir}/ricardo-vernal-hero-desktop@2x.jpg", "JPEG", quality=90, optimize=True)
    size_desktop_2x = os.path.getsize(f"{output_dir}/ricardo-vernal-hero-desktop@2x.jpg") / 1024
    print(f"✅ Desktop @2x (1000x1300): {desktop_2x.size} - {size_desktop_2x:.1f} KB")

    print(f"\n🎉 ¡Imágenes responsive creadas!")
    print(f"Total: {size_mobile + size_mobile_2x + size_desktop + size_desktop_2x:.1f} KB")

except Exception as e:
    print(f"❌ Error: {e}")
