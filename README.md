# Jackson Giordano Portfolio

An experimental, scroll-driven portfolio built with Next.js, React, TypeScript, and WebGL.

The site presents my software and AI engineering experience through an interactive visual story. It includes a responsive WebGL corridor, animated statistics, a sticky career timeline, a horizontal project showcase, an expanded GitHub archive, and a Formspree contact experience.

## Design Direction

Version 2 was redesigned around the visual language of modern creative-developer portfolios:

- Oversized editorial typography
- Asymmetric layouts and visible grid systems
- Scroll-linked storytelling instead of isolated entrance animations
- High-contrast neutral surfaces with acid green, cyan, and violet accents
- Small monospace labels inspired by technical interfaces
- Subtle film grain, depth, and responsive WebGL motion

The initial research included interaction patterns from React Bits, Aceternity UI, contemporary agency sites, and award-focused developer portfolios. These were used as references rather than imported templates. The layout, animation system, WebGL corridor, visual identity, and reusable components were implemented specifically for this site.

## Features

- Scroll-reactive WebGL box corridor and star field
- Device-aware rendering with reduced mobile particle counts
- Full `prefers-reduced-motion` support
- Lenis smooth scrolling synchronized with Motion
- Animated statistics and career timeline
- Pinned horizontal project gallery on desktop
- Responsive vertical project layout on mobile
- Full-screen GitHub repository archive
- Accessible keyboard navigation and focus states
- Server-side Formspree proxy with validation and honeypot protection
- Responsive ArcanAI privacy policy

## Technology

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Motion
- GSAP
- Lenis
- React Three Fiber
- Three.js and custom GLSL shaders
- Formspree

## Local Development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and add your Formspree endpoint:

```env
FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

The endpoint remains server-side and is forwarded through `/api/contact`.

## Production

Before deployment:

1. Add `FORMSPREE_ENDPOINT` to the hosting provider.
2. Enable Formspree domain restrictions, spam filtering, and reCAPTCHA.
3. Run the production build:

```bash
pnpm build
```

The project is configured for deployment on Vercel.