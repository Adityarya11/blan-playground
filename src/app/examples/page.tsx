"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BlanEditor from "@/components/BlanEditor";

const examples = [
    {
        title: "Quick Start",
        description: "Variables, assignment, and output. The minimum viable Blan program.",
        code: `Haan Meri Jaan
bhadwa x matlb 10
bolna x
bolna "hello"
Bhag Bsdk`,
    },
    {
        title: "If / Else-If / Else",
        description: "Chained conditional branches using agar, warna, and nahi_toh.",
        code: `Haan Meri Jaan
bhadwa x matlb 10

agar x > 15 tab
    bolna "X is greater than 15"
warna x == 10 tab
    bolna "X is exactly 10"
nahi_toh
    bolna "X is less than 10"
khtm

Bhag Bsdk`,
    },
    {
        title: "While Loop",
        description: "Arithmetic decrementing with JabTak. Runs until the condition is false.",
        code: `Haan Meri Jaan
bhadwa count matlb 3

JabTak count > 0 TabTak
    bolna count
    bhadwa count matlb count - 1
hogya

Bhag Bsdk`,
    },
    {
        title: "Boolean Logic",
        description: "Logical operators with short-circuit evaluation. sach and jhooth as first-class values.",
        code: `Haan Meri Jaan
bolna !sach
bolna sach && jhooth
bolna jhooth || sach
Bhag Bsdk`,
    },
    {
        title: "Boolean in Conditionals",
        description: "A boolean variable used directly as a condition without an explicit comparison.",
        code: `Haan Meri Jaan
bhadwa x matlb sach

agar x tab
    bolna "bool works"
khtm

Bhag Bsdk`,
    },
    {
        title: "Numeric Boolean Mapping",
        description: "sach behaves like 1 and jhooth like 0 inside numeric expressions and comparisons.",
        code: `Haan Meri Jaan
bhadwa x matlb sach

agar x == 1 tab
    bolna "ok"
khtm

Bhag Bsdk`,
    },
    {
        title: "String Concatenation",
        description: "The + operator joins strings when both operands are string types.",
        code: `Haan Meri Jaan
bhadwa first matlb "Haan "
bhadwa second matlb "Meri Jaan"
bolna first + second
Bhag Bsdk`,
    },
    {
        title: "Combined: Branch + Loop",
        description: "Conditionals and loops used together in one program.",
        code: `Haan Meri Jaan
bhadwa x matlb 10

agar x > 15 tab
    bolna "X is greater than 15"
warna x == 10 tab
    bolna "X is exactly 10"
nahi_toh
    bolna "X is less than 10"
khtm

bhadwa count matlb 3
JabTak count > 0 TabTak
    bolna count
    bhadwa count matlb count - 1
hogya

Bhag Bsdk`,
    },
    {
        title: "Comparison Operators",
        description: "All six comparison operators evaluated against numbers and booleans.",
        code: `Haan Meri Jaan
bolna 5 < 10
bolna 10 >= 10
bolna sach == 1
bolna 3 != 4
Bhag Bsdk`,
    },
    {
        title: "Runtime Error — Modulo by Zero",
        description: "The evaluator stops with a themed runtime error when dividing by zero.",
        code: `Haan Meri Jaan
bolna 10 % 0
Bhag Bsdk`,
    },
];

function ExampleCard({ title, description, code }: { title: string; description: string; code: string }) {
    const router = useRouter();
    const [hovered, setHovered] = useState(false);

    const handleClick = () => {
        const encoded = encodeURIComponent(code);
        router.push(`/?code=${encoded}`);
    };

    return (
        <div
            className="relative border border-border rounded-lg overflow-hidden cursor-pointer group transition-all duration-200 hover:border-foreground/40 bg-background"
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="px-5 pt-5 pb-3">
                <h2 className="text-sm font-semibold text-foreground tracking-tight">{title}</h2>
                <p className="text-xs text-foreground/50 mt-1 leading-relaxed">{description}</p>
            </div>

            <div className="relative h-48 pointer-events-none select-none">
                <BlanEditor code={code} onChange={() => { }} readOnly />

                <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${hovered ? "opacity-100" : "opacity-0"
                        }`}
                    style={{ background: "rgba(0,0,0,0.55)" }}
                >
                    <span className="text-xs font-medium text-white border border-white/30 px-4 py-1.5 rounded">
                        Click to run
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function ExamplesPage() {
    return (
        <div className="max-w-6xl mx-auto w-full px-6 py-12 flex-grow flex flex-col">
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Examples</h1>
                <p className="text-sm text-foreground/60">
                    Click any example to load it directly into the playground.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {examples.map((example) => (
                    <ExampleCard key={example.title} {...example} />
                ))}
            </div>
        </div>
    );
}