// GLSL for the scroll-driven box corridor.
//
// Two layers share one `uTravel` uniform so they read as a single system: the
// instanced boxes (positioned CPU-side, since their matrices also carry rotation
// and velocity stretch) and the dust points (wrapped entirely in the vertex
// shader, so 1200 points cost zero CPU and zero buffer uploads per frame).
//
// Deliberately no THREE.Fog anywhere. `ShaderMaterial.fog` defaults to false, so
// `#include <fog_fragment>` would compile to nothing silently — and three's fog
// chunk mixes `.rgb` only, never `.a`, so a fogged opaque box would punch an
// opaque hole through whatever sits behind the canvas. Both layers fade manually.

/** Corridor length in world units. Must stay below the camera's `far`. */
export const DEPTH = 120

/** Boxes recycle into [-DEPTH + Z_BEHIND, Z_BEHIND] so none straddle the near plane. */
export const Z_BEHIND = 6

/**
 * Shared mutable corridor state, advanced once per frame by the driver and read
 * by both layers. Deliberately a plain object, not React state — it is written
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

export const BOX_VERTEX = /* glsl */ `
// The velocity stretch rides on the instance matrix (CPU-side scale), so the
// vertex stage needs no speed uniform of its own.
//
// three injects "attribute mat4 instanceMatrix" into non-raw ShaderMaterial
// whenever the material is used on an InstancedMesh (WebGLProgram's vertex
// prefix, gated on USE_INSTANCING).
attribute vec3 aTint;

varying vec3 vScaled;
varying vec3 vHalf;
varying vec3 vTint;
varying float vDepth;

void main() {
  // Per-instance scale, recovered from the columns of the instance matrix. We
  // need it in the fragment stage to measure edge distance in world units
  // rather than UV units — see the median trick below.
  vec3 iScale = vec3(
    length(instanceMatrix[0].xyz),
    length(instanceMatrix[1].xyz),
    length(instanceMatrix[2].xyz)
  );

  vScaled = position * iScale;
  vHalf = iScale * 0.5;
  vTint = aTint;

  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  vDepth = -mvPosition.z;

  gl_Position = projectionMatrix * mvPosition;
}
`

export const BOX_FRAGMENT = /* glsl */ `
precision highp float;

uniform vec3  uFaceColor;
uniform vec3  uVoid;
uniform float uSpeed;
uniform float uGlow;
uniform float uEdgeWidth;
uniform float uNearFade;
uniform float uFarFade;
uniform float uDepth;

varying vec3 vScaled;
varying vec3 vHalf;
varying vec3 vTint;
varying float vDepth;

void main() {
  // Distance from this fragment to the nearest box EDGE, in world units.
  //
  // "e" holds the distance to each of the three face-pairs. On any face, one
  // component is ~0 (that face's own normal axis) and the other two measure how
  // far we are from the four bounding edges. So the median of the three is the
  // distance to the nearest edge — and unlike a UV-based measure it stays
  // correct under anisotropic per-instance scale, which matters because the
  // velocity stretch scales Z by up to 5x.
  vec3 e = vHalf - abs(vScaled);
  float m0 = min(min(e.x, e.y), e.z);
  float m2 = max(max(e.x, e.y), e.z);
  float m1 = e.x + e.y + e.z - m0 - m2;

  // World-space edge width with a screen-space floor, so distant edges stay a
  // couple of pixels wide and fade out rather than flickering on and off as
  // they cross the sub-pixel threshold.
  float aa = fwidth(m1);
  float w = max(uEdgeWidth, 2.0 * aa);
  // Falloff is deliberately wider than the line itself: a razor-hard edge on
  // moving geometry shimmers even with MSAA. This gives each edge a soft
  // shoulder instead.
  float edge = 1.0 - smoothstep(w * 0.35, w + aa * 1.5, m1);
  edge = pow(edge, 1.6);

  vec3 glow = vTint * uGlow * (1.0 + uSpeed * 0.7);
  vec3 color = mix(uFaceColor, glow, edge);

  // Manual depth fade toward the page background at both ends of the corridor:
  // in from the far plane, out as a box sweeps past the camera. This is what
  // hides the recycle.
  float fade = smoothstep(0.0, uNearFade, vDepth) *
               smoothstep(uDepth, uFarFade, vDepth);
  color = mix(uVoid, color, fade);

  gl_FragColor = vec4(color, 1.0);

  #include <colorspace_fragment>
}
`

export const DUST_VERTEX = /* glsl */ `
uniform float uTravel;
uniform float uSpeed;
uniform float uSize;
uniform float uPixelRatio;
uniform float uDepth;
uniform float uZBehind;
uniform float uRadialScale;

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
  pos.xy *= dist * uRadialScale;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / max(-mvPosition.z, 0.001));

  vFade = smoothstep(0.0, 18.0, dist) * smoothstep(uDepth, uDepth * 0.6, dist);
  // Dust is additive on top of the edge glow, so it stays faint by default and
  // only lifts a little when you're moving.
  vFade *= 0.22 + uSpeed * 0.28;
}
`

export const DUST_FRAGMENT = /* glsl */ `
precision highp float;

uniform vec3 uColor;

varying float vFade;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.0, d);
  alpha *= alpha;

  gl_FragColor = vec4(uColor, alpha * vFade);

  #include <colorspace_fragment>
}
`
