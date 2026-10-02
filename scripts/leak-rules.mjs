// Patterns that must never reach the public repository or the build output.
// Kept apart from the scanner so they can be unit-tested (src/lib/leaks.test.ts).

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const RULES = [
  ['private subdomain', /\b(?!www\.)[a-z0-9-]+\.nicodamian\.com\b/gi],
  [
    'internal host suffix',
    /\b[a-z0-9-]+\.(?:local|lan|internal|home\.arpa|ts\.net|workers\.dev|pages\.dev|cfargotunnel\.com|trycloudflare\.com|duckdns\.org|no-ip\.[a-z]+|fortiddns\.com)\b/gi,
  ],
  ['IPv4 literal', /\b(?:\d{1,3}\.){3}\d{1,3}\b/g],
  [
    'IPv6 literal',
    /(?<![\w:])(?:(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}|(?:[0-9a-f]{1,4}:){1,6}:(?:[0-9a-f]{1,4}(?::[0-9a-f]{1,4}){0,5})?)(?![\w:])/gi,
  ],
  ['credentials in URL', /\/\/[^\s/:@]+:[^\s/@]+@/g],
  ['API key', /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}/g],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{20,})/g],
  ['cloud key', /\b(?:AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{30,}|xox[bap]-[\w-]{10,})/g],
  ['Telegram bot token', /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/g],
  ['JWT', /\beyJ[\w-]{10,}\.[\w-]{10,}\.[\w-]{10,}/g],
  ['secret assignment', /\b(?:secret|token|passw(?:or)?d|api[_-]?key)\s*[:=]\s*['"][A-Za-z0-9+/_=-]{16,}['"]/gi],
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/g],
  ['email address', /\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b/gi],
  ['local path', /\b[A-Za-z]:[\\/]{1,2}(?:Users|yoweb)\b/g],
];

const ALLOWED = [/^153385003\+nicolasdamians@users\.noreply\.github\.com$/, /^(fontProviders|leak-denylist)\.local$/];

/** Extra literal terms from the git-ignored `.leak-denylist.local` (one per line, `#` comments). */
export const denylistRules = (fileContent) =>
  fileContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((term) => ['denylisted term', new RegExp(escapeRegExp(term), 'gi')]);

/** Returns the names of the rules a line breaks, with the offending text. */
export const scanLine = (line, rules = RULES) => {
  const hits = [];
  for (const [name, pattern] of rules) {
    for (const match of line.matchAll(pattern)) {
      const text = match[0];
      if (ALLOWED.some((ok) => ok.test(text))) continue;
      // SVG path data produces dotted numbers; a real address has four octets of at most 255.
      if (name === 'IPv4 literal' && text.split('.').some((octet) => Number(octet) > 255)) continue;
      // Clock times and CSS ratios look like short IPv6: require a hex letter or a 3+ digit group.
      if (name === 'IPv6 literal' && !/[a-f]|\d{3}/i.test(text)) continue;
      hits.push({ name, text: name === 'denylisted term' ? '[hidden]' : text });
    }
  }
  return hits;
};
