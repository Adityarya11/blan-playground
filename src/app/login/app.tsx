import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 border border-border rounded-lg bg-muted/10 shadow-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-foreground/70 text-sm">
                        Log in to save and manage your Blan snippets.
                    </p>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80 block">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="developer@example.com"
                            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-foreground/50 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80 block">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-foreground/50 transition-colors"
                        />
                    </div>

                    <button
                        type="button" // Change to submit later when wiring up Go
                        className="w-full bg-foreground text-background py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity mt-4"
                    >
                        Log In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-foreground/70">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-foreground font-medium hover:underline">
                        Sign up here
                    </Link>
                </div>
            </div>
        </div>
    );
}