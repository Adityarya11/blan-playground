"use client";
import Editor from '@monaco-editor/react';

interface BlanEditorProps {
    code: string;
    onChange: (value: string | undefined) => void;
}

export default function BlanEditor({ code, onChange }: BlanEditorProps) {

    // This runs right BEFORE the editor mounts, ensuring the theme and language exist first!
    const handleEditorWillMount = (monaco: any) => {
        // 1. Register the custom Blan language
        monaco.languages.register({ id: 'blan' });

        // 2. Define the Lexical Tokens
        monaco.languages.setMonarchTokensProvider('blan', {
            tokenizer: {
                root: [
                    [/Haan Meri Jaan/, 'keyword.start'],
                    [/Bhag Bsdk/, 'keyword.end'],
                    [/\b(bhadwa|matlb|bolna|agar|tab|warna|warna_agar|nahi_toh|nhi_toh|khtm|bas_itna_hi|JabTak|TabTak|hogya|sach|jhooth)\b/, 'keyword'],
                    [/\/\/.*$/, 'comment'],
                    [/".*?"/, 'string'],
                    [/\d+/, 'number'],
                ]
            }
        });

        // 3. Define the custom theme
        monaco.editor.defineTheme('blanDark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'keyword.start', foreground: '#4ADE80', fontStyle: 'bold' },
                { token: 'keyword.end', foreground: '#F87171', fontStyle: 'bold' },
                { token: 'keyword', foreground: '#60A5FA' },
                { token: 'comment', foreground: '#9CA3AF', fontStyle: 'italic' },
                { token: 'string', foreground: '#FCD34D' },
            ],
            colors: {
                'editor.background': '#000000',
                'editor.lineHighlightBackground': '#111111',
                'editorLineNumber.foreground': '#555555',
            }
        });
    };

    return (
        <Editor
            height="100%"
            defaultLanguage="blan"
            theme="blanDark"
            value={code}
            onChange={onChange}
            beforeMount={handleEditorWillMount} // <--- The magic fix
            options={{
                minimap: { enabled: false },
                fontSize: 15,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                padding: { top: 24 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                wordWrap: 'on',
            }}
        />
    );
}