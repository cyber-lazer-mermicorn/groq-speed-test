import { benchmarkGroq } from '../lib/benchmark';

describe('benchmarkGroq', () => {
  it('should be defined', () => {
    expect(benchmarkGroq).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof benchmarkGroq).toBe('function');
  });
});
