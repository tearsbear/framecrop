import { describe, expect, it } from 'vitest'
import { clampZoom, getFitScale } from '../geometry/fit'

const source = { width: 1200, height: 800 }
const crop = { x: 64, y: 48, width: 512, height: 384 }

describe('image fit', () => {
  it('covers a 4:3 crop at zero rotation', () => {
    expect(getFitScale(source, crop, 0)).toBeCloseTo(0.48)
  })

  it('uses the rotated dimensions for quarter turns', () => {
    expect(getFitScale(source, crop, 90)).toBeCloseTo(0.64)
  })

  it('keeps zoom within the editor range', () => {
    expect(clampZoom(0.4)).toBe(1)
    expect(clampZoom(2.56)).toBe(2.5)
  })
})
