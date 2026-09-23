import { useLayoutEffect, useState, type RefObject } from 'react'
import type { Size } from '../geometry/types'

export function useEditorResize(ref: RefObject<HTMLElement | null>, fallback: Size) {
  const [size, setSize] = useState<Size>(fallback)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect()
      if (width > 0 && height > 0) setSize({ width, height })
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return size
}
