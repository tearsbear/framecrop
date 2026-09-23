import { useRef, useState, type PointerEvent } from 'react'
import { clampPan } from '../geometry/constraints'
import type { PanLimits, Point } from '../geometry/types'

type PanGestureOptions = {
  pan: Point
  limits: PanLimits
  onPan: (pan: Point) => void
}

type DragStart = {
  pointerX: number
  pointerY: number
  pan: Point
} | null

export function usePanGesture({ pan, limits, onPan }: PanGestureOptions) {
  const start = useRef<DragStart>(null)
  const [isDragging, setIsDragging] = useState(false)

  const finish = () => {
    start.current = null
    setIsDragging(false)
  }

  return {
    isDragging,
    onPointerDown(event: PointerEvent<HTMLElement>) {
      event.currentTarget.setPointerCapture(event.pointerId)
      start.current = { pointerX: event.clientX, pointerY: event.clientY, pan }
      setIsDragging(true)
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (!start.current) return
      onPan(
        clampPan(
          {
            x: start.current.pan.x + event.clientX - start.current.pointerX,
            y: start.current.pan.y + event.clientY - start.current.pointerY,
          },
          limits,
        ),
      )
    },
    onPointerUp: finish,
    onPointerCancel: finish,
  }
}
