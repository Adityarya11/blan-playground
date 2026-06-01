"use client";
import { useState } from 'react';
import BlanEditor from '@/components/BlanEditor';

const defaultCode = `Haan Meri Jaan
bhadwa x matlb 10
bolna x
bolna "hello"
Bhag Bsdk`;

export default function Playground() {
  const [code, setCode] = useState<string>(defaultCode);
  const [output, setOutput] = useState<string>('// Output will appear here...\n// Awaiting backend connection...');

  const handleRun = () => {
    setOutput('10\nhello');
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row border-t border-border min-h-[calc(100vh-73px)]">

      {/* Left Side: The Code Editor */}
      <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-border h-[50vh] md:h-auto relative">
        <div className="flex justify-between items-center p-3 px-6 border-b border-border bg-muted/30 shrink-0">
          <span className="text-sm font-medium text-foreground/80">main.bl</span>
          <button
            onClick={handleRun}
            className="text-xs bg-foreground text-background px-5 py-1.5 rounded font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            ▶ Run
          </button>
        </div>
        {/* Added absolute positioning bounds to force Monaco to fill the space */}
        <div className="flex-grow relative w-full h-full">
          <div className="absolute" style={{ inset: 0 }}>
            <BlanEditor code={code} onChange={(val) => setCode(val || '')} />
          </div>
        </div>
      </div>

      {/* Right Side: The Output Terminal */}
      <div className="w-full md:w-1/2 flex flex-col bg-background h-[50vh] md:h-auto">
        <div className="p-3 px-6 border-b border-border bg-muted/30 shrink-0">
          <span className="text-sm font-medium text-foreground/80">Terminal</span>
        </div>
        <div className="p-6 flex-grow font-mono text-sm text-foreground/90 whitespace-pre-wrap overflow-y-auto">
          {output}
        </div>
      </div>

    </div>
  );
}