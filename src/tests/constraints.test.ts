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
})
