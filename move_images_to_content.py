#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Image file moving script
Function: Move image files from public directory to content/images directory
"""

import os
import shutil
from pathlib import Path

def move_images_to_content():
    """
    Move images from public directory to content/images directory
    """
    public_dir = Path('public')
    content_images_dir = Path('content/images')
    
    # Check if public directory exists
    if not public_dir.exists():
        print("Error: public directory does not exist")
        return
    
    # Check if content/images directory exists
    if not content_images_dir.exists():
        print("Error: content/images directory does not exist")
        return
    
    # Supported image formats
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'}
    
    # Find image files in public directory
    image_files = []
    for file_path in public_dir.rglob('*'):
        if file_path.is_file() and file_path.suffix.lower() in image_extensions:
            image_files.append(file_path)
    
    if not image_files:
        print("No image files found in public directory")
        return
    
    print(f"Found {len(image_files)} image files to move:")
    for file_path in image_files:
        print(f"  {file_path}")
    
    print("\nStarting file move...")
    
    moved_count = 0
    skipped_count = 0
    
    for file_path in image_files:
        # Create destination path
        dest_path = content_images_dir / file_path.name
        
        # Check if destination file already exists
        if dest_path.exists():
            print(f"Skipping {file_path.name}: File already exists in destination")
            skipped_count += 1
            continue
        
        try:
            # Move file
            shutil.move(str(file_path), str(dest_path))
            print(f"Moved: {file_path.name}")
            moved_count += 1
        except Exception as e:
            print(f"Error moving {file_path.name}: {e}")
    
    print(f"\nMove completed: {moved_count} files moved, {skipped_count} files skipped")

if __name__ == '__main__':
    move_images_to_content() 