import { projects } from './projects';
import type { Fact } from './types';

export const profile = {
  name: 'Nicolás Damián Sadofschi',
  shortName: 'Nico',
  handle: 'gen0ne',
  role: 'Senior Firewall Engineer',
  employer: 'SIX',
  location: 'Zurich, Switzerland',
  tagline:
    'I run firewalls and remote access for Swiss financial infrastructure. Off the clock I hold the OSCP and build my own servers and tools until they work.',
  /** Lines printed by `whoami` in the hero terminal. */
  whoami: ['Senior Firewall Engineer @ SIX · Zurich', '✓ Master in Offensive Security  ✓ OSCP  ✓ OSCP+'],
  stats: [
    { value: '20+', label: 'years in IT' },
    { value: 'OSCP', label: 'passed Jan 2026' },
    { value: String(projects.length), label: 'projects built' },
    { value: '4', label: 'languages spoken' },
  ],
  about: [
    'Infrastructure taught me how things are meant to work. Offensive security taught me how they actually fail. After twenty years of building and running other people’s platforms I did a master’s in offensive security and passed the OSCP, and now I use both sides every day: I build like someone who knows how it gets broken.',
    'By day that means firewalls at SIX, and before that four years engineering remote access at Julius Baer and almost seven at NTT, where I ended up as the last line of escalation for managed hosting customers.',
    'At home I run a small fleet for real: a hardened VPS, a Raspberry Pi, a site-to-site VPN, Zero Trust access and a pile of services I built myself. I do not hand-write much code any more: I work with AI coding agents, where my part is the design, the review of every change and knowing when to say no. If it is on this page, it is running somewhere.',
  ],
  /** How it started. Told by the owner; dates are approximate school years. */
  origin: [
    {
      when: '6th grade',
      title: 'First website',
      text: 'Built with FrontPage 97. The follow-up was a Simpsons fan site on free hosting, with a three-level quiz that kept stats and a JavaScript cookie that remembered your name and greeted you with it.',
    },
    {
      when: '6th–7th grade',
      title: 'First “hacks”',
      text: 'Sent the Sub7 and PC Invader backdoors to classmates over ICQ. “Hacking”, in very large quotation marks, but it was the first time a machine did what I wanted from somewhere else.',
    },
    {
      when: 'Early 2000s',
      title: 'IRC and the easy bugs',
      text: 'Fell into IRC groups and learned from the Unicode traversal bug and the Code Red era that most of the internet was held together with defaults.',
    },
    {
      when: 'Teens',
      title: 'Counter-Strike taught me Linux',
      text: 'Running game servers meant learning Linux, Apache, IIS and SQL without noticing I was studying.',
    },
    {
      when: '2004',
      title: 'Cyber-cafés',
      text: 'My first unofficial job: crimping network cables and setting up every machine in the room. The official career starts right after.',
    },
  ],
  facts: [
    { label: 'Role', value: 'Senior Firewall Engineer @ SIX' },
    { label: 'Base', value: 'Zurich, CH' },
    { label: 'Focus', value: 'Firewalls · Remote access · Offensive security' },
    { label: 'Certified', value: 'OSCP · OSCP+' },
    { label: 'In IT since', value: '2004' },
    { label: 'Speaks', value: 'Spanish · Catalan · English · French' },
  ] satisfies Fact[],
  pinky: {
    login: 'gen0ne',
    realName: 'Nicolás Damián Sadofschi',
    directory: '/home/gen0ne',
    shell: '/bin/bash',
  },
  motto: 'I know that I know nothing, but I also know one thing more than yesterday.',
  photoAlt: 'Nicolás on a ridge in the Swiss Alps',
} as const;
