# Architecture

## Test methodology
- Prompt: fixed 50-token system prompt + 20-token user message (constant across providers)
- Iterations: 10 per provider per model
- Metrics: TTFT (ms), throughput (tokens/s), measured with `performance.now()`
- Statistics: median and p95 reported

## Provider matrix

| Provider | Model | Transport |
|---|---|---|
| Groq | llama-3.1-70b | REST |
| OpenAI | gpt-4o-mini | REST |
| Anthropic | claude-haiku-3.5 | REST |
| Together.ai | llama-3.1-70b | REST |

## Results schema
```typescript
interface SpeedResult {
  provider: string; model: string;
  median_ttft_ms: number; p95_ttft_ms: number;
  throughput_tps: number; timestamp: string;
  status: 'ok' | 'unavailable' | 'error';
}
```
