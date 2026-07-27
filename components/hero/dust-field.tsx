"use client"

import { useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

import {
  DEPTH,
  DUST_FRAGMENT,
  DUST_VERTEX,
  Z_BEHIND,
  type CorridorState,
} from "./corridor-shaders"
import { makeRandom } from "./random"

const DUST_COLOR = new THREE.Color("#c7d2fe")
const DUST_END = new THREE.Color("#c7ff5e")

/**
 * Fine dust drifting between the boxes. The corridor wrap happens entirely in
 * the vertex shader off the shared `uTravel`, so this costs no CPU work and no
 * buffer uploads per frame — and it guarantees the dust moves in lockstep with
 * the boxes rather than looking like a second, unrelated system.
 */
export function DustField({
  count,
  state,
  mobile = false,
}: {
  count: number
  state: CorridorState
  mobile?: boolean
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const size = useThree((s) => s.size)
  const gl = useThree((s) => s.gl)

  const geometry = useMemo(() => {
    const random = makeRandom(5512399)
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // x/y are a unit-circle direction here — the shader multiplies them by
      // depth to place the dust on the same cone the boxes travel.
      const theta = random() * Math.PI * 2
      const radius = (0.35 + random() * 1.15) * 0.55
      positions[i * 3] = Math.cos(theta) * radius
      positions[i * 3 + 1] = Math.sin(theta) * radius
      positions[i * 3 + 2] = random() * DEPTH

      scales[i] = 0.4 + random() * 1.2
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1))
    return geo
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTravel: { value: 0 },
      uSpeed: { value: 0 },
      uSize: { value: mobile ? 10 : 26 },
      uMaxSize: { value: mobile ? 1.8 : 4.5 },
      uPixelRatio: { value: 1 },
      uDepth: { value: DEPTH },
      uZBehind: { value: Z_BEHIND },
      uViewportScale: { value: new THREE.Vector2(1, 1) },
      uColor: { value: DUST_COLOR },
    }),
    [mobile],
  )

  useFrame(() => {
    const material = materialRef.current
    if (!material || !state.active) return
    material.uniforms.uTravel.value = state.travel
    material.uniforms.uSpeed.value = state.speed
    material.uniforms.uPixelRatio.value = gl.getPixelRatio()
    const aspect = size.width / size.height
    material.uniforms.uViewportScale.value.set(Math.max(aspect, 1), Math.min(aspect, 1))
    material.uniforms.uColor.value.lerpColors(DUST_COLOR, DUST_END, state.sceneProgress)
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={DUST_VERTEX}
        fragmentShader={DUST_FRAGMENT}
        transparent
        depthWrite={false}
        depthTest
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
