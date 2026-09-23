import { describe, expect, it, vi } from 'vitest'
import { renderCropPreview } from '../geometry/cropMapping'

function createContext() {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    scale: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    drawImage: vi.fn(),
    fillStyle: '',
  } as unknown as CanvasRenderingContext2D
}

describe('crop mapping', () => {
  it.each([90, 270] as const)('keeps the source center for a %i degree preview', (rotation) => {
    const context = createContext()

    renderCropPreview({
      context,
      image: {} as CanvasImageSource,
      source: { width: 1200, height: 800 },
      rotation,
      zoom: 1.6,
      pan: { x: 80, y: -40 },
      viewport: { width: 640, height: 480 },
      crop: { x: 64, y: 48, width: 512, height: 384 },
      output: { width: 480, height: 360 },
    })

    expect(context.translate).toHaveBeenLastCalledWith(-600, -400)
  })
})
