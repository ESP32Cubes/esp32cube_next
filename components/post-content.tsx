'use client';

import { VditorRenderer } from '@/components/vditor-renderer';

interface PostContentProps {
    content: string;
    codeTheme?: string;
}

export function PostContent({ content, codeTheme = 'github' }: PostContentProps) {
    return <VditorRenderer content={content} codeTheme={codeTheme} />;
} 