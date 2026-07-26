"use client"

import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

import { MagneticLink, SectionLabel } from "@/components/motion/primitives"
import { profile, socials } from "@/lib/site-content"

export function ContactSection() {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  })
  const rotate = useTransform(scrollYProgress, [0, 1], [-7, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.76, 1])
  const y = useTransform(scrollYProgress, [0, 1], [160, 0])

  return (
    <section
      id="contact"
      ref={ref}
      className="relative z-10 overflow-hidden bg-acid text-ink"
    >
      <div className="story-grid absolute inset-0 opacity-20" />
      <div className="relative mx-auto flex min-h-svh max-w-[1600px] flex-col px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <SectionLabel index="04" className="text-ink/55 [&>span:first-child]:border-ink/20 [&>span:first-child]:text-ink [&>span:last-child]:bg-ink/15">
          Start a conversation
        </SectionLabel>

        <motion.div
          style={reducedMotion ? undefined : { rotate, scale, y }}
          className="my-auto origin-bottom-left"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/55">
            Have an idea? A role? A hard problem?
          </p>
          <h2 className="mt-6 max-w-7xl font-display text-[clamp(4rem,13vw,13rem)] font-semibold leading-[0.72] tracking-[-0.09em]">
            LET&apos;S MAKE
            <span className="block pl-[8vw] text-transparent [-webkit-text-stroke:1.5px_#050507]">
              IT REAL.
            </span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 border-t border-ink/20 pt-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="max-w-xl text-sm leading-7 text-ink/65 sm:text-base">
              I&apos;m always interested in new opportunities and collaborations. The fastest way
              to reach me is email.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-5 inline-block font-display text-[clamp(1.45rem,3.5vw,3.5rem)] font-medium tracking-[-0.04em] underline decoration-1 underline-offset-8 transition-opacity hover:opacity-60"
            >
              {profile.email}
            </a>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            {socials.map((social) => (
              <MagneticLink
                key={social.label}
                href={social.href}
                external={social.href.startsWith("http")}
                className="border-ink/25 hover:border-ink hover:bg-ink hover:text-acid"
              >
                {social.label} <ArrowUpRight className="ml-2 h-4 w-4" />
              </MagneticLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
