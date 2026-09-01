import cv2
import numpy as np
from PIL import Image

def extract_bottle(input_path, output_path, bg_threshold=235):
    # Load image
    img = cv2.imread(input_path)
    if img is None:
        print(f"Error loading {input_path}")
        return

    # Convert to RGBA
    img_rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    h, w, _ = img.shape

    # Find white background pixels (where R, G, B > threshold)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # We want to isolate the central product bottle/jar
    # Mask for non-white/non-text area
    # Let's inspect the center region of the image
    mask = np.ones((h, w), dtype=np.uint8) * 255
    
    # Threshold for background white
    bg_mask = (gray > bg_threshold)
    
    # For Step 1, 2, 3 sheets, the main product bottle is in the lower-center
    # Let's set alpha to 0 for white background
    img_rgba[bg_mask, 3] = 0
    
    # Crop bounding box of non-transparent pixels
    alpha = img_rgba[:, :, 3]
    coords = cv2.findNonZero(alpha)
    if coords is not None:
        x, y, crop_w, crop_h = cv2.boundingRect(coords)
        # Crop with padding
        pad = 10
        x1 = max(0, x - pad)
        y1 = max(0, y - pad)
        x2 = min(w, x + crop_w + pad)
        y2 = min(h, y + crop_h + pad)
        cropped = img_rgba[y1:y2, x1:x2]
        
        # Save output PNG
        cv2.imwrite(output_path, cropped)
        print(f"Saved {output_path} with size {x2-x1}x{y2-y1}")
    else:
        cv2.imwrite(output_path, img_rgba)

# Process step 1, step 2, step 3
extract_bottle('public/products/beaute-step-1-essence.jpg', 'public/products/beaute-step-1-bottle.png')
extract_bottle('public/products/beaute-step-2-cream.jpg', 'public/products/beaute-step-2-jar.png')
extract_bottle('public/products/beaute-step-3-ampoule.jpg', 'public/products/beaute-step-3-bottle.png')
