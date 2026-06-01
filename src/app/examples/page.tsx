// Pulling directly from your EXAMPLES.md
const blanExamples = [
    {
        title: "Quick Start",
        description: "The smallest useful Blan program demonstrating variables and output.",
        code: `Haan Meri Jaan\nbhadwa x matlb 10\nbolna x\nbolna "hello"\nBhag Bsdk`
    },
    {
        title: "If / Else-If / Else",
        description: "The canonical if/else example showing chained conditional branches.",
        code: `Haan Meri Jaan\nbhadwa x matlb 10\n\nagar x > 15 tab\n    bolna "X is greater than 15"\nwarna x == 10 tab\n    bolna "X is exactly 10"\nnahi_toh\n    bolna "X is less than 10"\nkhtm\n\nBhag Bsdk`
    },
    {
        title: "While Loop (JabTak)",
        description: "Arithmetic decrementing and repeated execution.",
        code: `Haan Meri Jaan\nbhadwa count matlb 3\n\nJabTak count > 0 TabTak\n    bolna count\n    bhadwa count matlb count - 1\nhogya\n\nBhag Bsdk`
    },
    {
        title: "Boolean Implement",
        description: "Numeric mapping of booleans (sach behaves like 1, jhooth like 0).",
        code: `Haan Meri Jaan\nbhadwa x matlb sach\n\nagar x == 1 tab\n    bolna "ok"\nkhtm\n\nBhag Bsdk`
    },
    {
        title: "Modulo Error",
        description: "Evaluator stops with a modulo-by-zero runtime error.",
        code: `Haan Meri Jaan\nbolna 10 % 0\nBhag Bsdk`
    }
];

export default function ExamplesPage() {
    return (
        <div className="max-w-6xl mx-auto w-full p-8 py-12 flex-grow flex flex-col">
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Examples</h1>
                <p className="text-foreground/70">
                    Practical showcases for the Bad Language Compiler. Verify behavior and learn the syntax.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blanExamples.map((example, index) => (
                    <div
                        key={index}
                        className="border border-border bg-muted/10 rounded-lg p-6 flex flex-col hover:border-foreground/30 transition-colors"
                    >
                        <h2 className="text-xl font-semibold mb-2">{example.title}</h2>
                        <p className="text-sm text-foreground/70 mb-4">{example.description}</p>

                        <div className="bg-background border border-border rounded p-4 overflow-x-auto mt-auto">
                            <pre className="font-mono text-sm text-foreground/90 whitespace-pre">
                                <code>{example.code}</code>
                            </pre>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}