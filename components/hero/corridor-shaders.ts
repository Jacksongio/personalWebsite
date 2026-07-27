// GLSL for the scroll-driven dust field.
//
// Dust points wrap entirely in the vertex shader off a shared `uTravel`, so
// ~1000 points cost zero CPU and zero buffer uploads per frame.
//
// Deliberately no THREE.Fog — `ShaderMaterial.fog` defaults to false, and three's
// fog chunk mixes `.rgb` only, never `.a`. Depth fade is done manually.

/** Corridor length in world units. Must stay below the camera's `far`. */
export const DEPTH = 120

/** Dust recycles into [-DEPTH + Z_BEHIND, Z_BEHIND] so none straddle the near plane. */
export const Z_BEHIND = 6

/**
 * Shared mutable corridor state, advanced once per frame by the driver and read
 * by the dust field. Deliberately a plain object, not React state — it is written
 * and read inside the render loop.
 */
export type CorridorState = {
  /** Distance travelled down the corridor, wrapped to [0, DEPTH). */
  travel: number
  /** Smoothed scroll speed, 0..1. */
  speed: number
  /** Bank angle of the whole ring, wrapped to [0, 2pi). */
  roll: number
  /** Normalized active page chapter, used to evolve the scene palette and energy. */
  sceneProgress: number
  /** Pauses expensive scene updates while the document is hidden. */
  active: boolean
}

export const DUST_VERTEX = /* glsl */ `
uniform float uTravel;
uniform float uSpeed;
uniform float uSize;
uniform float uMaxSize;
uniform float uPixelRatio;
uniform float uDepth;
uniform float uZBehind;
uniform vec2 uViewportScale;

attribute float aScale;

varying float vFade;

void main() {
  vec3 pos = position;

  // Same wrap the boxes use, done entirely on the GPU. position.z carries the
  // dust's base offset along the corridor; mod() keeps it in [0, uDepth).
  float z = mod(pos.z + uTravel, uDepth);
  pos.z = z - uDepth + uZBehind;

  // Cone placement: radius grows with distance so the corridor keeps a constant
  // angular hole down its centre instead of converging on the vanishing point.
  float dist = max(-pos.z, 0.001);
  pos.xy *= dist * uViewportScale;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float pointSize = uSize * aScale * uPixelRatio * (1.0 / max(-mvPosition.z, 0.001));
  gl_PointSize = min(pointSize, uMaxSize * uPixelRatio);

  vFade = smoothstep(0.0, 8.0, dist) *
          (1.0 - smoothstep(uDepth * 0.5, uDepth, dist));
  // Bright at idle so dust reads through the centre scrim on all displays.
  vFade *= 0.9 + uSpeed * 0.3;
}
`

export const DUST_FRAGMENT = /* glsl */ `
precision highp float;

uniform vec3 uColor;

varying float vFade;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float alpha = 1.0 - smoothstep(0.15, 0.5, d);

  vec3 color = uColor * (alpha * vFade);
  gl_FragColor = vec4(color, alpha * vFade);

  #include <colorspace_fragment>
}
`
