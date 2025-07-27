'use client';

import { useEffect, useRef } from 'react';
import 'vditor/dist/index.css';

interface VditorRendererProps {
    content: string;
    codeTheme?: string;
    defaultMode?: 'light' | 'dark';
}

export function VditorRenderer({ content, codeTheme = 'github', defaultMode = 'light' }: VditorRendererProps) {
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadVditor = async () => {
            if (previewRef.current) {
                try {
                    // @ts-ignore
                    const VditorPreview = (await import('vditor/dist/method.min')).default;

                    VditorPreview.preview(previewRef.current, content, {
                        mode: defaultMode,
                        anchor: 1, // 为标题添加锚点
                        hljs: {
                            style: codeTheme, // 使用传入的代码主题
                            lineNumber: true, // 显示行号
                            enable: true // 启用代码高亮
                        },
                        markdown: {
                            toc: true,
                            mark: true,
                            footnotes: true,
                            autoSpace: true
                        },
                        theme: {
                            current: 'classic'
                        },
                        lazyLoadImage: '/loading.gif', // 可选：懒加载图片
                        after: () => {
                            console.log('Vditor 渲染完成');
                        }
                    });
                } catch (error) {
                    console.error('Failed to load Vditor:', error);
                }
            }
        };

        loadVditor();
    }, [content, codeTheme, defaultMode]);

    return <div ref={previewRef} className="vditor-preview" />;
} 