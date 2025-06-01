import os
from PIL import Image

def convert_png_to_webp(folder_path, quality=80, recursive=False):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith('.png'):
                png_path = os.path.join(root, file)
                webp_path = os.path.splitext(png_path)[0] + '.webp'
                
                try:
                    img = Image.open(png_path).convert('RGBA')
                    img.save(webp_path, 'webp', quality=quality)
                    print(f'✅ Convertido: {png_path} -> {webp_path}')
                except Exception as e:
                    print(f'❌ Erro ao converter {png_path}: {e}')
        
        if not recursive:
            break  # Não percorre subpastas, só a pasta principal

# === EXEMPLO DE USO ===
# Altere o caminho da pasta abaixo:
pasta = 'images/'
convert_png_to_webp(pasta, quality=80, recursive=True)
