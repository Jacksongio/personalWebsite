import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-ink px-5 py-8 text-paper sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-5 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/40 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Jackson Giordano</p>
        <p className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-acid" />
          Designed and engineered with intent
        </p>
        <Link href="/privacy-policy" className="transition-colors hover:text-paper">
          ArcanAI privacy
        </Link>
      </div>
    </footer>
  )
}
