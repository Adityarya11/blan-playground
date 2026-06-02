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
  const [output, setOutput] = useState<string>('// Output will appear here...');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const readResponseText = async (response: Response) => {
    try {
      return await response.text();
    } catch {
      return '';
    }
  };

  const handleRun = async () => {
    if (!code.trim() || isCompiling) return;

    setIsCompiling(true);
    setOutput('// Compiling...');

    try {
      const compileRes = await fetch(`${API_BASE_URL}/api/v1/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_code: code }),
      });

      if (!compileRes.ok) {
        const errText = await readResponseText(compileRes);
        throw new Error(errText || `Failed to reach the compile endpoint. Status: ${compileRes.status}`);
      }

      const compileData = await compileRes.json();
      const jobId = compileData.ID || compileData.id || compileData.job_id;
      const directOutput = compileData.Output ?? compileData.output;
      const directError = compileData.Error ?? compileData.error;

      if (directOutput !== undefined || directError !== undefined) {
        setOutput(String(directError || directOutput || '// Execution finished with no output.'));
        return;
      }

      if (!jobId) {
        throw new Error('Backend returned neither output nor job id.');
      }

      setOutput(`// Job [${jobId.substring(0, 8)}...] queued. Waiting for worker...`);

      while (true) {
        const statusRes = await fetch(`${API_BASE_URL}/api/v1/status/${jobId}`);

        if (!statusRes.ok) {
          const errText = await readResponseText(statusRes);
          throw new Error(errText || `Failed to fetch job status. Status: ${statusRes.status}`);
        }

        const statusData = await statusRes.json();
        const currentStatus = String(statusData.Status || statusData.status || '').toLowerCase();
        const finalOutput = statusData.Output ?? statusData.output;
        const finalError = statusData.Error ?? statusData.error;

        if (currentStatus === 'completed' || currentStatus === 'failed') {
          setOutput(String(finalError || finalOutput || '// Execution finished with no output.'));
          break;
        }

        setOutput(`// Job status: ${currentStatus || 'queued'}...`);
        await sleep(1000);
      }
    } catch (err: any) {
      setOutput(`// System Error: ${err.message}`);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="grow flex flex-col md:flex-row border-t border-border min-h-[calc(100vh-73px)]">

      {/* Left Side: The Code Editor */}
      <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-border h-[50vh] md:h-auto relative">
        <div className="flex justify-between items-center p-3 px-6 border-b border-border bg-muted/30 shrink-0">
          <span className="text-sm font-medium text-foreground/80">main.bl</span>
          <button
            onClick={handleRun}
            disabled={isCompiling}
            className={`text-xs px-5 py-1.5 rounded font-medium transition-all flex items-center gap-2 ${isCompiling
              ? 'bg-foreground/50 cursor-not-allowed text-background'
              : 'bg-foreground text-background hover:opacity-90'
              }`}
          >
            {isCompiling ? '⏳ Compiling...' : '▶ Run'}
          </button>
        </div>
        <div className="grow relative w-full h-full">
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
        <div className="p-6 grow font-mono text-sm text-foreground/90 whitespace-pre-wrap overflow-y-auto">
          {output}
        </div>
      </div>

    </div>
  );
}