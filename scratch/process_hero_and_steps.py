import cv2
import numpy as np

def make_transparent_png(input_path, output_path, bg_threshold=245):
    img = cv2.imread(input_path)
    if img is None:
        print(f"Error opening {input_path}")
        return

    # Convert to RGBA
    h, w, _ = img.shape
    rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

    # Compute grayscale brightness
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Feather alpha for smooth white background removal
    # Brightness >= 248 -> 0 alpha
    # Brightness <= 220 -> 255 alpha
    # Linear feather between 220 and 248
    alpha = np.clip((248.0 - gray.astype(float)) / (248.0 - 220.0) * 255.0, 0, 255).astype(np.uint8)
    rgba[:, :, 3] = alpha

    # Trim excess transparent margin
    coords = cv2.findNonZero(alpha)
    if coords is not None:
        x, y, crop_w, crop_h = cv2.boundingRect(coords)
        pad = 10
        x1 = max(0, x - pad)
        x2 = min(w, x + crop_w + pad)
        y1 = max(0, y - pad)
        y2 = min(h, y + crop_h + pad)
        cropped = rgba[y1:y2, x1:x2]
        cv2.imwrite(output_path, cropped)
        print(f"Saved {output_path} ({cropped.shape[1]}x{cropped.shape[0]})")
    else:
        cv2.imwrite(output_path, rgba)

# 1. 3-Product Studio Render with Turmeric (Hero image)
make_transparent_png('/Users/mehdicohen/.gemini/antigravity-ide/brain/3daaaf01-2057-453f-a5a1-58cbc3dc71f7/.user_uploaded/media_1788224295089.png', 'public/products/beaute-turmeric-hero.png')

# 2. Step 1 First Light Essence bottle
make_transparent_png('/Users/mehdicohen/.gemini/antigravity-ide/brain/3daaaf01-2057-453f-a5a1-58cbc3dc71f7/.user_uploaded/media_1788224066800.png', 'public/products/beaute-step-1-bottle.png')

# 3. Step 2 Vital Rich Cream jar
make_transparent_png('/Users/mehdicohen/.gemini/antigravity-ide/brain/3daaaf01-2057-453f-a5a1-58cbc3dc71f7/.user_uploaded/media_1788224067602.png', 'public/products/beaute-step-2-jar.png')

# 4. Step 3 Crystal Ampoule Cream bottle
make_transparent_png('/Users/mehdicohen/.gemini/antigravity-ide/brain/3daaaf01-2057-453f-a5a1-58cbc3dc71f7/.user_uploaded/media_1788224066833.png', 'public/products/beaute-step-3-bottle.png')
