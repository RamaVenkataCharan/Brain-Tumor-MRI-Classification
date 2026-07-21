// ============================================================================
// lib/content.ts — Centralized content for TerraForge company website
// All text, team data, services, jobs, and testimonials live here.
// Swap this content with real brand copy when ready.
// ============================================================================

// --- Types ---

export interface NavLink {
  label: string;
  href: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  passion: string;
  image: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface Service {
  title: string;
  description: string;
  details: string;
  icon: string; // emoji or icon name
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface JobPosting {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface Value {
  title: string;
  description: string;
  icon: string;
}

export interface Perk {
  title: string;
  description: string;
  icon: string;
}

// --- Site-wide ---

export const siteConfig = {
  name: "TerraForge",
  tagline: "Building a Greener Future",
  description:
    "TerraForge builds sustainable infrastructure and tools that empower businesses to reduce their environmental footprint without sacrificing growth.",
  url: "https://terraforge.earth",
  email: "hello@terraforge.earth",
  phone: "+1 (555) 234-5678",
  address: "2100 Green Valley Parkway, Suite 400, Portland, OR 97201",
  socials: {
    twitter: "https://twitter.com/terraforge",
    linkedin: "https://linkedin.com/company/terraforge",
    github: "https://github.com/terraforge",
    instagram: "https://instagram.com/terraforge",
  },
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Team", href: "/team" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

// --- Home Page ---

export const homeContent = {
  hero: {
    headline: "We don't just talk about sustainability.",
    headlineAccent: "We build it.",
    subtext:
      "TerraForge creates the infrastructure, tools, and partnerships that turn environmental ambition into measurable impact.",
    cta: { label: "See Our Work", href: "/services" },
    ctaSecondary: { label: "Join the Mission", href: "/careers" },
  },
  manifesto: {
    prelude: "What we believe",
    lines: [
      "The planet doesn't need another report.",
      "It needs engineers who ship.",
      "It needs designers who care.",
      "It needs companies brave enough to measure their impact —",
      "and honest enough to publish it.",
      "That's us. That's TerraForge.",
    ],
  },
  offerings: [
    {
      title: "Carbon Analytics",
      description:
        "Real-time emissions tracking across your entire supply chain. No guesswork, no greenwashing — just data.",
      icon: "📊",
    },
    {
      title: "Green Infrastructure",
      description:
        "We design and deploy energy-efficient systems that reduce operational costs and environmental impact simultaneously.",
      icon: "🏗️",
    },
    {
      title: "Sustainability Strategy",
      description:
        "Expert consultation to set achievable sustainability goals and build the roadmap to reach them.",
      icon: "🧭",
    },
  ],
  socialProof: {
    heading: "Trusted by companies that care",
    logos: [
      "EcoVentures",
      "GreenPath Co.",
      "Solara Energy",
      "CleanWave",
      "BioTech Labs",
      "Horizon Fund",
    ],
  },
  ctaFooter: {
    headline: "Ready to build something that matters?",
    subtext:
      "Let's talk about how TerraForge can help your organization make a real environmental impact.",
    cta: { label: "Get in Touch", href: "/contact" },
  },
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "TerraForge didn't just help us track our carbon footprint — they helped us cut it by 40% in the first year.",
    author: "Sarah Chen",
    role: "VP of Operations",
    company: "EcoVentures",
  },
  {
    quote:
      "Their approach is refreshingly honest. No buzzwords, no vague promises — just engineering that delivers results.",
    author: "Marcus Rivera",
    role: "CEO",
    company: "CleanWave",
  },
  {
    quote:
      "Working with TerraForge felt like gaining a sustainability team overnight. They understood our constraints and delivered beyond expectations.",
    author: "Aisha Patel",
    role: "Head of Sustainability",
    company: "Solara Energy",
  },
];

// --- About Page ---

export const aboutContent = {
  hero: {
    headline: "Our Story",
    subtext:
      "Founded on the belief that technology should serve the planet, not just profit.",
  },
  story: {
    paragraphs: [
      "TerraForge started in a garage in Portland in 2019 — not with a pitch deck, but with a question: Why is it so hard for companies to actually measure their environmental impact?",
      "Our founders, a climate scientist and a software engineer, realized that the tools companies needed to take meaningful climate action simply didn't exist. So they built them.",
      "Five years later, TerraForge has grown from two people with a laptop to a team of 40+ engineers, designers, and sustainability experts — all united by the same conviction: that honest data and good engineering can change the world.",
    ],
  },
  mission:
    "To make environmental accountability the default, not the exception, for every business on Earth.",
  vision:
    "A world where every company can measure, reduce, and report its environmental impact with the same ease as tracking revenue.",
};

export const milestones: Milestone[] = [
  {
    year: "2019",
    title: "The Garage Days",
    description:
      "Two founders, one laptop, and a mission to make sustainability measurable.",
  },
  {
    year: "2020",
    title: "First Customer",
    description:
      "EcoVentures became our first client, piloting our carbon analytics platform.",
  },
  {
    year: "2021",
    title: "Seed Funding",
    description:
      "Raised $3.2M from Horizon Fund to expand our engineering team.",
  },
  {
    year: "2022",
    title: "Platform Launch",
    description:
      "Launched TerraForge Platform v1 — real-time emissions tracking for supply chains.",
  },
  {
    year: "2023",
    title: "50 Clients",
    description:
      "Crossed 50 enterprise clients across energy, manufacturing, and logistics.",
  },
  {
    year: "2024",
    title: "Series A",
    description:
      "Raised $18M Series A. Expanded into green infrastructure consulting.",
  },
];

export const values: Value[] = [
  {
    title: "Radical Transparency",
    description:
      "We publish our own environmental impact data. If we ask clients to be honest, we go first.",
    icon: "🔍",
  },
  {
    title: "Engineering Over Marketing",
    description:
      "We'd rather build something that works than talk about something that sounds good.",
    icon: "⚙️",
  },
  {
    title: "Measurable Impact",
    description:
      "Every project has quantifiable environmental outcomes. If we can't measure it, we don't claim it.",
    icon: "📐",
  },
  {
    title: "Long-term Thinking",
    description:
      "We optimize for decades, not quarters. Sustainability isn't a sprint.",
    icon: "🌱",
  },
];

// --- Team Page ---

export const teamMembers: TeamMember[] = [
  {
    name: "Dr. Elena Vasquez",
    role: "Co-Founder & CEO",
    bio: "Climate scientist turned entrepreneur. 12 years of research at NOAA before founding TerraForge.",
    passion:
      "I got tired of writing papers nobody read. I wanted to build tools people actually use.",
    image: "/images/team/elena.jpg",
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    name: "James Okafor",
    role: "Co-Founder & CTO",
    bio: "Former senior engineer at Stripe. Obsessed with making complex systems simple and reliable.",
    passion:
      "The best technology disappears into the background. That's what we're building.",
    image: "/images/team/james.jpg",
    socials: { linkedin: "#", github: "#" },
  },
  {
    name: "Maya Singh",
    role: "Head of Design",
    bio: "Previously at IDEO. Believes that sustainable products should feel delightful, not punitive.",
    passion:
      "Sustainability shouldn't feel like a sacrifice. It should feel like an upgrade.",
    image: "/images/team/maya.jpg",
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Carlos Mendez",
    role: "VP of Engineering",
    bio: "10 years at Google Cloud. Specializes in real-time data pipelines and distributed systems.",
    passion:
      "I want my kids to inherit a planet that's better, not worse. This is my way of making that happen.",
    image: "/images/team/carlos.jpg",
    socials: { linkedin: "#", github: "#" },
  },
  {
    name: "Amara Osei",
    role: "Head of Sustainability",
    bio: "Environmental policy expert. Former advisor to the UN Environment Programme.",
    passion:
      "Policy sets direction, but technology is the engine. TerraForge is where those two worlds meet.",
    image: "/images/team/amara.jpg",
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Liam Chen",
    role: "Lead Data Scientist",
    bio: "PhD in environmental modeling from MIT. Turns messy emissions data into clear, actionable insights.",
    passion:
      "Data is only powerful if it's honest. We don't fudge the numbers — ever.",
    image: "/images/team/liam.jpg",
    socials: { linkedin: "#", github: "#" },
  },
];

// --- Services Page ---

export const services: Service[] = [
  {
    title: "Carbon Analytics Platform",
    description:
      "End-to-end emissions tracking across Scope 1, 2, and 3. Integrates with your existing ERP, supply chain, and operations data.",
    details:
      "Our platform ingests data from over 200 sources, normalizes it against GHG Protocol standards, and gives you real-time dashboards, automated reports, and anomaly alerts. No spreadsheets, no guesswork.",
    icon: "📊",
  },
  {
    title: "Green Infrastructure Design",
    description:
      "Energy-efficient architecture for data centers, offices, and manufacturing facilities.",
    details:
      "We design systems that reduce energy consumption by 30-60% through smart HVAC, renewable energy integration, and intelligent building management. ROI typically within 18 months.",
    icon: "🏗️",
  },
  {
    title: "Sustainability Strategy Consulting",
    description:
      "Science-based target setting, ESG reporting, and regulatory compliance roadmaps.",
    details:
      "Our team of climate scientists and policy experts helps you set ambitious but achievable goals aligned with SBTi, CDP, and GRI frameworks. We don't just write reports — we build implementation plans.",
    icon: "🧭",
  },
  {
    title: "Supply Chain Decarbonization",
    description:
      "Map, measure, and reduce emissions across your entire supply network.",
    details:
      "We work with your suppliers to collect primary data, identify hotspots, and implement reduction strategies. Our supplier engagement platform makes collaboration seamless.",
    icon: "🔗",
  },
  {
    title: "Environmental Data API",
    description:
      "Embed sustainability data into your own products and internal tools.",
    details:
      "RESTful and GraphQL APIs for emissions factors, climate risk data, and sustainability benchmarks. Built for developers, documented thoroughly, and backed by 99.9% SLA.",
    icon: "🔌",
  },
  {
    title: "Impact Reporting & Compliance",
    description:
      "Automated ESG and sustainability reports that meet regulatory requirements.",
    details:
      "Generate investor-ready reports for CDP, TCFD, CSRD, and SEC climate disclosures. Our reporting engine pulls directly from your analytics data — no manual data entry.",
    icon: "📋",
  },
];

// --- Careers Page ---

export const careersContent = {
  hero: {
    headline: "Work on problems that matter.",
    subtext:
      "We're building the tools that will define how businesses interact with the environment for the next century. Want in?",
  },
  culture: {
    headline: "Why TerraForge?",
    points: [
      "We ship fast, but we think long-term.",
      "We measure everything — including our own impact.",
      "We believe the best ideas come from diverse perspectives.",
      "We're remote-first, with quarterly team retreats in nature.",
    ],
  },
};

export const jobPostings: JobPosting[] = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    description:
      "Build and scale our carbon analytics platform. React, Node.js, PostgreSQL. Climate tech experience a plus but not required.",
  },
  {
    title: "Data Engineer",
    department: "Data",
    location: "Remote (US)",
    type: "Full-time",
    description:
      "Design and maintain data pipelines that process millions of emissions data points daily. Python, Spark, dbt.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Portland, OR / Remote",
    type: "Full-time",
    description:
      "Shape the user experience of sustainability tools used by Fortune 500 companies. Figma, user research, design systems.",
  },
  {
    title: "Sustainability Analyst",
    department: "Consulting",
    location: "Remote (Global)",
    type: "Full-time",
    description:
      "Help clients set and achieve science-based sustainability targets. Background in environmental science or climate policy.",
  },
  {
    title: "Developer Advocate",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    description:
      "Grow our developer community around the Environmental Data API. Technical writing, speaking, open source.",
  },
];

export const perks: Perk[] = [
  {
    title: "Remote-First",
    description: "Work from anywhere. We care about output, not office hours.",
    icon: "🌍",
  },
  {
    title: "Climate Leave",
    description:
      "5 paid days per year to volunteer for environmental causes of your choice.",
    icon: "🌿",
  },
  {
    title: "Learning Budget",
    description:
      "$2,000/year for courses, conferences, and books. Grow in any direction.",
    icon: "📚",
  },
  {
    title: "Nature Retreats",
    description:
      "Quarterly team retreats in national parks. Team-building, not team-draining.",
    icon: "🏕️",
  },
  {
    title: "Equity for All",
    description:
      "Every employee gets equity. We're building this together.",
    icon: "📈",
  },
  {
    title: "Carbon-Neutral Benefits",
    description:
      "We offset the carbon footprint of your commute, home office, and travel.",
    icon: "♻️",
  },
];
