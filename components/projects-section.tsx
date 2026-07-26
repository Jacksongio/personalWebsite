"use client"

import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

import { KineticHeading, SectionLabel } from "@/components/motion/primitives"
import { projects } from "@/lib/site-content"

const ACCENTS: Record<string, string> = {
  lime: "bg-acid text-ink",
  violet: "bg-electric text-paper",
  cyan: "bg-cyan text-ink",
  orange: "bg-orange-400 text-ink",
  pink: "bg-pink-400 text-ink",
  blue: "bg-blue-500 text-paper",
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex min-h-[62svh] w-full shrink-0 flex-col overflow-hidden border border-paper/15 bg-ink/75 p-6 backdrop-blur-xl transition-colors hover:bg-paper/[0.06] sm:p-9 lg:h-[68svh] lg:w-[72vw] lg:max-w-[1100px] lg:p-12"
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper/35">
          Project / 0{index + 1}
        </span>
        <span
          className={`grid h-12 w-12 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45 ${ACCENTS[project.color]}`}
        >
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-auto">
        <h3 className="font-display text-[clamp(3.2rem,7vw,7.5rem)] font-medium leading-[0.82] tracking-[-0.075em]">
          {project.title}
        </h3>
        <div className="mt-8 grid gap-7 border-t border-paper/15 pt-6 sm:grid-cols-[1fr_auto]">
          <p className="max-w-xl text-sm leading-7 text-paper/55">{project.description}</p>
          <div className="flex flex-wrap content-start gap-2 sm:max-w-[260px] sm:justify-end">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-paper/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-paper/55"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <span
        aria-hidden="true"
        className={`absolute -bottom-24 -right-16 h-64 w-64 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-20 ${ACCENTS[project.color]}`}
      />
    </a>
  )
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })
  const x = useTransform(scrollYProgress, [0.08, 0.94], ["0vw", "-365vw"])
  const progress = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"])

  return (
    <section id="projects" ref={sectionRef} className="chapter-shell border-b border-paper/10 lg:h-[520vh]">
      <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 sm:py-32 lg:hidden">
        <SectionLabel index="03">Selected work</SectionLabel>
        <KineticHeading>Ideas in motion.</KineticHeading>
        <div className="mt-14 grid gap-5">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>

      <div className="sticky top-0 hidden h-svh overflow-hidden lg:flex lg:flex-col lg:py-10">
        <div className="flex items-end justify-between px-12">
          <div>
            <SectionLabel index="03" className="mb-4">Selected work</SectionLabel>
            <KineticHeading className="text-[clamp(3rem,6vw,6.5rem)]">Ideas in motion.</KineticHeading>
          </div>
          <p className="mb-2 max-w-xs text-right text-sm leading-6 text-paper/45">
            A selection of deployed products, experiments, and systems. Scroll to move sideways.
          </p>
        </div>

        <motion.div
          style={reducedMotion ? undefined : { x }}
          className="mt-10 flex flex-1 items-stretch gap-6 pl-12"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
          <div className="w-[18vw] shrink-0" />
        </motion.div>

        <div className="mx-12 mt-6 h-px bg-paper/10">
          <motion.div style={{ width: progress }} className="h-full bg-acid" />
        </div>
      </div>
    </section>
  )
}
