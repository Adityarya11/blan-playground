"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function setCookie(name: string, value: string, hours: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            setError("both fields. not optional.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "something went wrong. try again.");
                return;
            }

            setCookie("blan_token", data.token, 24);
            router.push("/");
            router.refresh();
        } catch {
            setError("could not reach the server. is the backend alive?");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-1">
                        welcome back.
                    </h1>
                    <p className="text-sm text-foreground/50">
                        log in to save and revisit your blan snippets.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="developer@blan.dev"
                            className="w-full px-3 py-2.5 bg-background border border-border rounded text-sm focus:outline-none focus:border-foreground/50 transition-colors"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="the one you set, hopefully"
                            className="w-full px-3 py-2.5 bg-background border border-border rounded text-sm focus:outline-none focus:border-foreground/50 transition-colors"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-400 font-mono">{error}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full py-2.5 rounded text-sm font-semibold tracking-tight transition-all mt-2 ${loading
                                ? "bg-foreground/30 text-background cursor-not-allowed"
                                : "bg-foreground text-background hover:opacity-85"
                            }`}
                    >
                        {loading ? "logging in..." : "log in"}
                    </button>
                </div>

                <p className="mt-6 text-center text-xs text-foreground/40">
                    don't have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-foreground/70 hover:text-foreground underline underline-offset-2"
                    >
                        sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
}