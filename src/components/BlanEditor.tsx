"use client";

import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

interface BlanEditorProps {
    code: string;
    onChange: (value: string | undefined) => void;
    readOnly?: boolean;
}

export default function BlanEditor({ code, onChange, readOnly = false }: BlanEditorProps) {
    const [editorTheme, setEditorTheme] = useState<"blanDark" | "blanLight">("blanDark");

    useEffect(() => {
        const updateTheme = () => {
            const isDark = document.documentElement.classList.contains("dark");
            setEditorTheme(isDark ? "blanDark" : "blanLight");
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const handleEditorWillMount = (monaco: any) => {
        monaco.languages.register({ id: "blan" });

        monaco.languages.setMonarchTokensProvider("blan", {
            tokenizer: {
                root: [
                    [/Haan Meri Jaan/, "keyword.start"],
                    [/Bhag Bsdk/, "keyword.end"],
                    [
                        /\b(bhadwa|matlb|bolna|agar|tab|warna|warna_agar|nahi_toh|nhi_toh|khtm|bas_itna_hi|JabTak|TabTak|hogya|sach|jhooth)\b/,
                        "keyword",
                    ],
                    [/\/\/.*$/, "comment"],
                    [/".*?"/, "string"],
                    [/\d+/, "number"],
                ],
            },
        });

        monaco.editor.defineTheme('blanDark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'keyword.start', foreground: '#4ADE80', fontStyle: 'bold' },
                { token: 'keyword.end', foreground: '#F87171', fontStyle: 'bold' },
                { token: 'keyword', foreground: '#60A5FA' },
                { token: 'comment', foreground: '#71717A', fontStyle: 'italic' }, // Softer comment gray
                { token: 'string', foreground: '#FCD34D' },
            ],
            colors: {
                'editor.background': '#09090b', // MATCHES THE NEW ZINC BACKGROUND
                'editor.lineHighlightBackground': '#18181b',
                'editorLineNumber.foreground': '#52525b',
            }
        });

        monaco.editor.defineTheme("blanLight", {
            base: "vs",
            inherit: true,
            rules: [
                { token: "keyword.start", foreground: "#16A34A", fontStyle: "bold" },
                { token: "keyword.end", foreground: "#DC2626", fontStyle: "bold" },
                { token: "keyword", foreground: "#2563EB" },
                { token: "comment", foreground: "#6B7280", fontStyle: "italic" },
                { token: "string", foreground: "#D97706" },
            ],
            colors: {
                "editor.background": "#ffffff",
                "editor.lineHighlightBackground": "#f3f4f6",
                "editorLineNumber.foreground": "#9ca3af",
            },
        });
    };

    return (
        <Editor
            height="100%"
            defaultLanguage="blan"
            theme={editorTheme}
            value={code}
            onChange={onChange}
            beforeMount={handleEditorWillMount}
            options={{
                minimap: { enabled: false },
                fontSize: 17,             // Increased from 15
                lineHeight: 26,           // Added breathing room between lines
                letterSpacing: 0.5,       // Added slight tracking
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                padding: { top: 24 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                wordWrap: 'on',
            }}
        />
    );
}