"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

import { CountUp, SectionLabel } from "@/components/motion/primitives"
import { stats } from "@/lib/site-content"

const TICKER = "BUILD / LEARN / SHIP / QUESTION / REPEAT / "

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-10%"])
  const reverseX = useTransform(scrollYProgress, [0, 1], ["-11%", "7%"])

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="chapter-shell overflow-hidden border-b border-paper/10 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <SectionLabel index="01">At a glance</SectionLabel>
        <div className="grid border-l border-t border-paper/15 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={reducedMotion ? false : { opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative min-h-52 overflow-hidden border-b border-r border-paper/15 p-6 sm:min-h-64 sm:p-8"
            >
              <span className="font-mono text-[10px] text-paper/30">0{index + 1}</span>
              <p className="mt-7 font-display text-[clamp(4.8rem,8vw,8.5rem)] font-medium leading-none tracking-[-0.08em]">
                <CountUp value={stat.value} />
                <span className="text-acid">{stat.suffix}</span>
              </p>
              <p className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/45 sm:bottom-8 sm:left-8">
                {stat.label}
              </p>
              <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-acid transition-transform duration-500 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-20 rotate-[-2deg] border-y border-paper/15 bg-acid py-3 text-ink">
        <motion.div
          style={reducedMotion ? undefined : { x }}
          className="w-max whitespace-nowrap font-display text-3xl font-semibold uppercase tracking-[-0.04em] sm:text-5xl"
        >
          {TICKER.repeat(4)}
        </motion.div>
      </div>
      <div className="-mt-1 rotate-[1deg] border-y border-paper/15 bg-electric py-2 text-paper">
        <motion.div
          style={reducedMotion ? undefined : { x: reverseX }}
          className="w-max whitespace-nowrap font-mono text-xs uppercase tracking-[0.28em] sm:text-sm"
        >
          {"SOFTWARE / AI / SYSTEMS / CREATIVE CODE / ".repeat(5)}
        </motion.div>
      </div>
    </section>
  )
}
