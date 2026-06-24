"use client";

import { useEffect, useState } from "react";

const sections = [
    { id: "about", label: "About" },
    { id: "structure", label: "Program Structure" },
    { id: "variables", label: "Variables" },
    { id: "types", label: "Data Types" },
    { id: "operators", label: "Operators" },
    { id: "conditionals", label: "Conditionals" },
    { id: "loops", label: "Loops" },
    { id: "errors", label: "Error Messages" },
    { id: "keywords", label: "Keyword Reference" },
];

function CodeBlock({ children }: { children: string }) {
    return (
        <pre className="bg-muted/20 border border-border rounded p-4 font-mono text-sm text-foreground/85 overflow-x-auto leading-relaxed whitespace-pre">
            {children}
        </pre>
    );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} className="scroll-mt-8">
            <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-border">{title}</h2>
            <div className="space-y-4 text-foreground/75 text-sm leading-relaxed">{children}</div>
        </section>
    );
}

function KW({ children }: { children: string }) {
    return (
        <code className="text-blue-400 bg-muted/20 px-1.5 py-0.5 rounded font-mono text-xs">
            {children}
        </code>
    );
}

export default function DocsPage() {
    const [active, setActive] = useState("about");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                }
            },
            { rootMargin: "-30% 0px -60% 0px" }
        );

        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="max-w-6xl mx-auto w-full px-6 py-12 flex-grow flex gap-12">
            <aside className="hidden lg:block w-48 shrink-0">
                <div className="sticky top-8 space-y-1">
                    <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-4">
                        Reference
                    </p>
                    {sections.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => scrollTo(id)}
                            className={`block w-full text-left text-sm px-3 py-1.5 rounded transition-colors ${active === id
                                    ? "text-foreground bg-muted/30 font-medium"
                                    : "text-foreground/50 hover:text-foreground"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </aside>

            <div className="flex-1 space-y-14 min-w-0">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Documentation</h1>
                    <p className="text-sm text-foreground/50">
                        Language specification and reference for the Bad Language Compiler.
                    </p>
                </div>

                <Section id="about" title="About">
                    <p>
                        Blan is a custom tree-walking interpreter built around Hindi slang. It was written as an
                        applied exercise in compiler design — specifically the Lexical Analysis, Syntax Analysis,
                        and Semantic Analysis phases from the CS312 curriculum at RGIPT.
                    </p>
                    <p>
                        The compiler is implemented in C++17. The backend execution layer is written in Go and
                        handles asynchronous job execution, result caching via a custom LSM-tree engine
                        (StrataKV), and JWT-based authentication.
                    </p>
                    <p>
                        This playground sends your source code to the Go backend, which hashes it, checks the
                        cache, and either returns a cached result immediately or runs it through the C++ binary
                        via a bounded worker pool.
                    </p>
                </Section>

                <Section id="structure" title="Program Structure">
                    <p>
                        Every Blan program must begin with the entry marker and end with the exit marker. Tokens
                        found after the exit marker produce a syntax error.
                    </p>
                    <CodeBlock>{`Haan Meri Jaan
// your program goes here
Bhag Bsdk`}</CodeBlock>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="border border-border rounded p-3">
                            <p className="font-mono text-xs text-green-400 mb-1">Haan Meri Jaan</p>
                            <p className="text-xs text-foreground/60">Entry point. Must be the first non-comment token.</p>
                        </div>
                        <div className="border border-border rounded p-3">
                            <p className="font-mono text-xs text-red-400 mb-1">Bhag Bsdk</p>
                            <p className="text-xs text-foreground/60">Exit point. Terminates the program cleanly.</p>
                        </div>
                    </div>
                    <p className="mt-2">
                        Single-line comments are supported with <KW>//</KW> and are ignored by the lexer.
                    </p>
                </Section>

                <Section id="variables" title="Variables">
                    <p>
                        Variables are declared and assigned in a single statement using <KW>bhadwa</KW> and{" "}
                        <KW>matlb</KW>. There is no separate declaration without assignment.
                    </p>
                    <CodeBlock>{`bhadwa x matlb 10
bhadwa name matlb "Aditya"
bhadwa flag matlb sach`}</CodeBlock>
                    <p>
                        Reassignment uses the same syntax. There is no mutation keyword — <KW>bhadwa</KW> is
                        always used.
                    </p>
                    <CodeBlock>{`bhadwa count matlb 5
bhadwa count matlb count - 1`}</CodeBlock>
                </Section>

                <Section id="types" title="Data Types">
                    <p>
                        The evaluator uses a <code className="font-mono text-xs">std::variant</code>-based Value
                        type that holds one of four kinds at runtime.
                    </p>

                    <div className="space-y-3">
                        <div className="border border-border rounded p-4">
                            <p className="font-semibold text-foreground text-xs mb-2">Number</p>
                            <p className="text-xs text-foreground/60 mb-2">
                                All numeric values are stored as double-precision floating point internally.
                                Trailing zeros are stripped from output.
                            </p>
                            <CodeBlock>{`bhadwa x matlb 42
bhadwa y matlb x + 8`}</CodeBlock>
                        </div>

                        <div className="border border-border rounded p-4">
                            <p className="font-semibold text-foreground text-xs mb-2">String</p>
                            <p className="text-xs text-foreground/60 mb-2">
                                String literals are enclosed in double quotes. The <KW>+</KW> operator concatenates
                                two strings.
                            </p>
                            <CodeBlock>{`bhadwa greeting matlb "Haan "
bolna greeting + "Meri Jaan"`}</CodeBlock>
                        </div>

                        <div className="border border-border rounded p-4">
                            <p className="font-semibold text-foreground text-xs mb-2">Boolean</p>
                            <p className="text-xs text-foreground/60 mb-2">
                                Boolean literals are <KW>sach</KW> (true) and <KW>jhooth</KW> (false). They print
                                as their Blan names, not as 0/1. In numeric contexts, <KW>sach</KW> behaves as 1
                                and <KW>jhooth</KW> as 0.
                            </p>
                            <CodeBlock>{`bolna sach        // prints: sach
bolna sach == 1   // prints: sach
bolna !jhooth     // prints: sach`}</CodeBlock>
                        </div>

                        <div className="border border-border rounded p-4">
                            <p className="font-semibold text-foreground text-xs mb-2">Null</p>
                            <p className="text-xs text-foreground/60">
                                Represented by <code className="font-mono text-xs">std::monostate</code> internally.
                                Uninitialized state. Prints as <code className="font-mono text-xs">null</code>.
                            </p>
                        </div>
                    </div>
                </Section>

                <Section id="operators" title="Operators">
                    <p>
                        Operators are evaluated left to right within each precedence level. The full precedence
                        chain from lowest to highest:
                    </p>
                    <CodeBlock>{`||  →  &&  →  == !=  →  < <= > >=  →  + -  →  * / %  →  - ! (unary)`}</CodeBlock>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        <div className="border border-border rounded p-3">
                            <p className="text-xs font-semibold text-foreground mb-2">Arithmetic</p>
                            <ul className="space-y-1 font-mono text-xs text-foreground/60">
                                <li>+ &nbsp; add / concatenate</li>
                                <li>- &nbsp; subtract</li>
                                <li>* &nbsp; multiply</li>
                                <li>/ &nbsp; divide</li>
                                <li>% &nbsp; modulo</li>
                            </ul>
                        </div>
                        <div className="border border-border rounded p-3">
                            <p className="text-xs font-semibold text-foreground mb-2">Comparison</p>
                            <ul className="space-y-1 font-mono text-xs text-foreground/60">
                                <li>== &nbsp; equal</li>
                                <li>!= &nbsp; not equal</li>
                                <li>&lt; &nbsp; less than</li>
                                <li>&lt;= &nbsp; less or equal</li>
                                <li>&gt; &nbsp; greater than</li>
                                <li>&gt;= &nbsp; greater or equal</li>
                            </ul>
                        </div>
                        <div className="border border-border rounded p-3">
                            <p className="text-xs font-semibold text-foreground mb-2">Logical</p>
                            <ul className="space-y-1 font-mono text-xs text-foreground/60">
                                <li>&amp;&amp; &nbsp; and (short-circuit)</li>
                                <li>|| &nbsp; or (short-circuit)</li>
                                <li>! &nbsp; not</li>
                            </ul>
                        </div>
                    </div>

                    <p className="mt-4">
                        Type mismatches produce a runtime error. You cannot subtract strings or apply{" "}
                        <KW>!</KW> to a number.
                    </p>
                </Section>

                <Section id="conditionals" title="Conditionals">
                    <p>
                        Conditionals use <KW>agar</KW> for if, <KW>warna</KW> for else-if, <KW>nahi_toh</KW>{" "}
                        for else, and <KW>khtm</KW> to close the block. The <KW>tab</KW> keyword closes the
                        condition header.
                    </p>
                    <CodeBlock>{`agar x > 15 tab
    bolna "greater"
warna x == 10 tab
    bolna "exactly ten"
nahi_toh
    bolna "less"
khtm`}</CodeBlock>
                    <p>
                        The <KW>warna</KW> chain is handled recursively by the parser — you can nest as many
                        else-if branches as needed. The <KW>khtm</KW> keyword always appears exactly once,
                        closing the entire chain.
                    </p>
                    <p>
                        Legacy aliases <KW>warna_agar</KW> and <KW>nhi_toh</KW> are still accepted for backward
                        compatibility.
                    </p>
                </Section>

                <Section id="loops" title="Loops">
                    <p>
                        The while loop uses <KW>JabTak</KW> to open, <KW>TabTak</KW> to close the condition
                        header, and <KW>hogya</KW> to end the body.
                    </p>
                    <CodeBlock>{`bhadwa count matlb 3

JabTak count > 0 TabTak
    bolna count
    bhadwa count matlb count - 1
hogya`}</CodeBlock>
                    <p>
                        The evaluator enforces a hard iteration cap of 100,000 loops. Programs that exceed this
                        are terminated with a runtime error to prevent infinite loops from hanging the execution
                        worker.
                    </p>
                </Section>

                <Section id="errors" title="Error Messages">
                    <p>
                        Blan uses themed error messages. They are not meant to be polite.
                    </p>
                    <div className="space-y-3">
                        <div className="border border-border rounded p-3">
                            <p className="font-mono text-xs text-red-400 mb-1">BehenChod! [Line N, Col N] Syntax Error</p>
                            <p className="text-xs text-foreground/60">
                                Emitted by the parser for malformed structure — missing <KW>tab</KW>, unclosed
                                blocks, unexpected tokens.
                            </p>
                        </div>
                        <div className="border border-border rounded p-3">
                            <p className="font-mono text-xs text-red-400 mb-1">CHUDDI! ...</p>
                            <p className="text-xs text-foreground/60">
                                Emitted by the evaluator for runtime errors — type mismatches, division by zero,
                                undefined variables, unknown operators.
                            </p>
                        </div>
                        <div className="border border-border rounded p-3">
                            <p className="font-mono text-xs text-red-400 mb-1">CHHUDDI! Maximum loops exceeded</p>
                            <p className="text-xs text-foreground/60">
                                Emitted when the 100,000 iteration cap is hit. Indicates an infinite loop.
                            </p>
                        </div>
                    </div>
                </Section>

                <Section id="keywords" title="Keyword Reference">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-border text-foreground/40 text-left">
                                    <th className="py-2 pr-6 font-medium">Keyword</th>
                                    <th className="py-2 pr-6 font-medium">Role</th>
                                    <th className="py-2 font-medium">Alias</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {[
                                    ["Haan Meri Jaan", "Program entry", ""],
                                    ["Bhag Bsdk", "Program exit", ""],
                                    ["bhadwa", "Variable declaration", ""],
                                    ["matlb", "Assignment operator", ""],
                                    ["bolna", "Print to stdout", ""],
                                    ["agar", "If condition", ""],
                                    ["tab", "Condition header close", ""],
                                    ["warna", "Else-if branch", "warna_agar"],
                                    ["nahi_toh", "Else branch", "nhi_toh"],
                                    ["khtm", "End if block", "bas_itna_hi"],
                                    ["JabTak", "While loop open", ""],
                                    ["TabTak", "While condition close", ""],
                                    ["hogya", "End while block", ""],
                                    ["sach", "Boolean true", ""],
                                    ["jhooth", "Boolean false", ""],
                                ].map(([kw, role, alias]) => (
                                    <tr key={kw}>
                                        <td className="py-2 pr-6 font-mono text-blue-400">{kw}</td>
                                        <td className="py-2 pr-6 text-foreground/70">{role}</td>
                                        <td className="py-2 font-mono text-foreground/40">{alias}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>
            </div>
        </div>
    );
}