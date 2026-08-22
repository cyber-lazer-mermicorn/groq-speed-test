import { describe, expect, it } from 'vitest';

import { benchmarkGroq } from '../lib/benchmark';

describe('benchmarkGroq', () => {
  it('should be defined', () => {
    expect(benchmarkGroq).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof benchmarkGroq).toBe('function');
  });

  it('fails with a clear error when the Groq key is absent', async () => {
    const previousKey = process.env.GROQ_API_KEY;
    delete process.env.GROQ_API_KEY;

    await expect(benchmarkGroq('test')).rejects.toThrow('GROQ_API_KEY is required');

    if (previousKey) {
      process.env.GROQ_API_KEY = previousKey;
    }
  });
});
