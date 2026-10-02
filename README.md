# PlainSpeak

Paste legal or government text and get a plain-language version: a summary, key points,
what it means for you, an action checklist, and notes on what the text leaves unclear.
The prompt is built to preserve obligations, deadlines and exceptions rather than smooth them away.

Built with Next.js 16, React 19, Tailwind 4 and the OpenAI API (`gpt-4o-mini`).

## Run it

```bash
npm install
cp .env.example .env.local   # then add your OpenAI API key
npm run dev
```

Open http://localhost:3000.

## How it works

- `app/page.tsx` — the UI (audience picker, input, structured output, error states).
- `app/api/translate/route.ts` — validates input (length cap, audience allowlist), wraps the
  document in `<document>` tags so instructions inside it are treated as data, and requests JSON output.
- `lib/types.ts` — shared constants and the result type.

## Known limitations

- No rate limiting or auth yet; add both before exposing a deployment publicly (every request costs API credit).
- Nothing verifies programmatically that every obligation and exception survives the rewrite; the model is only instructed to.
- Not legal advice.
