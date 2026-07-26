"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

import { KineticHeading, SectionLabel } from "@/components/motion/primitives"
import { education, experience, type TimelineEntry } from "@/lib/site-content"

function StoryCard({
  entry,
  index,
  type,
}: {
  entry: TimelineEntry
  index: number
  type: "Experience" | "Education"
}) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 86%", "end 28%"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.72, 1], [0.2, 1, 1, 0.32])
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.8, 1], [0.94, 1, 1, 0.96])
  const x = useTransform(scrollYProgress, [0, 0.35], [48, 0])

  return (
    <motion.article
      ref={ref}
      style={reducedMotion ? undefined : { opacity, scale, x }}
      className="relative flex min-h-[58svh] flex-col justify-center border-t border-paper/15 py-16 first:border-t-0 lg:min-h-[72svh]"
    >
      <div className="mb-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em]">
        <span className={type === "Experience" ? "text-acid" : "text-cyan"}>{type}</span>
        <span className="text-paper/30">0{index + 1}</span>
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-paper/40">{entry.period}</p>
      <h3 className="mt-5 max-w-3xl font-display text-[clamp(2.5rem,5.3vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.055em]">
        {entry.title}
      </h3>
      <p className="mt-4 font-display text-xl text-electric sm:text-2xl">{entry.org}</p>
      <p className="mt-8 max-w-2xl text-sm leading-7 text-paper/55 sm:text-base">{entry.description}</p>
    </motion.article>
  )
}

export function ExperienceSection() {
  const entries = [
    ...experience.map((entry) => ({ entry, type: "Experience" as const })),
    ...education.map((entry) => ({ entry, type: "Education" as const })),
  ]

  return (
    <section id="experience" className="chapter-shell border-b border-paper/10">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24 lg:px-12">
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <SectionLabel index="02">Background / trajectory</SectionLabel>
          <KineticHeading>
            Built by doing.
          </KineticHeading>
          <p className="mt-9 max-w-md text-sm leading-7 text-paper/55 sm:text-base">
            A timeline across software engineering, AI, security operations, and the education
            that keeps the work moving forward.
          </p>
          <div className="mt-12 hidden items-center gap-4 font-mono text-[9px] uppercase tracking-[0.22em] text-paper/35 lg:flex">
            <span className="h-2 w-2 rounded-full bg-acid" />
            Scroll through the timeline
          </div>
        </div>

        <div>
          {entries.map(({ entry, type }, index) => (
            <StoryCard key={`${type}-${entry.title}`} entry={entry} type={type} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
