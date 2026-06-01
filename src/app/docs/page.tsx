export default function DocsPage() {
    return (
        <div className="max-w-4xl mx-auto w-full p-8 py-12 flex-grow flex flex-col">
            <div className="mb-10 border-b border-border pb-8">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
                <p className="text-xl text-foreground/70">
                    The official reference and specifications for the Bad Language Compiler (Blan).
                </p>
            </div>

            <div className="space-y-12">
                {/* About Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">About the Project</h2>
                    <div className="space-y-4 text-foreground/80 leading-relaxed">
                        <p>
                            This project is a custom language interpreter built entirely around Hindi slang and swear words.
                            The core motivation was to take a standard academic curriculum—Compiler Design (CS312)—and
                            apply it to an unconventional and humorous concept.
                        </p>
                        <p>
                            The architecture follows the classical first phases of compiler design:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 bg-muted/10 p-4 rounded border border-border">
                            <li><strong>Lexical Analysis (Lexer):</strong> Tokenizes the raw source code.</li>
                            <li><strong>Syntax Analysis (Parser):</strong> Builds the Abstract Syntax Tree (AST).</li>
                            <li><strong>Semantic Analysis (Evaluator):</strong> Evaluates the AST in memory.</li>
                        </ul>
                    </div>
                </section>

                {/* Language Specifications */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Language Specifications</h2>

                    <div className="space-y-8">
                        {/* Program Structure */}
                        <div>
                            <h3 className="text-lg font-medium mb-2 border-l-2 border-foreground pl-3">Program Structure</h3>
                            <p className="text-foreground/80 mb-3">The language strictly enforces designated entry and exit points for scope management.</p>
                            <div className="bg-background border border-border rounded p-4">
                                <ul className="space-y-2 font-mono text-sm">
                                    <li><span className="text-green-400 font-bold">Haan Meri Jaan</span> <span className="text-foreground/50">// Entry Point</span></li>
                                    <li><span className="text-red-400 font-bold">Bhag Bsdk</span> <span className="text-foreground/50">// Exit Point</span></li>
                                </ul>
                            </div>
                        </div>

                        {/* Keywords */}
                        <div>
                            <h3 className="text-lg font-medium mb-2 border-l-2 border-foreground pl-3">Keywords & Control Flow</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-muted/10 p-4 rounded border border-border">
                                    <h4 className="font-semibold mb-3 border-b border-border pb-2">Conditionals</h4>
                                    <ul className="space-y-2 text-sm font-mono">
                                        <li><span className="text-blue-400">agar</span> <span className="text-foreground/60 font-sans">- if</span></li>
                                        <li><span className="text-blue-400">tab</span> <span className="text-foreground/60 font-sans">- then</span></li>
                                        <li><span className="text-blue-400">warna</span> <span className="text-foreground/60 font-sans">- else-if</span></li>
                                        <li><span className="text-blue-400">nahi_toh</span> <span className="text-foreground/60 font-sans">- else</span></li>
                                        <li><span className="text-blue-400">khtm</span> <span className="text-foreground/60 font-sans">- end-if</span></li>
                                    </ul>
                                </div>
                                <div className="bg-muted/10 p-4 rounded border border-border">
                                    <h4 className="font-semibold mb-3 border-b border-border pb-2">Loops</h4>
                                    <ul className="space-y-2 text-sm font-mono">
                                        <li><span className="text-blue-400">JabTak</span> <span className="text-foreground/60 font-sans">- while</span></li>
                                        <li><span className="text-blue-400">TabTak</span> <span className="text-foreground/60 font-sans">- do</span></li>
                                        <li><span className="text-blue-400">hogya</span> <span className="text-foreground/60 font-sans">- end-while</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Variables and Types */}
                        <div>
                            <h3 className="text-lg font-medium mb-2 border-l-2 border-foreground pl-3">Variables & Types</h3>
                            <ul className="list-disc pl-6 space-y-3 text-foreground/80">
                                <li><strong>Declaration:</strong> <code className="text-blue-400 bg-muted/30 px-1 rounded">bhadwa</code> is used to declare a variable.</li>
                                <li><strong>Assignment:</strong> <code className="text-blue-400 bg-muted/30 px-1 rounded">matlb</code> serves as the assignment operator (=).</li>
                                <li><strong>Output:</strong> <code className="text-blue-400 bg-muted/30 px-1 rounded">bolna</code> prints the evaluated expression to the standard output.</li>
                                <li><strong>Booleans:</strong> Represented natively as <code className="text-blue-400 bg-muted/30 px-1 rounded">sach</code> (true) and <code className="text-blue-400 bg-muted/30 px-1 rounded">jhooth</code> (false).</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}