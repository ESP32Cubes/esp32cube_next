# Markdown File Header Processing Tool

## Feature Description

This Python script is used to batch process the frontmatter (header information) of Markdown files. The main features include:

### 1. Auto-generate slug
- If the file doesn't have a `slug` field, it will be automatically generated from `title`
- Generation rules: Convert to lowercase, remove special characters, replace spaces with hyphens

### 2. Convert thumb to cover
- Convert `thumb` field to `cover` field
- Automatically remove `/docs/images/` path prefix
- Support relative and absolute paths

### 3. Add missing fields
- Add `date` field if missing (default: current date)
- Add `author` field if missing (default: "ESP32Cube Team")

## Usage

```bash
python process_markdown_headers.py
```

## File Format Examples

### Before Processing
```yaml
---
title: ESP32 WiFi 连接教程
thumb: /docs/images/wifi.jpg
tags: [ESP32, WiFi]
---
```

### After Processing
```yaml
---
title: ESP32 WiFi 连接教程
slug: esp32-wifi-connection-tutorial
cover: wifi.jpg
date: 2025-01-26
author: ESP32Cube Team
tags: [ESP32, WiFi]
---
```

## Supported Fields

- `title`: Article title (required)
- `slug`: URL-friendly identifier (auto-generated if missing)
- `thumb`: Cover image path (converted to `cover`)
- `cover`: Cover image path (new field)
- `date`: Publication date (auto-added if missing)
- `author`: Article author (auto-added if missing)
- `tags`: Article tags
- `category`: Article category

## Image Path Rules

- All images should be placed in the `content/images` directory
- Use relative paths in Markdown files (e.g., `image.jpg`)
- The script will automatically remove `/docs/images/` prefix
- Support both relative and absolute paths

## Troubleshooting

1. **Backup your files before running the script**
2. **Check file permissions** - Ensure the script has read/write permissions
3. **Review processed files** - Check the generated frontmatter for accuracy
4. **Handle special characters** - The script handles most special characters in titles

## Notes

- The script processes all `.md` files in the `content` directory and its subdirectories
- Original files are backed up before processing
- The script is idempotent - running it multiple times won't cause issues 