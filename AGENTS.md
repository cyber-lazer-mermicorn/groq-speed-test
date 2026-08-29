# Groq Speed Test — Agent Doctrine

## What this repo is
Head-to-head LLM latency comparison: Groq LPU vs GPU providers. Real measured TTFT and throughput.
By Cherry Shanaley (Chan), AI Solutions Engineer.

## Tech stack
- TypeScript strict, Node.js CLI, Vercel AI SDK adapters, `performance.now()`

## Coding rules
- Timing: `performance.now()` only — start before `fetch`, end at first token byte
- Each test run: 10 iterations, report median and p95 — never just average
- Results in `results/` as JSON — `{ provider, model, median_ttft_ms, p95_ttft_ms, throughput_tps, timestamp }`
- Providers compared: Groq, OpenAI, Anthropic, Together.ai — same prompt, same token budget
- Never fake results — if a provider is unavailable, record `{ status: 'unavailable' }`

## Commands
```bash
npm install
npm run test:speed      # run all provider comparisons
npm run test:speed -- --provider groq
npm run dev             # results dashboard
```

## Do not
- Use `Date.now()` for timing
- Report only averages — always include p95
- Fabricate benchmark numbers
