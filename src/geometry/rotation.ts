import type { Rotation, Size, SourceImage } from './types'

export function normalizeRotation(value: number): Rotation {
  const normalized = ((value % 360) + 360) % 360

  if (normalized === 90 || normalized === 180 || normalized === 270) {
    return normalized
  }

  return 0
}

export function isQuarterTurn(rotation: Rotation) {
  return rotation === 90 || rotation === 270
}

export function getRotatedBounds(source: SourceImage, rotation: Rotation): Size {
  return isQuarterTurn(rotation)
    ? { width: source.height, height: source.width }
    : { width: source.width, height: source.height }
}
