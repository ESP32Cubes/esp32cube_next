'use client';

import { Header } from './header';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            {/* Main content area */}
            <main className="pt-8 flex-1 main-content">
                <div className="container-responsive">
                    <div className="space-y-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
} 