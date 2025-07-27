'use client';

import { VditorRenderer } from '@/components/vditor-renderer';

interface PostContentProps {
    content: string;
    codeTheme?: string;
    defaultMode?: 'light' | 'dark';
}

export function PostContent({ content, codeTheme = 'github', defaultMode = 'light' }: PostContentProps) {
    return <VditorRenderer content={content} codeTheme={codeTheme} defaultMode={defaultMode} />;
} 