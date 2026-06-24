"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function SignupPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!username.trim() || !email.trim() || !password.trim()) {
            setError("fill everything. yes, all of it.");
            return;
        }

        if (password.length < 6) {
            setError("password too short. at least 6 characters, come on.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "something went wrong. try again.");
                return;
            }

            setSuccess(true);
            setTimeout(() => router.push("/login"), 2000);
        } catch {
            setError("could not reach the server. is the backend alive?");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center space-y-3">
                    <p className="text-2xl font-bold tracking-tight">you're in.</p>
                    <p className="text-sm text-foreground/50">
                        account created. taking you to login...
                    </p>
                    <div className="w-full h-0.5 bg-border rounded overflow-hidden mt-4">
                        <div className="h-full bg-foreground animate-[grow_2s_linear_forwards]" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-1">
                        join the chaos.
                    </h1>
                    <p className="text-sm text-foreground/50">
                        create an account to save your blan snippets.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="bhadwa_coder"
                            className="w-full px-3 py-2.5 bg-background border border-border rounded text-sm focus:outline-none focus:border-foreground/50 transition-colors font-mono"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            placeholder="something you won't forget"
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
                        {loading ? "creating account..." : "create account"}
                    </button>
                </div>

                <p className="mt-6 text-center text-xs text-foreground/40">
                    already have one?{" "}
                    <Link href="/login" className="text-foreground/70 hover:text-foreground underline underline-offset-2">
                        log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}