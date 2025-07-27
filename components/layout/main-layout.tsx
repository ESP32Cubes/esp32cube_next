'use client';

import { Header } from './header';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            {/* 主内容区域 */}
            <main className="pt-8 flex-1">
                <div className="container mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
} 