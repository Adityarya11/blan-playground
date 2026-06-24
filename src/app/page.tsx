"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BlanEditor from "@/components/BlanEditor";

const DEFAULT_CODE = `Haan Meri Jaan
bhadwa x matlb 10
bolna x
bolna "hello"
Bhag Bsdk`;

const EXAMPLES = [
  {
    name: "Hello World",
    description: "The classic starting point.",
    code: `Haan Meri Jaan\n// A simple greeting\nbolna "Hello, World!"\nBhag Bsdk`
  },
  {
    name: "Variables & Math",
    description: "Basic arithmetic operations.",
    code: `Haan Meri Jaan\n// Declare some variables\nbhadwa x matlb 10\nbhadwa y matlb 20\n\n// Add them up\nbolna "The sum is:"\nbolna x + y\nBhag Bsdk`
  },
  {
    name: "If / Else Logic",
    description: "Basic control flow.",
    code: `Haan Meri Jaan\nbhadwa age matlb 18\n\n// Check condition\nagar age > 17 tab\n  bolna "Access Granted: Adult"\nnahi_toh\n  bolna "Access Denied: Minor"\nkhtm\nBhag Bsdk`
  },
  {
    name: "While Loop",
    description: "Counting down to zero.",
    code: `Haan Meri Jaan\n// Loop from 5 down to 1\nbhadwa count matlb 5\n\nJabTak count > 0 TabTak\n  bolna count\n  count matlb count - 1\nhogya\n\nbolna "Blastoff!"\nBhag Bsdk`
  }
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? match.split("=")[1] : null;
}

function PlaygroundInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [output, setOutput] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error" | "unauthorized">("idle");
  const [showExamples, setShowExamples] = useState<boolean>(false);

  useEffect(() => {
    const param = searchParams.get("code");
    if (param) {
      setCode(decodeURIComponent(param));
    } else {
      const savedCode = localStorage.getItem("blan_draft");
      if (savedCode) setCode(savedCode);
    }

    const token = getCookie("blan_token");
    setIsLoggedIn(!!token);
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("blan_draft", code);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [code]);

  const readResponseText = async (response: Response) => {
    try {
      return await response.text();
    } catch {
      return "";
    }
  };

  const handleSave = async () => {
    if (!isLoggedIn) {
      setSaveStatus("unauthorized");
      setTimeout(() => setSaveStatus("idle"), 3000);
      return;
    }

    setSaveStatus("saving");
    const token = getCookie("blan_token");

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/snippets/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ source: code }),
      });

      if (!res.ok) throw new Error("Save failed");

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleRun = async () => {
    if (!code.trim() || isCompiling) return;

    setIsCompiling(true);
    setIsCached(false);
    setIsError(false);
    setOutput("// Compiling...");

    try {
      const compileRes = await fetch(`${API_BASE_URL}/api/v1/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_code: code }),
      });

      if (!compileRes.ok) {
        const errText = await readResponseText(compileRes);
        throw new Error(
          errText || `Failed to reach the compile endpoint. Status: ${compileRes.status}`
        );
      }

      const compileData = await compileRes.json();
      const jobId = compileData.ID || compileData.id || compileData.job_id;
      const directOutput = compileData.Output ?? compileData.output;
      const directError = compileData.Error ?? compileData.error;

      if (directOutput !== undefined || directError !== undefined) {
        setIsCached(true);
        if (directError) setIsError(true);
        setOutput(String(directError || directOutput || "// Execution finished with no output."));
        return;
      }

      if (!jobId) {
        throw new Error("Backend returned neither output nor job id.");
      }

      setOutput(`// Job [${jobId.substring(0, 8)}...] queued. Waiting for worker...`);

      while (true) {
        const statusRes = await fetch(`${API_BASE_URL}/api/v1/status/${jobId}`);

        if (!statusRes.ok) {
          const errText = await readResponseText(statusRes);
          throw new Error(
            errText || `Failed to fetch job status. Status: ${statusRes.status}`
          );
        }

        const statusData = await statusRes.json();
        const currentStatus = String(
          statusData.Status || statusData.status || ""
        ).toLowerCase();
        const finalOutput = statusData.Output ?? statusData.output;
        const finalError = statusData.Error ?? statusData.error;

        if (currentStatus === "completed" || currentStatus === "failed") {
          if (currentStatus === "failed") setIsError(true);
          setOutput(String(finalError || finalOutput || "// Execution finished with no output."));
          break;
        }

        setOutput(`// Job status: ${currentStatus || "queued"}...`);
        await sleep(1000);
      }
    } catch (err: any) {
      setIsError(true);
      setOutput(`// System Error: ${err.message}`);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="grow flex flex-col bg-muted/30 min-h-[calc(100vh-73px)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto w-full grow flex flex-col md:flex-row bg-background border border-border rounded-xl shadow-sm overflow-hidden">

        {/* Left Side: The Code Editor */}
        <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-border h-[50vh] md:h-auto relative">

          <div className="flex justify-between items-center px-6 h-16 border-b border-border bg-muted/40 shrink-0 relative z-30">

            <div className="flex items-center gap-4">
              <span className="text-base font-semibold tracking-wide text-foreground/90">main.bl</span>

              {/* DROPDOWN COMPONENT */}
              <div className="relative">
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md text-foreground/60 hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
                  Examples
                </button>

                {showExamples && (
                  <>
                    {/* Invisible overlay to close dropdown when clicking outside */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowExamples(false)} />

                    {/* THE FIX: 
                      1. bg-background safely taps our CSS variables (no flashbangs).
                      2. z-[100] absolutely dominates Monaco's internal layering. 
                    */}
                    <div className="absolute top-full left-0 mt-2 w-72 bg-background border border-border rounded-xl shadow-2xl z-[100] overflow-hidden transform opacity-100 scale-100 transition-all origin-top-left">
                      <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground/70 uppercase tracking-widest">Snippets Library</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                        {EXAMPLES.map((ex) => (
                          <button
                            key={ex.name}
                            onClick={() => {
                              setCode(ex.code);
                              setShowExamples(false);
                            }}
                            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted/80 transition-colors group flex flex-col gap-0.5"
                          >
                            <span className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors">{ex.name}</span>
                            <span className="text-xs text-foreground/50 transition-colors">{ex.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saveStatus === "saving"}
                className={`text-sm px-5 py-2 rounded-md font-medium transition-all ${saveStatus === "saving"
                  ? "bg-muted text-foreground/50 cursor-wait"
                  : saveStatus === "saved"
                    ? "bg-green-600/20 text-green-600 border border-green-600/30 dark:text-green-400"
                    : saveStatus === "unauthorized"
                      ? "bg-red-600/20 text-red-600 border border-red-600/30 dark:text-red-400"
                      : saveStatus === "error"
                        ? "bg-red-600/20 text-red-600 border border-red-600/30 dark:text-red-400"
                        : "border border-border text-foreground/80 hover:bg-muted hover:text-foreground"
                  }`}
              >
                {saveStatus === "saving" && "Saving..."}
                {saveStatus === "saved" && "Saved!"}
                {saveStatus === "unauthorized" && "Login to Save"}
                {saveStatus === "error" && "Save Failed"}
                {saveStatus === "idle" && "Save"}
              </button>

              <button
                onClick={handleRun}
                disabled={isCompiling}
                className={`text-sm px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${isCompiling
                  ? "bg-foreground/30 cursor-not-allowed text-background"
                  : "bg-foreground text-background hover:opacity-90 shadow-sm"
                  }`}
              >
                {isCompiling ? "Compiling..." : "Run Code"}
              </button>
            </div>
          </div>

          <div className="grow relative w-full h-full">
            <div className="absolute" style={{ inset: 0 }}>
              <BlanEditor code={code} onChange={(val) => setCode(val || "")} />
            </div>
          </div>
        </div>

        {/* Right Side: The Output Terminal */}
        <div className="w-full md:w-1/2 flex flex-col bg-background h-[50vh] md:h-auto">

          <div className="flex items-center justify-between px-6 h-16 border-b border-border bg-muted/40 shrink-0">
            <span className="text-base font-semibold tracking-wide text-foreground/90">Output Terminal</span>
            {isCached && (
              <span className="text-xs font-mono px-2.5 py-1 rounded-md border border-foreground/20 text-foreground/60 bg-muted/50">
                cached
              </span>
            )}
          </div>

          <div
            className={`p-6 grow font-mono text-[15px] whitespace-pre-wrap overflow-y-auto leading-[1.7] tracking-tight ${isError
              ? "text-red-400"
              : output
                ? "text-foreground/90"
                : "text-foreground/40"
              }`}
          >
            {output || "// Execute your code to view the output."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Playground() {
  return (
    <Suspense fallback={<div className="p-8 font-mono text-sm">Loading workspace...</div>}>
      <PlaygroundInner />
    </Suspense>
  );
}