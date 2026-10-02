/**
 * Command interpreter for the hero terminal. Pure: it maps an input line to output lines plus an
 * optional side effect that the page performs. No DOM access here, so it is unit-tested directly.
 */
export interface TerminalContext {
  sections: readonly string[];
  whoami: readonly string[];
  files: Readonly<Record<string, readonly string[]>>;
}

export type TerminalEffect = { type: 'goto'; section: string } | { type: 'clear' } | { type: 'theme' };

export interface TerminalResult {
  lines: readonly string[];
  effect?: TerminalEffect;
}

const HELP: readonly string[] = [
  'navigation',
  '  ls                 list sections',
  '  cd <section>       jump to a section (also: goto, open)',
  '  cat <file>         print a file (try: cat about.txt)',
  'info',
  '  whoami · neofetch · pwd · date',
  'misc',
  '  theme              switch light / dark',
  '  clear              clear the screen',
  '  sudo <anything>    you can try',
];

const normalise = (value: string): string => value.trim().toLowerCase().replace(/^[#/~.]+/, '').replace(/\/+$/, '');

export const runCommand = (input: string, ctx: TerminalContext, now: Date = new Date()): TerminalResult => {
  const [rawName = '', ...args] = input.trim().split(/\s+/);
  const name = rawName.toLowerCase();
  const arg = normalise(args.join(' '));

  switch (name) {
    case '':
      return { lines: [] };
    case 'help':
    case '?':
      return { lines: HELP };
    case 'ls':
    case 'dir':
      return { lines: [ctx.sections.map((section) => `${section}/`).join('  '), Object.keys(ctx.files).join('  ')] };
    case 'pwd':
      return { lines: ['/home/gen0ne'] };
    case 'whoami':
    case 'id':
      return { lines: ctx.whoami };
    case 'neofetch':
      return { lines: ['gen0ne@zrh', '----------', ...ctx.whoami] };
    case 'date':
      return { lines: [now.toUTCString()] };
    case 'cd':
    case 'goto':
    case 'open': {
      if (arg === '' || arg === 'home' || arg === 'top') return { lines: [], effect: { type: 'goto', section: 'top' } };
      return ctx.sections.includes(arg)
        ? { lines: [`→ ${arg}`], effect: { type: 'goto', section: arg } }
        : { lines: [`cd: no such section: ${arg}. Try: ${ctx.sections.join(', ')}`] };
    }
    case 'cat': {
      // Own keys only: `cat constructor` must not reach Object.prototype.
      const key = [arg, `${arg}.txt`].find((name) => Object.hasOwn(ctx.files, name));
      const file = key === undefined ? undefined : ctx.files[key];
      if (file) return { lines: file };
      return { lines: [arg ? `cat: ${arg}: No such file` : 'cat: missing file operand'] };
    }
    case 'theme':
      return { lines: ['theme switched'], effect: { type: 'theme' } };
    case 'clear':
    case 'cls':
      return { lines: [], effect: { type: 'clear' } };
    case 'sudo':
      return { lines: ['gen0ne is not in the sudoers file. This incident will be reported.'] };
    case 'exit':
    case 'logout':
      return { lines: ['There is no escape. Try: cd contact'] };
    default:
      return { lines: [`${name}: command not found. Type "help".`] };
  }
};
