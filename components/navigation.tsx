"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react"

import { navItems } from "@/lib/site-content"

export function Navigation() {
  const { scrollY, scrollYProgress } = useScroll()
  const reducedMotion = useReducedMotion()
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState("about")
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.3 })

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (reducedMotion) return
    const previous = scrollY.getPrevious() ?? 0
    setHidden(latest > previous && latest > window.innerHeight * 0.7)
  })

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((item): item is HTMLElement => item !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: "-30% 0px -55%", threshold: [0, 0.1, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-acid"
      />

      <motion.nav
        aria-label="Primary navigation"
        animate={{ y: hidden ? "-140%" : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-[60] px-4 pt-4 sm:px-6"
      >
        <div className="mx-auto flex h-12 max-w-[1500px] items-center justify-between rounded-full border border-paper/15 bg-ink/70 px-3 backdrop-blur-xl sm:px-4">
          <Link
            href="#about"
            className="flex items-center gap-3 rounded-full py-1 pr-3 font-display text-sm font-medium"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-acid font-mono text-[9px] font-medium text-ink">
              JG
            </span>
            <span className="hidden sm:inline">Jackson Giordano</span>
          </Link>

          <div className="hidden items-center md:flex">
            {navItems.map((item, index) => {
              const id = item.href.slice(1)
              const selected = id === active
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={selected ? "location" : undefined}
                  className={`relative rounded-full px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] transition-colors ${
                    selected ? "text-ink" : "text-paper/50 hover:text-paper"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="active-nav"
                      className="absolute inset-0 -z-10 rounded-full bg-acid"
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className="mr-2 opacity-50">0{index + 1}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>

          <Link
            href="#contact"
            className="rounded-full border border-paper/20 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            Let&apos;s talk
          </Link>
        </div>
      </motion.nav>
    </>
  )
}
