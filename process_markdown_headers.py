#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Markdown file header processing script
Features:
1. Generate slug from title when missing
2. Convert thumb field to cover field, remove /docs/images/ path
3. Add date and author fields
"""

import os
import re
import yaml
from datetime import datetime
from pathlib import Path

def slugify(text):
    """
    Convert text to URL-friendly slug
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove accented characters
    text = re.sub(r'[àáâãäå]', 'a', text)
    text = re.sub(r'[èéêë]', 'e', text)
    text = re.sub(r'[ìíîï]', 'i', text)
    text = re.sub(r'[òóôõö]', 'o', text)
    text = re.sub(r'[ùúûü]', 'u', text)
    
    # Replace non-alphanumeric characters with hyphens
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    
    # Remove leading and trailing hyphens
    text = text.strip('-')
    
    return text

def process_thumb_to_cover(thumb_value):
    """
    Convert thumb field to cover field
    Remove /docs/images/ prefix
    """
    if not thumb_value:
        return None
    
    # Remove /docs/images/ prefix
    if thumb_value.startswith('/docs/images/'):
        return thumb_value[13:]  # Remove '/docs/images/' (13 characters)
    
    return thumb_value

def process_markdown_file(file_path):
    """
    Process a single Markdown file
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file has frontmatter
        if not content.startswith('---'):
            print(f"Skipping {file_path}: No frontmatter found")
            return
        
        # Split frontmatter and content
        parts = content.split('---', 2)
        if len(parts) < 3:
            print(f"Skipping {file_path}: Invalid frontmatter format")
            return
        
        frontmatter_text = parts[1].strip()
        markdown_content = parts[2]
        
        # Parse frontmatter
        try:
            frontmatter = yaml.safe_load(frontmatter_text)
        except yaml.YAMLError as e:
            print(f"Error parsing frontmatter in {file_path}: {e}")
            return
        
        if not frontmatter:
            frontmatter = {}
        
        # Get file modification time for date
        file_stat = os.stat(file_path)
        file_date = datetime.fromtimestamp(file_stat.st_mtime).strftime('%Y-%m-%d')
        
        # Process frontmatter
        modified = False
        
        # 1. Generate slug if missing
        if 'title' in frontmatter and 'slug' not in frontmatter:
            frontmatter['slug'] = slugify(frontmatter['title'])
            modified = True
            print(f"  Added slug: {frontmatter['slug']}")
        
        # 2. Convert thumb to cover
        if 'thumb' in frontmatter:
            cover_value = process_thumb_to_cover(frontmatter['thumb'])
            if cover_value:
                frontmatter['cover'] = cover_value
                print(f"  Converted thumb to cover: {cover_value}")
            del frontmatter['thumb']
            modified = True
        
        # 3. Add date if missing
        if 'date' not in frontmatter:
            frontmatter['date'] = file_date
            modified = True
            print(f"  Added date: {file_date}")
        
        # 4. Add author if missing
        if 'author' not in frontmatter:
            frontmatter['author'] = 'ESP32Cube Team'
            modified = True
            print(f"  Added author: ESP32Cube Team")
        
        # Write back if modified
        if modified:
            # Create backup
            backup_path = str(file_path) + '.backup'
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            # Write modified content
            new_frontmatter = yaml.dump(frontmatter, default_flow_style=False, allow_unicode=True)
            new_content = f"---\n{new_frontmatter}---{markdown_content}"
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"  Updated {file_path}")
        else:
            print(f"  No changes needed")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    """
    Main function to process all Markdown files
    """
    content_dir = Path('content')
    
    if not content_dir.exists():
        print("Error: content directory not found")
        return
    
    print("Starting Markdown file processing...")
    print("=" * 50)
    
    # Find all .md files
    md_files = list(content_dir.rglob('*.md'))
    
    if not md_files:
        print("No Markdown files found in content directory")
        return
    
    print(f"Found {len(md_files)} Markdown files")
    print()
    
    # Process each file
    for file_path in md_files:
        print(f"Processing: {file_path}")
        process_markdown_file(file_path)
        print()
    
    print("=" * 50)
    print("Processing completed!")

if __name__ == '__main__':
    main() 