"use client"

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react"
import {
  motionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react"

type ScrollStoryValue = {
  progress: MotionValue<number>
  chapter: MotionValue<number>
  reducedMotion: boolean
}

const fallbackProgress = motionValue(0)
const fallbackChapter = motionValue(0)
const ScrollStoryContext = createContext<ScrollStoryValue>({
  progress: fallbackProgress,
  chapter: fallbackChapter,
  reducedMotion: false,
})

const CHAPTER_IDS = ["about", "stats", "experience", "projects", "contact"]

export function ScrollStory({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll()
  const chapter = useMemo(() => motionValue(0), [])
  const reducedMotion = useReducedMotion() ?? false

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    document.documentElement.style.setProperty("--scroll-progress", latest.toFixed(4))
  })

  useEffect(() => {
    const sections = CHAPTER_IDS.map((id) => document.getElementById(id)).filter(
      (section): section is HTMLElement => section !== null,
    )
    if (!sections.length) return

    const updateChapter = () => {
      const marker = window.innerHeight * 0.48
      let activeIndex = 0
      let bestDistance = Number.POSITIVE_INFINITY

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        const distance = Math.abs(rect.top + Math.min(rect.height, window.innerHeight) * 0.35 - marker)
        if (distance < bestDistance) {
          bestDistance = distance
          activeIndex = index
        }
      })

      chapter.set(activeIndex / Math.max(sections.length - 1, 1))
      document.documentElement.dataset.chapter = CHAPTER_IDS[activeIndex]
    }

    updateChapter()
    window.addEventListener("scroll", updateChapter, { passive: true })
    window.addEventListener("resize", updateChapter)
    return () => {
      window.removeEventListener("scroll", updateChapter)
      window.removeEventListener("resize", updateChapter)
    }
  }, [chapter])

  const value = useMemo(
    () => ({ progress: scrollYProgress, chapter, reducedMotion }),
    [scrollYProgress, chapter, reducedMotion],
  )

  return <ScrollStoryContext.Provider value={value}>{children}</ScrollStoryContext.Provider>
}

export function useScrollStory() {
  return useContext(ScrollStoryContext)
}
