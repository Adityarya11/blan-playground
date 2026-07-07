"use client";

import { useEffect, useState } from "react";

export default function VisitorCounter() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("blan_visit_count");
        const next = stored ? parseInt(stored, 10) + 1 : 1;
        localStorage.setItem("blan_visit_count", String(next));
        setCount(next);
    }, []);

    if (count === null) return null;

    return (
        <div
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
            style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
                opacity: 0.7,
            }}
        >
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {count} {count === 1 ? "visit" : "visits"}
        </div>
    );
}