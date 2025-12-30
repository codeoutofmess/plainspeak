"use client";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [inputText, setInputText] = useState("");
  const [audience, setAudience] = useState("Student");



  const handleTranslate = async () => {
  setIsLoading(true);

  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inputText,
      audience,
      readingLevel: "Easy",
    }),
  });

  const data = await response.json();
  setResult(data);
  setIsLoading(false);
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
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <label htmlFor="inputText" className="block text-sm font-medium opacity-90">
            Paste official text
          </label>
<div className="mt-4">
  <label htmlFor="audience" className="block text-sm font-medium opacity-90">
    Audience
  </label>
  <select
    id="audience"
    value={audience}
    onChange={(e) => setAudience(e.target.value)}
    className="mt-2 w-full rounded-xl bg-black/20 p-3 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
  >
    <option>Student</option>
    <option>Tenant</option>
    <option>Migrant / visa applicant</option>
    <option>Small business owner</option>
    <option>Benefits applicant</option>
    <option>Someone dealing with fines</option>
  </select>
</div>

          <textarea
            id="inputText"
            placeholder="Paste legal / government / policy text here…"
            className="mt-3 w-full min-h-[260px] resize-y rounded-xl bg-black/20 p-4 text-base outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <p className="mt-3 text-xs opacity-70">
            Tip: Don’t paste sensitive personal info. This tool is not legal advice.
          </p>
          <button
  onClick={handleTranslate}
  disabled={!inputText.trim() || isLoading}
  className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-gray-200 disabled:opacity-50"
>
  {isLoading ? "Translating…" : "Translate"}
</button>

        </div>

        {/* Right: Output placeholder */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-medium opacity-90">Output</h2>
          <div className="mt-3 rounded-xl bg-black/20 p-4 text-sm opacity-70">
            {isLoading ? (
  <p>Translating…</p>
) : result ? (
  <div className="space-y-6">
  {/* Plain English */}
  <div>
    <h3 className="text-sm font-semibold opacity-90">Plain English</h3>
    <p className="mt-2">{result.plain_english}</p>
  </div>

  {/* Key points */}
  {Array.isArray(result.key_points) && result.key_points.length > 0 && (
    <div>
      <h3 className="text-sm font-semibold opacity-90">Key points</h3>
      <ul className="mt-2 list-disc pl-5 space-y-1">
        {result.key_points.map((point: string, i: number) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    </div>
  )}

  {/* What this means for you */}
  {Array.isArray(result.what_it_means_for_you) && result.what_it_means_for_you.length > 0 && (
    <div>
      <h3 className="text-sm font-semibold opacity-90">What this means for you</h3>
      <ul className="mt-2 list-disc pl-5 space-y-1">
        {result.what_it_means_for_you.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )}

  {/* Action checklist */}
  {Array.isArray(result.action_checklist) && result.action_checklist.length > 0 && (
    <div>
      <h3 className="text-sm font-semibold opacity-90">What to do next</h3>
      <ul className="mt-2 list-disc pl-5 space-y-1">
        {result.action_checklist.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )}

  {/* Confidence notes */}
  {Array.isArray(result.confidence_notes) && result.confidence_notes.length > 0 && (
    <div>
      <h3 className="text-sm font-semibold opacity-90">Confidence / uncertainty</h3>
      <ul className="mt-2 list-disc pl-5 space-y-1">
        {result.confidence_notes.map((note: string, i: number) => (
          <li key={i}>{note}</li>
        ))}
      </ul>
    </div>
  )}
</div>

) : (
  <p>Your plain-language result will appear here after you click Translate.</p>
)}


          </div>
        </div>
      </section>

      <footer className="max-w-5xl mx-auto mt-10 text-xs opacity-60">
        Disclaimer: PlainSpeak provides general information and is not legal advice.
      </footer>
    </main>
  );
}
