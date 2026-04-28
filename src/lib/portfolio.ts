export type Level = "Beginner" | "Intermediate" | "Advanced";
export type Template = "developer" | "corporate" | "creative" | "minimal";

export type Personal = {
  fullName: string;
  title: string;
  about: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  photoUrl: string;
};

export type Project = {
  id: string;
  title: string;
  client: string;
  technologies: string;
  description: string;
  startDate: string;
  endDate: string;
  demoLink: string;
  githubLink: string;
  imageUrl: string;
};

export type Experience = {
  id: string;
  company: string;
  startDate: string;
  endDate: string;
  designation: string;
  responsibilities: string;
  location: string;
};

export type Skill = { id: string; name: string; level: Level; category: "Frontend" | "Backend" | "Design" | "Tools" };
export type Certificate = { id: string; institute: string; course: string; startDate: string; endDate: string; technologies: string; url: string };
export type Education = { id: string; course: string; university: string; trade: string; startYear: string; endYear: string; grade: string };
export type Additional = { languages: string; hobbies: string; interests: string };
export type SocialLinks = { linkedin: string; github: string; twitter: string; instagram: string; portfolio: string; youtube: string; dribbble: string };

export type PortfolioState = {
  id?: string;
  slug?: string | null;
  is_published: boolean;
  template: Template;
  theme_mode: "dark" | "light";
  personal: Personal;
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  certificates: Certificate[];
  education: Education[];
  additional: Additional;
  social_links: SocialLinks;
  generated_bio?: string | null;
  analytics?: { views: number; shares: number };
};

export const emptyPersonal: Personal = {
  fullName: "",
  title: "",
  about: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  photoUrl: "",
};

export const defaultPortfolio: PortfolioState = {
  is_published: false,
  template: "developer",
  theme_mode: "dark",
  personal: emptyPersonal,
  projects: [],
  experiences: [],
  skills: [],
  certificates: [],
  education: [],
  additional: { languages: "", hobbies: "", interests: "" },
  social_links: { linkedin: "", github: "", twitter: "", instagram: "", portfolio: "", youtube: "", dribbble: "" },
  generated_bio: null,
  analytics: { views: 0, shares: 0 },
};

export const uid = () => crypto.randomUUID();
export const levelValue = (level: Level) => (level === "Advanced" ? 92 : level === "Intermediate" ? 68 : 38);

export const templateCopy: Record<Template, { name: string; tone: string }> = {
  developer: { name: "Developer Theme", tone: "Terminal polish, project-first storytelling, vivid skill metrics." },
  corporate: { name: "Corporate Theme", tone: "Executive layout, precise credentials, refined credibility." },
  creative: { name: "Creative Theme", tone: "Editorial visuals, expressive cards, bold portfolio moments." },
  minimal: { name: "Minimal Theme", tone: "Quiet luxury, generous whitespace, typography-led presence." },
};

export const starterPortfolio: PortfolioState = {
  ...defaultPortfolio,
  slug: "demo-portfolio",
  personal: {
    fullName: "Avery Morgan",
    title: "Senior Product Designer & Frontend Builder",
    about: "I design and build polished digital products for fast-moving teams, blending strategy, interaction design, and production-ready frontend craft.",
    email: "avery@example.com",
    phone: "+1 555 0184",
    address: "Market Street",
    city: "San Francisco",
    country: "USA",
    photoUrl: "",
  },
  projects: [
    { id: uid(), title: "Atlas Studio", client: "SaaS Launch", technologies: "React, Design Systems, Motion", description: "A conversion-focused product site and dashboard suite with reusable components and analytics-ready funnels.", startDate: "2025-01", endDate: "2025-04", demoLink: "https://example.com", githubLink: "", imageUrl: "" },
    { id: uid(), title: "Northstar CRM", client: "Enterprise Client", technologies: "TypeScript, Charts, UX Research", description: "A dense sales intelligence workspace that reduced review time with crisp workflows and insight cards.", startDate: "2024-07", endDate: "2024-12", demoLink: "", githubLink: "", imageUrl: "" },
  ],
  experiences: [
    { id: uid(), company: "BrightLayer", startDate: "2022-03", endDate: "Present", designation: "Lead Product Designer", responsibilities: "Led portfolio strategy, prototyping, design systems, and frontend handoff across multiple B2B products.", location: "Remote" },
    { id: uid(), company: "Studio Nine", startDate: "2019-06", endDate: "2022-02", designation: "Frontend Designer", responsibilities: "Built interactive marketing pages, dashboards, and component libraries for startup teams.", location: "New York" },
  ],
  skills: [
    { id: uid(), name: "React", level: "Advanced", category: "Frontend" },
    { id: uid(), name: "UX Systems", level: "Advanced", category: "Design" },
    { id: uid(), name: "Node APIs", level: "Intermediate", category: "Backend" },
    { id: uid(), name: "Figma", level: "Advanced", category: "Tools" },
  ],
  certificates: [{ id: uid(), institute: "Interaction Design Foundation", course: "Advanced UX Strategy", startDate: "2023", endDate: "2023", technologies: "Research, Testing, Prototyping", url: "" }],
  education: [{ id: uid(), course: "B.Des Digital Product", university: "California College of Arts", trade: "Interaction Design", startYear: "2015", endYear: "2019", grade: "First Class" }],
  additional: { languages: "English, Spanish", hobbies: "Photography, synth music", interests: "AI tools, typography, urban systems" },
  social_links: { linkedin: "https://linkedin.com", github: "https://github.com", twitter: "", instagram: "", portfolio: "https://example.com", youtube: "", dribbble: "https://dribbble.com" },
  generated_bio: "Product-minded designer and frontend builder focused on elegant, measurable interfaces for ambitious teams.",
  analytics: { views: 1284, shares: 86 },
};

export const safeJson = <T,>(value: unknown, fallback: T): T => {
  if (!value) return fallback;
  return value as T;
};
