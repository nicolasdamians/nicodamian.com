import type { Project } from './types';

export const projects: readonly Project[] = [
  {
    id: 'mcp-oauth',
    kind: 'security',
    featured: true,
    title: 'Remote MCP server with its own OAuth 2.0',
    summary:
      'A Model Context Protocol server that lets an AI assistant query private data. It has its own authorization server instead of a borrowed one: dynamic client registration, PKCE, redirect allow-list and lockouts, then hardened it after an audit.',
    stack: ['Python', 'FastAPI', 'OAuth 2.0', 'PKCE', 'Zero Trust tunnel'],
  },
  {
    id: 'vpn',
    kind: 'security',
    featured: true,
    title: 'Site-to-site VPN that heals itself',
    summary:
      'An IPsec IKEv2 tunnel between home and a VPS, working behind double NAT and a dynamic address. Watchdogs detect a dead tunnel, tell ingress from egress failures and bring it back, with a kill switch so nothing leaks meanwhile.',
    stack: ['IPsec', 'IKEv2', 'WireGuard', 'Firewalling', 'Bash'],
  },
  {
    id: 'security-monitor',
    kind: 'security',
    featured: true,
    title: 'Daily security review, run by an LLM analyst',
    summary:
      'Every day a headless agent reads logs, port diffs and access events from my servers, triages them like a junior analyst would and only pages me when it is serious. Read-only by design.',
    stack: ['Python', 'LLM agents', 'systemd timers', 'Telegram'],
  },
  {
    id: 'gen0ne',
    kind: 'platform',
    featured: true,
    title: 'gen0ne: a personal data platform on a 1 GB server',
    summary:
      'Wearables, training, nutrition and calendar pulled into one API and dashboard, with alerting and an AI layer for logging by text, voice or photo. About ten integrations, no Docker, VPN-only by default.',
    stack: ['FastAPI', 'SQLite', 'React', 'APScheduler', 'nginx'],
  },
  {
    id: 'homelab',
    kind: 'infrastructure',
    featured: true,
    title: 'Home lab with Zero Trust access',
    summary:
      'A Raspberry Pi and a NAS that behave like a small datacenter: identity-gated access with short-lived SSH certificates, redundant DNS filtering, Prometheus and Grafana for every host, three tiers of backup and fault-injection tests that I actually run.',
    stack: ['Raspberry Pi', 'Cloudflare Tunnel', 'Prometheus', 'Grafana', 'Docker'],
  },
  {
    id: 'chatops',
    kind: 'tool',
    featured: true,
    title: 'Telegram ChatOps bot',
    summary:
      'One chat to run the fleet: wake or hibernate a PC, check servers, approve updates. Each integration gets its own forced-command SSH key limited to an allow-list of verbs, and anything that writes waits for my confirmation.',
    stack: ['Python', 'Telegram Bot API', 'SSH forced commands', 'Whisper'],
  },
  {
    id: 'dr-kit',
    kind: 'infrastructure',
    featured: false,
    title: 'Rebuild-the-server kit',
    summary:
      'Scripts and a runbook that recreate a whole VPS from Git: services, firewall, users and GPG-encrypted secrets, backed by layered off-site backups with integrity checks.',
    stack: ['Bash', 'Git', 'GPG', 'rclone'],
  },
  {
    id: 'hardening',
    kind: 'security',
    featured: false,
    title: 'VPS hardening and self-audits',
    summary:
      'Default-drop firewall, key-only SSH, fail2ban, sandboxed non-root services with memory caps, and periodic audits of my own perimeter with tracked remediation.',
    stack: ['Debian', 'systemd', 'fail2ban', 'nginx'],
  },
  {
    id: 'trip',
    kind: 'app',
    featured: false,
    title: 'Trip planner: offline-first PWA, bot and MCP',
    summary:
      'A planning app that keeps working with no signal, with a Telegram bot and an OAuth-protected MCP server on top. Around 540 tests and a full staging clone with a simulated clock to rehearse days in advance.',
    stack: ['Python', 'PWA', 'OAuth 2.0', 'Playwright'],
  },
  {
    id: 'travel-gateway',
    kind: 'security',
    featured: false,
    title: 'Travel VPN hotspot',
    summary:
      'A Raspberry Pi that turns any hotel network into my own: every client is forced through a WireGuard tunnel, with a kill switch checked against DNS and IPv6 leaks.',
    stack: ['Raspberry Pi', 'WireGuard', 'NetworkManager'],
  },
  {
    id: 'claudetrack',
    kind: 'tool',
    featured: false,
    title: 'claudetrack-tray',
    summary:
      'A Windows tray app for Claude Code that keeps session usage in view at all times and, more importantly, resumes sessions by itself when the limits reset. Credentials live in the OS keystore; 129 tests and ten languages.',
    stack: ['Rust', 'Tauri 2', 'TypeScript'],
    credit: 'Inspired by a browser extension my brother wrote. I built the desktop version and gave it to him; it lives on as UsagePeek.',
    link: { label: 'usagepeek.com', href: 'https://usagepeek.com' },
  },
  {
    id: 'wardrobe',
    kind: 'app',
    featured: false,
    title: 'AI wardrobe with virtual try-on',
    summary:
      'An open-source closet app extended with try-on image generation. It runs on a gaming PC that only wakes when someone asks for it.',
    stack: ['Docker', 'Wake-on-demand', 'Image generation'],
    credit: 'Built on the open-source wardrowbe project.',
  },
  {
    id: 'kery',
    kind: 'app',
    featured: false,
    title: 'Kery',
    summary:
      'A mobile app with an LLM at its core, built with prompt-injection rules and owner-only data access from day one. Paused, not abandoned.',
    stack: ['Flutter', 'Firebase', 'Gemini'],
  },
  {
    id: 'pikis',
    kind: 'app',
    featured: false,
    title: 'A routine tracker for kids',
    summary:
      'A small PWA with rewards and a parent approval loop over Telegram, plus a reproducible pipeline for its clay-style artwork.',
    stack: ['FastAPI', 'PWA', 'Telegram'],
  },
  {
    id: 'oscp-tracker',
    kind: 'tool',
    featured: false,
    title: 'OSCP Obsidian Tracker',
    summary:
      'The templates, dashboard and methodology I used to prepare the OSCP, packaged as an Obsidian vault.',
    stack: ['Obsidian', 'Dataview', 'Markdown'],
    link: { label: 'GitHub', href: 'https://github.com/nicolasdamians/oscp-obsidian-tracker' },
  },
  {
    id: 'tunneleitor',
    kind: 'tool',
    featured: false,
    title: 'Tunneleitor',
    summary:
      'A Bash script that creates and manages forward and reverse SSH tunnels: port checks, PID tracking, logs and a report of what is up.',
    stack: ['Bash', 'SSH'],
    link: { label: 'GitHub', href: 'https://github.com/nicolasdamians/Tunneleitor' },
  },
  {
    id: 'moves',
    kind: 'web',
    featured: false,
    title: 'Afectados MOVES III',
    summary: 'A campaign website for people affected by delays in a public subsidy programme.',
    stack: ['HTML', 'GitHub Pages'],
    link: { label: 'Website', href: 'https://afectadosmovesiii.org/' },
  },
];
