import os
from PIL import Image, ImageDraw, ImageFont

screenshots_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'screenshots')
output_gif = os.path.join(screenshots_dir, 'voxora-demo.gif')

image_files = [
    '01-landing-hero.png',
    '02-user-dashboard.png',
    '03-conversation-arena.png',
    '04-modes-scenarios.png',
    '05-shadow-studio.png',
    '06-vocabulary-vault.png',
    '07-voice-journal.png',
    '08-analytics-diagnostics.png',
]

feature_titles = [
    "VOXORA — AI English Speaking Companion",
    "Personalized Dashboard & Speaking Streaks",
    "Live Speaking Arena & 3D Audio Avatar",
    "11 Specialized Scenarios & Topic Roulette",
    "Shadow Mode Studio & Cadence Accuracy",
    "Vocabulary Vault with Audio Pronunciations",
    "Voice Journal (Daily Spoken Reflections)",
    "Speaking Diagnostics & 'Future Me' Analytics",
]

frames = []
target_width = 960

for idx, fname in enumerate(image_files):
    fpath = os.path.join(screenshots_dir, fname)
    if not os.path.exists(fpath):
        continue
    img = Image.open(fpath).convert('RGB')
    
    # Calculate aspect ratio
    w, h = img.size
    aspect = h / w
    target_height = int(target_width * aspect)
    img_resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)

    # Optional: draw a sleek top header banner on each frame showing the feature title
    draw = ImageDraw.Draw(img_resized)
    # Banner overlay
    banner_height = 42
    draw.rectangle([(0, 0), (target_width, banner_height)], fill=(10, 12, 16))
    draw.line([(0, banner_height), (target_width, banner_height)], fill=(34, 43, 61), width=1)
    
    # Accent indicator dot
    dot_x, dot_y = 20, 21
    draw.ellipse([(dot_x - 5, dot_y - 5), (dot_x + 5, dot_y + 5)], fill=(212, 248, 42))

    # Title text
    title = f"VOXORA • {feature_titles[idx]}"
    draw.text((36, 13), title, fill=(244, 244, 246))

    # Add frame
    # Convert to adaptive 256-color palette for crisp, compact GIF
    frame_p = img_resized.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
    frames.append(frame_p)

if frames:
    # duration in ms per frame (1800ms = 1.8 seconds per feature slide)
    frames[0].save(
        output_gif,
        save_all=True,
        append_images=frames[1:],
        duration=1800,
        loop=0,
        optimize=True
    )
    file_size_mb = os.path.getsize(output_gif) / (1024 * 1024)
    print(f"GIF generated successfully: {output_gif}")
    print(f"Total frames: {len(frames)}, File size: {file_size_mb:.2f} MB")
else:
    print("No frames found to generate GIF.")
