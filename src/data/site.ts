import type { SectionId } from './types';

export const site = {
  url: 'https://nicodamian.com',
  title: 'Nicolás Damián Sadofschi | Firewall & security engineer, OSCP',
  description:
    'Senior Firewall Engineer in Zurich. Network security, remote access and offensive security (OSCP), plus the servers and tools I build for myself.',
  repoUrl: 'https://github.com/nicolasdamians/nicodamian.com',
  nav: [
    { id: 'about', label: 'about' },
    { id: 'experience', label: 'experience' },
    { id: 'credentials', label: 'credentials' },
    { id: 'projects', label: 'projects' },
    { id: 'beyond', label: 'beyond' },
    { id: 'contact', label: 'contact' },
  ] satisfies { id: SectionId; label: string }[],
} as const;
