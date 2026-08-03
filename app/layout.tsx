import type { Metadata, Viewport } from "next"
import { IBM_Plex_Mono, Manrope, Space_Grotesk } from "next/font/google"
import "./globals.css"
import "lenis/dist/lenis.css"
import { SmoothScroll } from "@/components/smooth-scroll"
import { profile, siteUrl } from "@/lib/site-content"

const siteTitle = "Jackson Giordano — Software Engineer & AI Builder"
const siteDescription =
  "Jackson Giordano is a software engineer in Washington, DC building AI products, RAG systems, and digital experiences. Virginia Tech CS graduate, M.S. Software Engineering candidate, and Junior Software Engineer at eve.ai. Explore work including ArcanAI, StudiumVerbi, FogReport, and more."

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s · Jackson Giordano",
  },
  description: siteDescription,
  applicationName: "Jackson Giordano",
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  keywords: [
    "Jackson Giordano",
    "software engineer",
    "AI engineer",
    "Washington DC",
    "RAG",
    "retrieval-augmented generation",
    "Next.js",
    "React Native",
    "Core ML",
    "ArcanAI",
    "StudiumVerbi",
    "FogReport",
    "eve.ai",
    "Virginia Tech",
    "University of Tennessee",
    "portfolio",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Jackson Giordano",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/profile.jpg",
        width: 800,
        height: 800,
        alt: "Portrait of Jackson Giordano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

/** Keep the designed 100% layout; don't let pinch-zoom stretch the composition. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Jackson Giordano",
      description: siteDescription,
      inLanguage: "en-US",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: profile.name,
      url: siteUrl,
      image: `${siteUrl}/profile.jpg`,
      jobTitle: profile.role,
      email: profile.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Washington",
        addressRegion: "DC",
        addressCountry: "US",
      },
      worksFor: {
        "@type": "Organization",
        name: "eve.ai",
      },
      alumniOf: [
        {
          "@type": "CollegeOrUniversity",
          name: "Virginia Polytechnic Institute and State University",
        },
        {
          "@type": "CollegeOrUniversity",
          name: "University of Tennessee",
        },
      ],
      sameAs: [profile.github, profile.linkedin],
      knowsAbout: [
        "Software engineering",
        "Artificial intelligence",
        "Retrieval-augmented generation",
        "Full-stack development",
        "React Native",
        "Next.js",
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${manrope.variable} ${spaceGrotesk.variable} ${plexMono.variable}`}
    >
      <body className="bg-ink font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
