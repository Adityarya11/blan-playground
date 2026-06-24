"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BlanEditor from "@/components/BlanEditor";

const DEFAULT_CODE = `Haan Meri Jaan
bhadwa x matlb 10
bolna x
bolna "hello"
Bhag Bsdk`;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function PlaygroundInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [output, setOutput] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const param = searchParams.get("code");
    if (param) {
      setCode(decodeURIComponent(param));
      router.replace("/");
    }
  }, [searchParams, router]);

  const handleRun = async () => {
    if (!code.trim() || isCompiling) return;

    setIsCompiling(true);
    setOutput("");
    setIsCached(false);
    setIsError(false);

    try {
      const compileRes = await fetch(`${API_BASE_URL}/api/v1/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_code: code }),
      });

      if (!compileRes.ok) {
        const text = await compileRes.text().catch(() => "");
        throw new Error(text || `Compile endpoint returned ${compileRes.status}`);
      }

      const compileData = await compileRes.json();

      const directOutput = compileData.output ?? compileData.Output;
      const directError = compileData.error ?? compileData.Error;
      const cached = compileData.cached === true;

      if (directOutput !== undefined || directError !== undefined) {
        const hasError = Boolean(directError);
        setIsCached(cached && !hasError);
        setIsError(hasError);
        setOutput(String(directError || directOutput || ""));
        return;
      }

      const jobId = compileData.id || compileData.ID;
      if (!jobId) {
        throw new Error("Backend returned neither output nor a job id.");
      }

      setOutput(`Job queued — waiting for worker...`);

      while (true) {
        const statusRes = await fetch(`${API_BASE_URL}/api/v1/status/${jobId}`);

        if (!statusRes.ok) {
          const text = await statusRes.text().catch(() => "");
          throw new Error(text || `Status endpoint returned ${statusRes.status}`);
        }

        const statusData = await statusRes.json();
        const status = String(statusData.status || statusData.Status || "").toLowerCase();
        const finalOutput = statusData.output ?? statusData.Output;
        const finalError = statusData.error ?? statusData.Error;

        if (status === "completed" || status === "failed") {
          const hasError = Boolean(finalError);
          setIsError(hasError);
          setOutput(String(finalError || finalOutput || ""));
          break;
        }

        setOutput(`Job status: ${status || "queued"}...`);
        await sleep(1000);
      }
    } catch (err: any) {
      setIsError(true);
      setOutput(err.message || "An unexpected error occurred.");
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="grow flex flex-col md:flex-row border-t border-border min-h-[calc(100vh-57px)]">
      <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-border h-[50vh] md:h-auto relative">
        <div className="flex justify-between items-center px-5 py-2.5 border-b border-border bg-muted/20 shrink-0">
          <span className="text-xs font-medium text-foreground/60 font-mono">main.bl</span>
          <button
            onClick={handleRun}
            disabled={isCompiling}
            className={`text-xs px-5 py-1.5 rounded font-medium transition-all ${isCompiling
                ? "bg-foreground/30 cursor-not-allowed text-background"
                : "bg-foreground text-background hover:opacity-85"
              }`}
          >
            {isCompiling ? "Compiling..." : "Run"}
          </button>
        </div>

        <div className="grow relative w-full h-full">
          <div className="absolute" style={{ inset: 0 }}>
            <BlanEditor code={code} onChange={(val) => setCode(val || "")} />
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col bg-background h-[50vh] md:h-auto">
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-muted/20 shrink-0">
          <span className="text-xs font-medium text-foreground/60">Output</span>
          {isCached && (
            <span className="text-xs font-mono px-2 py-0.5 rounded border border-foreground/20 text-foreground/50">
              cached
            </span>
          )}
        </div>

        <div
          className={`p-6 grow font-mono text-sm whitespace-pre-wrap overflow-y-auto leading-relaxed ${isError ? "text-red-400" : output ? "text-foreground/90" : "text-foreground/30"
            }`}
        >
          {output || "// Run your code to see output here."}
        </div>
      </div>
    </div>
  );
}

export default function Playground() {
  return (
    <Suspense>
      <PlaygroundInner />
    </Suspense>
  );
}