#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Markdown image link format conversion script
Function: Convert ![[filename]] format to ![](filename) format
"""

import os
import re
import sys
from pathlib import Path

def convert_image_links(content):
    """
    Convert image link format
    From: ![[filename]]
    To:   ![](filename)
    """
    # Match ![[filename]] format image links
    pattern = re.compile(r'!\[\[([^\]]+)\]\]')
    matches = pattern.findall(content)
    if not matches:
        return content, 0
    # Perform replacement
    new_content = pattern.sub(lambda m: f'![]({m.group(1)})', content)
    return new_content, len(matches)

def process_markdown_file(file_path):
    """
    Process a single Markdown file
    """
    print(f"Processing file: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return False
    
    # Check if there are image links to convert
    new_content, count = convert_image_links(content)
    
    if count == 0:
        print(f"  No changes needed")
        return True
    
    print(f"  Found {count} image links to convert:")
    # Write back
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  Updated {file_path}")
        return True
    except Exception as e:
        print(f"  Error writing {file_path}: {e}")
        return False

def main():
    """
    Main function
    """
    content_dir = Path('content')
    
    if not content_dir.exists():
        print("Error: content directory not found")
        sys.exit(1)
    
    print("Starting image link conversion...")
    print("=" * 50)
    
    md_files = list(content_dir.rglob('*.md'))
    
    if not md_files:
        print("No Markdown files found in content directory")
        return
    
    print(f"Found {len(md_files)} Markdown files")
    print()
    
    success_count = 0
    error_count = 0
    modified_count = 0
    
    for file_path in md_files:
        if process_markdown_file(file_path):
            success_count += 1
            # Check if the file was actually modified
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                if re.search(r'!\[\[([^\]]+)\]\]', content):
                    pass  # Still unprocessed links
                else:
                    modified_count += 1
            except:
                pass
        else:
            error_count += 1
        print()
    
    print("=" * 50)
    print("Conversion completed!")
    print(f"Processed: {success_count} files, failed {error_count} files")
    print(f"Actual modifications: {modified_count} files")

if __name__ == '__main__':
    main() 