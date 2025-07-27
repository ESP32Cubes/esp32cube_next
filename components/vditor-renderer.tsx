'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import 'vditor/dist/index.css';

interface VditorRendererProps {
    content: string;
    codeTheme?: string;
    defaultMode?: 'light' | 'dark';
}

export function VditorRenderer({ content, codeTheme = 'github', defaultMode = 'light' }: VditorRendererProps) {
    const previewRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const loadVditor = async () => {
            if (previewRef.current) {
                try {
                    // @ts-ignore
                    const VditorPreview = (await import('vditor/dist/method.min')).default;

                    // 根据当前主题确定 Vditor 主题
                    const vditorTheme = theme === 'dark' ? 'dark' : 'light';

                    VditorPreview.preview(previewRef.current, content, {
                        anchor: 1,
                        lang: 'en_US',
                        hljs: {
                            style: codeTheme,
                            lineNumber: true,
                            enable: true
                        },
                        markdown: {
                            toc: true,
                            mark: true,
                            footnotes: true,
                            autoSpace: true
                        },
                        theme: {
                            current: vditorTheme
                        },
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
    }, [content, codeTheme, theme]); // 添加 theme 作为依赖项

    return (
        <>
            <style jsx global>{`
                /* 全局链接样式 */
                .vditor-preview a {
                    color: hsl(var(--primary)) !important;
                    text-decoration: underline !important;
                    text-underline-offset: 2px !important;
                    font-weight: bold !important;
                    transition: color 0.2s ease-in-out !important;
                }

                .vditor-preview a:hover {
                    color: hsl(var(--primary) / 0.8) !important;
                }

                .vditor-preview a:focus {
                    outline: 2px solid hsl(var(--ring)) !important;
                    outline-offset: 2px !important;
                    border-radius: 2px !important;
                }

                /* 代码块中的链接保持原样 */
                .vditor-preview pre a,
                .vditor-preview code a {
                    color: inherit !important;
                    text-decoration: none !important;
                }

                .vditor-preview pre a:hover,
                .vditor-preview code a:hover {
                    color: inherit !important;
                    text-decoration: none !important;
                }
            `}</style>
            <div ref={previewRef} className="vditor-preview" />
        </>
    );
} 