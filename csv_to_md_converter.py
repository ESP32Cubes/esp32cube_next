#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CSV to Markdown Converter
将CSV文件转换为Markdown文件，按category_id分类保存
"""

import csv
import os
import re
from datetime import datetime
from pathlib import Path

def clean_filename(title):
    """清理文件名，移除特殊字符"""
    # 移除或替换文件名中的特殊字符
    title = re.sub(r'[<>:"/\\|?*]', '', title)
    title = re.sub(r'\s+', '-', title.strip())
    title = re.sub(r'[^\w\-]', '', title)
    return title.lower()

def format_datetime(datetime_str):
    """格式化日期时间字符串"""
    try:
        # 解析CSV中的日期时间格式
        dt = datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    except:
        return datetime_str

def get_category_folder(category_id):
    """根据category_id返回对应的文件夹名"""
    category_mapping = {
        2: 'tutorials',
        1: 'projects', 
        3: 'guides',
        4: 'news',
        5: 'reviews'
    }
    return category_mapping.get(category_id, f'category_{category_id}')

def extract_tags_from_content(content):
    """从内容中提取标签（简单实现）"""
    # 这里可以根据实际需求实现更复杂的标签提取逻辑
    tags = []
    
    # 简单的关键词提取
    keywords = ['IoT', 'WiFi', 'Bluetooth', 'Sensor', 'Display', 'Motor', 'LED', 'Audio','Video', 'AI', 'Web']
    for keyword in keywords:
        if keyword.lower() in content.lower():
            tags.append(keyword)
    
    # 如果没有找到标签，使用默认标签
    if not tags:
        tags = ['ESP32', 'Tutorial']
    
    return tags

def csv_to_markdown(csv_file_path, output_dir='content'):
    """将CSV文件转换为Markdown文件"""
    
    # 创建输出目录
    Path(output_dir).mkdir(exist_ok=True)
    
    # 读取CSV文件
    with open(csv_file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            try:
                # 提取数据
                post_id = row['id']
                title = row['title']
                content = row['content']
                summary = row['summary']
                thumb = row['thumb']
                created_at = row['created_at']
                updated_at = row['updated_at']
                views_count = row['views_count']
                likes_count = row['likes_count']
                author_id = row['author_id']
                category_id = int(row['category_id'])
                slug = row['slug']
                md5_hash = row['md5_hash']
                
                # 获取分类文件夹
                category_folder = get_category_folder(category_id)
                category_path = Path(output_dir) / category_folder
                category_path.mkdir(exist_ok=True)
                
                # 生成文件名
                clean_title = clean_filename(title)
                filename = f"{post_id}-{clean_title}.md"
                file_path = category_path / filename
                
                # 提取标签
                tags = extract_tags_from_content(content)
                
                # 生成Markdown内容
                markdown_content = f"""---
slug: {slug}
title: {title}
created_at: {format_datetime(created_at)}
updated_at: {format_datetime(updated_at)}
author: ESP32Cube Team
summary: {summary}
cover: {thumb if thumb else 'default-cover.jpg'}
tags:
{chr(10).join(f'  - {tag}' for tag in tags)}
views: {views_count}
likes: {likes_count}
category: {category_folder}
---

{content}
"""
                
                # 写入文件
                with open(file_path, 'w', encoding='utf-8') as md_file:
                    md_file.write(markdown_content)
                
                print(f"✅ 已生成: {file_path}")
                
            except Exception as e:
                print(f"❌ 处理行时出错: {e}")
                print(f"   行数据: {row}")
                continue

def main():
    """主函数"""
    csv_file = 'orginal_data.csv'
    
    if not os.path.exists(csv_file):
        print(f"❌ 错误: 找不到文件 {csv_file}")
        return
    
    print(f"🔄 开始转换 {csv_file} 到Markdown文件...")
    print(f"📁 输出目录: content/")
    
    try:
        csv_to_markdown(csv_file)
        print("\n🎉 转换完成！")
        print("\n📂 生成的文件结构:")
        
        # 显示生成的文件结构
        content_dir = Path('content')
        if content_dir.exists():
            for category_dir in content_dir.iterdir():
                if category_dir.is_dir():
                    print(f"  📁 {category_dir.name}/")
                    for md_file in category_dir.glob('*.md'):
                        print(f"    📄 {md_file.name}")
        
    except Exception as e:
        print(f"❌ 转换过程中出错: {e}")

if __name__ == "__main__":
    main() 