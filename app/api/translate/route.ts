import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { inputText, audience, readingLevel } = await req.json();

  if (!inputText || inputText.trim().length < 20) {
    return NextResponse.json(
      { error: "Input text too short to translate reliably." },
      { status: 400 }
    );
  }

  const systemPrompt = `
You are a plain-language translator for legal and government text.

Rules:
- Do NOT add facts that are not in the text.
- If something is unclear or missing, say "Not stated in the text".
- Use simple language appropriate for a ${readingLevel} reader.
- Adapt explanations for a ${audience}.
- Be neutral and factual.
- This is NOT legal advice.

Return STRICT JSON with this shape:
{
  "plain_english": string,
  "key_points": string[],
  "what_it_means_for_you": string[],
  "action_checklist": string[],
  "confidence_notes": string[]
}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: inputText },
    ],
    temperature: 0.2,
  });

  const content = response.choices[0].message.content;

  try {
    const parsed = JSON.parse(content as string);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      {
        error: "AI response could not be parsed safely.",
        raw: content,
      },
      { status: 500 }
    );
  }
}
