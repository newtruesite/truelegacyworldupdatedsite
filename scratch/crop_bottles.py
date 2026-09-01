import cv2
import numpy as np

def crop_and_clean(input_path, output_path, crop_box, bg_threshold=240):
    img = cv2.imread(input_path)
    if img is None:
        print(f"Failed to read {input_path}")
        return
    
    h, w, _ = img.shape
    ymin, ymax, xmin, xmax = crop_box
    
    # Absolute pixel coords
    y1 = int(ymin * h)
    y2 = int(ymax * h)
    x1 = int(xmin * w)
    x2 = int(xmax * w)
    
    cropped = img[y1:y2, x1:x2]
    
    # Convert to RGBA
    rgba = cv2.cvtColor(cropped, cv2.COLOR_BGR2BGRA)
    
    # Compute brightness
    gray = cv2.cvtColor(cropped, cv2.COLOR_BGR2GRAY)
    
    # Smooth alpha mask for white background
    # Pixels > 245 are 0 alpha, pixels < 220 are 255 alpha, linear in between
    alpha = np.clip((245.0 - gray.astype(float)) / (245.0 - 210.0) * 255.0, 0, 255).astype(np.uint8)
    rgba[:, :, 3] = alpha
    
    # Trim transparent borders
    coords = cv2.findNonZero(alpha)
    if coords is not None:
        bx, by, bw, bh = cv2.boundingRect(coords)
        pad = 8
        by1 = max(0, by - pad)
        by2 = min(rgba.shape[0], by + bh + pad)
        bx1 = max(0, bx - pad)
        bx2 = min(rgba.shape[1], bx + bw + pad)
        final_crop = rgba[by1:by2, bx1:bx2]
        cv2.imwrite(output_path, final_crop)
        print(f"Saved clean PNG {output_path} ({final_crop.shape[1]}x{final_crop.shape[0]})")
    else:
        cv2.imwrite(output_path, rgba)

# Step 1 First Light Essence bottle is centered vertically in the poster sheet
crop_and_clean('public/products/beaute-step-1-essence.jpg', 'public/products/beaute-step-1-bottle.png', (0.22, 0.88, 0.25, 0.75))

# Step 2 Vital Rich Cream jar is centered in the lower-middle of poster sheet
crop_and_clean('public/products/beaute-step-2-cream.jpg', 'public/products/beaute-step-2-jar.png', (0.42, 0.85, 0.20, 0.80))

# Step 3 Crystal Ampoule Cream bottle is centered vertically in poster sheet
crop_and_clean('public/products/beaute-step-3-ampoule.jpg', 'public/products/beaute-step-3-bottle.png', (0.22, 0.88, 0.25, 0.75))
