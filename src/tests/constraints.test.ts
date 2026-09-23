import { describe, expect, it } from 'vitest'
import { clampPan, getPanLimits } from '../geometry/constraints'

describe('pan constraints', () => {
  it('centers images without excess coverage', () => {
    const limits = getPanLimits({
      source: { width: 1200, height: 800 },
      crop: { x: 64, y: 48, width: 512, height: 384 },
      rotation: 0,
      effectiveScale: 0.48,
    })
    expect(limits).toEqual({ x: 32, y: 0 })
    expect(clampPan({ x: 100, y: -50 }, limits)).toEqual({ x: 32, y: 0 })
  })

  it('uses quarter-turn bounds while constraining pan', () => {
    const limits = getPanLimits({
      source: { width: 1200, height: 800 },
      crop: { x: 42, y: 31.5, width: 336, height: 252 },
      rotation: 90,
      effectiveScale: 0.588,
    })

    expect(limits.x).toBeCloseTo(67.2)
    expect(limits.y).toBeCloseTo(226.8)
    expect(clampPan({ x: 102, y: 0 }, limits).x).toBeCloseTo(67.2)
  })
})
