import type { Channel, Interest } from './types';

export const beyond = {
  intro:
    'Away from the keyboard I am usually moving. I live in Zurich with my partner and our young son, and most weekends end up on a mountain or in a lake.',
  interests: [
    {
      id: 'two-wheels',
      label: 'Two wheels',
      blurb: 'Motorbikes and mountain bikes. One has an engine, both go downhill faster than they should.',
    },
    { id: 'sport', label: 'Sport', blurb: 'Gym, swimming, hiking. I train most days and I am not picky about how.' },
    {
      id: 'water',
      label: 'On the water',
      blurb: 'Licensed for motorboats and jet skis. The entry-level licence, but it floats.',
    },
    { id: 'music', label: 'Music', blurb: 'Always something playing while I work.' },
    {
      id: 'family',
      label: 'Family',
      blurb: 'Playing with my son is the best part of the day. Half of what I build at home is for the three of us.',
    },
    {
      id: 'tinkering',
      label: 'Tinkering',
      blurb: 'Raspberry Pis, fan controllers, anything with a serial port. If it can be automated, it will be.',
    },
  ] satisfies Interest[],
} as const;

export const contact = {
  email: { user: 'contacto', domain: 'nicodamian.com' },
  channels: [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: 'in/nicolas-damian-sadofschi',
      href: 'https://www.linkedin.com/in/nicolas-damian-sadofschi/',
    },
    { id: 'github', label: 'GitHub', value: 'nicolasdamians', href: 'https://github.com/nicolasdamians' },
  ] satisfies Channel[],
} as const;
