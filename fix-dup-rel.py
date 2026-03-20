import glob

files_to_fix = glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True)

for fpath in files_to_fix:
    with open(fpath, 'r') as f:
        lines = f.readlines()
    
    new_lines = []
    skip_next = False
    changed = False
    
    for i, line in enumerate(lines):
        if skip_next:
            skip_next = False
            continue
        
        if 'target="_blank" rel="noopener noreferrer"' in line:
            if i + 1 < len(lines) and lines[i + 1].strip() == 'rel="noopener noreferrer"':
                skip_next = True
                changed = True
        
        new_lines.append(line)
    
    if changed:
        with open(fpath, 'w') as f:
            f.writelines(new_lines)
        print(f'Fixed: {fpath}')

print('Done')
