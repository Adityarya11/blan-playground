"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`));
    return match ? match.split("=")[1] : null;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export default function Navbar() {
    const router = useRouter();
    const [theme, setTheme] = useState("dark");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showCookieBanner, setShowCookieBanner] = useState(false);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "dark" : "light");
        setIsLoggedIn(!!getCookie("blan_token"));
        if (!getCookie("blan_cookie_consent")) {
            setShowCookieBanner(true);
        }
    }, []);

    const toggleTheme = () => {
        if (theme === "dark") {
            document.documentElement.classList.remove("dark");
            setTheme("light");
        } else {
            document.documentElement.classList.add("dark");
            setTheme("dark");
        }
    };

    const handleLogout = () => {
        deleteCookie("blan_token");
        setIsLoggedIn(false);
        router.push("/");
        router.refresh();
    };

    const acceptCookie = () => {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        document.cookie = `blan_cookie_consent=yes;expires=${expires.toUTCString()};path=/;SameSite=Lax`;
        setShowCookieBanner(false);
    };

    return (
        <>
            <nav className="border-b border-border bg-background h-14 flex items-center px-4 md:px-6 shrink-0">
                <div className="w-full flex items-center justify-between gap-4">

                    <div className="flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-base font-bold tracking-tight text-foreground hover:text-foreground transition-colors"
                        >
                            Blan_Playground
                        </Link>

                        <div className="h-4 w-px bg-border" />

                        <div className="flex items-center gap-5 text-sm text-foreground/60">

                            <Link href="/docs" className="hover:text-foreground transition-colors">
                                Docs
                            </Link>
                            <Link href="/examples" className="hover:text-foreground transition-colors">
                                Examples
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="https://github.com/Adityarya11/Compiler-Blan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-foreground/50 hover:text-foreground transition-colors hidden sm:block"
                        >
                            GitHub ↗
                        </Link>

                        <div className="h-4 w-px bg-border hidden sm:block" />

                        <button
                            onClick={toggleTheme}
                            className="text-xs border border-border px-3 py-1.5 rounded hover:bg-muted/50 transition-colors font-medium text-foreground/60 hover:text-foreground"
                        >
                            {theme === "dark" ? "Light" : "Dark"}
                        </button>

                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="text-xs border border-border px-4 py-1.5 rounded font-medium text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-colors"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="text-xs bg-foreground text-background px-4 py-1.5 rounded font-semibold hover:opacity-85 transition-opacity whitespace-nowrap"
                            >
                                Login / Register
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {showCookieBanner && (
                <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm px-6 py-4">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <p className="text-xs text-foreground/60 leading-relaxed max-w-xl">
                            I don't have money to buy more space in the localStorage so please accept the cookie.
                        </p>
                        <button
                            onClick={acceptCookie}
                            className="text-xs bg-foreground text-background px-4 py-1.5 rounded font-medium hover:opacity-85 transition-opacity whitespace-nowrap shrink-0"
                        >
                            fair enough, accept
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}