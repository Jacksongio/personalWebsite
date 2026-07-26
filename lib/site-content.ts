export const profile = {
  name: "Jackson Giordano",
  role: "Software Engineer",
  company: "Proven AI",
  location: "Reston, Virginia",
  email: "jackson@giordano.us",
  blurb:
    "Computer Science graduate from Virginia Tech's College of Engineering and an Associate Software Engineer at Proven AI. Currently pursuing an M.S. in Computer Science at the University of Tennessee with a focus in Software Engineering — always learning, always up for a collaboration.",
  resume: "/resume.pdf",
  github: "https://github.com/jacksongio",
  linkedin: "https://www.linkedin.com/in/jacksongio",
} as const

export const stats = [
  { value: 7, suffix: "+", label: "Projects deployed" },
  { value: 32, suffix: "", label: "GitHub repositories" },
  { value: 12, suffix: "", label: "Years programming" },
  { value: 5, suffix: "", label: "Computers built" },
] as const

export type TimelineEntry = {
  period: string
  title: string
  org: string
  description: string
}

export const education: TimelineEntry[] = [
  {
    period: "2025 — 2026",
    title: "M.S. Software Engineering",
    org: "University of Tennessee",
    description:
      "Pursuing a Master of Science in Computer Science with a focus in Software Engineering, extending my knowledge and sharpening my skills in an ever-changing field.",
  },
  {
    period: "2025",
    title: "AI Engineering Bootcamp",
    org: "AI Makerspace",
    description:
      "Covered the fundamentals of AI, RAG applications, and applying agentic AI across multiple use cases within a deployed application.",
  },
  {
    period: "2021 — 2025",
    title: "B.S. Computer Science",
    org: "Virginia Polytechnic Institute",
    description:
      "Graduated from Virginia Tech's College of Engineering with a Bachelor of Science in Computer Science, building a foundation across both software and hardware.",
  },
]

export const experience: TimelineEntry[] = [
  {
    period: "2025 — Present",
    title: "Associate Software Engineer",
    org: "Proven AI",
    description:
      "Developing and maintaining the company's software products across a variety of projects — company websites, internal tooling, and customer-facing applications.",
  },
  {
    period: "2024 — 2025",
    title: "Cyber Operations Intern",
    org: "American Systems",
    description:
      "Performed IT security operations including incident response, security tool management, log analysis, and capability development in a dynamic enterprise environment.",
  },
  {
    period: "2022 — 2024",
    title: "Assistant Facilities Manager",
    org: "Revolution Sportsplex",
    description:
      "Maintained turf fields to pristine condition while handling staffing, equipment purchasing, and lighting schedules across the facility.",
  },
]

export const projects = [
  {
    title: "FogReport.io",
    description:
      "A web application for simulating military conflict scenarios, analyzing international warfare, and generating AI-powered strategic intelligence briefings with advanced RAG capabilities.",
    href: "https://fogreport.io",
    tags: ["Next.js", "RAG", "LLM"],
    color: "lime",
  },
  {
    title: "ArcanAI",
    description:
      "A private, offline LLM for iOS. Runs Ollama models on-device via Core ML — no sign-in, no internet after download, no tracking. Encrypted and local-only.",
    href: "https://github.com/Jacksongio/arcan_ai.git",
    tags: ["Swift", "Core ML", "iOS"],
    color: "violet",
  },
  {
    title: "GioBlockchain",
    description:
      "A Python blockchain implementation demonstrating block hashing and chain validation, with smart contracts, transaction validation, and decentralized networking.",
    href: "https://github.com/jacksongio/GioBlockchain",
    tags: ["Python", "Cryptography"],
    color: "cyan",
  },
  {
    title: "CryptoAnalyzer",
    description:
      "A C application that parses and analyzes historical cryptocurrency data, calculating price statistics over time to surface market trends.",
    href: "https://github.com/jacksongio/CryptoAnalyzer",
    tags: ["C", "Data Analysis"],
    color: "orange",
  },
  {
    title: "miniZip",
    description:
      "A minimal C ZIP archiver powered by zlib, reverse-engineered from WinZip's compression logic and assembled from the file format upward.",
    href: "https://github.com/jacksongio/GioWorkout",
    tags: ["C", "zlib"],
    color: "pink",
  },
  {
    title: "GioGPT",
    description:
      "A personal chatbot trained on my own dataset for sharp, direct responses using GPT-4o, with rich Markdown and code output.",
    href: "https://github.com/Jacksongio/GioGPT.git",
    tags: ["OpenAI", "Next.js"],
    color: "blue",
  },
] as const

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const

export const socials = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
] as const
