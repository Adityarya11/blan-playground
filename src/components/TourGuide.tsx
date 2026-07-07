"use client";

import { useState, useEffect } from "react";

const STEPS = [
    {
        title: "Your Playground",
        description:
            "Write your Blan code here. The editor supports syntax highlighting, file upload, and auto-saves your draft locally.",
        target: "editor-pane",
    },
    {
        title: "Run Your Code",
        description:
            "Click Run to compile and execute. The job is queued on the backend and results stream back when ready.",
        target: "run-button",
    },
    {
        title: "Output Terminal",
        description:
            "Your program's stdout lands here. Errors render in red. A cached badge appears if the result came from StrataKV.",
        target: "output-pane",
    },
    {
        title: "Upload a File",
        description:
            "Already wrote some Blan code locally? Upload a .bl or .blan file directly into the editor.",
        target: "upload-button",
    },
    {
        title: "Quick Examples",
        description:
            "Load pre-written programs into the editor instantly — Hello World, Fibonacci, Factorial, and more.",
        target: "examples-button",
    },
    {
        title: "Docs",
        description: "The full language reference. Every keyword, operator, data type, and error message explained.",
        target: "nav-docs",
    },
    {
        title: "Examples Page",
        description: "A full gallery of example programs with syntax-highlighted previews. Click any card to load it into the playground.",
        target: "nav-examples",
    },
    {
        title: "About",
        description: "About the project, the stack, and the person who built it. Also where to file bugs or say hi.",
        target: "nav-about",
    },
    {
        title: "Login / Register",
        description: "Create an account to save your snippets to the cloud and retrieve them anytime.",
        target: "nav-login",
    },
    {
        title: "Star on GitHub",
        description: "If you find this useful or interesting, a star on the repo goes a long way. The compiler, backend, and playground are all open source.",
        target: "nav-github",
    },
];

interface TourGuideProps {
    onComplete: () => void;
    onSkip: () => void;
}

export default function TourGuide({ onComplete, onSkip }: TourGuideProps) {
    const [step, setStep] = useState(0);
    const [spotlight, setSpotlight] = useState<DOMRect | null>(null);

    const current = STEPS[step];

    useEffect(() => {
        if (!current.target) {
            setSpotlight(null);
            return;
        }

        const el = document.getElementById(current.target);
        if (!el) {
            setSpotlight(null);
            return;
        }

        const rect = el.getBoundingClientRect();
        setSpotlight(rect);

        // Re-measure on resize
        const observer = new ResizeObserver(() => {
            setSpotlight(el.getBoundingClientRect());
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [step, current.target]);

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep((s) => s + 1);
        } else {
            onComplete();
        }
    };

    const handleSkip = () => {
        onSkip();
    };

    return (
        // Full-screen blocking overlay — pointer-events: none on the overlay itself,
        // but the card and spotlight cutout are interactive.
        <div className="fixed inset-0 z-[300]" style={{ pointerEvents: "all" }}>

            {/* Dim layer — covers everything */}
            <div
                className="absolute inset-0"
                style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
            />

            {/* Spotlight cutout — rendered as a box-shadow ring around the target element */}
            {spotlight && (
                <div
                    className="absolute rounded transition-all duration-300"
                    style={{
                        top: spotlight.top - 4,
                        left: spotlight.left - 4,
                        width: spotlight.width + 8,
                        height: spotlight.height + 8,
                        boxShadow: "0 0 0 9999px rgba(0,0,0,0.75)",
                        border: "2px solid rgba(255,255,255,0.15)",
                        pointerEvents: "none",
                    }}
                />
            )}

            {/* Tour card — always centered, always on top */}
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm mx-4 rounded-xl border p-6 shadow-2xl"
                style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    zIndex: 301,
                }}
            >
                <div className="flex items-center justify-between mb-4">
                    <span
                        className="text-xs font-mono uppercase tracking-widest"
                        style={{ color: "var(--foreground)", opacity: 0.4 }}
                    >
                        {step + 1} / {STEPS.length}
                    </span>
                    <div className="flex gap-1">
                        {STEPS.map((_, i) => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full transition-colors"
                                style={{
                                    backgroundColor:
                                        i === step
                                            ? "var(--foreground)"
                                            : "var(--border)",
                                }}
                            />
                        ))}
                    </div>
                </div>

                <h3
                    className="text-base font-semibold mb-2"
                    style={{ color: "var(--foreground)" }}
                >
                    {current.title}
                </h3>

                <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: "var(--foreground)", opacity: 0.65 }}
                >
                    {current.description}
                </p>

                <div className="flex items-center justify-between">
                    <button
                        onClick={handleSkip}
                        className="text-xs font-medium transition-opacity hover:opacity-100"
                        style={{ color: "var(--foreground)", opacity: 0.4 }}
                    >
                        Skip
                    </button>

                    <button
                        onClick={handleNext}
                        className="text-xs px-5 py-2 rounded font-semibold transition-opacity hover:opacity-85"
                        style={{
                            backgroundColor: "var(--foreground)",
                            color: "var(--background)",
                        }}
                    >
                        {step === STEPS.length - 1 ? "Done" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    );
}