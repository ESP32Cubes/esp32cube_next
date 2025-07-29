'use client';

import { useState, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
    children: React.ReactNode;
    className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    const handleCopy = async () => {
        if (preRef.current) {
            const codeElement = preRef.current.querySelector('code');
            if (codeElement) {
                const codeText = codeElement.textContent || '';

                try {
                    await navigator.clipboard.writeText(codeText);
                    setCopied(true);
                    setTimeout(() => {
                        setCopied(false);
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                }
            }
        }
    };

    return (
        <div className="relative group">
            <pre ref={preRef} className={className}>
                {children}
            </pre>
            <button
                onClick={handleCopy}
                className={`copy-button ${copied ? 'copied' : ''}`}
                title="Copy"
            >
                {copied ? (
                    <Check className="h-4 w-4" />
                ) : (
                    <Copy className="h-4 w-4" />
                )}
            </button>
        </div>
    );
} 