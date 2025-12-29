import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jackson Giordano - Personal Website',
  description: 'I am a recent Computer Science graduate from Virginia Techs College of Engineering, and an incoming Associate Software Engineer at Proven AI. ',
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
