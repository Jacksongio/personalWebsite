"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

import { MagneticLink } from "@/components/motion/primitives"
import { useScrollStory } from "@/components/scroll/scroll-story"
import { profile } from "@/lib/site-content"

const CorridorScene = dynamic(() => import("@/components/hero/corridor-scene"), {
  ssr: false,
})

const TIERS = {
  mobile: { boxes: 48, dust: 220, mobile: true },
  low: { boxes: 100, dust: 700, mobile: false },
  full: { boxes: 170, dust: 1050, mobile: false },
} as const

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { chapter } = useScrollStory()
  const [tier, setTier] = useState<(typeof TIERS)[keyof typeof TIERS] | null>(null)
  const { scrollY } = useScroll()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -180])
  const titleScale = useTransform(scrollYProgress, [0, 0.75], [1, 0.82])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.68], [1, 0])
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 240])
  const edgeOpacity = useTransform(scrollYProgress, [0.55, 1], [1, 0])

  useEffect(() => {
    if (reducedMotion) return
    const cores = navigator.hardwareConcurrency ?? 4
    const narrow = window.matchMedia("(max-width: 768px)").matches
    setTier(narrow ? TIERS.mobile : cores <= 4 ? TIERS.low : TIERS.full)
  }, [reducedMotion])

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-y-0 left-0 z-0 w-screen overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(94,231,247,.07),transparent_32%),radial-gradient(circle_at_82%_24%,rgba(139,92,246,.1),transparent_38%),radial-gradient(circle_at_54%_88%,rgba(199,255,94,.04),transparent_36%),#050507]" />
        {tier && (
          <CorridorScene
            scrollY={scrollY}
            storyProgress={chapter}
            boxCount={tier.boxes}
            dustCount={tier.dust}
            mobile={tier.mobile}
          />
        )}
        <div className="corridor-scrim absolute inset-0" />
        <div className="story-grid absolute inset-0 opacity-30" />
        <div className="noise absolute inset-0 opacity-[0.035] mix-blend-soft-light" />
      </div>

      <section
        id="about"
        ref={sectionRef}
        className="relative z-10 min-h-[125svh] border-b border-paper/10"
      >
        <div className="sticky top-0 flex min-h-svh flex-col overflow-hidden px-5 pb-8 pt-24 sm:px-8 lg:px-12">
          <motion.div
            style={reducedMotion ? undefined : { opacity: edgeOpacity }}
            className="flex items-start justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-paper/50 sm:text-[10px]"
          >
            <p>
              Portfolio / 2026
              <br />
              {profile.location}
            </p>
            <p className="flex items-center gap-2 text-right">
              <span className="h-2 w-2 animate-pulse rounded-full bg-acid" />
              Open to collaboration
            </p>
          </motion.div>

          <motion.div
            style={reducedMotion ? undefined : { y: titleY, scale: titleScale, opacity: titleOpacity }}
            className="my-auto origin-center py-12"
          >
            <p className="mb-3 ml-[1vw] font-mono text-[10px] uppercase tracking-[0.32em] text-acid">
              Software engineer / AI engineer
            </p>
            <h1 className="font-display text-[clamp(4.2rem,14.4vw,13.5rem)] font-medium leading-[0.72] tracking-[-0.09em] text-paper">
              <span className="block">JACKSON</span>
              <span className="ml-[7vw] block">
                GI<span className="outline-text">OR</span>DANO
              </span>
            </h1>
          </motion.div>

          <div className="grid items-end gap-8 lg:grid-cols-[1fr_minmax(280px,440px)_1fr]">
            <motion.div
              style={reducedMotion ? undefined : { y: portraitY }}
              className="hidden items-end gap-4 lg:flex"
            >
              <div className="relative h-24 w-20 overflow-hidden rounded-[2rem_2rem_.5rem_.5rem] border border-paper/20">
                <Image src="/profile.jpg" alt="" fill sizes="80px" className="object-cover" priority />
              </div>
              <p className="max-w-[12rem] font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-paper/40">
                Building systems where product thinking meets precise engineering.
              </p>
            </motion.div>

            <p className="text-balance text-sm leading-relaxed text-paper/60 sm:text-base">
              {profile.blurb}
            </p>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <MagneticLink href="#projects">
                Selected work <ArrowDownRight className="ml-2 h-4 w-4" />
              </MagneticLink>
              <MagneticLink href={profile.resume} external className="bg-paper text-ink hover:bg-acid">
                Résumé <ArrowUpRight className="ml-2 h-4 w-4" />
              </MagneticLink>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
