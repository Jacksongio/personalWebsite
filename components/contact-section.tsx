"use client"

import { useRef, useState, type FormEvent } from "react"
import { ArrowRight, ArrowUpRight, Check } from "lucide-react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

import { SectionLabel } from "@/components/motion/primitives"
import { profile, socials } from "@/lib/site-content"

type SubmitState = "idle" | "sending" | "sent" | "error"

export function ContactSection() {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const [submitState, setSubmitState] = useState<SubmitState>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  })
  const rotate = useTransform(scrollYProgress, [0, 1], [-7, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.76, 1])
  const y = useTransform(scrollYProgress, [0, 1], [160, 0])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT

    if (!endpoint) {
      setSubmitState("error")
      setErrorMessage(`The form is not configured yet. Please email ${profile.email}.`)
      return
    }

    setSubmitState("sending")
    setErrorMessage("")

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(event.currentTarget),
        headers: { Accept: "application/json" },
      })

      if (!response.ok) throw new Error("Formspree rejected the submission")

      event.currentTarget.reset()
      setSubmitState("sent")
    } catch {
      setSubmitState("error")
      setErrorMessage("That did not go through. Please try again or email me directly.")
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="relative z-10 overflow-hidden bg-acid text-ink lg:h-svh lg:min-h-[720px]"
    >
      <div className="story-grid absolute inset-0 opacity-20" />
      <div className="relative mx-auto flex min-h-svh max-w-[1600px] flex-col px-5 py-14 sm:px-8 lg:h-full lg:min-h-0 lg:px-12 lg:py-10">
        <SectionLabel
          index="04"
          className="mb-4 text-ink/55 [&>span:first-child]:border-ink/20 [&>span:first-child]:text-ink [&>span:last-child]:bg-ink/15"
        >
          Start a conversation
        </SectionLabel>

        <motion.div
          style={reducedMotion ? undefined : { rotate, scale, y }}
          className="my-auto origin-bottom-left py-8 lg:py-3"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/55">
            Have an idea? A role? A hard problem?
          </p>
          <h2 className="mt-5 max-w-7xl font-display text-[clamp(3.7rem,10.5vw,10.5rem)] font-semibold leading-[0.72] tracking-[-0.09em]">
            LET&apos;S MAKE
            <span className="block pl-[8vw] text-transparent [-webkit-text-stroke:1.5px_#050507]">
              IT REAL.
            </span>
          </h2>
        </motion.div>

        <div className="grid gap-9 border-t border-ink/20 pt-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <div className="flex flex-col justify-between gap-7">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink/45">
                Prefer email?
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="mt-2 inline-block font-display text-xl font-medium tracking-[-0.035em] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-55 sm:text-2xl"
              >
                {profile.email}
              </a>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {socials.slice(0, 2).map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-mono text-[9px] uppercase tracking-[0.18em] text-ink/55 transition-colors hover:text-ink"
                >
                  {social.label} <ArrowUpRight className="ml-1 h-3 w-3" />
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid content-start gap-3" aria-label="Contact form">
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="group">
                <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">
                  Your name
                </span>
                <input
                  required
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Smith"
                  className="h-11 w-full rounded-none border-0 border-b border-ink/25 bg-transparent px-0 text-sm text-ink outline-none placeholder:text-ink/30 focus:border-ink focus:ring-0"
                />
              </label>
              <label className="group">
                <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">
                  Email address
                </span>
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@company.com"
                  className="h-11 w-full rounded-none border-0 border-b border-ink/25 bg-transparent px-0 text-sm text-ink outline-none placeholder:text-ink/30 focus:border-ink focus:ring-0"
                />
              </label>
            </div>
            <label>
              <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">
                What are you thinking?
              </span>
              <textarea
                required
                name="message"
                rows={2}
                placeholder="A few details about your project, role, or idea..."
                className="min-h-16 w-full resize-none rounded-none border-0 border-b border-ink/25 bg-transparent px-0 py-2 text-sm leading-6 text-ink outline-none placeholder:text-ink/30 focus:border-ink focus:ring-0"
              />
            </label>

            <div className="flex min-h-10 items-center justify-between gap-4">
              <p aria-live="polite" className="max-w-md text-xs text-ink/60">
                {submitState === "sent" && (
                  <span className="inline-flex items-center font-medium text-ink">
                    <Check className="mr-1.5 h-4 w-4" /> Message sent. I&apos;ll be in touch.
                  </span>
                )}
                {submitState === "error" && errorMessage}
              </p>
              <button
                type="submit"
                disabled={submitState === "sending" || submitState === "sent"}
                className="ml-auto inline-flex h-10 shrink-0 items-center rounded-full bg-ink px-5 font-mono text-[9px] uppercase tracking-[0.18em] text-acid transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-55"
              >
                {submitState === "sending" ? "Sending..." : submitState === "sent" ? "Sent" : "Send message"}
                {submitState === "idle" || submitState === "error" ? (
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                ) : null}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
