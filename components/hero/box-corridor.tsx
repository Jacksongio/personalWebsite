"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

import {
  BOX_FRAGMENT,
  BOX_VERTEX,
  DEPTH,
  Z_BEHIND,
  type CorridorState,
} from "./corridor-shaders"
import { makeRandom } from "./random"

/** How far the cone opens per unit of depth. */
const RADIAL_K = 0.55

const VOID_COLOR = new THREE.Color("#05050a")
const FACE_COLOR = new THREE.Color("#07070e")
const FACE_END = new THREE.Color("#0d0714")

const TINTS = [
  new THREE.Color("#38bdf8"), // sky
  new THREE.Color("#8b5cf6"), // violet
  new THREE.Color("#f472b6"), // pink
  new THREE.Color("#a5b4fc"), // indigo
]

export function BoxCorridor({ count, state }: { count: number; state: CorridorState }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const size = useThree((s) => s.size)

  // Memoised so r3f doesn't tear down and rebuild the mesh on every render.
  const meshArgs = useMemo(
    () => [undefined, undefined, count] as [undefined, undefined, number],
    [count],
  )

  // Per-instance constants, generated once. Deterministic so every reload and
  // screenshot is identical.
  const instances = useMemo(() => {
    const random = makeRandom(9184722)
    const angle = new Float32Array(count)
    const radial = new Float32Array(count)
    const baseZ = new Float32Array(count)
    const spinRate = new Float32Array(count * 3)
    const size = new Float32Array(count * 3)
    const tint = new Float32Array(count * 3)
    // Mutable: integrated every frame rather than recomputed. Seeded with a
    // random phase so the boxes don't all start axis-aligned.
    const rotation = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      angle[i] = random() * Math.PI * 2
      radial[i] = 0.6 + random() * 0.8 // u in [0.6, 1.4]
      // Spread evenly along the corridor, with jitter so it isn't banded.
      baseZ[i] = ((i + random()) / count) * DEPTH

      for (let a = 0; a < 3; a++) {
        rotation[i * 3 + a] = random() * Math.PI * 2
        // Signed and widely varied, so boxes tumble on their own axes at their
        // own rates instead of the whole field rotating as one block.
        spinRate[i * 3 + a] = (random() - 0.5) * 2.2
      }

      const s = 0.6 + random() * 1.9
      size[i * 3] = s * (0.7 + random() * 0.6)
      size[i * 3 + 1] = s * (0.7 + random() * 0.6)
      size[i * 3 + 2] = s * (0.7 + random() * 0.6)

      const c = TINTS[Math.floor(random() * TINTS.length)]
      tint[i * 3] = c.r
      tint[i * 3 + 1] = c.g
      tint[i * 3 + 2] = c.b
    }

    return { angle, radial, baseZ, spinRate, size, tint, rotation }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uFaceColor: { value: FACE_COLOR },
      uVoid: { value: VOID_COLOR },
      uSpeed: { value: 0 },
      // Edge tints run at a fraction of their full value — at 200 boxes x 12
      // edges, full-saturation lines blow out the whole frame.
      uGlow: { value: 0.34 },
      uEdgeWidth: { value: 0.045 },
      uNearFade: { value: 14 },
      uFarFade: { value: DEPTH * 0.65 },
      uDepth: { value: DEPTH },
    }),
    [],
  )

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    // We rewrite every matrix each frame; tell the driver not to treat the
    // buffer as static.
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  }, [count])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh || !state.active) return

    const dt = Math.min(delta, 0.05)
    const { travel, speed, roll } = state

    const material = mesh.material as THREE.ShaderMaterial
    material.uniforms.uSpeed.value = speed
    material.uniforms.uGlow.value = 0.26 + Math.sin(state.sceneProgress * Math.PI) * 0.25
    material.uniforms.uFaceColor.value.lerpColors(FACE_COLOR, FACE_END, state.sceneProgress)

    // three's `fov` is vertical, so on a portrait viewport the horizontal frame
    // is much narrower. Without this, boxes stay on screen far longer and the
    // rush-past never happens on a phone.
    const aspectScale = Math.min(size.width / size.height, 1)

    // Velocity stretch, applied globally rather than per-instance: a box
    // crossing the wrap boundary must not change length discontinuously.
    const stretch = 1 + speed * 1.5

    const { angle, radial, baseZ, spinRate, size: boxSize, rotation } = instances

    for (let i = 0; i < count; i++) {
      // True modulo. JS `%` is remainder and returns negatives when scrolling
      // up, which would fling boxes out of the corridor.
      const raw = (baseZ[i] + travel) % DEPTH
      const wrapped = raw < 0 ? raw + DEPTH : raw
      const z = wrapped - DEPTH + Z_BEHIND

      const dist = Math.max(-z, 0.001)
      const r = radial[i] * RADIAL_K * dist * aspectScale

      // Roll the whole ring so the corridor banks as you travel through it.
      const a = angle[i] + roll
      dummy.position.set(Math.cos(a) * r, Math.sin(a) * r, z)

      // Rotation is INTEGRATED into a persistent per-instance array, never
      // derived from `travel`. `travel` is wrapped to [0, DEPTH) each frame, so
      // anything computed linearly from it snaps every time it wraps — that was
      // the periodic jolt. Integrating also means the tumble keeps its phase and
      // can respond to scroll speed.
      const tumble = dt * (0.28 + speed * 2.6)
      const rx = (rotation[i * 3] += spinRate[i * 3] * tumble)
      const ry = (rotation[i * 3 + 1] += spinRate[i * 3 + 1] * tumble)
      const rz = (rotation[i * 3 + 2] += spinRate[i * 3 + 2] * tumble)
      dummy.rotation.set(rx, ry, rz)

      dummy.scale.set(boxSize[i * 3], boxSize[i * 3 + 1], boxSize[i * 3 + 2] * stretch)

      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={meshArgs} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]}>
        <instancedBufferAttribute attach="attributes-aTint" args={[instances.tint, 3]} />
      </boxGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={BOX_VERTEX}
        fragmentShader={BOX_FRAGMENT}
        side={THREE.FrontSide}
      />
    </instancedMesh>
  )
}
