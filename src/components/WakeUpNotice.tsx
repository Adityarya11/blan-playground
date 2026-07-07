"use client";

import { useEffect, useState } from "react";

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`));
    return match ? match.split("=")[1] : null;
}

function setCookie(name: string, value: string, days: number) {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

interface WakeUpNoticeProps {
    open?: boolean;
    onClose?: () => void;
}

export default function WakeUpNotice({ open, onClose }: WakeUpNoticeProps) {
    const [visible, setVisible] = useState(false);

    // First-visit logic — only runs when not externally controlled
    useEffect(() => {
        if (open !== undefined) return;
        if (getCookie("blan_visited")) return;

        const timer = setTimeout(() => {
            setVisible(true);
            setCookie("blan_visited", "yes", 30);
        }, 1000);

        return () => clearTimeout(timer);
    }, [open]);

    // External control
    useEffect(() => {
        if (open !== undefined) setVisible(open);
    }, [open]);

    const handleClose = () => {
        setVisible(false);
        onClose?.();
    };

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[400] flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={handleClose}
        >
            <div
                className="relative max-w-sm w-full mx-4 rounded-xl border p-6 shadow-2xl"
                style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-xs"
                    style={{ color: "var(--foreground)", opacity: 0.4 }}
                >
                    ✕
                </button>

                <p
                    className="text-xs font-mono uppercase tracking-widest mb-3"
                    style={{ color: "var(--foreground)", opacity: 0.4 }}
                >
                    heads up
                </p>

                <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "var(--foreground)", opacity: 0.85 }}
                >
                    The backend runs on Render's free tier — which means it sleeps when
                    nobody's using it. Your first compile might take{" "}
                    <span className="font-semibold">20–30 seconds</span> to wake up.
                    After that, it's fast.
                </p>

                <p
                    className="text-sm leading-relaxed mb-5"
                    style={{ color: "var(--foreground)", opacity: 0.6 }}
                >
                    If that bothers you, hire me and I'll put it on something that
                    doesn't sleep.
                </p>

                <button
                    onClick={handleClose}
                    className="w-full py-2 rounded text-sm font-semibold transition-opacity hover:opacity-85"
                    style={{
                        backgroundColor: "var(--foreground)",
                        color: "var(--background)",
                    }}
                >
                    got it, let's go
                </button>
            </div>
        </div>
    );
}