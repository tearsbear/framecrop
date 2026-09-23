import { describe, expect, it } from 'vitest'
import { getRotatedBounds, normalizeRotation } from '../geometry/rotation'

describe('rotation geometry', () => {
  it('normalizes quarter turns', () => {
    expect(normalizeRotation(-90)).toBe(270)
    expect(normalizeRotation(450)).toBe(90)
  })

  it('swaps bounds for a quarter turn', () => {
    expect(getRotatedBounds({ width: 1200, height: 800 }, 90)).toEqual({ width: 800, height: 1200 })
    expect(getRotatedBounds({ width: 1200, height: 800 }, 180)).toEqual({ width: 1200, height: 800 })
  })
})
