import React, { useEffect, useRef } from 'react'

export interface ThreadsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'color'
> {
  color?: [number, number, number]

  amplitude?: number

  distance?: number

  enableMouseInteraction?: boolean
}

// ... (vertexShaderSource y fragmentShaderSource permanecen exactamente igual) ...

const vertexShaderSource = `

attribute vec2 position;

varying vec2 vUv;



void main() {

vUv = (position + 1.0) * 0.5;

gl_Position = vec4(position, 0.0, 1.0);

}

`

const fragmentShaderSource = `

precision highp float;



uniform float iTime;

uniform vec3 iResolution;

uniform vec3 uColor;

uniform float uAmplitude;

uniform float uDistance;

uniform vec2 uMouse;



#define PI 3.1415926538



const int u_line_count = 40;

const float u_line_width = 7.0;

const float u_line_blur = 10.0;



float Perlin2D(vec2 P) {

vec2 Pi = floor(P);

vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);

vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);

Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;

Pt += vec2(26.0, 161.0).xyxy;

Pt *= Pt;

Pt = Pt.xzxz * Pt.yyww;

vec4 hash_x = fract(Pt * (1.0 / 951.135664));

vec4 hash_y = fract(Pt * (1.0 / 642.949883));

vec4 grad_x = hash_x - 0.49999;

vec4 grad_y = hash_y - 0.49999;

vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)

* (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);

grad_results *= 1.4142135623730950;

vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy

* (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);

vec4 blend2 = vec4(blend, vec2(1.0 - blend));

return dot(grad_results, blend2.zxzx * blend2.wwyy);

}



float pixel(float count, vec2 resolution) {

return (1.0 / max(resolution.x, resolution.y)) * count;

}



float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance) {

float split_offset = (perc * 0.4);

float split_point = 0.1 + split_offset;



float amplitude_normal = smoothstep(split_point, 0.7, st.x);

float amplitude_strength = 0.5;

float finalAmplitude = amplitude_normal * amplitude_strength

* amplitude * (1.0 + (mouse.y - 0.5) * 0.2);



float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;

float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;



float xnoise = mix(

Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),

Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,

st.x * 0.3

);



float y = 0.5 + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;



float line_start = smoothstep(

y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),

y,

st.y

);



float line_end = smoothstep(

y,

y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),

st.y

);



return clamp(

(line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),

0.0,

1.0

);

}



void mainImage(out vec4 fragColor, in vec2 fragCoord) {

vec2 uv = fragCoord / iResolution.xy;



float line_strength = 1.0;

for (int i = 0; i < u_line_count; i++) {

float p = float(i) / float(u_line_count);

line_strength *= (1.0 - lineFn(

uv,

u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),

p,

(PI * 1.0) * p,

uMouse,

iTime,

uAmplitude,

uDistance

));

}



float colorVal = 1.0 - line_strength;

fragColor = vec4(uColor * colorVal, colorVal);

}



void main() {

mainImage(gl_FragColor, gl_FragCoord.xy);

}

`

function createShader(
  gl: WebGLRenderingContext,

  type: number,

  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type)

  if (!shader) return null

  gl.shaderSource(shader, source)

  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader))

    gl.deleteShader(shader)

    return null
  }

  return shader
}

function createProgram(
  gl: WebGLRenderingContext,

  vsSource: string,

  fsSource: string,
): WebGLProgram | null {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource)

  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource)

  if (!vs || !fs) return null

  const program = gl.createProgram()

  if (!program) return null

  gl.attachShader(program, vs)

  gl.attachShader(program, fs)

  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program))

    gl.deleteProgram(program)

    return null
  }

  return program
}

interface ThreadsState {
  color: [number, number, number]

  amplitude: number

  distance: number

  enableMouseInteraction: boolean
}

