"use client"

import { useEffect, useRef, useState } from "react"
import { ReactLenis, type LenisRef } from "lenis/react"
import { cancelFrame, frame, useReducedMotion } from "motion/react"

/**
 * Momentum scrolling for the whole document.
 *
 * Lenis is driven off Motion's `frame` loop (autoRaf disabled) so scroll-linked
 * Motion values are read in the same frame Lenis writes the scroll position —
 * otherwise scroll-driven animations lag one frame behind the page.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)
  const scrollTriggerRef = useRef<{ update: () => void; refresh: () => void } | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const [coarsePointer, setCoarsePointer] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)")
    const update = () => setCoarsePointer(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    let cancelled = false

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)
        scrollTriggerRef.current = ScrollTrigger
        document.fonts.ready.then(() => ScrollTrigger.refresh())
      },
    )

    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp)
      scrollTriggerRef.current?.update()
    }

    frame.update(update, true)
    return () => {
      cancelled = true
      scrollTriggerRef.current = null
      cancelFrame(update)
    }
  }, [])

  if (prefersReducedMotion || coarsePointer) return <>{children}</>

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.085, wheelMultiplier: 1, anchors: true }}
    >
      {children}
    </ReactLenis>
  )
}
