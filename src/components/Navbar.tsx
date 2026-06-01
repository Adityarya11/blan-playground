"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const [theme, setTheme] = useState('dark'); // Starting with that hacker aesthetic

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <nav className="border-b border-border bg-background py-4 px-8 flex justify-between items-center">
            <div className="flex items-center gap-8">
                <Link href="/" className="text-2xl font-bold tracking-tighter">
                    Blan_
                </Link>
                <div className="flex gap-6 text-sm text-foreground/70 font-medium">
                    <Link href="/" className="hover:text-foreground transition-colors">Playground</Link>
                    <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
                    <Link href="/examples" className="text-foreground transition-colors font-bold">Examples</Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="text-xs border border-border px-3 py-1.5 rounded hover:bg-muted transition-colors font-medium"
                >
                    {theme === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
                </button>
                <Link
                    href="/login"
                    className="text-xs bg-foreground text-background px-4 py-1.5 rounded font-medium hover:opacity-90 transition-opacity"
                >
                    Login / Register
                </Link>
            </div>
        </nav>
    );
}