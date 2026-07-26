import type { Metadata } from "next"
import { IBM_Plex_Mono, Manrope, Space_Grotesk } from "next/font/google"
import "./globals.css"
import "lenis/dist/lenis.css"
import { SmoothScroll } from "@/components/smooth-scroll"

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
  title: "Jackson Giordano — Software Engineer",
  description:
    "Software engineer building thoughtful AI products, systems, and digital experiences.",
  metadataBase: new URL("https://giordano.us"),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
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
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
