from PIL import Image

img = Image.open('public/products/kangen-wagyu-box.jpg').convert('RGBA')
datas = img.getdata()

newData = []
for item in datas:
    # Remove pure black / very dark background around the product box
    if item[0] < 12 and item[1] < 12 and item[2] < 12:
        newData.append((0, 0, 0, 0))
    else:
        newData.append(item)

img.putdata(newData)
img.save('public/products/kangen-wagyu-box.png', 'PNG')
print("Successfully processed kangen-wagyu-box.png")
