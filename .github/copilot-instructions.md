# Copilot Instructions — Groq Speed Test

## Always
- Use `performance.now()` for all timing
- Run 10 iterations, report median + p95
- Save typed JSON results to `results/`
- Compare the same prompt across all providers

## Never
- Use `Date.now()` for sub-ms measurement
- Report only averages
- Fabricate or estimate results
