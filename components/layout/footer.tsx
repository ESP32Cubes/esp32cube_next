import Link from 'next/link';
import { getSiteInfo, getSocialLinks } from '@/lib/server-config';

export async function Footer() {
    const siteInfo = await getSiteInfo();
    const socialLinks = await getSocialLinks();

    return (
        <footer className="border-t bg-background/95 mt-10">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span>Copyright © 2025 {siteInfo.name}. All rights reserved.</span>
                        <span>•</span>
                        <span>{siteInfo.version}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={socialLinks.github}
                            target="_blank"
                            className="hover:text-foreground transition-colors"
                        >
                            Source code
                        </Link>
                        <Link
                            href={socialLinks.twitter}
                            target="_blank"
                            className="hover:text-foreground transition-colors"
                        >
                            Twitter
                        </Link>
                        <Link
                            href={socialLinks.discord}
                            target="_blank"
                            className="hover:text-foreground transition-colors"
                        >
                            Discord
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
} 