'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    Menu,
    Github,
    Moon,
    Sun,
    User,
    Search,
    Home,
    BookOpen,
    Lightbulb,
    Tags
} from 'lucide-react';
import { useTheme } from 'next-themes';

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
        name: 'Tags',
        href: '/tags',
        icon: Tags,
    },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Top bar */}
            <div className="container-responsive flex h-14 items-center">
                {/* Left: Menu button and Logo */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold">ESP32Cube</span>
                    </Link>
                </div>

                {/* Right: Action buttons */}
                <div className="flex flex-1 items-center justify-end space-x-4">
                    {/* Search box */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchQuery.trim()) {
                                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                                }
                            }}
                        >
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 w-[300px]"
                            />
                        </form>
                    </div>

                    {/* Source code link */}
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="https://github.com" target="_blank">
                            <Github className="h-5 w-5" />
                        </Link>
                    </Button>

                    {/* Theme toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>

                    {/* User info */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Guest</span>
                    </div>
                </div>
            </div>

            {/* Navigation menu */}
            <div className="border-t bg-background/95">
                <div className="container-responsive">
                    <nav className="flex items-center space-x-6 h-12">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.name} href={item.href}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className={cn(
                                            "h-8 gap-2",
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
        </header>
    );
} 