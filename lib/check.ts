import type { TranslationResult } from "./types";

// Deterministic sanity check: did the facts that are easiest to lose survive the rewrite?
// It is a heuristic, not proof. It catches dropped numbers, amounts, durations,
// exceptions and prohibitions; it cannot catch a subtly changed meaning.

const EXCEPTION_SOURCE = /\b(unless|except|provided that|notwithstanding|other than)\b/i;
const EXCEPTION_OUTPUT =
  /\b(unless|except|exception|if not|only if|only when|other than|apart from|as long as|but not)\b/i;
const PROHIBITION_SOURCE = /\b(must not|shall not|may not|cannot|is prohibited|are prohibited)\b/i;
const PROHIBITION_OUTPUT = /\b(not|never|don'?t|can'?t|cannot|no one|prohibited|banned|forbidden)\b/i;

function flattenResult(result: TranslationResult): string {
  return [
    result.plain_english,
    ...(result.key_points ?? []),
    ...(result.what_it_means_for_you ?? []),
    ...(result.action_checklist ?? []),
    ...(result.confidence_notes ?? []),
  ]
    .filter(Boolean)
    .join("\n");
}

// "$1,200.50" -> "1200.50", "14" -> "14"; used so formatting differences don't cause false alarms.
const normaliseNumber = (s: string) => s.replace(/,/g, "");

function extractNumbers(text: string): string[] {
  const matches = text.match(/\d[\d,]*(?:\.\d+)?/g) ?? [];
  return [...new Set(matches.map(normaliseNumber))];
}

export function checkPreservation(source: string, result: TranslationResult): string[] {
  const out = flattenResult(result);
  const outNumbers = new Set(extractNumbers(out));
  const warnings: string[] = [];

  const missing = extractNumbers(source).filter((n) => !outNumbers.has(n));
  if (missing.length > 0) {
    warnings.push(
      `These figures from your text don't appear in the result: ${missing.join(", ")}. ` +
        "Check the original for amounts, dates or deadlines."
    );
  }
  if (EXCEPTION_SOURCE.test(source) && !EXCEPTION_OUTPUT.test(out)) {
    warnings.push(
      "Your text contains an exception or condition (e.g. “unless”, “except”) but the result doesn't mention one. Check the original."
    );
  }
  if (PROHIBITION_SOURCE.test(source) && !PROHIBITION_OUTPUT.test(out)) {
    warnings.push(
      "Your text contains a prohibition (e.g. “must not”) but the result doesn't state one. Check the original."
    );
  }
  return warnings;
}
