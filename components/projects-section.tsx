"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import { useLenis } from "lenis/react"
import { ArrowRight, ArrowUpRight, Github, X } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"

import { KineticHeading, SectionLabel } from "@/components/motion/primitives"
import { otherRepositories, projects } from "@/lib/site-content"

const ACCENTS: Record<string, string> = {
  lime: "bg-acid text-ink",
  violet: "bg-electric text-paper",
  cyan: "bg-cyan text-ink",
  orange: "bg-orange-400 text-ink",
  pink: "bg-pink-400 text-ink",
  blue: "bg-blue-500 text-paper",
}

function projectHost(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "")
  } catch {
    return href
  }
}

function WebsiteDemo({ src, href, title }: { src: string; href: string; title: string }) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-paper/15 bg-ink/80 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="flex shrink-0 items-center gap-3 border-b border-paper/10 px-3 py-2.5 short:py-1.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-paper/25" />
          <span className="h-2 w-2 rounded-full bg-paper/25" />
          <span className="h-2 w-2 rounded-full bg-paper/25" />
        </div>
        <div className="min-w-0 flex-1 truncate rounded-full bg-paper/[0.06] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/40">
          {projectHost(href)}
        </div>
      </div>
      {/* Wide stacked frame can crop to fill; the narrower side-by-side frame
          at short heights fits the whole screenshot instead. */}
      <div className="relative min-h-[240px] w-full flex-1 overflow-hidden bg-ink sm:min-h-[300px] lg:min-h-0">
        <Image
          src={src}
          alt={`${title} website demo`}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-top hshort:object-contain"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/50 to-transparent hshort:hidden"
        />
      </div>
    </div>
  )
}

function CardCopy({ project }: { project: (typeof projects)[number] }) {
  return (
    <>
      <h3 className="font-display text-[clamp(1.75rem,3.8vw,3.6rem)] font-medium leading-[0.84] tracking-[-0.07em] hshort:text-[clamp(1.75rem,3vw,3.1rem)] short:text-[1.7rem]">
        {project.title}
      </h3>
      <div className="mt-5 grid gap-7 border-t border-paper/15 pt-5 sm:grid-cols-[1fr_auto] hshort:grid-cols-1 hshort:gap-5 short:mt-3 short:gap-4 short:pt-3">
        <p className="max-w-xl text-sm leading-7 text-paper/55 short:text-[0.8rem] short:leading-[1.5]">
          {project.description}
        </p>
        <div className="flex flex-wrap content-start gap-2 sm:max-w-[260px] sm:justify-end hshort:max-w-none hshort:justify-start">
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
    </>
  )
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const image = "image" in project ? project.image : undefined

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex min-h-[62svh] w-full shrink-0 flex-col overflow-hidden border border-paper/15 bg-ink/75 p-6 backdrop-blur-xl transition-colors hover:bg-paper/[0.06] sm:p-9 lg:h-full lg:min-h-0 lg:w-[72vw] lg:max-w-[1100px] lg:p-12 short:p-6 shorter:p-4"
    >
      <div className="flex shrink-0 items-start justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper/35">
          Project / 0{index + 1}
        </span>
        <span
          className={`grid h-12 w-12 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45 short:h-9 short:w-9 shorter:h-8 shorter:w-8 ${ACCENTS[project.color]}`}
        >
          <ArrowUpRight className="h-5 w-5 short:h-4 short:w-4" />
        </span>
      </div>

      {image ? (
        // Tall viewports stack the demo above the copy. Short ones put the copy
        // beside it, where the frame can use the card's full height and still
        // show the whole screenshot.
        <div className="mt-6 flex min-h-0 flex-1 flex-col gap-7 hshort:flex-row hshort:items-stretch hshort:gap-10 short:mt-4">
          <div className="order-2 flex shrink-0 flex-col justify-center hshort:order-1 hshort:w-[38%]">
            <CardCopy project={project} />
          </div>
          <div className="order-1 min-h-0 w-full flex-1 hshort:order-2 hshort:h-full">
            <WebsiteDemo src={image} href={project.href} title={project.title} />
          </div>
        </div>
      ) : (
        <div className="mt-auto shrink-0 pt-6">
          <h3 className="font-display text-[clamp(3.2rem,7vw,7.5rem)] font-medium leading-[0.82] tracking-[-0.075em] short:text-[3rem] shorter:text-[2.4rem]">
            {project.title}
          </h3>
          <div className="mt-6 grid gap-7 border-t border-paper/15 pt-5 sm:mt-8 sm:grid-cols-[1fr_auto] sm:pt-6 short:gap-4">
            <p className="max-w-xl text-sm leading-7 text-paper/55 short:text-[0.8rem] short:leading-[1.5]">
              {project.description}
            </p>
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
      )}

      <span
        aria-hidden="true"
        className={`absolute -bottom-24 -right-16 h-64 w-64 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-20 ${ACCENTS[project.color]}`}
      />
    </a>
  )
}

