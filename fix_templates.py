#!/usr/bin/env python3
"""
Script to fix all template files to use direct image URLs instead of getPexelsImage()
"""

import re
import os

def fix_template_function(content, function_name):
    """Fix a single template function to use direct URLs"""
    
    # Pattern to match the function and its content
    function_pattern = rf'(export function {function_name}\(data: GeneratedPageData\): string \{{[\s\S]*?)(const \{{ [^}}]+ \}} = data;)'
    
    match = re.search(function_pattern, content)
    if not match:
        print(f"  ⚠️  Could not find function {function_name}")
        return content
    
    # Extract the destructuring line
    destructure_line = match.group(2)
    
    # Check if picDescriptions is already there
    if 'picDescriptions' in destructure_line:
        print(f"  ✓  {function_name} already has picDescriptions")
        return content
    
    # Add picDescriptions to destructuring
    new_destructure = destructure_line.replace('pics,', 'pics, picDescriptions,')
    content = content.replace(destructure_line, new_destructure)
    
    # Find where to add the descriptions constant (after destructuring)
    insert_pos = content.find(new_destructure) + len(new_destructure)
    
    # Find the next line break and add the descriptions constant
    next_newline = content.find('\n', insert_pos)
    if next_newline != -1:
        # Check if descriptions constant already exists
        following_lines = content[next_newline:next_newline+200]
        if 'const descriptions = ' not in following_lines:
            indent = '  '
            descriptions_line = f'\n{indent}const descriptions = picDescriptions || pics.map((_, i) => `Item ${{i + 1}}`);\n'
            content = content[:next_newline] + descriptions_line + content[next_newline:]
    
    # Replace getPexelsImage calls with direct URL usage
    # Pattern: pics.map((query, i) or pics.map(query =>
    content = re.sub(
        r'pics\.map\(\s*\(?query\)?,?\s*i?\s*\)',
        'pics.map((url, i)',
        content
    )
    
    # Replace getPexelsImage(query, ...) with url
    content = re.sub(
        r'\$\{getPexelsImage\(query,\s*\d+,\s*\d+\)\}',
        '${url}',
        content
    )
    
    # Add onerror fallback to img tags (only if not already present)
    content = re.sub(
        r'(<img src="\$\{url\}"[^>]*)(loading="lazy">)',
        r'\1loading="lazy" onerror="this.src=\'https://picsum.photos/900/900?random=${i}\'">',
        content
    )
    
    # Replace ${query} with ${descriptions[i]} in text content
    # This is trickier - need to be careful not to replace in img src
    # Pattern: ${query} outside of img src attributes
    content = re.sub(
        r'(<h[1-6][^>]*>.*?)\$\{query\.toUpperCase\(\)\}',
        r'\1${descriptions[i].toUpperCase()}',
        content
    )
    content = re.sub(
        r'(<h[1-6][^>]*>.*?)\$\{query\}',
        r'\1${descriptions[i]}',
        content
    )
    content = re.sub(
        r'(<p[^>]*>.*?)\$\{query\}',
        r'\1${descriptions[i]}',
        content
    )
    
    # Fix alt attributes
    content = re.sub(
        r'alt="\$\{query\}"',
        'alt="${descriptions[i]}"',
        content
    )
    
    print(f"  ✓  Fixed {function_name}")
    return content

def fix_template_file(filepath, function_names):
    """Fix all functions in a template file"""
    print(f"\n📝 Processing {os.path.basename(filepath)}...")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        for func_name in function_names:
            content = fix_template_function(content, func_name)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ Saved changes to {os.path.basename(filepath)}")
        else:
            print(f"  ℹ️  No changes needed for {os.path.basename(filepath)}")
        
        return True
    except Exception as e:
        print(f"  ❌ Error processing {os.path.basename(filepath)}: {e}")
        return False

def main():
    """Main function to fix all template files"""
    print("🚀 Starting template fix process...\n")
    
    base_path = r'c:\Users\Lenovo\VaaniWeb\app\lib\templates'
    
    # Define all files and their functions to fix
    files_to_fix = {
        'additional-templates.ts': [
            'generateSalonLuxuryLayout',
            'generateSalonChicLayout',
            'generateCafeModernLayout',
            'generateCafeMinimalLayout'
        ],
        'advanced-templates.ts': [
            'generateGymBoldLayout',
            'generatePortfolioGridLayout'
        ],
        'default-variations.ts': [
            'generateDefaultCreativeLayout',
            'generateDefaultProfessionalLayout',
            'generateDefaultBoldLayout'
        ],
        'premium-professional.ts': [
            'generatePremiumBusinessLayout'
        ],
        'unique-templates.ts': [
            'generateRestaurantFineDiningLayout',
            'generateBakerySweetLayout',
            'generateYogaZenLayout',
            'generatePhotographyProLayout',
            'generateRealEstateLuxuryLayout'
        ],
        'unique-templates-part2.ts': [
            'generateTravelAdventureLayout',
            'generateLawFirmLayout',
            'generateSpaWellnessLayout',
            'generateTechStartupLayout'
        ]
    }
    
    success_count = 0
    fail_count = 0
    
    for filename, functions in files_to_fix.items():
        filepath = os.path.join(base_path, filename)
        if os.path.exists(filepath):
            if fix_template_file(filepath, functions):
                success_count += 1
            else:
                fail_count += 1
        else:
            print(f"  ⚠️  File not found: {filepath}")
            fail_count += 1
    
    print(f"\n✨ Fix process completed!")
    print(f"   ✅ Successfully fixed: {success_count} files")
    print(f"   ❌ Failed: {fail_count} files")

if __name__ == '__main__':
    main()
