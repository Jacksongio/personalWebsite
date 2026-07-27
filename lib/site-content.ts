export const profile = {
  name: "Jackson Giordano",
  role: "Software Engineer",
  company: "Proven AI",
  location: "Washington, DC",
  email: "jackson@giordano.us",
  blurb:
    "Computer Science graduate from Virginia Tech's College of Engineering and a Junior Software Engineer at eve.ai. Currently pursuing an M.S. in Computer Science at the University of Tennessee with a focus in Software Engineering. Always learning and open to collaboration.",
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
    period: "2026 — Present",
    title: "Junior Software Engineer",
    org: "eve.ai",
    description:
      "Working in a client-facing AI engineering role supporting eve.ai through Proven AI. Fine-tuned models, implemented retrieval-augmented generation systems, and worked with vision-language models to deliver production solutions across diverse contracts.",
  },
  {
    period: "2025 — 2026",
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
]

export const projects = [
  {
    title: "ArcanAI",
    description:
      "A private, offline AI assistant for iOS that runs language models entirely on-device through Core ML. ArcanAI requires no account, works without an internet connection, and keeps every conversation encrypted and local.",
    href: "https://apps.apple.com/us/app/arcanai/id6768841547",
    tags: ["React Native", "Core ML", "iOS"],
    color: "violet",
  },
  {
    title: "StudiumVerbi",
    description:
      "A Catholic study companion for exploring Sacred Scripture, Sacred Tradition, and the teachings of the Magisterium, using retrieval-augmented generation over the Bible to provide grounded, context-rich guidance.",
    href: "https://studiumverbi.com",
    tags: ["Catholic", "RAG", "Scripture"],
    color: "cyan",
  },
  {
    title: "The Giordanos",
    description:
      "A polished wedding website combining complete RSVP management with interactive cocktail recommendations and a Spotify-powered song request experience for guests.",
    href: "https://thegiordanos.net",
    tags: ["Next.js", "RSVP", "Spotify"],
    color: "orange",
  },
  {
    title: "FogReport.io",
    description:
      "An AI-powered platform for modeling military conflicts, examining geopolitical scenarios, and producing strategic intelligence briefings grounded in a retrieval-augmented knowledge base.",
    href: "https://fogreport.io",
    tags: ["Next.js", "RAG", "LLM"],
    color: "lime",
  },
  {
    title: "miniZip",
    description:
      "A compact ZIP archiver written in C with zlib, built from the file format upward to handle compression, local headers, central directory records, and archive finalization.",
    href: "https://github.com/Jacksongio/miniZip",
    tags: ["C", "zlib"],
    color: "pink",
  },
  {
    title: "GioGPT",
    description:
      "An early personal AI assistant customized on my own dataset to deliver direct, context-aware responses with rich Markdown formatting and code generation.",
    href: "https://github.com/Jacksongio/GioGPT.git",
    tags: ["Archived", "OpenAI", "Next.js"],
    color: "blue",
  },
] as const

export const otherRepositories = [
  { name: "GioPrompt", href: "https://github.com/Jacksongio/GioPrompt" },
  { name: "Personal Website", href: "https://github.com/Jacksongio/personalWebsite" },
  { name: "Jackson Is Really Bored", href: "https://github.com/Jacksongio/jackson_is_bored" },
  { name: "Fantasy Football AI", href: "https://github.com/Jacksongio/fantasy_football_ai" },
  { name: "LLM Fact Maker", href: "https://github.com/Jacksongio/M4_llm_fact_maker" },
  { name: "Eliza Bot", href: "https://github.com/Jacksongio/eliza" },
  { name: "Macintosh Portfolio", href: "https://github.com/Jacksongio/jacksongio.com" },
  { name: "CryptoAnalyzer", href: "https://github.com/Jacksongio/CryptoAnalyzer" },
  { name: "Flappy Dad", href: "https://github.com/Jacksongio/flappyDad" },
  { name: "White Wine and Claret", href: "https://github.com/Jacksongio/whitewine-claret" },
  { name: "GioBlockchain", href: "https://github.com/Jacksongio/GioBlockchain" },
  { name: "GioWorkout", href: "https://github.com/Jacksongio/GioWorkout" },
  { name: "Giordano Family Website", href: "https://github.com/Jacksongio/giordano.us" },
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
