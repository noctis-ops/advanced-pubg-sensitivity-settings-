import { describe, expect, it } from 'vitest';
import { runSyntheticValidation } from './synthetic-validation';

describe('synthetic validation suite', () => {
  it('passes the project invariants without human data', () => {
    const report = runSyntheticValidation();
    expect(report.score).toBe(100);
    expect(report.checks.every((check) => check.passed)).toBe(true);
  });
});