const Threads: React.FC<ThreadsProps> = ({
  color = [1, 1, 1],

  amplitude = 1,

  distance = 0,

  enableMouseInteraction = false,

  className = '',

  style,

  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const animationFrameId = useRef<number>(0)

  const propsRef = useRef<ThreadsState>({
    color,

    amplitude,

    distance,

    enableMouseInteraction,
  })

  // Sincronizar las props mutando la referencia únicamente como un efecto secundario (Side Effect)

  useEffect(() => {
    propsRef.current = { color, amplitude, distance, enableMouseInteraction }
  }, [color, amplitude, distance, enableMouseInteraction])

  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    const canvas = document.createElement('canvas')

    canvas.style.display = 'block'

    canvas.style.width = '100%'

    canvas.style.height = '100%'

    container.appendChild(canvas)

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false })

    if (!gl) {
      console.error('WebGL is not supported in this environment.')

      return
    }

    gl.clearColor(0, 0, 0, 0)

    gl.enable(gl.BLEND)

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)

    if (!program) return

    gl.useProgram(program)

    const positionBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    gl.bufferData(
      gl.ARRAY_BUFFER,

      new Float32Array([-1, -1, 3, -1, -1, 3]),

      gl.STATIC_DRAW,
    )

    const posAttrLoc = gl.getAttribLocation(program, 'position')

    gl.enableVertexAttribArray(posAttrLoc)

    gl.vertexAttribPointer(posAttrLoc, 2, gl.FLOAT, false, 0, 0)

    const uTimeLoc = gl.getUniformLocation(program, 'iTime')

    const uResLoc = gl.getUniformLocation(program, 'iResolution')

    const uColorLoc = gl.getUniformLocation(program, 'uColor')

    const uAmpLoc = gl.getUniformLocation(program, 'uAmplitude')

    const uDistLoc = gl.getUniformLocation(program, 'uDistance')

    const uMouseLoc = gl.getUniformLocation(program, 'uMouse')

    const MAX_RENDER_DIM = 1920

    function resize() {
      if (!container) return // Comprobación estricta de nulos para TypeScript

      const { clientWidth, clientHeight } = container

      const baseDpr = Math.min(window.devicePixelRatio || 1, 2)

      const longestSide = Math.max(clientWidth, clientHeight) * baseDpr

      const dpr =
        longestSide > MAX_RENDER_DIM
          ? (baseDpr * MAX_RENDER_DIM) / longestSide
          : baseDpr

      const displayWidth = Math.floor(clientWidth * dpr)

      const displayHeight = Math.floor(clientHeight * dpr)

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth

        canvas.height = displayHeight
      }

      // Se usa encadenamiento opcional si existe alguna ruta donde gl se invalide

      gl?.viewport(0, 0, canvas.width, canvas.height)

      gl?.uniform3f(
        uResLoc,

        canvas.width,

        canvas.height,

        canvas.width / (canvas.height || 1),
      )
    }

    const resizeObserver = new ResizeObserver(resize)

    resizeObserver.observe(container)

    window.addEventListener('resize', resize)

    resize()

    const currentMouse = [0.5, 0.5]

    let targetMouse = [0.5, 0.5]

    function handleMouseMove(e: MouseEvent) {
      if (!container) return // Comprobación estricta de nulos para TypeScript

      const rect = container.getBoundingClientRect()

      const x = (e.clientX - rect.left) / rect.width

      const y = 1.0 - (e.clientY - rect.top) / rect.height

      targetMouse = [x, y]
    }

    function handleMouseLeave() {
      targetMouse = [0.5, 0.5]
    }

    container.addEventListener('mousemove', handleMouseMove)

    container.addEventListener('mouseleave', handleMouseLeave)

    let isVisible = true

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting
      },

      { threshold: 0 },
    )

    intersectionObserver.observe(container)

    function update(t: number) {
      animationFrameId.current = requestAnimationFrame(update)

      if (!isVisible || document.hidden || !gl) return

      const { color, amplitude, distance, enableMouseInteraction } =
        propsRef.current

      gl.useProgram(program)

      gl.uniform3f(uColorLoc, color[0], color[1], color[2])

      gl.uniform1f(uAmpLoc, amplitude)

      gl.uniform1f(uDistLoc, distance)

      if (enableMouseInteraction) {
        const smoothing = 0.05

        currentMouse[0] += smoothing * (targetMouse[0] - currentMouse[0])

        currentMouse[1] += smoothing * (targetMouse[1] - currentMouse[1])

        gl.uniform2f(uMouseLoc, currentMouse[0], currentMouse[1])
      } else {
        gl.uniform2f(uMouseLoc, 0.5, 0.5)
      }

      gl.uniform1f(uTimeLoc, t * 0.001)

      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    animationFrameId.current = requestAnimationFrame(update)

    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current)

      resizeObserver.disconnect()

      intersectionObserver.disconnect()

      window.removeEventListener('resize', resize)

      // Añadimos comprobaciones explícitas antes de remover event listeners y dom nodes

      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)

        container.removeEventListener('mouseleave', handleMouseLeave)

        if (container.contains(canvas)) {
          container.removeChild(canvas)
        }
      }

      if (gl) {
        if (program) gl.deleteProgram(program)

        if (positionBuffer) gl.deleteBuffer(positionBuffer)

        gl.getExtension('WEBGL_lose_context')?.loseContext()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}

      className={`w-full h-full relative ${className}`}

      style={style}

      {...rest}
    />
  )
}

export default Threads
