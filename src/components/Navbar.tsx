"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const [theme, setTheme] = useState('dark');

    // Sync state with the actual HTML class on mount
    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
    }, []);

    const toggleTheme = () => {
        if (theme === 'dark') {
            document.documentElement.classList.remove('dark');
            setTheme('light');
        } else {
            document.documentElement.classList.add('dark');
            setTheme('dark');
        }
    };

    return (
        <nav className="border-b border-border bg-background py-3 px-4 md:px-8">
            {/* max-w-7xl ensures it doesn't stretch too far on huge monitors */}
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">

                {/* Left side: Logo & Navigation Links */}
                <div className="flex items-center gap-6 flex-wrap">
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-foreground">
                        Blan_
                    </Link>
                    <div className="flex items-center gap-4 text-sm font-medium text-foreground/70">
                        <Link href="/" className="hover:text-foreground transition-colors">Playground</Link>
                        <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
                        <Link href="/examples" className="hover:text-foreground transition-colors">Examples</Link>
                    </div>
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="text-xs border border-border px-3 py-1.5 rounded hover:bg-muted transition-colors font-medium text-foreground"
                    >
                        {theme === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
                    </button>
                    <Link
                        href="/login"
                        // whitespace-nowrap prevents the button text from breaking into two lines
                        className="text-xs bg-foreground text-background px-4 py-1.5 rounded font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                        Login / Register
                    </Link>
                </div>

            </div>
        </nav>
    );
}