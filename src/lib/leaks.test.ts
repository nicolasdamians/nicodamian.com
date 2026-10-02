import { describe, expect, it } from 'vitest';
import { denylistRules, scanLine } from '../../scripts/leak-rules.mjs';

const names = (line: string): string[] => scanLine(line).map((hit) => String(hit.name));

// Samples are assembled at runtime so this file never contains a token-shaped literal.
const repeat = (char: string, count: number) => char.repeat(count);

describe('leak rules: must flag', () => {
  const cases: [string, string][] = [
    ['private subdomain', 'see https://dash.nicodamian' + '.com/x'],
    ['internal host suffix', 'ssh pi.tail1234.ts' + '.net'],
    ['IPv4 literal', 'server at 10.10.' + '10.1 port 22'],
    ['IPv6 literal', 'addr fd7a:115c:a1e0::' + '1 up'],
    ['IPv6 literal', '2001:db8:85a3:0:0:8a2e:370:' + '7334'],
    ['credentials in URL', 'https://user:pa55' + '@example.org/'],
    ['API key', 'sk-' + 'ant-api03-' + repeat('A', 24)],
    ['API key', 'sk-' + 'proj-' + repeat('b', 24)],
    ['GitHub token', 'gho' + '_' + repeat('a', 36)],
    ['Telegram bot token', '1234567890' + ':' + repeat('A', 35)],
    ['JWT', 'eyJ' + repeat('a', 12) + '.' + repeat('b', 12) + '.' + repeat('c', 12)],
    ['secret assignment', 'api_key' + ' = "' + repeat('Z', 20) + '"'],
    ['private key', '-----BEGIN OPENSSH ' + 'PRIVATE KEY-----'],
    ['email address', 'mail someone' + '@example.org now'],
    ['local path', 'copied from z:' + '\\\\yoweb\\\\docs'],
  ];
  for (const [rule, sample] of cases) it(rule, () => expect(names(sample)).toContain(rule));
});

describe('leak rules: must not flag', () => {
  const clean = [
    'https://nicodamian.com/ and https://www.nicodamian.com/',
    'astro 7.3.5, tailwind 4.3.3',
    'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01',
    'starts at 12:30:45 with ratio 16:9',
    'a task-force of risk-takers wrote the token rotation runbook',
    'fontProviders.local()',
  ];
  for (const line of clean) it(line.slice(0, 40), () => expect(names(line)).toEqual([]));
});

describe('denylist', () => {
  it('turns lines into literal, case-insensitive rules and hides the match', () => {
    const rules = denylistRules('# comment\n\nMyNas.Box\n');
    expect(rules).toHaveLength(1);
    expect(scanLine('connect to mynas.box today', rules)).toEqual([{ name: 'denylisted term', text: '[hidden]' }]);
    expect(scanLine('mynasXbox', rules)).toEqual([]);
  });
});
