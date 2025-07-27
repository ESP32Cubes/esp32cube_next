'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Home,
    BookOpen,
    Lightbulb,
    Search,
    Tags
} from 'lucide-react';

const navigation = [
    {
        name: 'Home',
        href: '/',
        icon: Home,
    },
    {
        name: 'Tutorials',
        href: '/tutorials',
        icon: BookOpen,
    },
    {
        name: 'Projects',
        href: '/projects',
        icon: Lightbulb,
    },
    {
        name: 'Search',
        href: '/search',
        icon: Search,
    },
    {
        name: 'Tags',
        href: '/tags',
        icon: Tags,
    },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-transform duration-200 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-full flex-col">
                    {/* Navigation menu */}
                    <nav className="flex-1 space-y-1 p-4">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.name} href={item.href} onClick={onClose}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start gap-3",
                                            isActive && "bg-secondary"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </Button>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </>
    );
} 