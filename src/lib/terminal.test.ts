import { describe, expect, it } from 'vitest';
import { runCommand, type TerminalContext } from './terminal';

const ctx: TerminalContext = {
  sections: ['about', 'projects', 'contact'],
  whoami: ['Nico', 'Engineer'],
  files: { 'about.txt': ['hello'] },
};

describe('runCommand', () => {
  it('returns nothing for empty input', () => expect(runCommand('   ', ctx)).toEqual({ lines: [] }));

  it('lists sections and files', () => {
    const { lines } = runCommand('ls', ctx);
    expect(lines[0]).toContain('projects/');
    expect(lines[1]).toContain('about.txt');
  });

  it('jumps to a known section, tolerating #, / and case', () => {
    for (const input of ['cd projects', 'goto #projects', 'open /Projects/', 'CD projects']) {
      expect(runCommand(input, ctx).effect).toEqual({ type: 'goto', section: 'projects' });
    }
  });

  it('refuses an unknown section without an effect', () => {
    const result = runCommand('cd nowhere', ctx);
    expect(result.effect).toBeUndefined();
    expect(result.lines[0]).toContain('no such section');
  });

  it('goes home with a bare cd', () => expect(runCommand('cd', ctx).effect).toEqual({ type: 'goto', section: 'top' }));

  it('prints files with or without the extension', () => {
    expect(runCommand('cat about.txt', ctx).lines).toEqual(['hello']);
    expect(runCommand('cat about', ctx).lines).toEqual(['hello']);
    expect(runCommand('cat nope', ctx).lines[0]).toContain('No such file');
    expect(runCommand('cat', ctx).lines[0]).toContain('missing file operand');
  });

  it('never resolves inherited object properties as files', () => {
    for (const name of ['constructor', '__proto__', 'toString', 'hasOwnProperty']) {
      expect(runCommand(`cat ${name}`, ctx).lines[0]).toContain('No such file');
    }
  });

  it('exposes whoami, theme and clear', () => {
    expect(runCommand('whoami', ctx).lines).toEqual(['Nico', 'Engineer']);
    expect(runCommand('theme', ctx).effect).toEqual({ type: 'theme' });
    expect(runCommand('clear', ctx).effect).toEqual({ type: 'clear' });
  });

  it('uses the injected clock', () => {
    expect(runCommand('date', ctx, new Date('2026-01-10T00:00:00Z')).lines[0]).toContain('10 Jan 2026');
  });

  it('answers unknown commands without throwing', () => {
    expect(runCommand('rm -rf /', ctx).lines[0]).toContain('command not found');
    expect(runCommand('sudo make me a sandwich', ctx).lines[0]).toContain('sudoers');
  });
});
