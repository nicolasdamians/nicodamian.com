export type SectionId = 'about' | 'experience' | 'credentials' | 'projects' | 'beyond' | 'contact';

export interface Fact {
  label: string;
  value: string;
}

export interface Role {
  id: string;
  role: string;
  company: string;
  location: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM or 'present' */
  end: string;
  summary: string;
  highlights: readonly string[];
  stack?: readonly string[];
  /** Show only years when the months are not known precisely. */
  yearsOnly?: boolean;
}

export interface Credential {
  id: string;
  name: string;
  issuer: string;
  issued?: string;
  verifyUrl?: string;
  featured: boolean;
  note?: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  items: readonly string[];
}

export type ProjectKind = 'platform' | 'security' | 'infrastructure' | 'tool' | 'app' | 'web';

export interface Project {
  id: string;
  title: string;
  kind: ProjectKind;
  summary: string;
  stack: readonly string[];
  link?: { label: string; href: string };
  credit?: string;
  featured: boolean;
}

export interface Interest {
  id: string;
  label: string;
  blurb: string;
}

export interface Channel {
  id: string;
  label: string;
  value: string;
  href: string;
}
