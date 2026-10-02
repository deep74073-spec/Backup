from PIL import Image, ImageOps
from pathlib import Path

source = Image.open("Tic_toc_toe.png").convert("RGBA")

sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192
}

for folder, size in sizes.items():
    path = Path("android/app/src/main/res") / folder
    path.mkdir(parents=True, exist_ok=True)

    icon = ImageOps.fit(
        source,
        (size, size),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5)
    )

    icon.save(path / "ic_launcher.png")
    icon.save(path / "ic_launcher_round.png")

print("App launcher icons generated successfully!")
