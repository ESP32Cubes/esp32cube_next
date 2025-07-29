'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import { createLowlight } from 'lowlight';
import { CodeBlock } from './code-block';

import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import html from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

const lowlight = createLowlight({ c, cpp, python, bash, html, javascript });

lowlight.registerAlias({
    c: ['c'],
    cpp: ['cpp', 'c++', 'cc'],
    python: ['python', 'py'],
    bash: ['bash', 'shell', 'sh', 'zsh'],
    html: ['html', 'htm'],
    javascript: ['javascript', 'js', 'jsx'],
});

interface PostContentProps {
    content: string;
}

export function PostContent({ content }: PostContentProps) {
    return (
        <div className="markdown-body">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[
                    [rehypeHighlight, { lowlight }],
                    rehypeKatex
                ]}
                components={{
                    pre: ({ children, className, ...props }) => {
                        return (
                            <CodeBlock className={className} {...props}>
                                {children}
                            </CodeBlock>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
