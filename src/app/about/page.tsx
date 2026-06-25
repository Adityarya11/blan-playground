import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16 flex-grow">

            {/* Header */}
            <div className="mb-14">
                <p className="text-xs font-mono text-foreground/40 uppercase tracking-widest mb-3">
                    about this thing
                </p>
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    what even is Blan?
                </h1>
                <p className="text-foreground/60 leading-relaxed text-base">
                    Blan or BadLang is what happens when a CS student gets too curious about
                    how compilers work and decides the best way to learn is to build one —
                    in C++, with Hindi slang as the syntax, because why not.
                </p>
            </div>

            {/* The itch */}
            <section className="mb-14 space-y-4 text-foreground/70 leading-relaxed">
                <h2 className="text-xl font-semibold text-foreground mb-4">the itch</h2>
                <p>
                    It started with a Compiler Design course (CS312) and the very reasonable question:
                    "what actually happens between the code I write and the thing that runs?" Most people
                    move on. Some people open a textbook. A few people build a lexer at 2am and don't
                    stop until they have a full tree-walking interpreter.
                </p>
                <p>
                    Blan is the third kind of person. A C++ compiler that tokenizes, parses into an AST,
                    and evaluates — with keywords like <code className="font-mono text-sm bg-muted/30 px-1.5 py-0.5 rounded text-blue-400">bhadwa</code> for
                    variable declaration and <code className="font-mono text-sm bg-muted/30 px-1.5 py-0.5 rounded text-blue-400">bolna</code> for
                    print, because if you're going to spend weeks on something, it should at least make
                    you laugh.
                </p>
                <p>
                    Then it needed a backend. So there's a Go API server with a worker pool, async job
                    execution, a custom LSM-tree cache engine (StrataKV — also built from scratch, because
                    apparently one project wasn't enough), and JWT auth. Then it needed a frontend.
                    Here we are.
                </p>
                <p>
                    The real goal was never to build a production language. The goal was to understand
                    what happens at every layer — from source text to token to AST node to evaluated value.
                    And to have something genuinely weird to show for it.
                </p>
            </section>

            {/* Stack */}
            <section className="mb-14">
                <h2 className="text-xl font-semibold text-foreground mb-5">what's under the hood</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            layer: "Compiler",
                            tech: "C++17",
                            detail: "Lexer → Parser → AST → Tree-walking evaluator. Built with CMake, tested with GoogleTest.",
                        },
                        {
                            layer: "Backend",
                            tech: "Go + Gin",
                            detail: "Async worker pool, StrataKV LSM cache, JWT auth, MySQL via GORM. Deployed on Railway.",
                        },
                        {
                            layer: "Frontend",
                            tech: "Next.js 16",
                            detail: "Monaco editor with custom Blan syntax highlighting. Tailwind v4. Deployed on Vercel.",
                        },
                    ].map(({ layer, tech, detail }) => (
                        <div key={layer} className="border border-border rounded-lg p-4 space-y-1.5">
                            <p className="text-xs text-foreground/40 uppercase tracking-wider">{layer}</p>
                            <p className="font-semibold text-foreground text-sm">{tech}</p>
                            <p className="text-xs text-foreground/55 leading-relaxed">{detail}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Maker */}
            <section className="mb-14">
                <h2 className="text-xl font-semibold text-foreground mb-6">the person responsible</h2>
                <div className="border border-border rounded-lg p-6 flex flex-col sm:flex-row gap-6">
                    <div className="shrink-0">
                        <img
                            src="https://github.com/Adityarya11.png"
                            alt="Aditya Arya"
                            className="w-16 h-16 rounded-full border border-border object-cover shadow-sm"
                        />
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="font-semibold text-foreground text-base">Aditya Arya</p>
                            <p className="text-xs text-foreground/40">
                                B.Tech Computer Science · RGIPT · Batch of 2027
                            </p>
                        </div>
                        <p className="text-sm text-foreground/65 leading-relaxed">
                            CS student who got a little too interested in Compiler Design and how things work under the
                            hood. Competitive programmer by habit, systems engineer by curiosity. Built Blan
                            because the Compiler Design course said "understand lexical analysis" and somewhere
                            that turned into a full language with a Go backend and a cloud deployment.
                        </p>
                        <p className="text-sm text-foreground/65 leading-relaxed">
                            Also built StrataKV (an LSM-tree key-value store in Go) because the cache layer
                            needed to be custom too. At some point you stop asking why and just keep building.
                        </p>
                        <div className="flex items-center gap-4 pt-1">
                            <Link
                                href="https://github.com/Adityarya11"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1.5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                GitHub
                            </Link>
                            <Link
                                href="https://www.linkedin.com/in/adityarya"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1.5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                LinkedIn
                            </Link>
                            <Link
                                href="https://x.com/adity_rya11"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1.5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                                </svg>
                                X
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Built with Claude note */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold text-foreground mb-4">an honest note</h2>
                <p className="text-sm text-foreground/60 leading-relaxed">
                    Parts of this project were built with AI assistance (Claude by Anthropic) — specifically
                    the frontend, documentation, and some backend refinements. The compiler, StrataKV, and
                    the core systems architecture are original work. The AI was used the way a senior
                    developer might be used: to review, suggest, and help move faster. Not to replace
                    understanding — the whole point of this project was to build understanding from the
                    ground up.
                </p>
            </section>

            {/* Footer nudge */}
            <div className="border-t border-border pt-8 text-center">
                <p className="text-xs text-foreground/30">
                    found a bug? have a feature idea? the GitHub repos are open.
                    or just say hi on X.
                </p>
            </div>

        </div>
    );
}