function MoreProjectsButton({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-3 rounded-full border border-paper/20 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/60 transition-colors hover:border-acid hover:bg-acid hover:text-ink ${className}`}
    >
      More projects
      <span className="grid h-6 w-6 place-items-center rounded-full border border-current/25">
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  )
}

function RepositoryOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()
  const lenis = useLenis()

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    // Pause page smooth-scroll only while this white overlay is open so its
    // own overflow can receive the wheel. Main projects scrolling is untouched.
    lenis?.stop()
    document.documentElement.dataset.repositoryOverlay = "open"
    window.dispatchEvent(new CustomEvent("repository-overlay", { detail: { open: true } }))
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      lenis?.start()
      delete document.documentElement.dataset.repositoryOverlay
      window.dispatchEvent(new CustomEvent("repository-overlay", { detail: { open: false } }))
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, onClose, lenis])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="repository-title"
          data-lenis-prevent
          initial={reducedMotion ? { opacity: 0 } : { clipPath: "circle(0% at 88% 12%)" }}
          animate={reducedMotion ? { opacity: 1 } : { clipPath: "circle(150% at 88% 12%)" }}
          exit={reducedMotion ? { opacity: 0 } : { clipPath: "circle(0% at 88% 12%)" }}
          transition={{ duration: reducedMotion ? 0.15 : 0.85, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-paper text-ink"
        >
          <div className="story-grid pointer-events-none fixed inset-0 opacity-25" />
          <div className="relative mx-auto min-h-full max-w-[1600px] px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
            <div className="flex items-center justify-between border-b border-ink/15 pb-5">
              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.22em] text-ink/50">
                <Github className="h-4 w-4" />
                GitHub archive / {otherRepositories.length} repositories
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close repository archive"
                className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-paper"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-10 py-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
              <div className="lg:sticky lg:top-10 lg:h-fit">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/45">
                  Experiments, tools, and earlier work
                </p>
                <h2
                  id="repository-title"
                  className="mt-5 font-display text-[clamp(3.8rem,8vw,8rem)] font-semibold leading-[0.78] tracking-[-0.08em]"
                >
                  MORE
                  <span className="block text-transparent [-webkit-text-stroke:1.5px_#050507]">
                    PROJECTS.
                  </span>
                </h2>
                <p className="mt-8 max-w-sm text-sm leading-7 text-ink/55">
                  A broader archive of repositories, side projects, experiments, and ideas from
                  across the years.
                </p>
              </div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.045, delayChildren: 0.2 } },
                }}
                className="border-t border-ink/20"
              >
                {otherRepositories.map((repository, index) => (
                  <motion.a
                    key={repository.href}
                    href={repository.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={{
                      hidden: { opacity: 0, x: 30 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="group grid grid-cols-[2.5rem_1fr_auto] items-center border-b border-ink/20 py-4 sm:grid-cols-[4rem_1fr_auto] sm:py-5"
                  >
                    <span className="font-mono text-[9px] text-ink/35">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-xl font-medium tracking-[-0.035em] transition-transform duration-300 group-hover:translate-x-2 sm:text-3xl">
                      {repository.name}
                    </span>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-ink/20 transition-colors group-hover:bg-ink group-hover:text-acid">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [showRepositories, setShowRepositories] = useState(false)
  const [travel, setTravel] = useState<number | null>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })
  // End translation is measured so the track stops on GioGPT (last card),
  // instead of overshooting with a hard-coded vw distance.
  const x = useTransform(scrollYProgress, [0.08, 0.92], [0, -(travel ?? 0)])
  const progress = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      const viewport = track.parentElement
      if (!viewport) return
      // Leave a small right pad so the last card isn't flush against the edge.
      const pad = 48
      setTravel(Math.max(0, track.scrollWidth + pad - viewport.clientWidth))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  return (
    <>
      <section
        id="projects"
        ref={sectionRef}
        className="chapter-shell border-b border-paper/10 lg:h-[calc(100svh+var(--projects-scroll,350vh))]"
        style={
          // Stick for one viewport, then spend scroll proportional to the
          // measured sideways distance. Deriving it in pixels keeps the scroll
          // speed identical under OS display scaling, where a vh-based budget
          // would drift against the px-capped card widths.
          travel === null
            ? undefined
            : ({ "--projects-scroll": `${Math.round(travel * 0.9)}px` } as CSSProperties)
        }
      >
        <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 sm:py-32 lg:hidden">
          <SectionLabel index="03">Selected work</SectionLabel>
          <KineticHeading immediate>Projects</KineticHeading>
          <div className="mt-14 grid gap-5">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
          <div className="mt-7 flex justify-center">
            <MoreProjectsButton onClick={() => setShowRepositories(true)} />
          </div>
        </div>

        <div className="sticky top-0 hidden h-svh lg:flex lg:flex-col lg:py-10 short:py-5 shorter:py-4">
          <div className="flex shrink-0 items-end justify-between px-12">
            <div>
              <SectionLabel index="03" className="mb-4 short:mb-2">
                Selected work
              </SectionLabel>
              <KineticHeading
                immediate
                className="text-[clamp(3rem,6vw,6.5rem)] short:text-[2.6rem] shorter:text-[2rem]"
              >
                Projects
              </KineticHeading>
            </div>
            <div className="mb-2 flex max-w-xs flex-col items-end gap-4 text-right short:gap-2">
              <p className="text-sm leading-6 text-paper/45 short:hidden">
                A selection of deployed products, experiments, and systems. Scroll to move sideways.
              </p>
              <MoreProjectsButton onClick={() => setShowRepositories(true)} />
            </div>
          </div>

          <div className="mt-10 min-h-0 flex-1 overflow-hidden short:mt-5 shorter:mt-4">
            <motion.div
              ref={trackRef}
              style={reducedMotion ? undefined : { x }}
              className="flex h-full items-stretch gap-6 pl-12 pr-12"
            >
              {projects.map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index} />
              ))}
            </motion.div>
          </div>

          <div className="mx-12 mt-6 h-px shrink-0 bg-paper/10 short:mt-3 shorter:mt-2">
            <motion.div style={{ width: progress }} className="h-full bg-acid" />
          </div>
        </div>
      </section>
      <RepositoryOverlay open={showRepositories} onClose={() => setShowRepositories(false)} />
    </>
  )
}
