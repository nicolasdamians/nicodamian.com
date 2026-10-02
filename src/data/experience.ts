import type { Role } from './types';

export const experience: readonly Role[] = [
  {
    id: 'six',
    role: 'Senior Firewall Engineer',
    company: 'SIX',
    location: 'Zurich',
    start: '2026-04',
    end: 'present',
    summary: 'Firewall engineering for the company that operates Swiss financial market infrastructure.',
    highlights: [
      'Working on bringing a Model Context Protocol server for Palo Alto firewalls into the team’s tooling.',
    ],
    stack: ['Palo Alto', 'MCP'],
  },
  {
    id: 'julius-baer',
    role: 'Security Engineer',
    company: 'Julius Baer',
    location: 'Zurich',
    start: '2022-05',
    end: '2026-03',
    summary: 'Operations and engineering for remote access at a Swiss private bank.',
    highlights: [
      'Improved how tickets flow between the helpdesk and engineering, and ran training and mentoring sessions for the helpdesk every six months.',
      'Tightened day-to-day operations of the remote access platform.',
      'Onboarded two engineers and took them from zero to fully autonomous.',
    ],
  },
  {
    id: 'synlab',
    role: 'Senior Infrastructure Engineer',
    company: 'SYNLAB International',
    location: 'Barcelona',
    start: '2021-08',
    end: '2022-05',
    summary: 'Infrastructure engineering for an international medical diagnostics group.',
    highlights: [
      'Planned and delivered a datacenter migration from Madrid to Germany, including the network architecture.',
      'Kept the original subnets, as required, and scripted traffic analysis to work out which firewall rules the new site needed.',
      'Moved the databases with SnapMirror, with no data loss.',
    ],
    stack: ['Network design', 'SnapMirror', 'Traffic analysis'],
  },
  {
    id: 'ntt-t3',
    role: 'Solutions Engineer Tier 3 & Deputy Team Lead',
    company: 'NTT Ltd.',
    location: 'Barcelona',
    start: '2019-09',
    end: '2021-08',
    summary: 'Last level of escalation for NTT cloud and managed hosting customers, plus installation and QA.',
    highlights: [
      'Owned customer platforms end to end, from deployment to support, inside agreed SLAs.',
      'Built and ran networking, Linux and Windows servers, virtualization, load balancing, firewalls and storage.',
      'On-call engineer for maintenance windows and customer projects; deputy lead of the team.',
    ],
  },
  {
    id: 'ntt-sd',
    role: 'Service Desk Engineer',
    company: 'NTT Ltd.',
    location: 'Barcelona',
    start: '2017-08',
    end: '2019-09',
    summary: 'Escalation point for complex incidents on managed infrastructure; trained and mentored the team.',
    highlights: [
      'Supported managed hosting for customers such as Decathlon, Canon, Emirates, Etihad, Aviva and Nomura.',
      'Led internal and customer-facing projects as one of the most technical members of the desk.',
    ],
    stack: ['FortiGate', 'Juniper', 'Cisco', 'NetScaler', 'Alteon', 'VMware', 'NetApp'],
  },
  {
    id: 'ntt-analyst',
    role: 'Senior Infrastructure Analyst',
    company: 'NTT Ltd.',
    location: 'Barcelona',
    start: '2014-12',
    end: '2017-08',
    summary: 'Networks, firewalls, VPN, storage, load balancing and servers for customer solutions.',
    highlights: [
      'Resolved incidents and problems and planned production changes, often out of hours.',
      'Configured FortiGate firewalls through FortiManager and the CLI.',
    ],
  },
  {
    id: 'early',
    role: 'Support, freelance and a company of my own',
    company: 'Earlier years',
    location: 'Catalonia',
    start: '2004-01',
    end: '2014-12',
    yearsOnly: true,
    summary: 'Ten years of hands-on IT before the datacenter.',
    highlights: [
      'Second-level support for Meliá Hotels at Digitex: Active Directory, Exchange, Citrix, VMware.',
      'Freelance consultant for small businesses: networks, servers, hosting and websites.',
      'Managing partner of Verynice Europa, a company that built, sold and rented ice rinks.',
      'Repair bench, field support and a cyber-café, where it all started.',
    ],
  },
];

export const education = [
  {
    id: 'ucam',
    title: 'Master’s Degree in Offensive Security',
    school: 'UCAM, Universidad Católica San Antonio de Murcia',
    years: '2024 – 2025',
  },
  { id: 'lacetania', title: 'Network Systems Administration', school: 'IES Lacetània, Manresa', years: '2005 – 2007' },
] as const;
