"use client";
import { useState } from "react";
import {
  AUDIENCES,
  MAX_INPUT_CHARS,
  type TranslationResult,
} from "@/lib/types";

function Section({ title, items }: { title: string; items?: string[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 list-disc pl-5 space-y-1">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [audience, setAudience] = useState<string>(AUDIENCES[0]);

  const handleTranslate = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText, audience, readingLevel: "Easy" }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setResult(data);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <header className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold">PlainSpeak</h1>
        <p className="mt-3 text-lg opacity-80">
          Turn official text into something you can actually use.
        </p>
      </header>

      <section className="max-w-5xl mx-auto mt-10 grid gap-6 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="rounded-2xl border border-current/10 bg-current/5 p-5">
          <label htmlFor="audience" className="block text-sm font-medium">
            Audience
          </label>
          <select
            id="audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="mt-2 w-full rounded-xl bg-current/5 p-3 text-sm outline-none ring-1 ring-current/10 focus:ring-2 focus:ring-current/30"
          >
            {AUDIENCES.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <label htmlFor="inputText" className="mt-4 block text-sm font-medium">
            Paste official text
          </label>
          <textarea
            id="inputText"
            placeholder="Paste legal / government / policy text here…"
            maxLength={MAX_INPUT_CHARS}
            className="mt-2 w-full min-h-[260px] resize-y rounded-xl bg-current/5 p-4 text-base outline-none ring-1 ring-current/10 focus:ring-2 focus:ring-current/30"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <p className="mt-1 text-right text-xs opacity-70">
            {inputText.length.toLocaleString()} / {MAX_INPUT_CHARS.toLocaleString()}
          </p>

          <p className="mt-2 text-xs opacity-80">
            Your text is sent to OpenAI to be translated. Don’t paste sensitive
            personal info. This tool is not legal advice.
          </p>
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || isLoading}
            className="mt-4 w-full rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Translating…" : "Translate"}
          </button>
        </div>

        {/* Right: Output */}
        <div className="rounded-2xl border border-current/10 bg-current/5 p-5">
          <h2 className="text-sm font-medium">Output</h2>
          <div
            className="mt-3 rounded-xl bg-current/5 p-4 text-sm"
            aria-live="polite"
          >
            {isLoading ? (
              <p>Translating…</p>
            ) : error ? (
              <p role="alert" className="font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            ) : result ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold">Plain English</h3>
                  <p className="mt-2">{result.plain_english}</p>
                </div>
                {result.preservation_warnings &&
                  result.preservation_warnings.length > 0 && (
                    <div
                      role="alert"
                      className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3"
                    >
                      <h3 className="text-sm font-semibold">
                        Check the original before relying on this
                      </h3>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        {result.preservation_warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                <Section title="Key points" items={result.key_points} />
                <Section
                  title="What this means for you"
                  items={result.what_it_means_for_you}
                />
                <Section title="What to do next" items={result.action_checklist} />
                <Section
                  title="Confidence / uncertainty"
                  items={result.confidence_notes}
                />
              </div>
            ) : (
              <p className="opacity-70">
                Your plain-language result will appear here after you click
                Translate.
              </p>
            )}
          </div>
        </div>
      </section>

      <footer className="max-w-5xl mx-auto mt-10 text-xs opacity-70">
        Disclaimer: PlainSpeak provides general information and is not legal advice.
      </footer>
    </main>
  );
}
