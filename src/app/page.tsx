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

  // Added "unauthorized" to the state union
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error" | "unauthorized">("idle");

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
      // Trigger the new unauthorized state
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

          {/* UPGRADE: Taller header (h-16), larger font (text-base font-semibold) */}
          <div className="flex justify-between items-center px-6 h-16 border-b border-border bg-muted/40 shrink-0">
            <span className="text-base font-semibold tracking-wide text-foreground/90">main.bl</span>

            <div className="flex items-center gap-3">
              {/* UPGRADE: Buttons are now text-sm (larger) and have more padding */}
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

          {/* UPGRADE: Terminal text bumped to text-[15px] with loose line height for readability */}
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