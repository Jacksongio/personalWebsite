"use client"

import { useMemo } from "react"

import { makeRandom } from "./random"

type Star = {
  left: string
  top: string
  size: number
  delay: string
  duration: string
  opacity: number
}

/**
 * CSS fallback glitter. Some Windows/ANGLE setups clamp WebGL gl_PointSize to
 * 1px, which makes the Three.js dust field effectively invisible. This layer
 * always renders at a readable size.
 */
export function StarField({ count = 140 }: { count?: number }) {
  const stars = useMemo(() => {
    const random = makeRandom(7722144)
    const next: Star[] = []
    for (let i = 0; i < count; i++) {
      next.push({
        left: `${random() * 100}%`,
        top: `${random() * 100}%`,
        size: 1.5 + random() * 2.5,
        delay: `${(-random() * 6).toFixed(2)}s`,
        duration: `${2.4 + random() * 3.6}s`,
        opacity: 0.35 + random() * 0.55,
      })
    }
    return next
  }, [count])

  return (
    <div aria-hidden="true" className="star-field pointer-events-none absolute inset-0">
      {stars.map((star, index) => (
        <span
          key={index}
          className="star-field__dot"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  )
}
