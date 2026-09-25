import type {
  Profile,
  SiteSettings,
  Skill,
  Project,
  Experience,
  Education,
  Certification,
  Service,
  Testimonial,
  BlogPost,
  ContactMessage,
} from '@/types'
import { STORAGE_KEYS, storage, DATA_VERSION } from '@/lib/storage'
import { generateId, nowISO } from '@/lib/id'

const now = nowISO()
const ts = { createdAt: now, updatedAt: now }

/* Stable ids so cross-references (testimonial -> project) resolve. */
const PROJECT_IDS = {
  nexus: 'proj_seed_nexus',
  ledger: 'proj_seed_ledger',
  atlas: 'proj_seed_atlas',
  pulse: 'proj_seed_pulse',
  forge: 'proj_seed_forge',
  beacon: 'proj_seed_beacon',
}

const img = (seed: string, w = 1200, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`
const avatar = (n: number) => `https://i.pravatar.cc/240?img=${n}`

/* ── Profile (singleton) ─────────────────────────────────────── */
export function makeDefaultProfile(): Profile {
  return {
    id: 'profile',
    fullName: 'Shahzeb Ahmad',
    professionalTitle: 'Full-Stack Developer',
    tagline: 'I build fast, scalable and conversion-focused digital experiences.',
    avatar: avatar(12),
    email: 'hello@shahzeb.dev',
    phone: '+1 (555) 018-2043',
    location: 'Remote · Available worldwide',
    shortBio:
      'Full-stack developer specialising in React, TypeScript and Node.js. I help startups and product teams ship polished, performant web applications.',
    longBio:
      "I'm a full-stack developer with 6+ years of experience turning ambiguous ideas into production software. My focus is the front of the stack — React, TypeScript and design-system engineering — backed by pragmatic Node.js APIs and cloud infrastructure.\n\nI care about the details that make products feel fast and trustworthy: accessible interfaces, sensible architecture, and measurable performance. I've partnered with early-stage founders and established teams alike, and I enjoy owning features end-to-end from discovery through launch.",
    currentFocus: 'Design systems, performance engineering & AI-assisted product features.',
    available: true,
    availabilityMessage: 'Available for freelance projects',
    yearsOfExperience: 6,
    projectsCompleted: 48,
    happyClients: 32,
    resumeUrl: '/resume',
    social: [
      { platform: 'github', url: 'https://github.com/shahzeb', enabled: true },
      { platform: 'linkedin', url: 'https://linkedin.com/in/shahzeb', enabled: true },
      { platform: 'twitter', url: 'https://twitter.com/shahzeb', enabled: true },
      { platform: 'dribbble', url: 'https://dribbble.com/shahzeb', enabled: false },
    ],
    hero: {
      greeting: "Hi, I'm",
      valueProposition:
        'I build fast, scalable and conversion-focused digital experiences for founders and product teams.',
      availabilityText: 'Available for freelance projects',
      primaryCtaLabel: 'View My Work',
      primaryCtaHref: '/projects',
      secondaryCtaLabel: "Let's Work Together",
      secondaryCtaHref: '/contact',
      imageOverride: '',
      showGreeting: true,
      showAvailability: true,
      showSecondaryCta: true,
      showSocials: true,
    },
    ...ts,
  }
}

/* ── Settings (singleton) ────────────────────────────────────── */
export function makeDefaultSettings(): SiteSettings {
  return {
    id: 'settings',
    siteName: 'Shahzeb Ahmad',
    siteDescription:
      'Full-Stack Developer building fast, scalable and conversion-focused digital experiences.',
    logoText: 'Shahzeb Ahmad',
    logoImageUrl: '',
    faviconUrl: '/favicon.svg',
    seo: {
      metaTitle: 'Shahzeb Ahmad — Full-Stack Developer',
      metaDescription:
        'Full-Stack Developer specialising in React, TypeScript and Node.js. Building polished, performant web applications.',
      keywords: ['Full-Stack Developer', 'React', 'TypeScript', 'Node.js', 'Freelance Developer'],
      ogImage: img('og-cover', 1200, 630),
    },
    appearance: {
      defaultTheme: 'dark',
      accent: 'violet',
      animationsEnabled: true,
    },
    ...ts,
  }
}

/* ── Skills ──────────────────────────────────────────────────── */
function makeSkills(): Skill[] {
  const rows: Array<[string, Skill['category'], string, number, number, boolean]> = [
    ['React', 'frontend', 'Atom', 96, 6, true],
    ['TypeScript', 'frontend', 'Braces', 94, 5, true],
    ['Next.js', 'frontend', 'PanelsTopLeft', 90, 4, true],
    ['Tailwind CSS', 'frontend', 'Wind', 93, 4, true],
    ['Framer Motion', 'frontend', 'Sparkles', 85, 3, false],
    ['Node.js', 'backend', 'Hexagon', 90, 5, true],
    ['Express', 'backend', 'Server', 88, 5, false],
    ['GraphQL', 'backend', 'Share2', 80, 3, false],
    ['MongoDB', 'database', 'Database', 87, 5, true],
    ['PostgreSQL', 'database', 'Table2', 82, 4, false],
    ['Redis', 'database', 'Zap', 74, 3, false],
    ['Docker', 'devops', 'Container', 80, 4, false],
    ['AWS', 'devops', 'Cloud', 78, 3, true],
    ['Git', 'tools', 'GitBranch', 92, 6, false],
    ['Figma', 'tools', 'Figma', 84, 4, false],
    ['Vitest', 'tools', 'FlaskConical', 79, 3, false],
  ]
  return rows.map(([name, category, icon, proficiency, yearsOfExperience, featured], i) => ({
    id: generateId('skill'),
    name,
    category,
    icon,
    proficiency,
    yearsOfExperience,
    featured,
    sortOrder: i,
    ...ts,
  }))
}

/* ── Projects ────────────────────────────────────────────────── */
function makeProjects(): Project[] {
  return [
    {
      id: PROJECT_IDS.nexus,
      title: 'Nexus Analytics Platform',
      slug: 'nexus-analytics-platform',
      shortDescription:
        'A real-time analytics dashboard that turns raw product events into clear, actionable insight.',
      description:
        'Nexus is a real-time analytics platform for product teams. It ingests millions of events per day and renders them into fast, filterable dashboards so teams can understand user behaviour without waiting on data engineering.',
      thumbnail: img('nexus', 1200, 800),
      images: [img('nexus-1', 1600, 1000), img('nexus-2', 1600, 1000), img('nexus-3', 1600, 1000)],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
      category: 'Dashboard',
      features: [
        'Real-time event streaming with sub-second updates',
        'Composable dashboards with saved views',
        'Cohort and funnel analysis',
        'Role-based access control',
      ],
      challenges: [
        'Rendering large time-series datasets without janky scrolling',
        'Keeping dashboards responsive under heavy concurrent load',
      ],
      solutions: [
        'Virtualised chart rendering and windowed queries',
        'Redis-backed caching layer with smart invalidation',
      ],
      results: [
        'Reduced time-to-insight from hours to seconds',
        'Sustained 2M+ daily events at p95 < 400ms',
      ],
      githubUrl: 'https://github.com/shahzeb/nexus',
      liveUrl: 'https://nexus.example.com',
      client: 'Nexus Labs',
      completedAt: '2025-09-01',
      featured: true,
      published: true,
      sortOrder: 0,
      seo: {
        metaTitle: 'Nexus Analytics Platform — Case Study',
        metaDescription: 'How I built a real-time analytics platform handling millions of events.',
        ogImage: img('nexus', 1200, 630),
      },
      ...ts,
    },
    {
      id: PROJECT_IDS.ledger,
      title: 'Ledger — Fintech Onboarding',
      slug: 'ledger-fintech-onboarding',
      shortDescription:
        'A conversion-focused onboarding flow that took a fintech product from sign-up to funded in minutes.',
      description:
        'Ledger needed an onboarding experience that felt effortless while satisfying strict KYC requirements. I designed and built a multi-step flow with real-time validation, progressive disclosure and resilient state handling.',
      thumbnail: img('ledger', 1200, 800),
      images: [img('ledger-1', 1600, 1000), img('ledger-2', 1600, 1000)],
      technologies: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'Web App',
      features: [
        'Multi-step KYC onboarding with autosave',
        'Real-time identity verification',
        'Stripe-powered funding',
        'Accessible, keyboard-first forms',
      ],
      challenges: ['Balancing compliance friction with conversion'],
      solutions: ['Progressive disclosure and inline validation to reduce drop-off'],
      results: ['Increased completed sign-ups by 38%', 'Cut average onboarding time to under 4 minutes'],
      githubUrl: '',
      liveUrl: 'https://ledger.example.com',
      client: 'Ledger Financial',
      completedAt: '2025-05-15',
      featured: true,
      published: true,
      sortOrder: 1,
      seo: {},
      ...ts,
    },
    {
      id: PROJECT_IDS.atlas,
      title: 'Atlas Design System',
      slug: 'atlas-design-system',
      shortDescription:
        'A themeable component library and documentation site adopted across six product teams.',
      description:
        'Atlas is a design system built to unify a growing product suite. It ships accessible React components, design tokens, and living documentation, cutting UI build time dramatically.',
      thumbnail: img('atlas', 1200, 800),
      images: [img('atlas-1', 1600, 1000), img('atlas-2', 1600, 1000), img('atlas-3', 1600, 1000)],
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Storybook', 'Vitest'],
      category: 'Design System',
      features: [
        'Token-driven theming (light/dark)',
        '60+ accessible components',
        'Automated visual regression tests',
        'MDX documentation site',
      ],
      challenges: ['Getting six teams to adopt a shared system'],
      solutions: ['Incremental migration path and excellent docs'],
      results: ['Reduced UI build time by ~40%', 'Single source of truth for design'],
      githubUrl: 'https://github.com/shahzeb/atlas',
      liveUrl: 'https://atlas.example.com',
      client: 'Internal',
      completedAt: '2024-12-10',
      featured: true,
      published: true,
      sortOrder: 2,
      seo: {},
      ...ts,
    },
    {
      id: PROJECT_IDS.pulse,
      title: 'Pulse — Fitness Landing Page',
      slug: 'pulse-fitness-landing',
      shortDescription:
        'A high-converting marketing site for a fitness app, built for speed and story.',
      description:
        'Pulse needed a landing page that loaded instantly and told a compelling story. I built a statically-generated site with buttery animations and a perfect Lighthouse score.',
      thumbnail: img('pulse', 1200, 800),
      images: [img('pulse-1', 1600, 1000)],
      technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
      category: 'Landing Page',
      features: ['100/100 Lighthouse performance', 'Scroll-driven animations', 'A/B tested hero'],
      challenges: ['Rich motion without hurting performance'],
      solutions: ['GPU-friendly transforms and lazy hydration'],
      results: ['1.2s largest contentful paint', '24% lift in trial sign-ups'],
      githubUrl: '',
      liveUrl: 'https://pulse.example.com',
      client: 'Pulse Fitness',
      completedAt: '2024-08-20',
      featured: false,
      published: true,
      sortOrder: 3,
      seo: {},
      ...ts,
    },
    {
      id: PROJECT_IDS.forge,
      title: 'Forge — Developer CLI',
      slug: 'forge-developer-cli',
      shortDescription:
        'An open-source CLI that scaffolds production-ready TypeScript services in seconds.',
      description:
        'Forge is a developer tool that scaffolds opinionated, production-ready TypeScript services with testing, linting and CI wired up from the start.',
      thumbnail: img('forge', 1200, 800),
      images: [img('forge-1', 1600, 1000)],
      technologies: ['Node.js', 'TypeScript', 'Docker'],
      category: 'API / Backend',
      features: ['Interactive project scaffolding', 'Built-in CI templates', 'Plugin architecture'],
      challenges: ['Keeping generated projects up to date'],
      solutions: ['Versioned templates with codemod upgrades'],
      results: ['1.4k+ GitHub stars', 'Adopted by several small teams'],
      githubUrl: 'https://github.com/shahzeb/forge',
      liveUrl: '',
      client: 'Open source',
      completedAt: '2024-03-05',
      featured: false,
      published: true,
      sortOrder: 4,
      seo: {},
      ...ts,
    },
    {
      id: PROJECT_IDS.beacon,
      title: 'Beacon — E-commerce Storefront',
      slug: 'beacon-ecommerce-storefront',
      shortDescription:
        'A headless commerce storefront with a checkout tuned relentlessly for conversion.',
      description:
        'Beacon is a headless e-commerce storefront built for a boutique brand. It pairs a fast, editorial storefront with a frictionless checkout.',
      thumbnail: img('beacon', 1200, 800),
      images: [img('beacon-1', 1600, 1000), img('beacon-2', 1600, 1000)],
      technologies: ['React', 'TypeScript', 'Node.js', 'Stripe', 'MongoDB'],
      category: 'E-commerce',
      features: ['Headless CMS-driven storefront', 'One-page checkout', 'Wishlist & saved carts'],
      challenges: ['Cart abandonment on mobile'],
      solutions: ['Streamlined mobile checkout and express payments'],
      results: ['22% reduction in cart abandonment', 'Improved mobile conversion by 31%'],
      githubUrl: '',
      liveUrl: 'https://beacon.example.com',
      client: 'Beacon Goods',
      completedAt: '2023-11-30',
      featured: false,
      published: true,
      sortOrder: 5,
      seo: {},
      ...ts,
    },
  ]
}

/* ── Experience ──────────────────────────────────────────────── */
function makeExperience(): Experience[] {
  const rows: Array<Partial<Experience> & { company: string }> = [
    {
      company: 'Nexus Labs',
      position: 'Senior Full-Stack Developer',
      location: 'Remote',
      employmentType: 'full-time',
      startDate: '2023-02-01',
      endDate: '',
      current: true,
      description: 'Lead engineer on the analytics platform, owning frontend architecture and core APIs.',
      responsibilities: [
        'Architect and build the React + TypeScript frontend',
        'Design performant Node.js services and data pipelines',
        'Mentor two mid-level engineers',
      ],
      achievements: [
        'Cut dashboard load time by 60%',
        'Introduced a design system that halved UI build time',
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
      companyUrl: 'https://nexus.example.com',
    },
    {
      company: 'Ledger Financial',
      position: 'Full-Stack Developer',
      location: 'Berlin, Germany (Hybrid)',
      employmentType: 'full-time',
      startDate: '2021-04-01',
      endDate: '2023-01-15',
      current: false,
      description: 'Built conversion-critical onboarding and payments experiences for a fintech product.',
      responsibilities: [
        'Owned the onboarding and KYC flows end-to-end',
        'Integrated Stripe for funding and payouts',
      ],
      achievements: ['Increased completed sign-ups by 38%'],
      technologies: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Stripe'],
      companyUrl: 'https://ledger.example.com',
    },
    {
      company: 'Freelance',
      position: 'Web Developer',
      location: 'Remote',
      employmentType: 'freelance',
      startDate: '2019-06-01',
      endDate: '2021-03-30',
      current: false,
      description: 'Delivered marketing sites and web apps for startups and small businesses.',
      responsibilities: ['Designed and shipped 20+ client websites', 'Managed projects end-to-end'],
      achievements: ['Maintained a 5-star client rating'],
      technologies: ['React', 'JavaScript', 'Node.js', 'Tailwind CSS'],
      companyUrl: '',
    },
  ]
  return rows.map((r, i) => ({
    id: generateId('exp'),
    location: '',
    endDate: '',
    current: false,
    description: '',
    responsibilities: [],
    achievements: [],
    technologies: [],
    companyUrl: '',
    employmentType: 'full-time',
    startDate: '',
    position: '',
    ...r,
    sortOrder: i,
    ...ts,
  })) as Experience[]
}

/* ── Education ───────────────────────────────────────────────── */
function makeEducation(): Education[] {
  const rows = [
    {
      institution: 'University of Technology',
      degree: 'B.Sc.',
      field: 'Computer Science',
      startDate: '2015-09-01',
      endDate: '2019-06-01',
      current: false,
      description: 'Focused on software engineering, algorithms and human-computer interaction.',
      institutionUrl: '',
    },
    {
      institution: 'Frontend Masters',
      degree: 'Professional Path',
      field: 'Full-Stack JavaScript',
      startDate: '2020-01-01',
      endDate: '2020-12-01',
      current: false,
      description: 'Completed the full-stack JavaScript learning path.',
      institutionUrl: 'https://frontendmasters.com',
    },
  ]
  return rows.map((r, i) => ({ id: generateId('edu'), sortOrder: i, ...r, ...ts }))
}

/* ── Certifications ──────────────────────────────────────────── */
function makeCertifications(): Certification[] {
  const rows = [
    {
      name: 'AWS Certified Developer – Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2024-02-01',
      credentialId: 'AWS-DEV-2024-8821',
      credentialUrl: 'https://aws.amazon.com/verification',
      image: img('cert-aws', 600, 400),
    },
    {
      name: 'Professional Scrum Developer I',
      issuer: 'Scrum.org',
      issueDate: '2023-06-15',
      credentialId: 'PSD-2023-4410',
      credentialUrl: 'https://scrum.org',
      image: img('cert-scrum', 600, 400),
    },
    {
      name: 'MongoDB Associate Developer',
      issuer: 'MongoDB University',
      issueDate: '2022-11-20',
      credentialId: 'MDB-2022-9034',
      credentialUrl: 'https://university.mongodb.com',
      image: img('cert-mongo', 600, 400),
    },
  ]
  return rows.map((r, i) => ({ id: generateId('cert'), sortOrder: i, ...r, ...ts }))
}

/* ── Services ────────────────────────────────────────────────── */
function makeServices(): Service[] {
  const rows = [
    {
      title: 'Full-Stack Web Applications',
      description:
        'End-to-end web apps with React, TypeScript and Node.js — from architecture to launch.',
      icon: 'Layers',
      features: ['React + TypeScript frontend', 'Node.js APIs', 'Database design', 'Deployment & CI'],
      startingPrice: 'From $6,000',
      deliveryTime: '4–8 weeks',
      featured: true,
    },
    {
      title: 'Landing Page Development',
      description: 'High-converting, blazing-fast marketing pages that tell your story.',
      icon: 'Rocket',
      features: ['Conversion-focused design', 'Perfect Lighthouse scores', 'CMS integration'],
      startingPrice: 'From $1,500',
      deliveryTime: '1–2 weeks',
      featured: true,
    },
    {
      title: 'React Development',
      description: 'Component libraries, complex UIs and performance work for existing React apps.',
      icon: 'Atom',
      features: ['Design systems', 'Performance audits', 'Accessibility'],
      startingPrice: 'From $3,000',
      deliveryTime: '2–4 weeks',
      featured: false,
    },
    {
      title: 'E-commerce Development',
      description: 'Headless storefronts and checkout experiences tuned for conversion.',
      icon: 'ShoppingBag',
      features: ['Headless commerce', 'Stripe integration', 'Optimised checkout'],
      startingPrice: 'From $5,000',
      deliveryTime: '4–6 weeks',
      featured: false,
    },
    {
      title: 'Website Redesign',
      description: 'Modernise an existing site with a refreshed design and improved performance.',
      icon: 'Wand2',
      features: ['UX audit', 'Redesign & rebuild', 'SEO preservation'],
      startingPrice: 'From $2,500',
      deliveryTime: '2–4 weeks',
      featured: false,
    },
    {
      title: 'Maintenance & Support',
      description: 'Ongoing development, monitoring and improvements for your product.',
      icon: 'Wrench',
      features: ['Bug fixes', 'Feature work', 'Performance monitoring'],
      startingPrice: 'From $800/mo',
      deliveryTime: 'Ongoing',
      featured: false,
    },
  ]
  return rows.map((r, i) => ({
    id: generateId('svc'),
    published: true,
    sortOrder: i,
    ...r,
    ...ts,
  }))
}

/* ── Testimonials ────────────────────────────────────────────── */
function makeTestimonials(): Testimonial[] {
  const rows = [
    {
      clientName: 'Sarah Chen',
      clientPhoto: avatar(5),
      position: 'VP of Product',
      company: 'Nexus Labs',
      testimonial:
        'Shahzeb is the rare engineer who cares as much about the product as the code. He took our analytics platform from prototype to production and made it feel effortless.',
      rating: 5,
      projectId: PROJECT_IDS.nexus,
      featured: true,
    },
    {
      clientName: 'Marcus Feldman',
      clientPhoto: avatar(13),
      position: 'Founder & CEO',
      company: 'Ledger Financial',
      testimonial:
        'Our onboarding conversion jumped almost 40% after Shahzeb reworked the flow. Clear communication, fast delivery, and beautiful attention to detail.',
      rating: 5,
      projectId: PROJECT_IDS.ledger,
      featured: true,
    },
    {
      clientName: 'Priya Nair',
      clientPhoto: avatar(9),
      position: 'Design Director',
      company: 'Atlas',
      testimonial:
        'The design system Shahzeb built became the backbone of our product. Thoughtful, accessible and genuinely a joy to work with.',
      rating: 5,
      projectId: PROJECT_IDS.atlas,
      featured: true,
    },
    {
      clientName: 'David Okoro',
      clientPhoto: avatar(15),
      position: 'Marketing Lead',
      company: 'Pulse Fitness',
      testimonial:
        'Fast, reliable and creative. Our new landing page loads instantly and looks incredible. Highly recommend.',
      rating: 5,
      projectId: PROJECT_IDS.pulse,
      featured: false,
    },
  ]
  return rows.map((r, i) => ({
    id: generateId('tst'),
    published: true,
    status: 'approved' as const,
    sortOrder: i,
    ...r,
    ...ts,
  }))
}

/* ── Blog ────────────────────────────────────────────────────── */
function makeBlog(): BlogPost[] {
  const rows = [
    {
      title: 'Building a Repository Layer That Survives a Backend Swap',
      slug: 'repository-layer-backend-swap',
      excerpt:
        'How a thin repository abstraction lets you start with localStorage and move to a real API without rewriting your UI.',
      content:
        "## Why abstractions matter\n\nWhen you start a project you rarely have the backend ready. But that doesn't mean your UI should reach into `localStorage` directly. A **repository layer** gives you a seam.\n\n## The interface\n\nDefine what the app needs, not how it's stored:\n\n```ts\ninterface ProjectRepository {\n  getAll(): Promise<Project[]>\n  getById(id: string): Promise<Project | null>\n}\n```\n\n## Two implementations\n\nStart with a mock that reads from storage. Later, add an API implementation that fetches from Express. The UI never changes.\n\n> The best architecture decisions are the ones you don't have to revisit.\n\nThat's the whole trick — depend on interfaces, inject implementations.",
      featuredImage: img('blog-repo', 1200, 800),
      category: 'Architecture',
      tags: ['Architecture', 'TypeScript', 'React'],
      author: 'Shahzeb Ahmad',
      publishedAt: '2026-06-12',
      status: 'published' as const,
      featured: true,
      seo: {},
    },
    {
      title: 'Designing Interfaces That Feel Fast',
      slug: 'designing-interfaces-that-feel-fast',
      excerpt:
        'Perceived performance is a design problem as much as an engineering one. Here are the techniques I reach for.',
      content:
        "## Speed is a feeling\n\nUsers don't measure milliseconds — they feel them. A few techniques go a long way.\n\n## Optimistic UI\n\nUpdate the interface before the server confirms. Roll back on failure.\n\n## Skeletons over spinners\n\nSkeletons communicate structure and reduce perceived wait. Spinners just say *wait*.\n\n## Motion with intent\n\nSubtle, fast transitions guide attention. Anything over ~300ms starts to feel sluggish.",
      featuredImage: img('blog-fast', 1200, 800),
      category: 'Frontend',
      tags: ['UX', 'Performance', 'React'],
      author: 'Shahzeb Ahmad',
      publishedAt: '2026-04-28',
      status: 'published' as const,
      featured: false,
      seo: {},
    },
    {
      title: 'A Pragmatic Guide to TypeScript Generics',
      slug: 'pragmatic-guide-typescript-generics',
      excerpt:
        'Generics are not academic. Used well, they remove duplication and make refactors safe.',
      content:
        "## Start concrete\n\nWrite the specific version first, then generalise. Premature generics are as bad as premature optimisation.\n\n## Constrain your types\n\n```ts\nfunction getById<T extends { id: string }>(items: T[], id: string) {\n  return items.find((i) => i.id === id)\n}\n```\n\nConstraints give you both flexibility and safety.\n\n## Know when to stop\n\nIf a generic needs a comment to explain it, consider whether a plain type would be clearer.",
      featuredImage: img('blog-ts', 1200, 800),
      category: 'TypeScript',
      tags: ['TypeScript'],
      author: 'Shahzeb Ahmad',
      publishedAt: '',
      status: 'draft' as const,
      featured: false,
      seo: {},
    },
  ]
  return rows.map((r) => ({
    id: generateId('post'),
    readingTime: Math.max(1, Math.round(r.content.split(/\s+/).length / 220)),
    ...r,
    ...ts,
  }))
}

/* ── Messages ────────────────────────────────────────────────── */
function makeMessages(): ContactMessage[] {
  const rows = [
    {
      name: 'Elena Rossi',
      email: 'elena@brightco.io',
      company: 'BrightCo',
      website: 'https://brightco.io',
      projectType: 'Web Application',
      budget: '$10k – $25k',
      message:
        "Hi Shahzeb, we're building an internal tool and love your work on Nexus. Would you be open to a discovery call next week?",
      status: 'unread' as const,
    },
    {
      name: 'Tom Whitfield',
      email: 'tom@wanderlust.travel',
      company: 'Wanderlust',
      website: '',
      projectType: 'Landing Page',
      budget: '$1k – $5k',
      message:
        'We need a high-converting landing page for a new travel product. Timeline is about 3 weeks. Are you available?',
      status: 'read' as const,
    },
  ]
  return rows.map((r) => ({ id: generateId('msg'), ...r, ...ts }))
}

/**
 * Seed all collections + singletons if this is a fresh install or the data
 * version changed. Existing user edits are preserved (we only write keys that
 * are missing). This is the single place initial data enters the system.
 */
export function seedDatabase(): void {
  const seededVersion = storage.get<number>(STORAGE_KEYS.version)
  const fresh = seededVersion !== DATA_VERSION

  const ensure = <T>(key: string, factory: () => T) => {
    if (fresh || !storage.has(key)) storage.set(key, factory())
  }

  ensure(STORAGE_KEYS.profile, makeDefaultProfile)
  ensure(STORAGE_KEYS.settings, makeDefaultSettings)
  ensure(STORAGE_KEYS.skills, makeSkills)
  ensure(STORAGE_KEYS.projects, makeProjects)
  ensure(STORAGE_KEYS.experience, makeExperience)
  ensure(STORAGE_KEYS.education, makeEducation)
  ensure(STORAGE_KEYS.certifications, makeCertifications)
  ensure(STORAGE_KEYS.services, makeServices)
  ensure(STORAGE_KEYS.testimonials, makeTestimonials)
  ensure(STORAGE_KEYS.blog, makeBlog)
  ensure(STORAGE_KEYS.messages, makeMessages)

  storage.set(STORAGE_KEYS.version, DATA_VERSION)
}

/** Wipe all app data and reseed (used by Admin → Settings → Reset demo data). */
export function resetDatabase(): void {
  storage.set(STORAGE_KEYS.version, -1)
  ;[
    STORAGE_KEYS.profile,
    STORAGE_KEYS.settings,
    STORAGE_KEYS.skills,
    STORAGE_KEYS.projects,
    STORAGE_KEYS.experience,
    STORAGE_KEYS.education,
    STORAGE_KEYS.certifications,
    STORAGE_KEYS.services,
    STORAGE_KEYS.testimonials,
    STORAGE_KEYS.blog,
    STORAGE_KEYS.messages,
  ].forEach((key) => storage.remove(key))
  seedDatabase()
}
