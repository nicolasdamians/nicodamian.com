import type { Credential, SkillGroup } from './types';

/**
 * Ordered by importance, as the owner ranks them. No credential IDs on purpose:
 * verification goes through the issuer's link.
 */
export const credentials: readonly Credential[] = [
  {
    id: 'master',
    name: 'Master’s Degree in Offensive Security',
    issuer: 'UCAM',
    featured: true,
    issued: '2024 – 2025',
    note: 'Universidad Católica San Antonio de Murcia. A full year of offensive security, built around the OSCP syllabus.',
  },
  {
    id: 'oscp',
    name: 'OSCP',
    issuer: 'OffSec',
    featured: true,
    issued: 'January 2026',
    verifyUrl: 'https://credentials.offsec.com/c4fbf6fb-b0af-4826-ad52-82007ffc5b16',
    note: 'OffSec Certified Professional. A 24-hour, hands-on penetration test followed by a written report.',
  },
  {
    id: 'oscp-plus',
    name: 'OSCP+',
    issuer: 'OffSec',
    featured: true,
    issued: 'January 2026 · valid until January 2029',
    verifyUrl: 'https://credentials.offsec.com/2be1e3f1-86d1-49ff-a377-0ca183288419',
    note: 'The renewable edition of the OSCP, earned in the same exam.',
  },
  {
    id: 'vcp-2020',
    name: 'VMware Certified Professional, Data Center Virtualization 2020',
    issuer: 'VMware',
    featured: false,
    issued: '2020 – 2022',
  },
  {
    id: 'vcp6',
    name: 'VMware Certified Professional 6, Data Center Virtualization',
    issuer: 'VMware',
    featured: false,
    issued: '2017 – 2019',
  },
  { id: 'nse7', name: 'NSE 7 Network Security Architect', issuer: 'Fortinet', featured: false, issued: '2020 – 2022' },
  {
    id: 'nse4',
    name: 'Network Security Expert 4 (FortiOS 5.4)',
    issuer: 'Fortinet',
    featured: false,
    issued: '2018 – 2020',
  },
  {
    id: 'cca-n',
    name: 'Citrix Certified Associate, Networking (CCA-N)',
    issuer: 'Citrix',
    featured: false,
    issued: '2019 – 2022',
  },
  { id: 'itil', name: 'ITIL Foundations', issuer: 'ITIL', featured: false },
  { id: 'cyberops', name: 'CyberOps Associate', issuer: 'Cisco', featured: false, issued: '2022' },
  { id: 'aptis', name: 'English CEFR C1 (Aptis ESOL)', issuer: 'British Council', featured: false, issued: '2025' },
];

export const skills: readonly SkillGroup[] = [
  {
    id: 'netsec',
    label: 'Network security',
    items: ['Firewall engineering', 'Remote access & VPN', 'IPsec / IKEv2', 'WireGuard', 'Zero Trust access', 'Load balancing'],
  },
  {
    id: 'offsec',
    label: 'Offensive security',
    items: ['Penetration testing', 'Active Directory', 'Privilege escalation', 'Web applications', 'Reporting'],
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    items: ['Linux', 'Windows Server', 'VMware', 'Storage', 'DNS', 'Hardening', 'Backup & recovery'],
  },
  {
    id: 'build',
    label: 'Building with AI',
    items: ['AI coding agents', 'Specs, review and rollback', 'MCP servers', 'OAuth 2.0', 'LLM tooling', 'Bash'],
  },
  {
    id: 'ops',
    label: 'Operations',
    items: ['Prometheus', 'Grafana', 'systemd', 'nginx', 'Docker', 'Incident analysis'],
  },
];
