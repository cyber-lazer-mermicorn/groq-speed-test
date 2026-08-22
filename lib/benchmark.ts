import Groq from 'groq-sdk';
import OpenAI from 'openai';

function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is required to run a Groq benchmark.');
  }
  return new Groq({ apiKey });
}

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required to run an OpenAI benchmark.');
  }
  return new OpenAI({ apiKey });
}

export interface BenchmarkResult {
  provider: string;
  model: string;
  latencyMs: number;
  tokensPerSec: number;
  totalTokens: number;
  costPer1MTokens: number;
}

export async function benchmarkGroq(prompt: string): Promise<BenchmarkResult> {
  try {
    const start = Date.now();
    const response = await getGroqClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
    });
    const elapsed = Date.now() - start;
    const tokens = response.usage?.total_tokens || 0;

    return {
      provider: 'Groq',
      model: 'llama-3.3-70b-versatile',
      latencyMs: elapsed,
      tokensPerSec: Math.round((tokens / elapsed) * 1000),
      totalTokens: tokens,
      costPer1MTokens: 0.59,
    };
  } catch (error: any) {
    throw new Error(`Groq benchmark error: ${error?.status || 500} - ${error?.message || 'Unknown error'}`);
  }
}

export async function benchmarkOpenAI(prompt: string): Promise<BenchmarkResult> {
  try {
    const start = Date.now();
    const response = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
    });
    const elapsed = Date.now() - start;
    const tokens = response.usage?.total_tokens || 0;

    return {
      provider: 'OpenAI',
      model: 'gpt-4-turbo-preview',
      latencyMs: elapsed,
      tokensPerSec: Math.round((tokens / elapsed) * 1000),
      totalTokens: tokens,
      costPer1MTokens: 10.0,
    };
  } catch (error: any) {
    throw new Error(`OpenAI benchmark error: ${error?.status || 500} - ${error?.message || 'Unknown error'}`);
  }
}

export async function compareProviders(prompt: string) {
  try {
    const [groqResult, openaiResult] = await Promise.all([
      benchmarkGroq(prompt),
      benchmarkOpenAI(prompt),
    ]);

    return {
      groq: groqResult,
      openai: openaiResult,
      speedup: Math.round(openaiResult.latencyMs / groqResult.latencyMs * 10) / 10,
      costSavings: Math.round((1 - groqResult.costPer1MTokens / openaiResult.costPer1MTokens) * 100),
    };
  } catch (error: any) {
    throw new Error(`Comparison error: ${error?.message || 'Unknown error'}`);
  }
}

export async function streamBenchmark(provider: 'groq' | 'openai', prompt: string) {
  try {
    const start = Date.now();
    let tokenCount = 0;

    if (provider === 'groq') {
      const stream = await getGroqClient().chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      });
      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) tokenCount++;
      }
    } else {
      const stream = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      });
      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) tokenCount++;
      }
    }

    const elapsed = Date.now() - start;
    return { provider, tokens: tokenCount, latencyMs: elapsed, tokensPerSec: Math.round((tokenCount / elapsed) * 1000) };
  } catch (error: any) {
    throw new Error(`Stream benchmark error: ${error?.status || 500} - ${error?.message || 'Unknown error'}`);
  }
}