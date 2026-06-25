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
    code: `Haan Meri Jaan
bolna "Hello, World!"
Bhag Bsdk`,
  },
  {
    name: "Variables & Math",
    description: "Basic arithmetic operations.",
    code: `Haan Meri Jaan
bhadwa x matlb 10
bhadwa y matlb 20
bolna "The sum is:"
bolna x + y
bolna "The product is:"
bolna x * y
Bhag Bsdk`,
  },
  {
    name: "If / Else Logic",
    description: "Chained conditional branches.",
    code: `Haan Meri Jaan
bhadwa age matlb 18

agar age > 17 tab
    bolna "Access Granted: Adult"
warna age == 17 tab
    bolna "Almost there."
nahi_toh
    bolna "Access Denied: Minor"
khtm

Bhag Bsdk`,
  },
  {
    name: "While Loop",
    description: "Countdown from 5.",
    code: `Haan Meri Jaan
bhadwa count matlb 5

JabTak count > 0 TabTak
    bolna count
    bhadwa count matlb count - 1
hogya

bolna "Blastoff!"
Bhag Bsdk`,
  },
  {
    name: "Fibonacci (n=8)",
    description: "First 8 numbers of the sequence. Change n to tune.",
    code: `Haan Meri Jaan
bhadwa n matlb 8
bhadwa a matlb 0
bhadwa b matlb 1
bhadwa i matlb 0

bolna "Fibonacci sequence:"
bolna a

JabTak i < n TabTak
    bolna b
    bhadwa temp matlb a + b
    bhadwa a matlb b
    bhadwa b matlb temp
    bhadwa i matlb i + 1
hogya

Bhag Bsdk`,
  },
  {
    name: "Factorial (n=6)",
    description: "Computes n! iteratively. Change n to tune.",
    code: `Haan Meri Jaan
bhadwa n matlb 6
bhadwa result matlb 1
bhadwa i matlb 1

JabTak i <= n TabTak
    bhadwa result matlb result * i
    bhadwa i matlb i + 1
hogya

bolna "Factorial:"
bolna result
Bhag Bsdk`,
  },
  {
    name: "Boolean Logic",
    description: "sach and jhooth as first-class values.",
    code: `Haan Meri Jaan
bolna !sach
bolna sach && jhooth
bolna jhooth || sach
bolna sach == 1
Bhag Bsdk`,
  },
  {
    name: "String Concat",
    description: "The + operator joins strings.",
    code: `Haan Meri Jaan
bhadwa first matlb "Haan "
bhadwa second matlb "Meri Jaan"
bolna first + second
Bhag Bsdk`,
  },
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
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error" | "unauthorized"
  >("idle");
  const [showExamples, setShowExamples] = useState<boolean>(false);

  useEffect(() => {
    const param = searchParams.get("code");
    if (param) {
      setCode(decodeURIComponent(param));
      router.replace("/");
    } else {
      const savedCode = localStorage.getItem("blan_draft");
      if (savedCode) setCode(savedCode);
    }
    setIsLoggedIn(!!getCookie("blan_token"));
  }, [searchParams, router]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("blan_draft", code);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [code]);

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

      if (!res.ok) throw new Error("save failed");

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleRun = async () => {
    if (!code.trim() || isCompiling) return;

    setIsCompiling(true);
    setIsCached(false);
    setIsError(false);
    setOutput("// compiling...");

    try {
      const compileRes = await fetch(`${API_BASE_URL}/api/v1/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_code: code }),
      });

      if (!compileRes.ok) {
        const text = await compileRes.text().catch(() => "");
        throw new Error(text || `compile endpoint returned ${compileRes.status}`);
      }

      const compileData = await compileRes.json();
      const jobId = compileData.ID || compileData.id;
      const directOutput = compileData.Output ?? compileData.output;
      const directError = compileData.Error ?? compileData.error;
      const cached = compileData.cached === true;

      if (directOutput !== undefined || directError !== undefined) {
        const hasError = Boolean(directError);
        setIsError(hasError);
        setIsCached(cached && !hasError);
        setOutput(String(directError || directOutput || "// execution finished with no output."));
        return;
      }

      if (!jobId) throw new Error("backend returned neither output nor job id.");

      setOutput(`// job [${jobId.substring(0, 8)}...] queued. waiting for worker...`);

      while (true) {
        const statusRes = await fetch(`${API_BASE_URL}/api/v1/status/${jobId}`);
        if (!statusRes.ok) {
          const text = await statusRes.text().catch(() => "");
          throw new Error(text || `status endpoint returned ${statusRes.status}`);
        }

        const statusData = await statusRes.json();
        const currentStatus = String(statusData.Status || statusData.status || "").toLowerCase();
        const finalOutput = statusData.Output ?? statusData.output;
        const finalError = statusData.Error ?? statusData.error;

        if (currentStatus === "completed" || currentStatus === "failed") {
          const hasError = Boolean(finalError);
          setIsError(hasError);
          setOutput(String(finalError || finalOutput || "// execution finished with no output."));
          break;
        }

        setOutput(`// job status: ${currentStatus || "queued"}...`);
        await sleep(1000);
      }
    } catch (err: any) {
      setIsError(true);
      setOutput(`// system error: ${err.message}`);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="grow flex flex-col" style={{ height: "calc(100vh - 56px)" }}>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 md:px-6 h-11 border-b border-border bg-muted/30 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-foreground/50">main.bl</span>

          <div className="h-3.5 w-px bg-border" />

          {/* Snippets dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="flex items-center gap-1.5 text-xs text-foreground/50 hover:text-foreground transition-colors py-1 px-2 rounded hover:bg-muted/60"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
              Examples
            </button>

            {showExamples && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowExamples(false)}
                />
                <div className="absolute top-full left-0 mt-1.5 w-68 bg-background border border-border rounded-lg shadow-xl z-[100] overflow-hidden">
                  <div className="px-3 py-2 border-b border-border">
                    <span className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">
                      Snippets
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
                    {EXAMPLES.map((ex) => (
                      <button
                        key={ex.name}
                        onClick={() => {
                          setCode(ex.code);
                          setShowExamples(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded hover:bg-muted/60 transition-colors flex flex-col gap-0.5"
                      >
                        <span className="text-xs font-semibold text-foreground/80">
                          {ex.name}
                        </span>
                        <span className="text-xs text-foreground/40">{ex.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className={`text-xs px-3 py-1.5 rounded font-medium transition-all border ${saveStatus === "saved"
                ? "border-green-500/40 text-green-500 bg-green-500/10"
                : saveStatus === "unauthorized" || saveStatus === "error"
                  ? "border-red-500/40 text-red-400 bg-red-500/10"
                  : saveStatus === "saving"
                    ? "border-border text-foreground/30 cursor-wait"
                    : "border-border text-foreground/60 hover:text-foreground hover:border-foreground/30"
              }`}
          >
            {saveStatus === "saving" && "Saving..."}
            {saveStatus === "saved" && "Saved"}
            {saveStatus === "unauthorized" && "Login to save"}
            {saveStatus === "error" && "Save failed"}
            {saveStatus === "idle" && "Save"}
          </button>

          <button
            onClick={handleRun}
            disabled={isCompiling}
            className={`text-xs px-4 py-1.5 rounded font-semibold transition-all ${isCompiling
                ? "bg-foreground/20 cursor-not-allowed text-foreground/40"
                : "bg-foreground text-background hover:opacity-85"
              }`}
          >
            {isCompiling ? "Running..." : "▶ Run"}
          </button>
        </div>
      </div>

      {/* Editor + Output — full bleed */}
      <div className="grow flex flex-col md:flex-row overflow-hidden">

        {/* Editor pane */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full border-b md:border-b-0 md:border-r border-border relative">
          <div className="absolute inset-0">
            <BlanEditor code={code} onChange={(val) => setCode(val || "")} />
          </div>
        </div>

        {/* Output pane */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full flex flex-col bg-background">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/20 shrink-0">
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${isError
                    ? "bg-red-500"
                    : output && !output.startsWith("//")
                      ? "bg-green-500"
                      : "bg-foreground/20"
                  }`}
              />
              <span className="text-xs text-foreground/50 font-mono">output</span>
            </div>
            {isCached && (
              <span className="text-xs font-mono px-2 py-0.5 rounded border border-foreground/15 text-foreground/40">
                cached
              </span>
            )}
          </div>

          <div
            className={`p-5 grow font-mono text-sm whitespace-pre-wrap overflow-y-auto leading-relaxed ${isError
                ? "text-red-400"
                : output && !output.startsWith("//")
                  ? "text-foreground/90"
                  : "text-foreground/30"
              }`}
          >
            {output || "// run your code to see output here."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Playground() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full font-mono text-sm text-foreground/30">
          loading workspace...
        </div>
      }
    >
      <PlaygroundInner />
    </Suspense>
  );
}