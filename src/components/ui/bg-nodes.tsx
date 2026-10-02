import React, { useEffect, useRef } from 'react'

export interface ThreadsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'color'
> {
  color?: [number, number, number]
  enableMouseInteraction?: boolean
  nodeCount?: number
  connectionDistance?: number
  rotationSpeed?: number
}

interface SphereNode {
  bx: number
  by: number
  bz: number
  x: number
  y: number
  z: number
  px: number
  py: number
}

const Threads: React.FC<ThreadsProps> = ({
  color = [1, 1, 1],
  enableMouseInteraction = true,
  nodeCount = 250,
  connectionDistance = 0.25,
  rotationSpeed = 0.0005,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number>(0)
  const mousePos = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })
  const currentRotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let radius = 0
    const nodes: SphereNode[] = []

    const initNodes = () => {
      nodes.length = 0
      for (let i = 0; i < nodeCount; i++) {
        const z = (i / nodeCount) * 2 - 1
        const r = Math.sqrt(1 - z * z)
        const theta = i * Math.PI * (3 - Math.sqrt(5))
        nodes.push({
          bx: r * Math.cos(theta),
          by: r * Math.sin(theta),
          bz: z,
          x: 0,
          y: 0,
          z: 0,
          px: 0,
          py: 0,
        })
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
      radius = Math.min(width, height) * 0.45
      initNodes()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableMouseInteraction) return
      const rect = container.getBoundingClientRect()
      mousePos.current.x = (e.clientX - rect.left) / width - 0.5
      mousePos.current.y = (e.clientY - rect.top) / height - 0.5
      targetRotation.current.x = mousePos.current.y * Math.PI * 0.3
      targetRotation.current.y = mousePos.current.x * Math.PI * 0.3
    }

    const handleMouseLeave = () => {
      targetRotation.current.x = 0
      targetRotation.current.y = 0
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    const [r, g, b] = color.map((c) => Math.round(c * 255))

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height)

      currentRotation.current.x +=
        (targetRotation.current.x - currentRotation.current.x) * 0.05
      currentRotation.current.y +=
        (targetRotation.current.y - currentRotation.current.y) * 0.05

      const rotX = currentRotation.current.x
      const rotY = currentRotation.current.y + time * rotationSpeed

      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)

      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i]

        const x1 = node.bx * cosY - node.bz * sinY
        const z1 = node.bz * cosY + node.bx * sinY

        const y2 = node.by * cosX - z1 * sinX
        const z2 = z1 * cosX + node.by * sinX

        node.x = x1
        node.y = y2
        node.z = z2

        const scale = 1 / (1 + z2 * 0.25)

        node.px = width / 2 + x1 * radius * scale
        node.py = height / 2 + y2 * radius * scale
      }

      for (let i = 0; i < nodeCount; i++) {
        const nodeA = nodes[i]

        if (nodeA.z > 0.8) continue

        const alphaA = Math.max(0, 1 - (nodeA.z + 1) / 2)

        ctx.beginPath()
        ctx.arc(nodeA.px, nodeA.py, 1.5 * alphaA, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alphaA * 0.8})`
        ctx.fill()

        for (let j = i + 1; j < nodeCount; j++) {
          const nodeB = nodes[j]
          if (nodeB.z > 0.8) continue

          const dx = nodeA.px - nodeB.px
          const dy = nodeA.py - nodeB.py
          const dist = Math.sqrt(dx * dx + dy * dy)

          const maxDist = radius * connectionDistance

          if (dist < maxDist) {
            const alphaB = Math.max(0, 1 - (nodeB.z + 1) / 2)
            const lineAlpha =
              (1 - dist / maxDist) * Math.min(alphaA, alphaB) * 0.4

            ctx.beginPath()
            ctx.moveTo(nodeA.px, nodeA.py)
            ctx.lineTo(nodeB.px, nodeB.py)
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineAlpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(render)
    }

    animationFrameId.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId.current)
      resizeObserver.disconnect()
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [
    color,
    enableMouseInteraction,
    nodeCount,
    connectionDistance,
    rotationSpeed,
  ])

  return (
    <div
      ref={containerRef}
      className={`relative size-full overflow-hidden ${className}`}
      style={style}
      {...rest}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block size-full" />
    </div>
  )
}

export default Threads
