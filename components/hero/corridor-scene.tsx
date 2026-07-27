"use client"

import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { MotionValue } from "motion/react"

import { BoxCorridor } from "./box-corridor"
import { DEPTH, type CorridorState } from "./corridor-shaders"
import { DustField } from "./dust-field"

/** World units travelled per pixel scrolled. */
const TRAVEL_PER_PX = 0.055

/** Radians the corridor banks per pixel scrolled — the twist as you travel. */
const ROLL_PER_PX = 0.00035

/** Keeps the corridor alive when the page is static. */
const IDLE_DRIFT = 1.6
const IDLE_ROLL = 0.012

/** Scroll speed that maps to full effect, in px/s. */
const SPEED_NORMALISE = 4000

/**
 * Owns the shared corridor state and advances it once per frame, before the
 * layers read it.
 *
 * Speed is derived here from raw `scrollY` deltas rather than Motion's
 * `useVelocity`: that hook returns 0 whenever the value hasn't updated within
 * MAX_VELOCITY_DELTA (30ms), so it reads zero below ~33fps — precisely when
 * you're scrolling hard on a weak device — and the same clamp turns a scroll
 * restore into a ~166,000px/s spike.
 */
function CorridorDriver({
  scrollY,
  storyProgress,
  state,
}: {
  scrollY: MotionValue<number>
  storyProgress: MotionValue<number>
  state: CorridorState
}) {
  const previousY = useRef<number | null>(null)
  // Two-stage smoothing. `dy / dt` is inherently noisy because dt jitters frame
  // to frame, and feeding that straight into scale/brightness made the whole
  // field buzz. The first stage takes the edge off the raw sample; the second
  // is slow enough to read as inertia.
  const rawSpeed = useRef(0)

  useFrame((_, delta) => {
    if (!state.active) return
    // Clamped so a backgrounded tab doesn't jolt the corridor forward on return.
    const dt = Math.min(delta, 0.05)

    const y = scrollY.get()
    if (previousY.current === null) previousY.current = y
    const dy = y - previousY.current
    previousY.current = y

    // Teleport guard: anchor jumps, scroll restoration and scrollbar drags can
    // move the page by thousands of pixels in a single frame.
    const teleported = Math.abs(dy) > window.innerHeight

    let sample = 0
    if (!teleported) {
      sample = Math.min(Math.abs(dy / dt) / SPEED_NORMALISE, 1)
      state.travel += dy * TRAVEL_PER_PX
      state.roll += dy * ROLL_PER_PX
    }

    rawSpeed.current += (sample - rawSpeed.current) * Math.min(dt * 8, 1)
    state.speed += (rawSpeed.current - state.speed) * Math.min(dt * 2.2, 1)
    state.sceneProgress += (storyProgress.get() - state.sceneProgress) * Math.min(dt * 2.5, 1)

    const storyEnergy = 0.8 + Math.sin(state.sceneProgress * Math.PI) * 0.7
    state.travel += dt * IDLE_DRIFT * storyEnergy
    state.roll += dt * IDLE_ROLL * storyEnergy

    // Wrap every frame so `travel` never grows into the range where float
    // precision makes mod() visibly jitter. Note nothing may derive an absolute
    // angle from `travel` — the wrap would snap it. Rotation is integrated
    // separately for exactly that reason.
    state.travel = ((state.travel % DEPTH) + DEPTH) % DEPTH
    // Roll is an angle, so wrapping at 2pi is seamless.
    state.roll = state.roll % (Math.PI * 2)
  })

  return null
}

export default function CorridorScene({
  scrollY,
  storyProgress,
  boxCount,
  dustCount,
  mobile = false,
}: {
  scrollY: MotionValue<number>
  storyProgress: MotionValue<number>
  boxCount: number
  dustCount: number
  mobile?: boolean
}) {
  // Plain mutable object, deliberately not React state — it is written and read
  // inside the render loop.
  const state = useMemo<CorridorState>(
    () => ({ travel: 0, speed: 0, roll: 0, sceneProgress: 0, active: true }),
    [],
  )

  useEffect(() => {
    const update = () => {
      state.active = document.visibilityState === "visible"
    }
    update()
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [state])

  return (
    <Canvas
      dpr={mobile ? [1, 1.25] : [1, 1.65]}
      // MSAA is on here despite the cost: the box edges are thin, high-contrast
      // and in constant motion, which is the worst case for aliasing. Without it
      // the edges crawl and shimmer, which reads as the whole thing juddering.
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{
        position: [0, 0, 0],
        // Tilted off-axis so the vanishing point — where box density is highest
        // — sits away from the centred text column.
        //
        // Passing `rotation` here is also load-bearing: r3f calls
        // `camera.lookAt(0,0,0)` unless the camera options include a rotation,
        // and with the camera AT the origin that is a zero-length direction
        // vector and a degenerate matrix.
        rotation: [THREE.MathUtils.degToRad(5), THREE.MathUtils.degToRad(-8), 0],
        fov: 55,
        near: 0.1,
        // `far` must exceed DEPTH or the far end of the corridor is clipped.
        far: 200,
      }}
    >
      <CorridorDriver scrollY={scrollY} storyProgress={storyProgress} state={state} />
      <BoxCorridor count={boxCount} state={state} />
      <DustField count={dustCount} state={state} mobile={mobile} />
    </Canvas>
  )
}
