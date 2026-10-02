import { describe, expect, it } from 'vitest';
import { formatMonth, formatRange } from './dates';

describe('formatMonth', () => {
  it('formats YYYY-MM', () => expect(formatMonth('2026-04')).toBe('Apr 2026'));
  it('rejects malformed input', () => {
    expect(() => formatMonth('2026')).toThrow();
    expect(() => formatMonth('2026-13')).toThrow();
  });
});

describe('formatRange', () => {
  it('handles an open range', () => expect(formatRange('2026-04', 'present')).toBe('Apr 2026 – Present'));
  it('handles a closed range', () => expect(formatRange('2019-09', '2021-08')).toBe('Sep 2019 – Aug 2021'));
});
