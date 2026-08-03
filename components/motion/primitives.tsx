"use client"

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"

/** Shared easing — the same curve the hero uses, so the whole page feels of a piece. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/**
 * Fade-and-rise on scroll into view. Honors prefers-reduced-motion by rendering
 * the final state immediately.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Section heading whose words rise out of a mask when it scrolls into view.
 *
 * Triggered by Motion's useInView rather than GSAP ScrollTrigger — that keeps
 * GSAP out of the scroll loop entirely, so there's nothing to sync with Lenis.
 */
export function SplitHeading({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !inView || prefersReducedMotion) return

    gsap.registerPlugin(SplitText)

    let split: SplitText | undefined
    let tween: gsap.core.Tween | undefined
    let cancelled = false

    document.fonts.ready.then(() => {
      if (cancelled || !ref.current) return
      split = SplitText.create(ref.current, { type: "words", mask: "words" })
      tween = gsap.from(split.words, {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.07,
      })
    })

    return () => {
      cancelled = true
      tween?.kill()
      split?.revert()
    }
  }, [inView, prefersReducedMotion])

  return (
    <h2
      ref={ref}
      className={cn(
        "heading-legible text-balance bg-gradient-to-br from-white via-white to-white/50 bg-clip-text text-4xl font-light tracking-tight text-transparent sm:text-5xl",
        className,
      )}
    >
      {children}
    </h2>
  )
}

/** Small uppercase label that sits above a section heading. */
export function Eyebrow({ index, children }: { index: string; children: ReactNode }) {
  return (
    <Reveal>
      <p className="text-legible mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/45">
        <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text font-medium text-transparent">
          {index}
        </span>
        <span className="h-px w-8 bg-white/15" />
        {children}
      </p>
    </Reveal>
  )
}

/**
 * Card with a violet spotlight that tracks the cursor. The gradient position is
 * written to motion values, so tracking never triggers a React re-render.
 */
export function SpotlightCard({
  children,
  className,
  as = "div",
  href,
  target,
  rel,
}: {
  children: ReactNode
  className?: string
  as?: "div" | "a"
  href?: string
  target?: string
  rel?: string
}) {
  const mouseX = useMotionValue(-500)
  const mouseY = useMotionValue(-500)

  const background = useMotionTemplate`radial-gradient(340px circle at ${mouseX}px ${mouseY}px, rgba(139,92,246,0.16), transparent 72%)`

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    mouseX.set(event.clientX - bounds.left)
    mouseY.set(event.clientY - bounds.top)
  }

  function handleMouseLeave() {
    mouseX.set(-500)
    mouseY.set(-500)
  }

  // There is no page background behind these, so the card is what makes its own
  // text readable: a dark translucent panel plus a blur that smears the live
  // particles behind it into a soft glow rather than sharp moving dots.
  const shellClassName = cn(
    "group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#05050a]/60 backdrop-blur-xl transition-colors duration-500 hover:border-white/20 hover:bg-[#05050a]/50",
    className,
  )

  const inner = (
    <>
      <motion.div
        aria-hidden="true"
        style={{ background }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {/* flex-1/h-full so callers can build equal-height cards with a pinned footer */}
      <div className="relative flex h-full flex-1 flex-col">{children}</div>
    </>
  )

  if (as === "a") {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={shellClassName}
      >
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={shellClassName}
    >
      {inner}
    </motion.div>
  )
}

/** Number that counts up when it scrolls into view. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-20% 0px" })
  const prefersReducedMotion = useReducedMotion()

  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion) {
      count.set(value)
      return
    }
    const controls = animate(count, value, { duration: 1.6, ease: "easeOut" })
    return () => controls.stop()
  }, [inView, value, count, prefersReducedMotion])

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
    </span>
  )
}

/** Full-width hairline used to separate sections. */
export function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
    />
  )
}

export function ScrubbedReveal({
  children,
  className,
  distance = 80,
}: {
  children: ReactNode
  className?: string
  distance?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 48%"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [distance, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.55, 1], [0, 0.5, 1])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reducedMotion ? undefined : { y, opacity }}
    >
      {children}
    </motion.div>
  )
}

export function KineticHeading({
  children,
  className,
  immediate = false,
}: {
  children: string
  className?: string
  /** Animate on mount instead of while-in-view (needed for sticky top headers). */
  immediate?: boolean
}) {
  const reducedMotion = useReducedMotion()

  return (
    <h2
      className={cn(
        "font-display text-[clamp(3.2rem,9vw,8.5rem)] font-medium leading-[0.82] tracking-[-0.075em] text-paper",
        className,
      )}
      aria-label={children}
    >
      {children.trim().split(/\s+/).map((word, index) => (
        // Padding gives the reveal mask room for descenders and the final
        // glyph, which the negative tracking would otherwise crop.
        <span
          key={`${word}-${index}`}
          className="mr-[0.06em] -mb-[0.14em] inline-block overflow-hidden pb-[0.22em] pr-[0.12em] pt-[0.08em]"
        >
          <motion.span
            aria-hidden="true"
            className="inline-block"
            initial={reducedMotion ? false : { y: "115%", rotate: 3 }}
            {...(immediate || reducedMotion
              ? { animate: { y: 0, rotate: 0 } }
              : {
                  whileInView: { y: 0, rotate: 0 },
                  viewport: { once: true, margin: "-12%" },
                })}
            transition={{ duration: 0.9, delay: index * 0.055, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h2>
  )
}

export function SectionLabel({
  index,
  children,
  className,
}: {
  index: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-8 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/45",
        className,
      )}
    >
      <span className="grid h-8 w-8 place-items-center rounded-full border border-paper/15 text-acid">
        {index}
      </span>
      <span>{children}</span>
      <span className="h-px flex-1 bg-paper/10" />
    </div>
  )
}

export function MagneticLink({
  children,
  href,
  className,
  external,
}: {
  children: ReactNode
  href: string
  className?: string
  external?: boolean
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 22 })
  const springY = useSpring(y, { stiffness: 260, damping: 22 })
  const reducedMotion = useReducedMotion()

  function handleMove(event: MouseEvent<HTMLAnchorElement>) {
    if (reducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * 0.16)
    y.set((event.clientY - rect.top - rect.height / 2) * 0.16)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={reducedMotion ? undefined : { x: springX, y: springY }}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-paper/20 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:border-acid hover:bg-acid hover:text-ink",
        className,
      )}
    >
      {children}
    </motion.a>
  )
}
